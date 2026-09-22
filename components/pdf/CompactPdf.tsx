import { View, Text } from "@react-pdf/renderer";
import type { ResumeAppearance, ResumeContent } from "@/lib/resume/types";
import { optionalSectionsToBlocks } from "@/lib/resume/optional-sections";
import { pdfMetrics, PDF_FONT_BOLD } from "@/lib/pdf/shared";
import { scaledAvatarSize } from "@/lib/resume/appearance";
import { PdfAvatar, PdfHeading, PdfBullets, PdfOptionalSections } from "./primitives";

export function CompactPdf({ content, appearance }: { content: ResumeContent; appearance: ResumeAppearance }) {
  const { contact, summary, experience, education, skills } = content;
  const m = pdfMetrics(appearance);

  return (
    <View style={{ fontSize: m.fontSize, lineHeight: m.lineHeight, color: "#171717" }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", borderBottomWidth: 0.5, borderBottomColor: "#c7c7c9", paddingBottom: 4 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          {contact.photoDataUrl && (
            <PdfAvatar
              name={contact.name}
              photoDataUrl={contact.photoDataUrl}
              shape={appearance.photoShape}
              size={scaledAvatarSize(48, appearance.photoSize)}
              accent={m.accent}
            />
          )}
          <Text style={{ fontFamily: PDF_FONT_BOLD, fontSize: m.fontSize + 5 }}>{contact.name}</Text>
          {contact.jobTitle && <Text style={{ color: "#525252" }}>{contact.jobTitle}</Text>}
        </View>
        <Text style={{ color: "#6b6b6f", fontSize: m.fontSize - 1 }}>
          {[contact.email, contact.phone, contact.location].filter(Boolean).join("  ·  ")}
        </Text>
      </View>

      <View style={{ marginTop: m.sectionGap, flexDirection: "column", gap: m.sectionGap }}>
        {summary && <Text>{summary}</Text>}

        {experience.length > 0 && (
          <View>
            <PdfHeading tone="caps" accent={m.accent}>Experience</PdfHeading>
            {experience.map((job) => (
              <View key={job.id} style={{ marginTop: 4 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text>
                    <Text style={{ fontFamily: PDF_FONT_BOLD }}>{job.jobTitle}</Text> · {job.company}
                  </Text>
                  <Text style={{ color: "#6b6b6f" }}>{job.startDate}–{job.endDate}</Text>
                </View>
                <PdfBullets items={job.bullets} />
              </View>
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View>
            <PdfHeading tone="caps" accent={m.accent}>Education</PdfHeading>
            {education.map((edu) => (
              <View key={edu.id} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text>
                  <Text style={{ fontFamily: PDF_FONT_BOLD }}>{edu.degree}</Text>, {edu.institution}
                </Text>
                <Text style={{ color: "#6b6b6f" }}>{edu.gradYear}</Text>
              </View>
            ))}
          </View>
        )}

        {skills.length > 0 && (
          <View>
            <PdfHeading tone="caps" accent={m.accent}>Skills</PdfHeading>
            <Text>{skills.filter(Boolean).join(" · ")}</Text>
          </View>
        )}

        <PdfOptionalSections blocks={optionalSectionsToBlocks(content.optionalSections)} tone="caps" accent={m.accent} />
      </View>
    </View>
  );
}
