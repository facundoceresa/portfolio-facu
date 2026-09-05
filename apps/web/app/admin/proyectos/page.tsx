import { JsonCreateForm } from "@/components/admin/json-create-form";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminTable } from "@/app/admin/page";
import { listAdminProjects } from "@/features/admin/content-admin";
import { requireAdminPage } from "@/lib/admin/require-admin-page";

export const dynamic = "force-dynamic";

const template = {
  status: "draft",
  kind: "personal",
  featured: false,
  sortOrder: 10,
  metricValue: null,
  metricLabelKey: null,
  repoUrl: "",
  liveUrl: "",
  evidenceNote: "Completar evidencia antes de publicar.",
  technologies: ["postgres", "docker"],
  translations: [
    { locale: "es", slug: "borrador-real", title: "Borrador real", summary: "Resumen real pendiente de completar antes de publicar.", category: "infra", role: "" },
    { locale: "en", slug: "real-draft", title: "Real draft", summary: "Real summary pending completion before publishing.", category: "infra", role: "" }
  ]
};

export default async function ProjectsAdminPage() {
  await requireAdminPage();
  const rows = await listAdminProjects();
  return (
    <AdminShell>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <section className="technical-card p-5"><h2 className="mb-4 font-display text-2xl font-bold uppercase text-mint">proyectos</h2><AdminTable rows={rows.map((r) => ({ id: r.project.id, locale: r.translation.locale, title: r.translation.title, status: r.project.status, slug: r.translation.slug }))} /></section>
        <JsonCreateForm endpoint="/api/admin/projects" template={template} />
      </div>
    </AdminShell>
  );
}
