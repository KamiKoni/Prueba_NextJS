"use client";

import Link from "next/link";
import { Card, Chip } from "@heroui/react";

import { RecipeImage } from "@/components/recipes/recipe-image";
import { FavoriteButton } from "@/components/recipes/favorite-button";
import type { RecipeRecord } from "@/types/app";

export function RecipeCard({
  recipe,
  priority = false,
}: {
  recipe: RecipeRecord;
  priority?: boolean;
}) {
  return (
    <Card className="recipe-card">
      <div className="relative">
        <Link className="block" href={`/recipes/${recipe.slug}`}>
          <div className="aspect-[4/3] overflow-hidden rounded-t-lg bg-stone-200">
            <RecipeImage
              alt={recipe.title}
              className="h-full w-full object-cover transition duration-300 hover:scale-105"
              cloudinaryHeight={360}
              cloudinaryWidth={480}
              height={360}
              imageUrl={recipe.imageUrl}
              loading={priority ? "eager" : "lazy"}
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              width={480}
            />
          </div>
        </Link>
        <div className="absolute right-3 top-3">
          <FavoriteButton slug={recipe.slug} />
        </div>
      </div>
      <Card.Content className="space-y-4 p-5">
        <Link href={`/recipes/${recipe.slug}`}>
          <div className="flex flex-wrap gap-2">
            {recipe.tags.slice(0, 2).map((tag) => (
              <Chip key={tag} color="success" size="sm" variant="soft">
                {tag}
              </Chip>
            ))}
          </div>
          <div>
            <h2 className="font-serif text-2xl text-stone-950">{recipe.title}</h2>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">{recipe.description}</p>
          </div>
        </Link>
      </Card.Content>
      <Card.Footer className="grid grid-cols-3 gap-2 border-t border-stone-100 p-5 text-center text-xs font-bold uppercase tracking-[0.08em] text-stone-500">
        <span>{recipe.cookTimeMinutes} min</span>
        <span>{recipe.servings} serves</span>
        <span>{recipe.difficulty}</span>
      </Card.Footer>
    </Card>
  );
}
