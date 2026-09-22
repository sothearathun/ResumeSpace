import { View, Text } from "@react-pdf/renderer";
import type { ResumeAppearance, ResumeContent } from "@/lib/resume/types";
import { optionalSectionsToBlocks } from "@/lib/resume/optional-sections";
import { pdfMetrics, contactLine, PDF_FONT_BOLD } from "@/lib/pdf/shared";
import { scaledAvatarSize } from "@/lib/resume/appearance";
import { PdfAvatar, PdfHeading, PdfOptionalSections, PdfExperienceEntry } from "./primitives";

export function GraduatePdf({ content, appearance }: { content: ResumeContent; appearance: ResumeAppearance }) {
  const { contact, summary, experience, education, skills } = content;
  const m = pdfMetrics(appearance);
  const blocks = optionalSectionsToBlocks(content.optionalSections);
  const projectBlocks = blocks.filter((b) => b.key === "projects");
  const otherBlocks = blocks.filter((b) => b.key !== "projects");

  return (
    <View style={{ fontSize: m.fontSize, lineHeight: m.lineHeight, color: "#171717" }}>
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
        {contact.photoDataUrl && (
          <PdfAvatar
            name={contact.name}
            photoDataUrl={contact.photoDataUrl}
            shape={appearance.photoShape}
            size={scaledAvatarSize(85, appearance.photoSize)}
            accent={m.accent}
          />
        )}
        <View>
          <Text style={{ fontFamily: PDF_FONT_BOLD, fontSize: m.fontSize + 8 }}>{contact.name}</Text>
          {contact.jobTitle && <Text style={{ color: "#525252", marginTop: 2 }}>{contact.jobTitle}</Text>}
          <Text style={{ color: m.link, marginTop: 4 }}>{contactLine(contact)}</Text>
        </View>
      </View>

      <View style={{ marginTop: m.sectionGap, flexDirection: "column", gap: m.sectionGap }}>
        {summary && (
          <View>
            <PdfHeading tone="caps" accent={m.accent}>Summary</PdfHeading>
            <Text>{summary}</Text>
          </View>
        )}

        {education.length > 0 && (
          <View>
            <PdfHeading tone="caps" accent={m.accent}>Education</PdfHeading>
            {education.map((edu) => (
              <View key={edu.id} style={{ marginTop: 3 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text>
                    <Text style={{ fontFamily: PDF_FONT_BOLD }}>{edu.degree}</Text>, {edu.institution}
                  </Text>
                  <Text style={{ color: "#6b6b6f" }}>{edu.gradYear}</Text>
                </View>
                {edu.gpa && <Text style={{ color: "#6b6b6f" }}>GPA: {edu.gpa}</Text>}
                {edu.coursework && <Text style={{ color: "#6b6b6f" }}>Coursework: {edu.coursework}</Text>}
              </View>
            ))}
          </View>
        )}

        <PdfOptionalSections blocks={projectBlocks} tone="caps" accent={m.accent} />

        {skills.length > 0 && (
          <View>
            <PdfHeading tone="caps" accent={m.accent}>Skills</PdfHeading>
            <Text>{skills.filter(Boolean).join(" · ")}</Text>
          </View>
        )}

        {experience.length > 0 && (
          <View>
            <PdfHeading tone="caps" accent={m.accent}>Experience</PdfHeading>
            {experience.map((job) => (
              <PdfExperienceEntry key={job.id} job={job} align="left-inline" />
            ))}
          </View>
        )}

        <PdfOptionalSections blocks={otherBlocks} tone="caps" accent={m.accent} />
      </View>
    </View>
  );
}
