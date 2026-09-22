import { View, Text } from "@react-pdf/renderer";
import type { ResumeAppearance, ResumeContent } from "@/lib/resume/types";
import { optionalSectionsToBlocks } from "@/lib/resume/optional-sections";
import { pdfMetrics, contactLine, PDF_FONT_BOLD, PAGE_PADDING } from "@/lib/pdf/shared";
import { scaledAvatarSize } from "@/lib/resume/appearance";
import { PdfAvatar, PdfHeading, PdfOptionalSections, PdfExperienceEntry } from "./primitives";

export function ModernPdf({ content, appearance }: { content: ResumeContent; appearance: ResumeAppearance }) {
  const { contact, summary, experience, education, skills } = content;
  const m = pdfMetrics(appearance);
  const twoColumn = appearance.layout !== "one-column";

  const sidebar = (
    <View style={{ flexDirection: "column", gap: m.sectionGap }}>
      {education.length > 0 && (
        <View>
          <PdfHeading tone="caps" accent={m.accent}>Education</PdfHeading>
          {education.map((edu) => (
            <View key={edu.id} style={{ marginTop: 4 }}>
              <Text style={{ fontFamily: PDF_FONT_BOLD }}>{edu.degree}</Text>
              <Text style={{ color: "#6b6b6f" }}>{edu.institution}</Text>
              <Text style={{ color: "#8a8a8e" }}>{edu.gradYear}</Text>
            </View>
          ))}
        </View>
      )}
      {skills.length > 0 && (
        <View>
          <PdfHeading tone="caps" accent={m.accent}>Skills</PdfHeading>
          {skills.filter(Boolean).map((s) => (
            <Text key={s} style={{ marginTop: 2 }}>{s}</Text>
          ))}
        </View>
      )}
      <PdfOptionalSections blocks={optionalSectionsToBlocks(content.optionalSections)} tone="caps" accent={m.accent} />
    </View>
  );

  const main = (
    <View style={{ flexDirection: "column", gap: m.sectionGap }}>
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
    </View>
  );

  return (
    <View style={{ fontSize: m.fontSize, lineHeight: m.lineHeight, color: "#171717" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 14,
          backgroundColor: m.headerBg,
          padding: 16,
          margin: -PAGE_PADDING,
          marginBottom: 0,
        }}
      >
        {contact.photoDataUrl && (
          <PdfAvatar name={contact.name} photoDataUrl={contact.photoDataUrl} shape={appearance.photoShape} size={scaledAvatarSize(95, appearance.photoSize)} accent={m.accent} />
        )}
        <View>
          <Text style={{ fontFamily: PDF_FONT_BOLD, fontSize: m.fontSize + 9 }}>{contact.name}</Text>
          {contact.jobTitle && <Text style={{ color: m.accent, marginTop: 2, fontFamily: PDF_FONT_BOLD }}>{contact.jobTitle}</Text>}
          <Text style={{ color: m.link, marginTop: 4 }}>{contactLine(contact)}</Text>
        </View>
      </View>

      <View style={{ marginTop: m.sectionGap }}>
        {twoColumn ? (
          <View style={{ flexDirection: "row", gap: 20 }}>
            <View style={{ flex: 1.6 }}>{main}</View>
            <View style={{ flex: 1 }}>{sidebar}</View>
          </View>
        ) : (
          <View style={{ flexDirection: "column", gap: m.sectionGap }}>
            {main}
            {sidebar}
          </View>
        )}
      </View>
    </View>
  );
}
