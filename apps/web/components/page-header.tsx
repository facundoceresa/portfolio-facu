export function PageHeader({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <section className="mx-auto max-w-[1360px] px-5 pb-16 pt-20 md:px-10 md:pb-24 md:pt-28">
      <p className="tech-label mb-5">{eyebrow}</p>
      <h1 className="display-title max-w-5xl text-[clamp(3.2rem,9vw,8.4rem)] text-mint">{title}</h1>
      {body ? <p className="mt-8 max-w-3xl text-lg leading-8 text-[color:var(--muted)]">{body}</p> : null}
    </section>
  );
}
