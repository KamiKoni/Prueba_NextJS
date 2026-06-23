import { fail, ok } from "@/lib/api";
import { AppError } from "@/lib/errors";
import { getRecipeBySlug } from "@/lib/recipes";

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
