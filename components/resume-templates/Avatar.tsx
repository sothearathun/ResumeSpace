export function Avatar({
  name,
  photoDataUrl,
  size = 88,
  shape = "circle",
  ring = false,
}: {
  name: string;
  photoDataUrl?: string;
  size?: number;
  shape?: "circle" | "square";
  /** A white ring, for placing the avatar on a colored header band. */
  ring?: boolean;
}) {
  const shapeClass = shape === "square" ? "rounded-lg" : "rounded-full";
  const ringClass = ring ? "ring-2 ring-white" : "";

  if (photoDataUrl) {
    // A plain <img> is intentional: the source is a client-side data URL
    // (no remote host to optimize) rendered inside a canvas the parent
    // scales with a CSS transform, which next/image's sizing doesn't suit.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoDataUrl}
        alt=""
        style={{ width: size, height: size }}
        className={`shrink-0 object-cover ${shapeClass} ${ringClass}`}
      />
    );
  }

  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("") || "?";

  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className={`flex shrink-0 items-center justify-center bg-(--accent) font-semibold text-white ${shapeClass} ${ringClass}`}
    >
      {initials}
    </div>
  );
}
