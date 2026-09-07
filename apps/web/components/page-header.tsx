import { ScrollReveal } from "@/components/scroll-reveal";

export function PageHeader({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <ScrollReveal as="section" className="page-header mx-auto max-w-[1360px] px-5 pb-16 pt-20 md:px-10 md:pb-24 md:pt-28">
      <p className="tech-label mb-5">{eyebrow}</p>
      <h1 className="display-title max-w-5xl text-[clamp(3.2rem,9vw,8.4rem)] text-mint">{renderTitle(title)}</h1>
      {body ? <p className="page-header-body mt-8 max-w-3xl text-lg leading-8">{body}</p> : null}
    </ScrollReveal>
  );
}

function renderTitle(title: string) {
  const parts = title.trim().split(/\s+/);
  if (parts.length < 2) return title;
  const last = parts.pop();
  return (
    <>
      {parts.join(" ")} <span className="text-glow-strong">{last}</span>
    </>
  );
}
