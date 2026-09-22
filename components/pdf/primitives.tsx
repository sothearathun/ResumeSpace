import { Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import type { ResumeExperience } from "@/lib/resume/types";
import { PDF_FONT_BOLD, initials } from "@/lib/pdf/shared";

const styles = StyleSheet.create({
  bulletRow: { flexDirection: "row", marginTop: 2 },
  bulletMark: { width: 10 },
  bulletText: { flex: 1 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
});

export function PdfAvatar({
  name,
  photoDataUrl,
  size,
  shape = "circle",
  accent,
  ring = false,
}: {
  name: string;
  photoDataUrl?: string;
  size: number;
  shape?: "circle" | "square";
  accent: string;
  /** A white ring, for placing the avatar on a colored header band. */
  ring?: boolean;
}) {
  const radius = shape === "square" ? 6 : size / 2;
  const ringStyle = ring ? { borderWidth: 2, borderColor: "#ffffff" } : {};

  if (photoDataUrl) {
    // This is @react-pdf/renderer's Image (a PDF drawing primitive, not an
    // HTML <img>) — it has no `alt` prop, so jsx-a11y's rule doesn't apply.
    return (
      // eslint-disable-next-line jsx-a11y/alt-text
      <Image
        src={photoDataUrl}
        style={{ width: size, height: size, borderRadius: radius, objectFit: "cover", ...ringStyle }}
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: accent,
        alignItems: "center",
        justifyContent: "center",
        ...ringStyle,
      }}
    >
      <Text style={{ color: "#ffffff", fontSize: size * 0.36, fontFamily: PDF_FONT_BOLD }}>
        {initials(name)}
      </Text>
    </View>
  );
}

export function PdfHeading({
  children,
  tone,
  accent,
}: {
  children: string;
  tone: "caps" | "bordered" | "centered";
  accent: string;
}) {
  const base = { fontFamily: PDF_FONT_BOLD, fontSize: 9, marginBottom: 4 };
  if (tone === "bordered") {
    return (
      <Text
        style={{
          ...base,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          color: "#171717",
          borderBottomWidth: 0.5,
          borderBottomColor: accent,
          paddingBottom: 2,
        }}
      >
        {children}
      </Text>
    );
  }
  if (tone === "centered") {
    return (
      <Text style={{ ...base, textTransform: "uppercase", letterSpacing: 1, color: "#171717", textAlign: "center" }}>
        {children}
      </Text>
    );
  }
  return (
    <Text style={{ ...base, textTransform: "uppercase", letterSpacing: 1, color: accent }}>
      {children}
    </Text>
  );
}

export function PdfBullets({ items }: { items: string[] }) {
  const filtered = items.filter(Boolean);
  if (filtered.length === 0) return null;
  return (
    <View>
      {filtered.map((item, i) => (
        <View key={i} style={styles.bulletRow}>
          <Text style={styles.bulletMark}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export function PdfOptionalSections({
  blocks,
  tone,
  accent,
}: {
  blocks: { key: string; title: string; lines: string[] }[];
  tone: "caps" | "bordered" | "centered";
  accent: string;
}) {
  return (
    <>
      {blocks.map((block) => (
        <View key={block.key} style={{ marginTop: 10 }}>
          <PdfHeading tone={tone} accent={accent}>
            {block.title}
          </PdfHeading>
          <PdfBullets items={block.lines} />
        </View>
      ))}
    </>
  );
}

export function PdfExperienceEntry({
  job,
  align = "left",
}: {
  job: ResumeExperience;
  align?: "left" | "left-inline";
}) {
  return (
    <View style={{ marginTop: 6 }}>
      <View style={styles.rowBetween}>
        <Text style={{ fontFamily: PDF_FONT_BOLD }}>
          {job.jobTitle}
          {align === "left-inline" ? ` · ${job.company}` : ""}
        </Text>
        <Text style={{ color: "#6b6b6f" }}>
          {job.startDate} – {job.endDate}
        </Text>
      </View>
      {align === "left" && <Text style={{ color: "#6b6b6f" }}>{job.company}</Text>}
      <PdfBullets items={job.bullets} />
    </View>
  );
}
