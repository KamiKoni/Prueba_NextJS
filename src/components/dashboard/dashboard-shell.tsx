"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function DashboardShell() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="panel max-w-md text-center">
        <p className="section-kicker">Pantry Routes</p>
        <h1 className="section-title">Opening recipes</h1>
      </div>
    </main>
  );
}
