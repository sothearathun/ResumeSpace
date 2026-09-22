"use client";

import dynamic from "next/dynamic";

// Same reasoning as MasterResumeLoader/BuilderShellLoader: reads localStorage,
// no meaningful server-rendered output.
export const MyResumesLoader = dynamic(
  () => import("./MyResumesShell").then((m) => m.MyResumesShell),
  { ssr: false }
);
