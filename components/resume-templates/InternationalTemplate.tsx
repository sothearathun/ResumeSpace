import type { ResumeAppearance, ResumeContent } from "@/lib/resume/types";
import { appearanceStyle, scaledAvatarSize } from "@/lib/resume/appearance";
import { optionalSectionsToBlocks } from "@/lib/resume/optional-sections";
import { Section, OptionalSectionBlocks } from "./Section";
import { Avatar } from "./Avatar";

export function InternationalTemplate({
  content,
  appearance,
}: {
  content: ResumeContent;
  appearance: ResumeAppearance;
}) {
  const { contact, summary, experience, education, skills } = content;
  const blocks = optionalSectionsToBlocks(content.optionalSections);
  const languageBlocks = blocks.filter((b) => b.key === "languages");
  const otherBlocks = blocks.filter((b) => b.key !== "languages");

  return (
    <div className="flex w-full bg-white text-neutral-900" style={appearanceStyle(appearance)}>
      <aside className="flex w-[34%] shrink-0 flex-col gap-(--section-gap) bg-(--header-bg) px-7 py-10">
        <Avatar
          name={contact.name}
          photoDataUrl={contact.photoDataUrl}
          shape={appearance.photoShape}
          size={scaledAvatarSize(150, appearance.photoSize)}
        />

        <div>
          <h1 className="text-[1.25em] leading-tight font-semibold">{contact.name}</h1>
          {contact.jobTitle && (
            <p className="mt-1 text-[0.82em] font-medium text-(--accent)">{contact.jobTitle}</p>
          )}
        </div>

        <Section title="Contact">
          <div className="flex flex-col gap-1 text-[0.78em] break-words text-(--link)">
            {[contact.email, contact.phone, contact.location, contact.linkedin, contact.portfolio]
              .filter(Boolean)
              .map((item) => (
                <span key={item}>{item}</span>
              ))}
          </div>
        </Section>

        {education.length > 0 && (
          <Section title="Education">
            <div className="flex flex-col gap-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <p className="text-[0.82em] font-medium">{edu.degree}</p>
                  <p className="text-[0.78em] text-neutral-600">{edu.institution}</p>
                  <p className="text-[0.74em] text-neutral-500">{edu.gradYear}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {skills.length > 0 && (
          <Section title="Skills">
            <ul className="flex flex-col gap-1.5 text-[0.8em] text-neutral-800">
              {skills.filter(Boolean).map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </Section>
        )}

        <OptionalSectionBlocks blocks={languageBlocks} />
      </aside>

      <main className="flex flex-1 flex-col gap-(--section-gap) px-10 py-10">
        {summary && (
          <Section title="Profile">
            <p className="text-[0.92em] text-neutral-800">{summary}</p>
          </Section>
        )}

        {experience.length > 0 && (
          <Section title="Experience">
            <div className="flex flex-col gap-4">
              {experience.map((job) => (
                <div key={job.id}>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-[0.95em] font-medium">{job.jobTitle}</p>
                    <p className="shrink-0 text-[0.8em] text-neutral-500">
                      {job.startDate} &ndash; {job.endDate}
                    </p>
                  </div>
                  <p className="text-[0.85em] text-neutral-600">
                    {job.company}
                    {job.location ? ` — ${job.location}` : ""}
                  </p>
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

        <OptionalSectionBlocks blocks={otherBlocks} />
      </main>
    </div>
  );
}
