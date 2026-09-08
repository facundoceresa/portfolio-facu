import { ScrollReveal } from "@/components/scroll-reveal";

type PageHeaderVariant = "showcase" | "read" | "contact" | "index";

const variantClassName: Record<PageHeaderVariant, string> = {
  showcase: "page-header-showcase",
  read: "page-header-read",
  contact: "page-header-contact",
  index: "page-header-index",
};

const titleClassName: Record<PageHeaderVariant, string> = {
  showcase: "max-w-5xl text-[clamp(3rem,8vw,7.6rem)]",
  read: "max-w-4xl text-[clamp(2.6rem,6vw,5.2rem)]",
  contact: "max-w-4xl text-[clamp(2.45rem,5.4vw,4.9rem)]",
  index: "max-w-5xl text-[clamp(2.8rem,7vw,6.4rem)]",
};

export function PageHeader({
  eyebrow,
  title,
  body,
  variant = "showcase",
}: {
  eyebrow: string;
  title: string;
  body?: string;
  variant?: PageHeaderVariant;
}) {
  return (
    <ScrollReveal
      as="section"
      className={`page-header ${variantClassName[variant]} mx-auto max-w-[1360px] px-5 md:px-10`}
      variant={variant === "contact" ? "compress" : variant === "read" ? "trace" : "lift"}
    >
      <p className="tech-label page-header-label">{eyebrow}</p>
      <h1 className={`display-title page-header-title ${titleClassName[variant]}`}>{renderTitle(title, variant)}</h1>
      {body ? <p className="page-header-body mt-8 max-w-3xl text-lg leading-8">{body}</p> : null}
    </ScrollReveal>
  );
}

function renderTitle(title: string, variant: PageHeaderVariant) {
  const parts = title.trim().split(/\s+/);
  if (parts.length < 2) return title;
  const last = parts.pop();
  return (
    <>
      {parts.join(" ")} <span className={variant === "read" ? "text-tone-fog" : variant === "index" ? "text-glow-soft" : "text-glow-strong"}>{last}</span>
    </>
  );
}
