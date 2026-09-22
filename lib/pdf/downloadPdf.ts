import type { ResumeDraft } from "@/lib/resume/types";

export async function downloadResumePdf(draft: ResumeDraft): Promise<void> {
  const res = await fetch("/api/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(draft),
  });

  if (!res.ok) {
    throw new Error("Could not generate PDF");
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const filename = res.headers
    .get("Content-Disposition")
    ?.match(/filename="(.+)"/)?.[1] ?? "resume.pdf";

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
