import { View, Text } from "@react-pdf/renderer";
import type { ResumeAppearance, ResumeContent } from "@/lib/resume/types";
import { optionalSectionsToBlocks } from "@/lib/resume/optional-sections";
import { pdfMetrics, contactLine, PDF_FONT_BOLD } from "@/lib/pdf/shared";
import { scaledAvatarSize } from "@/lib/resume/appearance";
import { PdfAvatar, PdfHeading, PdfOptionalSections, PdfExperienceEntry } from "./primitives";

export function ExecutivePdf({ content, appearance }: { content: ResumeContent; appearance: ResumeAppearance }) {
  const { contact, summary, experience, education, skills } = content;
  const m = pdfMetrics(appearance);

  return (
    <View style={{ fontSize: m.fontSize, lineHeight: m.lineHeight, color: "#171717" }}>
      <View style={{ alignItems: "center", borderBottomWidth: 1, borderBottomColor: m.accent, paddingBottom: 12 }}>
        {contact.photoDataUrl && (
          <View style={{ marginBottom: 6 }}>
            <PdfAvatar name={contact.name} photoDataUrl={contact.photoDataUrl} shape={appearance.photoShape ?? "square"} size={scaledAvatarSize(88, appearance.photoSize)} accent={m.accent} />
          </View>
        )}
        <Text style={{ fontFamily: PDF_FONT_BOLD, fontSize: m.fontSize + 8, letterSpacing: 0.5 }}>{contact.name}</Text>
        {contact.jobTitle && (
          <Text style={{ color: "#525252", marginTop: 3, textTransform: "uppercase", letterSpacing: 1 }}>
            {contact.jobTitle}
          </Text>
        )}
        <Text style={{ color: "#6b6b6f", marginTop: 5 }}>{contactLine(contact)}</Text>
      </View>

      <View style={{ marginTop: m.sectionGap, flexDirection: "column", gap: m.sectionGap }}>
        {summary && (
          <View>
            <PdfHeading tone="centered" accent={m.accent}>Summary</PdfHeading>
            <Text>{summary}</Text>
          </View>
        )}

        {experience.length > 0 && (
          <View>
            <PdfHeading tone="centered" accent={m.accent}>Experience</PdfHeading>
            {experience.map((job) => (
              <PdfExperienceEntry key={job.id} job={job} align="left" />
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View>
            <PdfHeading tone="centered" accent={m.accent}>Education</PdfHeading>
            {education.map((edu) => (
              <View key={edu.id} style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 3 }}>
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
            <PdfHeading tone="centered" accent={m.accent}>Areas of Expertise</PdfHeading>
            <Text style={{ textAlign: "center" }}>{skills.filter(Boolean).join(" · ")}</Text>
          </View>
        )}

        <PdfOptionalSections blocks={optionalSectionsToBlocks(content.optionalSections)} tone="centered" accent={m.accent} />
      </View>
    </View>
  );
}
