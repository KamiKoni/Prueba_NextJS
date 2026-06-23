import { fail, ok } from "@/lib/api";
import { getRecipeCards } from "@/lib/recipes";

export async function GET() {
  try {
    const recipes = await getRecipeCards();
    return ok({ recipes });
  } catch (error) {
    return fail(error);
  }
}
