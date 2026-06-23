import { NextRequest } from "next/server";

import { fail, ok, parseBody } from "@/lib/api";
import { getRecipeCards } from "@/lib/recipes";
import { createRecipeSchema } from "@/lib/schemas";
import { requireSession } from "@/lib/session";
import { createRecipe } from "@/services/recipe-service";

export async function GET() {
  try {
    const recipes = await getRecipeCards();
    return ok({ recipes });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireSession(request);
    const payload = await parseBody(request, createRecipeSchema);
    const recipe = await createRecipe(payload);

    return ok({ recipe }, 201);
  } catch (error) {
    return fail(error);
  }
}
