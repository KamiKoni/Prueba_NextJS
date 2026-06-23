import { NextRequest } from "next/server";

import { fail, ok, parseBody } from "@/lib/api";
import { AppError } from "@/lib/errors";
import { getRecipeBySlug } from "@/lib/recipes";
import { requireSession } from "@/lib/session";
import { createRecipeSchema } from "@/lib/schemas";
import { updateRecipe, deleteRecipe } from "@/services/recipe-service";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const recipe = await getRecipeBySlug(slug);

    if (!recipe) {
      throw new AppError(404, "NOT_FOUND", "Recipe not found.");
    }

    return ok({ recipe });
  } catch (error) {
    return fail(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireSession(request);
    const { slug } = await params;
    const payload = await parseBody(request, createRecipeSchema);

    const recipe = await updateRecipe(slug, payload);
    if (!recipe) {
      throw new AppError(404, "NOT_FOUND", "Recipe not found.");
    }

    return ok({ recipe });
  } catch (error) {
    return fail(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireSession(request);
    const { slug } = await params;

    const success = await deleteRecipe(slug);
    if (!success) {
      throw new AppError(404, "NOT_FOUND", "Recipe not found.");
    }

    return ok({ success });
  } catch (error) {
    return fail(error);
  }
}
