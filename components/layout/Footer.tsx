export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-6 text-[13px] text-text-secondary sm:px-6 lg:px-10">
        <span>ResumeCraft</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
