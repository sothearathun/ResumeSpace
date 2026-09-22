import { View, Text } from "@react-pdf/renderer";
import type { ResumeAppearance, ResumeContent } from "@/lib/resume/types";
import { optionalSectionsToBlocks } from "@/lib/resume/optional-sections";
import { pdfMetrics, contactLine, PDF_FONT_BOLD, PAGE_PADDING } from "@/lib/pdf/shared";
import { scaledAvatarSize } from "@/lib/resume/appearance";
import { PdfAvatar, PdfHeading, PdfOptionalSections, PdfExperienceEntry } from "./primitives";

export function BoldPdf({ content, appearance }: { content: ResumeContent; appearance: ResumeAppearance }) {
  const { contact, summary, experience, education, skills } = content;
  const m = pdfMetrics(appearance);

  return (
    <View style={{ fontSize: m.fontSize, lineHeight: m.lineHeight, color: "#171717" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 14,
          backgroundColor: m.headerBg,
          padding: 18,
          margin: -PAGE_PADDING,
          marginBottom: 0,
        }}
      >
        {contact.photoDataUrl && (
          <PdfAvatar name={contact.name} photoDataUrl={contact.photoDataUrl} shape={appearance.photoShape} size={scaledAvatarSize(95, appearance.photoSize)} accent={m.accent} ring />
        )}
        <View>
          <Text style={{ fontFamily: PDF_FONT_BOLD, fontSize: m.fontSize + 9, color: "#ffffff" }}>{contact.name}</Text>
          {contact.jobTitle && <Text style={{ color: "#ffffff", opacity: 0.85, marginTop: 2 }}>{contact.jobTitle}</Text>}
          <Text style={{ color: "#ffffff", opacity: 0.75, marginTop: 4 }}>{contactLine(contact)}</Text>
        </View>
      </View>

      <View style={{ marginTop: m.sectionGap, flexDirection: "column", gap: m.sectionGap }}>
        {summary && (
          <View>
            <PdfHeading tone="caps" accent={m.accent}>Summary</PdfHeading>
            <Text>{summary}</Text>
          </View>
        )}

        {experience.length > 0 && (
          <View>
            <PdfHeading tone="caps" accent={m.accent}>Experience</PdfHeading>
            {experience.map((job) => (
              <PdfExperienceEntry key={job.id} job={job} align="left" />
            ))}
          </View>
        )}

        <View style={{ flexDirection: "row", gap: 24 }}>
          {education.length > 0 && (
            <View style={{ flex: 1 }}>
              <PdfHeading tone="caps" accent={m.accent}>Education</PdfHeading>
              {education.map((edu) => (
                <View key={edu.id} style={{ marginTop: 2 }}>
                  <Text style={{ fontFamily: PDF_FONT_BOLD }}>{edu.degree}</Text>
                  <Text style={{ color: "#6b6b6f" }}>{edu.institution} · {edu.gradYear}</Text>
                </View>
              ))}
            </View>
          )}
          {skills.length > 0 && (
            <View style={{ flex: 1 }}>
              <PdfHeading tone="caps" accent={m.accent}>Skills</PdfHeading>
              <Text>{skills.filter(Boolean).join(" · ")}</Text>
            </View>
          )}
        </View>

        <PdfOptionalSections blocks={optionalSectionsToBlocks(content.optionalSections)} tone="caps" accent={m.accent} />
      </View>
    </View>
  );
}
