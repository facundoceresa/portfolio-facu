import Link from "next/link";

export default function CaseNotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-5 text-center">
      <div>
        <p className="tech-label mb-5">{"// 404 · caso"}</p>
        <h1 className="display-title text-[clamp(4rem,13vw,10rem)] text-mint">ruta no encontrada</h1>
        <p className="mx-auto mt-6 max-w-xl text-[color:var(--muted)]">El caso no existe o todavía no fue publicado.</p>
        <Link className="hard-button hard-button-primary mt-8" href="/casos">
          volver_casos()
        </Link>
      </div>
    </main>
  );
}
