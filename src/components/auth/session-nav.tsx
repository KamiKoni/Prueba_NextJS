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
        <Button as={Link} color="success" href="/auth/login" radius="sm" variant="flat">
          Sign in
        </Button>
        <Button as={Link} color="success" href="/auth/register" radius="sm">
          Register
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="mini-pill">{session.name}</span>
      <Button as={Link} href="/favorites" radius="sm" variant="flat">
        Favorites
      </Button>
      <Button isDisabled={busy} radius="sm" variant="bordered" onPress={() => void handleLogout()}>
        Sign out
      </Button>
    </div>
  );
}
