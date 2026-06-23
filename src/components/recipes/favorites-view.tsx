"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { RecipeCard } from "@/components/recipes/recipe-card";
import { useAppState } from "@/hooks/use-state";
import type { FavoritesPayload, RecipeRecord } from "@/types/app";

export function FavoritesView() {
  const router = useRouter();
  const { session, bootstrapping, clearSession } = useAppState();
  const [recipes, setRecipes] = useState<RecipeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bootstrapping) {
      return;
    }

    if (!session) {
      router.replace("/auth/login");
      return;
    }

    let cancelled = false;

    async function loadFavorites() {
      try {
        const response = await fetch("/api/favorites", {
          credentials: "same-origin",
          cache: "no-store",
        });

        if (response.status === 401) {
          clearSession();
          if (!cancelled) {
            router.replace("/auth/login");
          }
          return;
        }

        const payload = (await response.json()) as { data?: FavoritesPayload; success?: boolean };

        if (!cancelled) {
          setRecipes(payload.data?.recipes ?? []);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setRecipes([]);
          setLoading(false);
        }
      }
    }

    void loadFavorites();

    return () => {
      cancelled = true;
    };
  }, [bootstrapping, router, session, clearSession]);

  if (bootstrapping || loading) {
    return (
      <div className="panel mx-auto mt-10 max-w-md text-center">
        <p className="section-kicker">Favorites</p>
        <h1 className="section-title">Loading saved recipes</h1>
      </div>
    );
  }

  return (
    <section className="mt-8">
      {recipes.length === 0 ? (
        <div className="panel mx-auto max-w-lg text-center">
          <p className="section-kicker">Favorites</p>
          <h1 className="section-title">No saved recipes yet</h1>
          <Link href="/">
            <Button className="mt-5" variant="primary">Browse recipes</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {recipes.map((recipe, index) => (
            <RecipeCard key={recipe.id} priority={index < 3} recipe={recipe} />
          ))}
        </div>
      )}
    </section>
  );
}
