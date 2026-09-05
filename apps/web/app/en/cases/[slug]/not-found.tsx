import Link from "next/link";

export default function CaseNotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-5 text-center">
      <div>
        <p className="tech-label mb-5">{"// 404 · case"}</p>
        <h1 className="display-title text-[clamp(4rem,13vw,10rem)] text-mint">route not found</h1>
        <p className="mx-auto mt-6 max-w-xl text-[color:var(--muted)]">This case does not exist or is not published yet.</p>
        <Link className="hard-button hard-button-primary mt-8" href="/en/cases">
          back_to_cases()
        </Link>
      </div>
    </main>
  );
}
