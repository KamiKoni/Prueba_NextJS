"use client";

import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import Link from "next/link";

import { useAppState } from "@/hooks/use-state";

export function SessionNav() {
  const router = useRouter();
  const { session, bootstrapping, busy, logout } = useAppState();

  async function handleLogout() {
    await logout();
    router.refresh();
  }

  if (bootstrapping && session) {
    return <span className="mini-pill">Checking session</span>;
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <a className="secondary-button" href="/auth/login">
          Sign in
        </a>
        <a className="primary-button" href="/auth/register">
          Register
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link className="mini-pill hover:bg-stone-200 transition-colors cursor-pointer" href="/">
        {session.name}
      </Link>
      <Link className="secondary-button" href="/recipes/new">
        Create Recipe
      </Link>
      <a className="secondary-button" href="/favorites">
        Favorites
      </a>
      <Button isDisabled={busy} variant="outline" onPress={() => void handleLogout()}>
        Sign out
      </Button>
    </div>
  );
}
