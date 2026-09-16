import type { ResumeAppearance, ResumeContent } from "@/lib/resume/types";
import { appearanceStyle } from "@/lib/resume/appearance";
import { optionalSectionsToBlocks } from "@/lib/resume/optional-sections";
import { OptionalSectionBlocks } from "./Section";
import { Avatar } from "./Avatar";

export function CompactTemplate({
  content,
  appearance,
}: {
  content: ResumeContent;
  appearance: ResumeAppearance;
}) {
  const { contact, summary, experience, education, skills } = content;

  return (
    <div
      className="w-full bg-white px-12 py-10 text-neutral-900"
      style={appearanceStyle(appearance)}
    >
      <header className="flex items-center justify-between gap-4 border-b border-neutral-300 pb-2">
        <div className="flex items-center gap-3">
          {contact.photoDataUrl && (
            <Avatar
              name={contact.name}
              photoDataUrl={contact.photoDataUrl}
              shape={appearance.photoShape}
              size={44}
            />
          )}
          <div>
            <h1 className="text-[1.5em] font-semibold tracking-tight">{contact.name}</h1>
            {contact.jobTitle && (
              <span className="text-[0.85em] text-neutral-600">{contact.jobTitle}</span>
            )}
          </div>
        </div>
        <p className="shrink-0 text-[0.72em] text-neutral-600">
          {[contact.email, contact.phone, contact.location]
            .filter(Boolean)
            .join("  ·  ")}
        </p>
      </header>

      <div className="mt-(--section-gap) flex flex-col gap-(--section-gap)">
        {summary && <p className="text-[0.82em] text-neutral-800">{summary}</p>}

        {experience.length > 0 && (
          <div>
            <h2 className="mb-1 text-[0.7em] font-semibold tracking-[0.06em] text-(--accent) uppercase">
              Experience
            </h2>
            <div className="flex flex-col divide-y divide-neutral-200">
              {experience.map((job) => (
                <div key={job.id} className="py-1.5 first:pt-0">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-[0.82em] font-medium">
                      {job.jobTitle} <span className="font-normal text-neutral-600">· {job.company}</span>
                    </p>
                    <p className="shrink-0 text-[0.72em] text-neutral-500">
                      {job.startDate}&ndash;{job.endDate}
                    </p>
                  </div>
                  <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-[0.78em] text-neutral-800">
                    {job.bullets.filter(Boolean).map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div>
            <h2 className="mb-1 text-[0.7em] font-semibold tracking-[0.06em] text-(--accent) uppercase">
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="flex items-baseline justify-between gap-4 text-[0.8em]">
                <p>
                  <span className="font-medium">{edu.degree}</span>, {edu.institution}
                </p>
                <p className="shrink-0 text-[0.72em] text-neutral-500">{edu.gradYear}</p>
              </div>
            ))}
          </div>
        )}

        {skills.length > 0 && (
          <div>
            <h2 className="mb-1 text-[0.7em] font-semibold tracking-[0.06em] text-(--accent) uppercase">
              Skills
            </h2>
            <p className="text-[0.78em] text-neutral-800">{skills.join(" · ")}</p>
          </div>
        )}

        <OptionalSectionBlocks blocks={optionalSectionsToBlocks(content.optionalSections)} />
      </div>
    </div>
  );
}
