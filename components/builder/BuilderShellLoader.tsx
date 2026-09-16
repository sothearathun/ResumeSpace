"use client";

import dynamic from "next/dynamic";

/** The builder reads/writes localStorage, so it has no meaningful SSR
 * output — loading it client-only avoids a hydration-mismatch class of
 * bugs and lets BuilderShell read its initial draft synchronously via a
 * plain lazy useState instead of an effect+setState round trip. */
export const BuilderShellLoader = dynamic(
  () => import("./BuilderShell").then((m) => m.BuilderShell),
  { ssr: false }
);
