import { BuilderShellLoader } from "@/components/builder/BuilderShellLoader";

export default async function BuilderPage(props: PageProps<"/builder/[draftId]">) {
  const { draftId } = await props.params;
  return <BuilderShellLoader key={draftId} draftId={draftId} />;
}
