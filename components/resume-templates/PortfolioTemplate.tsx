import type { ResumeAppearance, ResumeContent } from "@/lib/resume/types";
import { appearanceStyle, scaledAvatarSize } from "@/lib/resume/appearance";
import { optionalSectionsToBlocks } from "@/lib/resume/optional-sections";
import { Avatar } from "./Avatar";

function BigSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-[1.05em] font-bold tracking-tight text-neutral-900">{title}</h2>
      {children}
    </section>
  );
}

export function PortfolioTemplate({
  content,
  appearance,
}: {
  content: ResumeContent;
  appearance: ResumeAppearance;
}) {
  const { contact, summary, experience, education, skills } = content;
  const blocks = optionalSectionsToBlocks(content.optionalSections);

  return (
    <div className="w-full bg-white text-neutral-900" style={appearanceStyle(appearance)}>
      <header className="flex items-start gap-6 bg-(--header-bg) px-14 py-12">
        {contact.photoDataUrl && (
          <Avatar
            name={contact.name}
            photoDataUrl={contact.photoDataUrl}
            shape={appearance.photoShape}
            size={scaledAvatarSize(160, appearance.photoSize)}
            ring
          />
        )}
        <div>
          <h1 className="text-[2.6em] leading-none font-bold tracking-tight text-(--accent)">
            {contact.name}
          </h1>
          {contact.jobTitle && (
            <p className="mt-2 text-[1.1em] font-medium text-neutral-800">{contact.jobTitle}</p>
          )}
          <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[0.85em] text-(--link)">
            {[contact.email, contact.phone, contact.location, contact.portfolio]
              .filter(Boolean)
              .map((item) => (
                <span key={item}>{item}</span>
              ))}
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-(--section-gap) px-14 py-10">
        {summary && (
          <BigSection title="About">
            <p className="text-[0.95em] text-neutral-800">{summary}</p>
          </BigSection>
        )}

        {experience.length > 0 && (
          <BigSection title="Experience">
            <div className="flex flex-col gap-4">
              {experience.map((job) => (
                <div key={job.id}>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-[1em] font-semibold">{job.jobTitle}</p>
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
          </BigSection>
        )}

        {blocks.map((block) => (
          <BigSection key={block.key} title={block.title}>
            <ul className="list-disc space-y-1 pl-4 text-[0.88em] text-neutral-800">
              {block.lines.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </BigSection>
        ))}

        <div className="grid grid-cols-2 gap-8">
          {education.length > 0 && (
            <BigSection title="Education">
              <div className="flex flex-col gap-2">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <p className="text-[0.9em] font-medium">{edu.degree}</p>
                    <p className="text-[0.85em] text-neutral-600">
                      {edu.institution} &middot; {edu.gradYear}
                    </p>
                  </div>
                ))}
              </div>
            </BigSection>
          )}

          {skills.length > 0 && (
            <BigSection title="Skills">
              <p className="text-[0.88em] text-neutral-800">{skills.filter(Boolean).join(" · ")}</p>
            </BigSection>
          )}
        </div>
      </div>
    </div>
  );
}
