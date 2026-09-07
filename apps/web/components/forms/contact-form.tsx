"use client";

import { useEffect, useMemo, useState, useTransition, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
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
    consent: "Autorizo el uso de estos datos unicamente para responder este mensaje.",
    submit: "enviar mensaje",
    sending: "enviando...",
    success: "Mensaje recibido. Si SMTP falla, igual queda visible en el panel.",
    error: "No se pudo enviar. Revisa los campos o intenta de nuevo.",
    formTitle: "// formulario_directo",
    formMeta: "v1 · 5 campos",
    namePlaceholder: "Como te llamas",
    emailPlaceholder: "tu@correo.com",
    companyPlaceholder: "Empresa · rol",
    messagePlaceholder: "Que queres resolver, contexto, restricciones, enlaces utiles...",
    markdown: "markdown soportado",
    response: "respuesta estimada",
    responseValue: "< 48 h",
    scopeLabels: {
      automation: "automatizacion",
      integration: "integracion",
      fullstack: "producto end-to-end",
      infrastructure: "infraestructura",
      "technical-review": "auditoria tecnica",
    },
    budgetLabels: {
      undefined: "por definir",
      "under-1k": "< 1k",
      "1k-5k": "1k - 5k",
      "5k-15k": "5k - 15k",
      "over-15k": "> 15k",
    },
  },
  en: {
    name: "Name",
    email: "Email",
    companyRole: "Company / role (optional)",
    scope: "Scope",
    budget: "Budget",
    message: "Message",
    consent: "I authorize these details to be used only to answer this message.",
    submit: "send message",
    sending: "sending...",
    success: "Message received. If SMTP fails, it still remains visible in the panel.",
    error: "Could not send. Review the fields or try again.",
    formTitle: "// direct_form",
    formMeta: "v1 · 5 fields",
    namePlaceholder: "How should I call you",
    emailPlaceholder: "you@email.com",
    companyPlaceholder: "Company · role",
    messagePlaceholder: "What you want to solve, context, constraints, useful links...",
    markdown: "markdown supported",
    response: "estimated response",
    responseValue: "< 48 h",
    scopeLabels: {
      automation: "automation",
      integration: "integration",
      fullstack: "end-to-end product",
      infrastructure: "infrastructure",
      "technical-review": "technical review",
    },
    budgetLabels: {
      undefined: "undefined",
      "under-1k": "< 1k",
      "1k-5k": "1k - 5k",
      "5k-15k": "5k - 15k",
      "over-15k": "> 15k",
    },
  },
};

export function ContactForm({ locale }: { locale: Locale }) {
  const t = labels[locale];
  const [startedAt] = useState(() => Date.now());
  const idempotencyKey = useMemo(() => crypto.randomUUID(), []);
  const [state, setState] = useState<FormState>({});
  const [pending, startTransition] = useTransition();
  const [messageLength, setMessageLength] = useState(0);
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
      className="contact-form-panel signal-panel"
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
      <div className="contact-form-panel-header">
        <p className="tech-label">{t.formTitle}</p>
        <span>{t.formMeta}</span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field id="name" label={t.name}>
          <input id="name" name="name" required minLength={2} maxLength={80} autoComplete="name" placeholder={t.namePlaceholder} className="form-control" />
        </Field>
        <Field id="email" label={t.email}>
          <input id="email" name="email" required type="email" maxLength={254} autoComplete="email" placeholder={t.emailPlaceholder} className="form-control" />
        </Field>
      </div>

      <Field id="companyRole" label={t.companyRole}>
        <input id="companyRole" name="companyRole" maxLength={120} autoComplete="organization-title" placeholder={t.companyPlaceholder} className="form-control" />
      </Field>

      <ChoiceField id="scope" label={t.scope} values={contactScopes} labels={t.scopeLabels} defaultValue="automation" />
      <ChoiceField id="budget" label={t.budget} values={contactBudgets} labels={t.budgetLabels} defaultValue="undefined" />

      <Field id="message" label={t.message}>
        <textarea
          id="message"
          name="message"
          required
          minLength={20}
          maxLength={2000}
          rows={7}
          placeholder={t.messagePlaceholder}
          className="form-control resize-y py-3"
          onChange={(event) => setMessageLength(event.currentTarget.value.length)}
        />
        <div className="contact-form-meta-row">
          <span>{t.markdown}</span>
          <span>{messageLength} / 2000</span>
        </div>
      </Field>

      <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <input type="hidden" name="turnstileToken" value={siteKey ? "" : "dev-turnstile-token"} />
      {siteKey ? <div className="cf-turnstile" data-sitekey={siteKey} data-response-field-name="turnstileToken" /> : null}

      <label className="contact-consent">
        <input name="consent" type="checkbox" required />
        <span>{t.consent}</span>
      </label>

      <div className="contact-form-submit-row">
        <p>
          {t.response} <strong>{t.responseValue}</strong>
        </p>
        <button className="hard-button hard-button-primary" disabled={pending} type="submit">
          {pending ? t.sending : t.submit}
          <ArrowUpRight size={15} aria-hidden="true" />
        </button>
      </div>

      <p aria-live="polite" className={state.ok ? "contact-form-status text-mint" : "contact-form-status text-[color:var(--danger)]"}>
        {state.message ?? state.error}
      </p>
    </form>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className="form-field">
      <label className="tech-label" htmlFor={id}>{label}</label>
      {children}
    </div>
  );
}

function ChoiceField<T extends string>({
  id,
  label,
  values,
  labels,
  defaultValue,
}: {
  id: string;
  label: string;
  values: readonly T[];
  labels: Record<T, string>;
  defaultValue: T;
}) {
  return (
    <fieldset className="form-field">
      <legend className="tech-label">{label}</legend>
      <div className="choice-grid">
        {values.map((value) => (
          <label className="choice-pill" key={value}>
            <input type="radio" name={id} value={value} defaultChecked={value === defaultValue} required />
            <span>{labels[value]}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
