import { View, Text } from "@react-pdf/renderer";
import type { ResumeAppearance, ResumeContent } from "@/lib/resume/types";
import { optionalSectionsToBlocks } from "@/lib/resume/optional-sections";
import { pdfMetrics, contactLine, PDF_FONT_BOLD, PAGE_PADDING } from "@/lib/pdf/shared";
import { scaledAvatarSize } from "@/lib/resume/appearance";
import { PdfAvatar, PdfExperienceEntry } from "./primitives";

function BigHeading({ children }: { children: string }) {
  return <Text style={{ fontFamily: PDF_FONT_BOLD, fontSize: 12, marginBottom: 4 }}>{children}</Text>;
}

export function PortfolioPdf({ content, appearance }: { content: ResumeContent; appearance: ResumeAppearance }) {
  const { contact, summary, experience, education, skills } = content;
  const m = pdfMetrics(appearance);
  const blocks = optionalSectionsToBlocks(content.optionalSections);

  return (
    <View style={{ fontSize: m.fontSize, lineHeight: m.lineHeight, color: "#171717" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 16,
          backgroundColor: m.headerBg,
          padding: 20,
          margin: -PAGE_PADDING,
          marginBottom: 0,
        }}
      >
        {contact.photoDataUrl && (
          <PdfAvatar name={contact.name} photoDataUrl={contact.photoDataUrl} shape={appearance.photoShape} size={scaledAvatarSize(118, appearance.photoSize)} accent={m.accent} ring />
        )}
        <View>
          <Text style={{ fontFamily: PDF_FONT_BOLD, fontSize: m.fontSize + 16, color: m.accent }}>{contact.name}</Text>
          {contact.jobTitle && <Text style={{ marginTop: 4, fontFamily: PDF_FONT_BOLD }}>{contact.jobTitle}</Text>}
          <Text style={{ color: m.link, marginTop: 4 }}>{contactLine(contact)}</Text>
        </View>
      </View>

      <View style={{ marginTop: m.sectionGap, flexDirection: "column", gap: m.sectionGap }}>
        {summary && (
          <View>
            <BigHeading>About</BigHeading>
            <Text>{summary}</Text>
          </View>
        )}

        {experience.length > 0 && (
          <View>
            <BigHeading>Experience</BigHeading>
            {experience.map((job) => (
              <PdfExperienceEntry key={job.id} job={job} align="left" />
            ))}
          </View>
        )}

        {blocks.map((block) => (
          <View key={block.key}>
            <BigHeading>{block.title}</BigHeading>
            {block.lines.map((line, i) => (
              <Text key={i} style={{ marginTop: 2 }}>{line}</Text>
            ))}
          </View>
        ))}

        <View style={{ flexDirection: "row", gap: 24 }}>
          {education.length > 0 && (
            <View style={{ flex: 1 }}>
              <BigHeading>Education</BigHeading>
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
              <BigHeading>Skills</BigHeading>
              <Text>{skills.filter(Boolean).join(" · ")}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
