"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  return (
    <form
      className="technical-card mx-auto grid w-full max-w-md gap-5 p-6"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const body = Object.fromEntries(new FormData(form));
        startTransition(async () => {
          setError("");
          const response = await fetch("/api/admin/auth/login", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(body),
          });
          if (response.ok) {
            router.replace("/admin");
            router.refresh();
          } else {
            setError("Credenciales invalidas o cooldown activo.");
          }
        });
      }}
    >
      <div className="grid gap-2">
        <label className="tech-label" htmlFor="email">email</label>
        <input id="email" name="email" type="email" required autoComplete="username" className="min-h-12 border border-[color:var(--line)] bg-[rgba(13,27,42,0.72)] px-4" />
      </div>
      <div className="grid gap-2">
        <label className="tech-label" htmlFor="password">password</label>
        <input id="password" name="password" type="password" required minLength={16} autoComplete="current-password" className="min-h-12 border border-[color:var(--line)] bg-[rgba(13,27,42,0.72)] px-4" />
      </div>
      <button className="hard-button hard-button-primary" disabled={pending} type="submit">{pending ? "validando..." : "entrar"}</button>
      <p aria-live="polite" className="text-[color:var(--danger)]">{error}</p>
    </form>
  );
}
