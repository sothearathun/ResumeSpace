export type SectionTone = "caps" | "bordered" | "centered";

export function Section({
  title,
  tone = "caps",
  children,
}: {
  title: string;
  tone?: SectionTone;
  children: React.ReactNode;
}) {
  if (tone === "bordered") {
    return (
      <section>
        <h2 className="mb-2 border-b border-(--accent)/30 pb-1 text-[0.82em] font-semibold tracking-[0.04em] text-neutral-900 uppercase">
          {title}
        </h2>
        {children}
      </section>
    );
  }

  if (tone === "centered") {
    return (
      <section>
        <h2 className="mb-2 text-center text-[0.78em] font-semibold tracking-[0.12em] text-neutral-900 uppercase">
          {title}
        </h2>
        {children}
      </section>
    );
  }

  return (
    <section>
      <h2 className="mb-2 text-[0.78em] font-semibold tracking-[0.08em] text-(--accent) uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function OptionalSectionBlocks({
  blocks,
  tone = "caps",
}: {
  blocks: { key: string; title: string; lines: string[] }[];
  tone?: SectionTone;
}) {
  return (
    <>
      {blocks.map((block) => (
        <Section key={block.key} title={block.title} tone={tone}>
          <ul className="list-disc space-y-1 pl-4 text-[0.88em] text-neutral-800">
            {block.lines.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </Section>
      ))}
    </>
  );
}
