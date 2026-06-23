import Link from "next/link";
import Image from "next/image";
import { Card, CardBody, CardFooter, Chip } from "@heroui/react";

import { FavoriteButton } from "@/components/recipes/favorite-button";
import type { RecipeRecord } from "@/types/app";

export function RecipeCard({ recipe }: { recipe: RecipeRecord }) {
  return (
    <Card className="recipe-card" radius="sm" shadow="sm">
      <div className="relative">
        <Link className="block" href={`/recipes/${recipe.slug}`}>
        <div className="aspect-[4/3] overflow-hidden rounded-t-lg bg-stone-200">
          <Image
            alt={recipe.title}
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
            height={600}
            src={recipe.imageUrl}
            width={800}
          />
        </div>
        </Link>
        <div className="absolute right-3 top-3">
          <FavoriteButton slug={recipe.slug} />
        </div>
      </div>
      <CardBody className="space-y-4 p-5">
        <Link href={`/recipes/${recipe.slug}`}>
          <div className="flex flex-wrap gap-2">
            {recipe.tags.slice(0, 2).map((tag) => (
              <Chip key={tag} color="success" radius="sm" size="sm" variant="flat">
                {tag}
              </Chip>
            ))}
          </div>
          <div>
            <h2 className="font-serif text-2xl text-stone-950">{recipe.title}</h2>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">{recipe.description}</p>
          </div>
        </Link>
      </CardBody>
      <CardFooter className="grid grid-cols-3 gap-2 border-t border-stone-100 p-5 text-center text-xs font-bold uppercase tracking-[0.08em] text-stone-500">
        <span>{recipe.cookTimeMinutes} min</span>
        <span>{recipe.servings} serves</span>
        <span>{recipe.difficulty}</span>
      </CardFooter>
    </Card>
  );
}
