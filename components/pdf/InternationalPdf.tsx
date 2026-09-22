import { View, Text } from "@react-pdf/renderer";
import type { ResumeAppearance, ResumeContent } from "@/lib/resume/types";
import { optionalSectionsToBlocks } from "@/lib/resume/optional-sections";
import { pdfMetrics, PDF_FONT_BOLD, PAGE_PADDING } from "@/lib/pdf/shared";
import { scaledAvatarSize } from "@/lib/resume/appearance";
import { PdfAvatar, PdfHeading, PdfOptionalSections, PdfExperienceEntry } from "./primitives";

export function InternationalPdf({ content, appearance }: { content: ResumeContent; appearance: ResumeAppearance }) {
  const { contact, summary, experience, education, skills } = content;
  const m = pdfMetrics(appearance);
  const blocks = optionalSectionsToBlocks(content.optionalSections);
  const languageBlocks = blocks.filter((b) => b.key === "languages");
  const otherBlocks = blocks.filter((b) => b.key !== "languages");

  return (
    <View style={{ fontSize: m.fontSize, lineHeight: m.lineHeight, color: "#171717", flexDirection: "row", margin: -PAGE_PADDING }}>
      <View style={{ width: 210, backgroundColor: m.headerBg, padding: 16, flexDirection: "column", gap: m.sectionGap }}>
        <PdfAvatar name={contact.name} photoDataUrl={contact.photoDataUrl} shape={appearance.photoShape} size={scaledAvatarSize(105, appearance.photoSize)} accent={m.accent} />
        <View>
          <Text style={{ fontFamily: PDF_FONT_BOLD, fontSize: m.fontSize + 3 }}>{contact.name}</Text>
          {contact.jobTitle && <Text style={{ color: m.accent, fontFamily: PDF_FONT_BOLD, marginTop: 2 }}>{contact.jobTitle}</Text>}
        </View>

        <View>
          <PdfHeading tone="caps" accent={m.accent}>Contact</PdfHeading>
          {[contact.email, contact.phone, contact.location, contact.linkedin, contact.portfolio]
            .filter(Boolean)
            .map((line) => (
              <Text key={line} style={{ marginTop: 2, color: m.link }}>{line}</Text>
            ))}
        </View>

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

        <PdfOptionalSections blocks={languageBlocks} tone="caps" accent={m.accent} />
      </View>

      <View style={{ flex: 1, padding: 20, flexDirection: "column", gap: m.sectionGap }}>
        {summary && (
          <View>
            <PdfHeading tone="caps" accent={m.accent}>Profile</PdfHeading>
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

        <PdfOptionalSections blocks={otherBlocks} tone="caps" accent={m.accent} />
      </View>
    </View>
  );
}
