import { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api";
import { parseBody } from "@/lib/api";
import { requireSession } from "@/lib/session";
import { favoriteSchema } from "@/lib/schemas";
import { listRecipesBySlugs } from "@/services/recipe-service";
import { setFavoriteSlug } from "@/services/user-service";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const session = await requireSession(request);
    const { slug } = await params;
    const payload = await parseBody(request, favoriteSchema);
    const favoriteSlugs = await setFavoriteSlug(session.id, slug, payload.favorite);
    const recipes = await listRecipesBySlugs(favoriteSlugs);

    return ok({ favoriteSlugs, recipes });
  } catch (error) {
    return fail(error);
  }
}
