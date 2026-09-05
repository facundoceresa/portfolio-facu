"use client";

import { useRouter } from "next/navigation";

function csrf() {
  return document.cookie.split("; ").find((part) => part.startsWith("__Host-csrf="))?.split("=")[1] ?? "";
}

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      className="hard-button hard-button-secondary"
      type="button"
      onClick={async () => {
        await fetch("/api/admin/auth/logout", { method: "POST", headers: { "x-csrf-token": csrf() } });
        router.replace("/admin/login");
        router.refresh();
      }}
    >
      logout
    </button>
  );
}
