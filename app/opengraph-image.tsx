import { ImageResponse } from "next/og";

export const alt = "ResumeSpace — Free AI Resume Builder & Master Resume Maker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #1d4ed8 0%, #4f46e5 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 36, fontWeight: 700 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "white",
              color: "#1d4ed8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
            }}
          >
            R
          </div>
          ResumeSpace
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, display: "flex", flexWrap: "wrap" }}>
            Free AI Resume Builder
          </div>
          <div style={{ fontSize: 38, color: "#dbeafe", display: "flex" }}>
            Build a master resume once. Tailor it to every job.
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, fontSize: 26, fontWeight: 600 }}>
          {["Free", "AI-powered", "ATS-friendly", "PDF download"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.16)",
                border: "2px solid rgba(255,255,255,0.35)",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
