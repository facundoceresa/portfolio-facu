"use client";

import { useState, useTransition } from "react";

function csrf() {
  return document.cookie.split("; ").find((part) => part.startsWith("__Host-csrf="))?.split("=")[1] ?? "";
}

export function JsonCreateForm({ endpoint, template }: { endpoint: string; template: unknown }) {
  const [value, setValue] = useState(JSON.stringify(template, null, 2));
  const [status, setStatus] = useState("");
  const [pending, startTransition] = useTransition();
  return (
    <form
      className="technical-card grid gap-4 p-5"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => {
          setStatus("");
          const response = await fetch(endpoint, {
            method: "POST",
            headers: { "content-type": "application/json", "x-csrf-token": csrf() },
            body: value,
          });
          setStatus(response.ok ? "guardado" : "error de validacion");
        });
      }}
    >
      <label className="tech-label" htmlFor={`${endpoint}-json`}>crear / editar json estructurado</label>
      <textarea id={`${endpoint}-json`} value={value} onChange={(event) => setValue(event.target.value)} rows={18} className="w-full overflow-x-auto border border-[color:var(--line)] bg-[rgba(0,0,0,0.22)] p-4 font-mono text-xs text-[color:var(--glow)]" />
      <button className="hard-button hard-button-primary" disabled={pending} type="submit">{pending ? "guardando..." : "crear registro"}</button>
      <p aria-live="polite" className="text-mint">{status}</p>
    </form>
  );
}
