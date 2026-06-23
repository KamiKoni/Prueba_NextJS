"use client";

import { useRouter } from "next/navigation";

import { useAppState } from "@/hooks/use-state";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`favorite-icon ${filled ? "favorite-icon--filled" : ""}`}
      fill={filled ? "currentColor" : "none"}
      height="18"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="18"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

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
    <button
      aria-label={selected ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={selected}
      className={`favorite-btn ${selected ? "favorite-btn--active" : ""}`}
      disabled={busy}
      type="button"
      onClick={() => void handleClick()}
    >
      <HeartIcon filled={selected} />
    </button>
  );
}
