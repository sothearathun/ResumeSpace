import type { ResumeAppearance, ResumeContent } from "@/lib/resume/types";
import { appearanceStyle, scaledAvatarSize } from "@/lib/resume/appearance";
import { optionalSectionsToBlocks } from "@/lib/resume/optional-sections";
import { Section, OptionalSectionBlocks } from "./Section";
import { Avatar } from "./Avatar";

export function ExecutiveTemplate({
  content,
  appearance,
}: {
  content: ResumeContent;
  appearance: ResumeAppearance;
}) {
  const { contact, summary, experience, education, skills } = content;

  return (
    <div
      className="w-full bg-white px-16 py-14 text-neutral-900"
      style={appearanceStyle(appearance)}
    >
      <header className="border-b border-(--accent) pb-5 text-center">
        {contact.photoDataUrl && (
          <div className="mb-3 flex justify-center">
            <Avatar
              name={contact.name}
              photoDataUrl={contact.photoDataUrl}
              shape={appearance.photoShape ?? "square"}
              size={scaledAvatarSize(135, appearance.photoSize)}
            />
          </div>
        )}
        <h1 className="text-[2em] font-semibold tracking-[0.02em]">{contact.name}</h1>
        {contact.jobTitle && (
          <p className="mt-1.5 text-[0.98em] tracking-[0.04em] text-neutral-600 uppercase">
            {contact.jobTitle}
          </p>
        )}
        <p className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[0.82em] text-neutral-600">
          {[contact.email, contact.phone, contact.location, contact.linkedin, contact.portfolio]
            .filter(Boolean)
            .map((item) => (
              <span key={item}>{item}</span>
            ))}
        </p>
      </header>

      <div className="mt-(--section-gap) flex flex-col gap-(--section-gap)">
        {summary && (
          <Section title="Summary" tone="centered">
            <p className="text-[0.92em] text-neutral-800">{summary}</p>
          </Section>
        )}

        {experience.length > 0 && (
          <Section title="Experience" tone="centered">
            <div className="flex flex-col gap-4">
              {experience.map((job) => (
                <div key={job.id}>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-[0.95em] font-semibold">{job.jobTitle}</p>
                    <p className="shrink-0 text-[0.8em] text-neutral-500">
                      {job.startDate} &ndash; {job.endDate}
                    </p>
                  </div>
                  <p className="text-[0.88em] text-neutral-600">
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

        {education.length > 0 && (
          <Section title="Education" tone="centered">
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

        {skills.length > 0 && (
          <Section title="Areas of Expertise" tone="centered">
            <p className="text-center text-[0.88em] text-neutral-800">{skills.filter(Boolean).join(" · ")}</p>
          </Section>
        )}

        <OptionalSectionBlocks
          blocks={optionalSectionsToBlocks(content.optionalSections)}
          tone="centered"
        />
      </div>
    </div>
  );
}
