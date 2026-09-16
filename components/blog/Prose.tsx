export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[15.5px] leading-relaxed text-text-primary
        [&>h2]:mt-10 [&>h2]:mb-1 [&>h2]:text-[20px] [&>h2]:font-semibold [&>h2]:tracking-tight
        [&>h3]:mt-7 [&>h3]:mb-1 [&>h3]:text-[16px] [&>h3]:font-semibold
        [&>p]:mt-4
        [&>ul]:mt-3 [&>ul]:list-disc [&>ul]:space-y-1.5 [&>ul]:pl-5
        [&>ol]:mt-3 [&>ol]:list-decimal [&>ol]:space-y-1.5 [&>ol]:pl-5
        [&_strong]:font-semibold [&_strong]:text-text-primary
        [&>blockquote]:mt-4 [&>blockquote]:border-l-2 [&>blockquote]:border-border [&>blockquote]:pl-4 [&>blockquote]:text-text-secondary"
    >
      {children}
    </div>
  );
}
