"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { contactBudgets, contactScopes } from "@/features/contact/schemas";
import type { Locale } from "@/features/content/schemas";

type FormState = {
  ok?: boolean;
  message?: string;
  error?: string;
};

const labels = {
  es: {
    name: "Nombre",
    email: "Email",
    companyRole: "Empresa / rol (opcional)",
    scope: "Alcance",
    budget: "Presupuesto",
    message: "Mensaje",
    consent: "Acepto la politica de privacidad",
    submit: "enviar_mensaje()",
    sending: "enviando...",
    success: "Mensaje recibido. Si SMTP falla, igual queda visible en el panel.",
    error: "No se pudo enviar. Revisa los campos o intenta de nuevo.",
  },
  en: {
    name: "Name",
    email: "Email",
    companyRole: "Company / role (optional)",
    scope: "Scope",
    budget: "Budget",
    message: "Message",
    consent: "I accept the privacy policy",
    submit: "send_message()",
    sending: "sending...",
    success: "Message received. If SMTP fails, it still remains visible in the panel.",
    error: "Could not send. Review the fields or try again.",
  },
};

export function ContactForm({ locale }: { locale: Locale }) {
  const t = labels[locale];
  const [startedAt] = useState(() => Date.now());
  const idempotencyKey = useMemo(() => crypto.randomUUID(), []);
  const [state, setState] = useState<FormState>({});
  const [pending, startTransition] = useTransition();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey) return;
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    return () => script.remove();
  }, [siteKey]);

  return (
    <form
      className="technical-card grid gap-5 p-5 md:p-8"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        startTransition(async () => {
          setState({});
          const payload = Object.fromEntries(formData.entries());
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ ...payload, locale, startedAt, idempotencyKey }),
          });
          if (response.ok) {
            form.reset();
            setState({ ok: true, message: t.success });
          } else {
            setState({ ok: false, error: t.error });
          }
        });
      }}
    >
      <div className="grid gap-2">
        <label className="tech-label" htmlFor="name">{t.name}</label>
        <input id="name" name="name" required minLength={2} maxLength={80} autoComplete="name" className="min-h-12 border border-[color:var(--line)] bg-[rgba(13,27,42,0.72)] px-4 text-[color:var(--fog)]" />
      </div>
      <div className="grid gap-2">
        <label className="tech-label" htmlFor="email">{t.email}</label>
        <input id="email" name="email" required type="email" maxLength={254} autoComplete="email" className="min-h-12 border border-[color:var(--line)] bg-[rgba(13,27,42,0.72)] px-4 text-[color:var(--fog)]" />
      </div>
      <div className="grid gap-2">
        <label className="tech-label" htmlFor="companyRole">{t.companyRole}</label>
        <input id="companyRole" name="companyRole" maxLength={120} autoComplete="organization-title" className="min-h-12 border border-[color:var(--line)] bg-[rgba(13,27,42,0.72)] px-4 text-[color:var(--fog)]" />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <SelectField id="scope" label={t.scope} values={contactScopes} />
        <SelectField id="budget" label={t.budget} values={contactBudgets} />
      </div>
      <div className="grid gap-2">
        <label className="tech-label" htmlFor="message">{t.message}</label>
        <textarea id="message" name="message" required minLength={20} maxLength={2000} rows={8} className="border border-[color:var(--line)] bg-[rgba(13,27,42,0.72)] px-4 py-3 text-[color:var(--fog)]" />
      </div>
      <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <input type="hidden" name="turnstileToken" value={siteKey ? "" : "dev-turnstile-token"} />
      {siteKey ? <div className="cf-turnstile" data-sitekey={siteKey} data-response-field-name="turnstileToken" /> : null}
      <label className="flex items-start gap-3 text-sm leading-6 text-[color:var(--muted)]">
        <input name="consent" type="checkbox" required className="mt-1 h-5 w-5 accent-[color:var(--mint)]" />
        <span>{t.consent}</span>
      </label>
      <button className="hard-button hard-button-primary w-full md:w-auto" disabled={pending} type="submit">
        {pending ? t.sending : t.submit}
      </button>
      <p aria-live="polite" className={state.ok ? "text-mint" : "text-[color:var(--danger)]"}>
        {state.message ?? state.error}
      </p>
    </form>
  );
}

function SelectField({ id, label, values }: { id: string; label: string; values: readonly string[] }) {
  return (
    <div className="grid gap-2">
      <label className="tech-label" htmlFor={id}>{label}</label>
      <select id={id} name={id} required className="min-h-12 border border-[color:var(--line)] bg-[rgba(13,27,42,0.92)] px-4 text-[color:var(--fog)]">
        {values.map((value) => <option key={value} value={value}>{value}</option>)}
      </select>
    </div>
  );
}
