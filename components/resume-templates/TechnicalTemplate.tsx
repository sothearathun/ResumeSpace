import type { ResumeAppearance, ResumeContent } from "@/lib/resume/types";
import { appearanceStyle, scaledAvatarSize } from "@/lib/resume/appearance";
import { optionalSectionsToBlocks } from "@/lib/resume/optional-sections";
import { Section, OptionalSectionBlocks } from "./Section";
import { Avatar } from "./Avatar";

export function TechnicalTemplate({
  content,
  appearance,
}: {
  content: ResumeContent;
  appearance: ResumeAppearance;
}) {
  const { contact, summary, experience, education, skills } = content;

  return (
    <div
      className="w-full bg-white px-14 py-12 text-neutral-900"
      style={appearanceStyle(appearance)}
    >
      <header className="flex items-start gap-5">
        {contact.photoDataUrl && (
          <Avatar
            name={contact.name}
            photoDataUrl={contact.photoDataUrl}
            shape={appearance.photoShape}
            size={scaledAvatarSize(135, appearance.photoSize)}
          />
        )}
        <div>
          <h1 className="text-[2em] font-semibold tracking-tight">{contact.name}</h1>
          {contact.jobTitle && (
            <p className="mt-1 text-[1.05em] text-neutral-600">{contact.jobTitle}</p>
          )}
          <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[0.85em] text-(--link)">
            {[contact.email, contact.phone, contact.location, contact.linkedin, contact.portfolio]
              .filter(Boolean)
              .map((item) => (
                <span key={item}>{item}</span>
              ))}
          </p>
        </div>
      </header>

      <div className="mt-(--section-gap) flex flex-col gap-(--section-gap)">
        {summary && (
          <Section title="Summary">
            <p className="text-[0.92em] text-neutral-800">{summary}</p>
          </Section>
        )}

        {skills.length > 0 && (
          <Section title="Skills">
            <div className="flex flex-wrap gap-1.5">
              {skills.filter(Boolean).map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-neutral-100 px-2 py-0.5 text-[0.78em] text-neutral-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Section>
        )}

        {experience.length > 0 && (
          <Section title="Experience">
            <div className="flex flex-col gap-4">
              {experience.map((job) => (
                <div key={job.id}>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-[0.95em] font-medium">
                      {job.jobTitle} <span className="text-neutral-500">@ {job.company}</span>
                    </p>
                    <p className="shrink-0 text-[0.8em] text-neutral-500">
                      {job.startDate} &ndash; {job.endDate}
                    </p>
                  </div>
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
          <Section title="Education">
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

        <OptionalSectionBlocks blocks={optionalSectionsToBlocks(content.optionalSections)} />
      </div>
    </div>
  );
}
