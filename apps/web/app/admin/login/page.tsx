import { LoginForm } from "@/components/admin/login-form";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh place-items-center px-5">
      <div className="w-full">
        <p className="tech-label mb-4 text-center">{"// admin_auth"}</p>
        <h1 className="display-title mb-8 text-center text-[clamp(3rem,8vw,6rem)] text-mint">panel privado</h1>
        <LoginForm />
      </div>
    </main>
  );
}
