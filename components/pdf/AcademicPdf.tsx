import { View, Text } from "@react-pdf/renderer";
import type { ResumeAppearance, ResumeContent } from "@/lib/resume/types";
import { optionalSectionsToBlocks } from "@/lib/resume/optional-sections";
import { pdfMetrics, PDF_FONT_BOLD } from "@/lib/pdf/shared";
import { scaledAvatarSize } from "@/lib/resume/appearance";
import { PdfAvatar, PdfHeading, PdfOptionalSections, PdfExperienceEntry } from "./primitives";

export function AcademicPdf({ content, appearance }: { content: ResumeContent; appearance: ResumeAppearance }) {
  const { contact, summary, experience, education, skills } = content;
  const m = pdfMetrics(appearance);
  const blocks = optionalSectionsToBlocks(content.optionalSections);
  const publicationBlocks = blocks.filter((b) => b.key === "publications");
  const otherBlocks = blocks.filter((b) => b.key !== "publications");

  return (
    <View style={{ fontSize: m.fontSize, lineHeight: m.lineHeight, color: "#171717" }}>
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12, borderBottomWidth: 1, borderBottomColor: m.accent, paddingBottom: 8 }}>
        {contact.photoDataUrl && (
          <PdfAvatar name={contact.name} photoDataUrl={contact.photoDataUrl} shape={appearance.photoShape ?? "square"} size={scaledAvatarSize(80, appearance.photoSize)} accent={m.accent} />
        )}
        <View>
          <Text style={{ fontFamily: PDF_FONT_BOLD, fontSize: m.fontSize + 6 }}>{contact.name}</Text>
          {contact.jobTitle && <Text style={{ color: "#525252", marginTop: 2 }}>{contact.jobTitle}</Text>}
          <Text style={{ color: "#6b6b6f", marginTop: 3 }}>
            {[contact.email, contact.phone, contact.location].filter(Boolean).join("   ")}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: m.sectionGap, flexDirection: "column", gap: m.sectionGap }}>
        {summary && (
          <View>
            <PdfHeading tone="bordered" accent={m.accent}>Research Summary</PdfHeading>
            <Text>{summary}</Text>
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

        <PdfOptionalSections blocks={publicationBlocks} tone="bordered" accent={m.accent} />

        {experience.length > 0 && (
          <View>
            <PdfHeading tone="bordered" accent={m.accent}>Appointments</PdfHeading>
            {experience.map((job) => (
              <PdfExperienceEntry key={job.id} job={job} align="left" />
            ))}
          </View>
        )}

        {skills.length > 0 && (
          <View>
            <PdfHeading tone="bordered" accent={m.accent}>Skills</PdfHeading>
            <Text>{skills.filter(Boolean).join(" · ")}</Text>
          </View>
        )}

        <PdfOptionalSections blocks={otherBlocks} tone="bordered" accent={m.accent} />
      </View>
    </View>
  );
}
