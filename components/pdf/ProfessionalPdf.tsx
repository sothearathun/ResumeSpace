import { View, Text } from "@react-pdf/renderer";
import type { ResumeAppearance, ResumeContent } from "@/lib/resume/types";
import { optionalSectionsToBlocks } from "@/lib/resume/optional-sections";
import { pdfMetrics, contactLine, PDF_FONT_BOLD } from "@/lib/pdf/shared";
import { scaledAvatarSize } from "@/lib/resume/appearance";
import { PdfAvatar, PdfHeading, PdfOptionalSections, PdfExperienceEntry } from "./primitives";

export function ProfessionalPdf({ content, appearance }: { content: ResumeContent; appearance: ResumeAppearance }) {
  const { contact, summary, experience, education, skills } = content;
  const m = pdfMetrics(appearance);

  return (
    <View style={{ fontSize: m.fontSize, lineHeight: m.lineHeight, color: "#171717" }}>
      <View
        style={{
          alignItems: "center",
          borderBottomWidth: 2,
          borderBottomColor: m.accent,
          paddingBottom: 10,
        }}
      >
        {contact.photoDataUrl && (
          <View style={{ marginBottom: 6 }}>
            <PdfAvatar name={contact.name} photoDataUrl={contact.photoDataUrl} shape={appearance.photoShape} size={scaledAvatarSize(90, appearance.photoSize)} accent={m.accent} />
          </View>
        )}
        <Text style={{ fontFamily: PDF_FONT_BOLD, fontSize: m.fontSize + 9 }}>{contact.name}</Text>
        {contact.jobTitle && <Text style={{ color: "#525252", marginTop: 2 }}>{contact.jobTitle}</Text>}
        <Text style={{ color: m.link, marginTop: 4 }}>{contactLine(contact)}</Text>
      </View>

      <View style={{ marginTop: m.sectionGap, flexDirection: "column", gap: m.sectionGap }}>
        {summary && (
          <View>
            <PdfHeading tone="bordered" accent={m.accent}>Professional Summary</PdfHeading>
            <Text>{summary}</Text>
          </View>
        )}

        {experience.length > 0 && (
          <View>
            <PdfHeading tone="bordered" accent={m.accent}>Work Experience</PdfHeading>
            {experience.map((job) => (
              <PdfExperienceEntry key={job.id} job={job} align="left" />
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View>
            <PdfHeading tone="bordered" accent={m.accent}>Education</PdfHeading>
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
            <PdfHeading tone="bordered" accent={m.accent}>Skills</PdfHeading>
            <Text>{skills.filter(Boolean).join(" · ")}</Text>
          </View>
        )}

        <PdfOptionalSections
          blocks={optionalSectionsToBlocks(content.optionalSections)}
          tone="bordered"
          accent={m.accent}
        />
      </View>
    </View>
  );
}
