import { LegalPage } from "@/components/legal-page";
import { getSettings } from "@/features/content/data";

export const dynamic = "force-dynamic";

export default async function PrivacyPage() {
  return <LegalPage locale="es" kind="privacy" settings={await getSettings()} />;
}
