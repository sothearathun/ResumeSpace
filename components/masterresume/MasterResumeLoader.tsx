"use client";

import dynamic from "next/dynamic";

// Same reasoning as BuilderShellLoader: this reads/writes localStorage and
// has no meaningful server-rendered output.
export const MasterResumeLoader = dynamic(
  () => import("./MasterResumeShell").then((m) => m.MasterResumeShell),
  { ssr: false }
);
