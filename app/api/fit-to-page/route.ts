import type { ResumeAppearance, ResumeDraft } from "@/lib/resume/types";
import { renderResumePdf } from "@/lib/pdf/renderResumePdf";
import { countPdfPages } from "@/lib/pdf/countPdfPages";
import { draftTooLarge, enforceRateLimit, LIMITS, tooLarge } from "@/lib/apiGuard";

const FONT_SIZES: ResumeAppearance["fontSize"][] = ["small", "medium", "large"];
const SPACINGS: ResumeAppearance["spacing"][] = ["compact", "comfortable", "spacious"];

type Combo = { fontSize: ResumeAppearance["fontSize"]; spacing: ResumeAppearance["spacing"] };

// Font size dominates the ranking (weighted far more than spacing), so
// shrinking gives up whitespace before it gives up readability. Largest/
// most-readable combo first — the first one whose real PDF is one page
// wins, so a short resume gets sized *up* to fill the page too.
const COMBOS: Combo[] = FONT_SIZES.flatMap((fontSize, fi) =>
  SPACINGS.map((spacing, si) => ({ fontSize, spacing, rank: fi * SPACINGS.length + si }))
)
  .sort((a, b) => b.rank - a.rank)
  .map(({ fontSize, spacing }) => ({ fontSize, spacing }));

// Beyond the largest preset (large + spacious), keep scaling continuously —
// the three discrete fontSize steps alone often leave a lot of a page
// empty for genuinely short resumes; contentScale (lib/resume/appearance.ts,
// lib/pdf/shared.ts) grows font size and section gaps proportionally past
// that ceiling.
const SCALE_STEPS = [1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8];

async function pageCountFor(draft: ResumeDraft, appearance: ResumeAppearance): Promise<number> {
  const buffer = await renderResumePdf({ ...draft, appearance });
  return countPdfPages(buffer);
}

export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, LIMITS.fitToPage);
  if (limited) return limited;

  let draft: ResumeDraft;
  try {
    draft = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!draft || typeof draft !== "object" || !draft.templateKey || !draft.contact) {
    return Response.json({ error: "Missing or invalid resume draft" }, { status: 400 });
  }
  if (draftTooLarge(draft)) return tooLarge();

  try {
    const results = await Promise.all(
      COMBOS.map(async (combo) => ({
        combo,
        pages: await pageCountFor(draft, { ...draft.appearance, ...combo, contentScale: 1 }),
      }))
    );

    const fitting = results.find((r) => r.pages <= 1);
    // When nothing fits on one page, don't force it by falling back to the
    // smallest, hardest-to-read combo — a resume with genuinely a lot of
    // content should just flow onto a second (or third) page at a size
    // that's still comfortable to read, rather than getting crushed down
    // to fit an arbitrary one-page limit. results[0] is the largest/most
    // readable combo, so that's the fallback; the live preview (and the
    // real PDF) show however many pages that actually takes.
    const chosen = fitting ?? results[0];

    let contentScale = 1;
    // Only try to grow further when the *largest* preset already fits —
    // that's the "sparse content, lots of empty page left" case. If a
    // smaller preset was needed just to fit, there's no slack to grow into.
    if (fitting && chosen === results[0]) {
      const scaleResults = await Promise.all(
        SCALE_STEPS.map(async (scale) => ({
          scale,
          pages: await pageCountFor(draft, { ...draft.appearance, ...chosen.combo, contentScale: scale }),
        }))
      );
      const fittingScales = scaleResults.filter((r) => r.pages <= 1).map((r) => r.scale).sort((a, b) => a - b);
      if (fittingScales.length > 0) {
        // Back off one step from the exact boundary the real PDF measured,
        // rather than the single largest fitting scale — the DOM live
        // preview and the PDF aren't pixel-for-pixel identical renderers,
        // so a small safety margin keeps the preview from clipping content
        // that the PDF itself would still fit.
        contentScale = fittingScales[Math.max(0, fittingScales.length - 2)];
      }
    }

    return Response.json({
      fontSize: chosen.combo.fontSize,
      spacing: chosen.combo.spacing,
      contentScale,
      fits: Boolean(fitting),
      pages: chosen.pages,
    });
  } catch (error) {
    console.error("Fit-to-page failed", error);
    return Response.json({ error: "Could not compute fit" }, { status: 500 });
  }
}

// Rendering PDFs / calling the AI can outlast a serverless default timeout.
export const maxDuration = 60;
