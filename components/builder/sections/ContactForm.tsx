import { useState } from "react";
import type { ResumeAppearance, ResumeDraft } from "@/lib/resume/types";
import { readImageAsDataUrl } from "@/lib/resume/photo";
import { Avatar } from "@/components/resume-templates/Avatar";
import { Field } from "../Field";
import { inputClass } from "../inputStyles";

type Contact = ResumeDraft["contact"];

const PHOTO_SIZES: NonNullable<ResumeAppearance["photoSize"]>[] = ["small", "medium", "large"];

export function ContactForm({
  contact,
  onChange,
  supportsPhoto,
  photoShape,
  onPhotoShapeChange,
  photoSize,
  onPhotoSizeChange,
}: {
  contact: Contact;
  onChange: (contact: Contact) => void;
  supportsPhoto: boolean;
  photoShape: ResumeAppearance["photoShape"];
  onPhotoShapeChange: (shape: ResumeAppearance["photoShape"]) => void;
  photoSize: ResumeAppearance["photoSize"];
  onPhotoSizeChange: (size: ResumeAppearance["photoSize"]) => void;
}) {
  const [photoError, setPhotoError] = useState<string | null>(null);

  function set<K extends keyof Contact>(key: K, value: Contact[K]) {
    onChange({ ...contact, [key]: value });
  }

  async function handlePhotoSelect(file: File | undefined) {
    if (!file) return;
    setPhotoError(null);
    try {
      const dataUrl = await readImageAsDataUrl(file);
      set("photoDataUrl", dataUrl);
    } catch {
      setPhotoError("Couldn't read that image — try a different file.");
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {supportsPhoto && (
        // Not using the shared Field wrapper here: it renders a <label>,
        // and this field already contains its own <label> around the file
        // input — nesting labels makes some browsers open the file picker
        // twice on a single click.
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-text-primary">Photo</span>
          <div className="flex items-center gap-4">
            {/* Fixed size on purpose — this is a preview of the uploaded
                photo itself, not of how big it'll appear on the resume, so
                it shouldn't shrink/grow when the Size control changes. */}
            <Avatar
              name={contact.name || "?"}
              photoDataUrl={contact.photoDataUrl}
              shape={photoShape}
              size={64}
            />
            <div className="flex items-center gap-3">
              <label className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-[13px] font-medium text-text-primary transition-colors hover:bg-bg-secondary">
                {contact.photoDataUrl ? "Change photo" : "Upload photo"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handlePhotoSelect(e.target.files?.[0])}
                />
              </label>
              {contact.photoDataUrl && (
                <button
                  type="button"
                  onClick={() => set("photoDataUrl", undefined)}
                  className="text-[13px] text-text-secondary hover:text-error"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[12px] text-text-secondary">Shape</span>
            <div className="flex overflow-hidden rounded-md border border-border">
              {(["circle", "square"] as const).map((shape) => (
                <button
                  key={shape}
                  type="button"
                  onClick={() => onPhotoShapeChange(shape)}
                  aria-pressed={(photoShape ?? "circle") === shape}
                  className={`px-2.5 py-1 text-[12px] capitalize transition-colors ${
                    (photoShape ?? "circle") === shape
                      ? "bg-accent text-white"
                      : "text-text-secondary hover:bg-bg-secondary"
                  }`}
                >
                  {shape}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[12px] text-text-secondary">Size</span>
            <div className="flex overflow-hidden rounded-md border border-border">
              {PHOTO_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => onPhotoSizeChange(size)}
                  aria-pressed={(photoSize ?? "medium") === size}
                  className={`px-2.5 py-1 text-[12px] capitalize transition-colors ${
                    (photoSize ?? "medium") === size
                      ? "bg-accent text-white"
                      : "text-text-secondary hover:bg-bg-secondary"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <span className="text-[12px] text-text-secondary">
            Common in Europe and Asia; usually skipped for US, UK, and Canada applications.
          </span>
          {photoError && <span className="text-[12px] text-error">{photoError}</span>}
        </div>
      )}

      <Field label="Full name">
        <input
          className={inputClass}
          value={contact.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Jordan Rivera"
        />
      </Field>
      <Field label="Job title" helperText="Shown under your name on the resume.">
        <input
          className={inputClass}
          value={contact.jobTitle ?? ""}
          onChange={(e) => set("jobTitle", e.target.value)}
          placeholder="Product Designer"
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Email">
          <input
            className={inputClass}
            type="email"
            value={contact.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@email.com"
          />
        </Field>
        <Field label="Phone">
          <input
            className={inputClass}
            value={contact.phone ?? ""}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="(555) 555-0100"
          />
        </Field>
      </div>
      <Field label="Location">
        <input
          className={inputClass}
          value={contact.location ?? ""}
          onChange={(e) => set("location", e.target.value)}
          placeholder="New York, NY"
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="LinkedIn">
          <input
            className={inputClass}
            value={contact.linkedin ?? ""}
            onChange={(e) => set("linkedin", e.target.value)}
            placeholder="linkedin.com/in/you"
          />
        </Field>
        <Field label="Portfolio">
          <input
            className={inputClass}
            value={contact.portfolio ?? ""}
            onChange={(e) => set("portfolio", e.target.value)}
            placeholder="you.com"
          />
        </Field>
      </div>
    </div>
  );
}
