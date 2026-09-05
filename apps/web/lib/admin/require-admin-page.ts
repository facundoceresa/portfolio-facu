import { redirect } from "next/navigation";
import { getSession } from "@/features/auth/auth";

export async function requireAdminPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}
