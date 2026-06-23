"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

import { useAppState } from "@/hooks/use-state";

export function FavoriteButton({ slug }: { slug: string }) {
  const router = useRouter();
  const { session, favoriteSlugs, busy, toggleFavorite } = useAppState();
  const selected = favoriteSlugs.includes(slug);

  async function handleClick() {
    if (!session) {
      router.push("/auth/login");
      return;
    }

    await toggleFavorite(slug);
    router.refresh();
  }

  return (
    <Button
      isIconOnly
      aria-label={selected ? "Remove from favorites" : "Add to favorites"}
      className={`bookmark-button ${selected ? "bookmark-button-on" : ""}`}
      isDisabled={busy}
      radius="sm"
      size="sm"
      variant="flat"
      onPress={() => void handleClick()}
    >
      <span aria-hidden="true" className="bookmark-icon" />
    </Button>
  );
}
