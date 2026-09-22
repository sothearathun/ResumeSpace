import Link from "next/link";
import type { ResumeExample } from "@/lib/resume-examples/examples";
import { TemplatePreviewLazy } from "@/components/resume-templates/TemplatePreviewLazy";
import { sampleResumes } from "@/lib/resume/sample-resumes";

export function ExampleCard({ example }: { example: ResumeExample }) {
  const name = sampleResumes[example.templateKey].contact.name;

  return (
    <Link href={`/resume-examples/${example.slug}`} className="group flex flex-col gap-4">
      <div className="overflow-hidden rounded-lg border border-border transition-colors group-hover:border-accent/40">
        <TemplatePreviewLazy templateKey={example.templateKey} />
      </div>
      <div>
        <h3 className="text-[15px] font-medium group-hover:text-accent">
          {example.roleTitle} Resume Example
        </h3>
        <p className="mt-1 text-[13px] text-text-secondary">{example.summary}</p>
        <p className="mt-1 text-[12px] text-text-secondary">Based on {name}&rsquo;s resume</p>
      </div>
    </Link>
  );
}
