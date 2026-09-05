import { LegalPage } from "@/components/legal-page";
import { getSettings } from "@/features/content/data";

export const dynamic = "force-dynamic";

export default async function TermsPage() {
  return <LegalPage locale="en" kind="terms" settings={await getSettings()} />;
}
