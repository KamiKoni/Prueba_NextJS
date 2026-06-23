import { cache } from "react";

import {
  ensureStarterRecipes,
  getRecipeDetails,
  listRecipeCards,
  listRecipesBySlugs,
} from "@/services/recipe-service";

export { ensureStarterRecipes, listRecipesBySlugs };

export const getRecipeCards = cache(async () => listRecipeCards());

export const getRecipeBySlug = cache(async (slug: string) => getRecipeDetails(slug));
