import type { ResumeAppearance, ResumeDraft } from "@/lib/resume/types";

export type FitToPageResult = {
  fontSize: ResumeAppearance["fontSize"];
  spacing: ResumeAppearance["spacing"];
  contentScale: number;
  fits: boolean;
  pages: number;
};

export async function fetchFitToPage(draft: ResumeDraft): Promise<FitToPageResult | null> {
  try {
    const res = await fetch("/api/fit-to-page", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchCheckOverflow(draft: ResumeDraft): Promise<boolean | null> {
  try {
    const res = await fetch("/api/check-overflow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (!res.ok) return null;
    const { overflowing } = await res.json();
    return Boolean(overflowing);
  } catch {
    return null;
  }
}
