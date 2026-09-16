import type { ResumeAppearance, ResumeContent } from "@/lib/resume/types";
import { appearanceStyle } from "@/lib/resume/appearance";
import { optionalSectionsToBlocks } from "@/lib/resume/optional-sections";
import { Section, OptionalSectionBlocks } from "./Section";
import { Avatar } from "./Avatar";

export function AcademicTemplate({
  content,
  appearance,
}: {
  content: ResumeContent;
  appearance: ResumeAppearance;
}) {
  const { contact, summary, experience, education, skills } = content;
  const blocks = optionalSectionsToBlocks(content.optionalSections);
  const publicationBlocks = blocks.filter((b) => b.key === "publications");
  const otherBlocks = blocks.filter((b) => b.key !== "publications");

  return (
    <div
      className="w-full bg-white px-14 py-12 text-neutral-900"
      style={appearanceStyle(appearance)}
    >
      <header className="flex items-center gap-5 border-b border-(--accent) pb-4">
        {contact.photoDataUrl && (
          <Avatar
            name={contact.name}
            photoDataUrl={contact.photoDataUrl}
            shape={appearance.photoShape ?? "square"}
            size={72}
          />
        )}
        <div>
          <h1 className="text-[1.8em] font-semibold tracking-tight">{contact.name}</h1>
          {contact.jobTitle && (
            <p className="mt-1 text-[0.95em] text-neutral-600">{contact.jobTitle}</p>
          )}
          <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[0.82em] text-neutral-600">
            {[contact.email, contact.phone, contact.location]
              .filter(Boolean)
              .map((item) => (
                <span key={item}>{item}</span>
              ))}
          </p>
        </div>
      </header>

      <div className="mt-(--section-gap) flex flex-col gap-(--section-gap)">
        {summary && (
          <Section title="Research Summary" tone="bordered">
            <p className="text-[0.92em] text-neutral-800">{summary}</p>
          </Section>
        )}

        {education.length > 0 && (
          <Section title="Education" tone="bordered">
            <div className="flex flex-col gap-2">
              {education.map((edu) => (
                <div key={edu.id} className="flex items-baseline justify-between gap-4">
                  <p className="text-[0.92em]">
                    <span className="font-medium">{edu.degree}</span>, {edu.institution}
                  </p>
                  <p className="shrink-0 text-[0.8em] text-neutral-500">{edu.gradYear}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {publicationBlocks.length > 0 && (
          <OptionalSectionBlocks blocks={publicationBlocks} tone="bordered" />
        )}

        {experience.length > 0 && (
          <Section title="Appointments" tone="bordered">
            <div className="flex flex-col gap-4">
              {experience.map((job) => (
                <div key={job.id}>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-[0.95em] font-medium">{job.jobTitle}</p>
                    <p className="shrink-0 text-[0.8em] text-neutral-500">
                      {job.startDate} &ndash; {job.endDate}
                    </p>
                  </div>
                  <p className="text-[0.85em] text-neutral-600">{job.company}</p>
                  <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[0.88em] text-neutral-800">
                    {job.bullets.filter(Boolean).map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        )}

        {skills.length > 0 && (
          <Section title="Skills" tone="bordered">
            <p className="text-[0.88em] text-neutral-800">{skills.join(" · ")}</p>
          </Section>
        )}

        <OptionalSectionBlocks blocks={otherBlocks} tone="bordered" />
      </div>
    </div>
  );
}
