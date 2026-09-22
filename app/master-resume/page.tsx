import { MasterResumeLoader } from "@/components/masterresume/MasterResumeLoader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Master Resume Tool",
  // The content page at /master-resume-builder is the one meant to rank;
  // this is the client-side tool, so keep it out of the index but let
  // crawlers follow its links.
  robots: { index: false, follow: true },
};

export default function MasterResumePage() {
  return <MasterResumeLoader />;
}
