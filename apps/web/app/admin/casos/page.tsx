import { JsonCreateForm } from "@/components/admin/json-create-form";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminTable } from "@/app/admin/page";
import { listAdminCases } from "@/features/admin/content-admin";
import { requireAdminPage } from "@/lib/admin/require-admin-page";

export const dynamic = "force-dynamic";

const template = {
  status: "draft",
  sortOrder: 10,
  readTimeMinutes: 6,
  resultValue: null,
  resultVerified: false,
  technologies: ["powershell", "active-directory"],
  translations: [
    { locale: "es", slug: "automatizacion-soporte", title: "Automatizacion de soporte", dek: "Caso real pendiente de redaccion completa y evidencia antes de publicar.", category: "automatizacion", periodLabel: "", resultLabel: "", contentBlocks: [{ type: "paragraph", markdown: "Borrador interno. Completar contexto, restricciones, rol, implementacion y aprendizajes." }] },
    { locale: "en", slug: "support-automation", title: "Support automation", dek: "Real case pending full writing and evidence before publication.", category: "automation", periodLabel: "", resultLabel: "", contentBlocks: [{ type: "paragraph", markdown: "Internal draft. Complete context, constraints, role, implementation and learnings." }] }
  ]
};

export default async function CasesAdminPage() {
  await requireAdminPage();
  const rows = await listAdminCases();
  return (
    <AdminShell>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <section className="technical-card p-5"><h2 className="mb-4 font-display text-2xl font-bold uppercase text-mint">casos</h2><AdminTable rows={rows.map((r) => ({ id: r.caseStudy.id, locale: r.translation.locale, title: r.translation.title, status: r.caseStudy.status, slug: r.translation.slug }))} /></section>
        <JsonCreateForm endpoint="/api/admin/cases" template={template} />
      </div>
    </AdminShell>
  );
}
