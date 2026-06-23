import { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api";
import { requireSession } from "@/lib/session";
import { listRecipesBySlugs } from "@/services/recipe-service";
import { getFavoriteSlugs } from "@/services/user-service";

export async function GET(request: NextRequest) {
  try {
    const session = await requireSession(request);
    const favoriteSlugs = await getFavoriteSlugs(session.id);
    const recipes = await listRecipesBySlugs(favoriteSlugs);

    return ok({ favoriteSlugs, recipes });
  } catch (error) {
    return fail(error);
  }
}
