import { describe, expect, it } from "vitest";
import { contactSchema } from "@/features/contact/schemas";

describe("contactSchema", () => {
  it("normalizes email and accepts optional company role", () => {
    const parsed = contactSchema.parse({
      name: "Facundo",
      email: "FACU@example.com",
      companyRole: "",
      scope: "automation",
      budget: "undefined",
      message: "Necesito automatizar un proceso real con contexto suficiente.",
      consent: "on",
      locale: "es",
      startedAt: Date.now() - 5000,
      honeypot: "",
      turnstileToken: "token",
      idempotencyKey: "1234567890123456",
    });
    expect(parsed.email).toBe("facu@example.com");
  });

  it("rejects short messages", () => {
    const parsed = contactSchema.safeParse({
      name: "Facundo",
      email: "facu@example.com",
      scope: "automation",
      budget: "undefined",
      message: "corto",
      consent: "on",
      startedAt: Date.now(),
      turnstileToken: "token",
      idempotencyKey: "1234567890123456",
    });
    expect(parsed.success).toBe(false);
  });
});
