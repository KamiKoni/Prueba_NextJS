"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";

import { useAppState } from "@/hooks/use-state";

export function SessionNav() {
  const router = useRouter();
  const { session, bootstrapping, busy, logout } = useAppState();

  async function handleLogout() {
    await logout();
    router.refresh();
  }

  if (bootstrapping) {
    return <span className="mini-pill">Checking session</span>;
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/login">
          <Button variant="secondary">Sign in</Button>
        </Link>
        <Link href="/auth/register">
          <Button variant="primary">Register</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="mini-pill">{session.name}</span>
      <Link href="/favorites">
        <Button variant="secondary">Favorites</Button>
      </Link>
      <Button isDisabled={busy} variant="outline" onPress={() => void handleLogout()}>
        Sign out
      </Button>
    </div>
  );
}
