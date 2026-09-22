import type { ResumeDraft } from "@/lib/resume/types";
import { renderResumePdf } from "@/lib/pdf/renderResumePdf";
import { countPdfPages } from "@/lib/pdf/countPdfPages";

// A single real PDF render + page count — deliberately much cheaper than
// /api/fit-to-page's full search across combos, since this one runs
// automatically in the background after every edit (debounced) rather than
// only on a manual click.
export async function POST(request: Request) {
  let draft: ResumeDraft;
  try {
    draft = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!draft || typeof draft !== "object" || !draft.templateKey) {
    return Response.json({ error: "Missing or invalid resume draft" }, { status: 400 });
  }

  try {
    const buffer = await renderResumePdf(draft);
    const pages = await countPdfPages(buffer);
    return Response.json({ overflowing: pages > 1 });
  } catch (error) {
    console.error("Check overflow failed", error);
    return Response.json({ error: "Could not check overflow" }, { status: 500 });
  }
}

// Rendering PDFs / calling the AI can outlast a serverless default timeout.
export const maxDuration = 60;
