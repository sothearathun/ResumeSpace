import { Header } from "./Header";
import { Footer } from "./Footer";

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <section className="mx-auto flex w-full max-w-[480px] flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
        <h1 className="text-[24px] font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">{description}</p>
      </section>
      <Footer />
    </div>
  );
}
