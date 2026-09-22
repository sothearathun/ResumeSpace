import type { ResumeDraft } from "@/lib/resume/types";
import { renderResumePdf } from "@/lib/pdf/renderResumePdf";

function filenameFor(draft: ResumeDraft): string {
  const base = draft.contact.name.trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "");
  return `${base || "resume"}.pdf`;
}

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
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filenameFor(draft)}"`,
      },
    });
  } catch (error) {
    console.error("PDF generation failed", error);
    return Response.json({ error: "Could not generate PDF" }, { status: 500 });
  }
}

// Rendering PDFs / calling the AI can outlast a serverless default timeout.
export const maxDuration = 60;
