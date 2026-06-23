"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import Link from "next/link";

import { useAppState } from "@/hooks/use-state";

interface RecipeActionsProps {
  slug: string;
}

export function RecipeActions({ slug }: RecipeActionsProps) {
  const router = useRouter();
  const { setNotification, clearNotification } = useAppState();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm("Are you sure you want to delete this recipe? This action cannot be undone.");
    if (!confirmed) {
      return;
    }

    clearNotification();
    setDeleting(true);

    try {
      const response = await fetch(`/api/recipes/${slug}`, {
        method: "DELETE",
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok || body.success === false) {
        throw new Error(body.error?.message ?? "Failed to delete recipe.");
      }

      setNotification({ tone: "success", message: "Recipe deleted successfully." });
      router.push("/");
      router.refresh();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "An unexpected error occurred.";
      setNotification({ tone: "error", message: msg });
      setDeleting(false);
    }
  }

  return (
    <div className="mt-6 flex flex-wrap gap-3 border-t border-stone-100 pt-6">
      <Link href={`/recipes/${slug}/edit`} className="secondary-button !py-2 !px-4 text-sm flex-1 md:flex-none text-center">
        Edit Recipe
      </Link>
      <Button
        onPress={() => void handleDelete()}
        className="bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 !py-2 !px-4 text-sm font-bold flex-1 md:flex-none rounded-8"
        isDisabled={deleting}
      >
        {deleting ? "Deleting..." : "Delete Recipe"}
      </Button>
    </div>
  );
}
