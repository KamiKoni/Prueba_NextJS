import { ObjectId } from "mongodb";

import { getCollections, type RecipeDocument } from "@/lib/mongodb";
import type { RecipeRecord } from "@/types/app";

const starterRecipes: Omit<RecipeDocument, "_id">[] = [
  {
    slug: "lemon-herb-risotto",
    title: "Lemon Herb Risotto",
    description: "Creamy arborio rice finished with lemon, parmesan, and garden herbs.",
    imageUrl:
      "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=1200&q=80",
    cookTimeMinutes: 38,
    servings: 4,
    difficulty: "Medium",
    tags: ["Vegetarian", "Dinner", "Italian"],
    ingredients: ["Arborio rice", "Vegetable stock", "Parmesan", "Lemon", "Parsley", "Butter"],
    steps: [
      "Toast rice in butter until the grains look glossy.",
      "Add warm stock one ladle at a time, stirring until absorbed.",
      "Fold in parmesan, lemon zest, lemon juice, and chopped herbs.",
      "Rest for two minutes before serving.",
    ],
    chefTip: "Keep the stock hot so the rice cooks evenly and stays silky.",
    internalNotes: "Card view intentionally hides steps, ingredients, and chefTip.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    slug: "smoky-chickpea-tacos",
    title: "Smoky Chickpea Tacos",
    description: "Crisp spiced chickpeas with avocado crema, cabbage, and lime.",
    imageUrl:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80",
    cookTimeMinutes: 25,
    servings: 3,
    difficulty: "Easy",
    tags: ["Weeknight", "Plant-based", "Tacos"],
    ingredients: ["Chickpeas", "Corn tortillas", "Avocado", "Cabbage", "Lime", "Smoked paprika"],
    steps: [
      "Roast chickpeas with oil, salt, cumin, and smoked paprika.",
      "Blend avocado, lime, yogurt, and cilantro into a crema.",
      "Warm tortillas and layer with cabbage, chickpeas, and crema.",
      "Finish with extra lime and flaky salt.",
    ],
    chefTip: "Dry the chickpeas well before roasting for a better crunch.",
    internalNotes: "Keep the internal spice-ratio note server-side only.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    slug: "berry-oat-skillet",
    title: "Berry Oat Skillet",
    description: "A cozy baked oat skillet with berries, maple, and toasted almonds.",
    imageUrl:
      "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1200&q=80",
    cookTimeMinutes: 32,
    servings: 6,
    difficulty: "Easy",
    tags: ["Breakfast", "Bake", "Family"],
    ingredients: ["Rolled oats", "Mixed berries", "Milk", "Maple syrup", "Eggs", "Almonds"],
    steps: [
      "Whisk milk, eggs, maple syrup, vanilla, and a pinch of salt.",
      "Stir in oats and berries, then pour into a buttered skillet.",
      "Bake until just set and golden at the edges.",
      "Top with toasted almonds before serving.",
    ],
    chefTip: "Use frozen berries straight from the freezer to prevent bleeding.",
    internalNotes: "Do not expose testing note: works with oat milk and flax eggs.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

function serializeRecipe(recipe: RecipeDocument, includeDetails = false): RecipeRecord {
  return {
    id: recipe._id.toHexString(),
    slug: recipe.slug,
    title: recipe.title,
    description: recipe.description,
    imageUrl: recipe.imageUrl,
    cookTimeMinutes: recipe.cookTimeMinutes,
    servings: recipe.servings,
    difficulty: recipe.difficulty,
    tags: recipe.tags,
    ingredients: includeDetails ? recipe.ingredients : undefined,
    steps: includeDetails ? recipe.steps : undefined,
    chefTip: includeDetails ? recipe.chefTip : undefined,
  };
}

export async function ensureStarterRecipes() {
  const { recipes } = await getCollections();
  const count = await recipes.countDocuments();

  if (count === 0) {
    await recipes.insertMany(starterRecipes.map((recipe) => ({ ...recipe, _id: new ObjectId() })));
  }
}

export async function listRecipeCards() {
  await ensureStarterRecipes();
  const { recipes } = await getCollections();
  const docs = await recipes.find().sort({ title: 1 }).toArray();

  return docs.map((recipe) => serializeRecipe(recipe));
}

export async function getRecipeDetails(slug: string) {
  await ensureStarterRecipes();
  const { recipes } = await getCollections();
  const recipe = await recipes.findOne({ slug });

  return recipe ? serializeRecipe(recipe, true) : null;
}

export async function listRecipesBySlugs(slugs: string[]) {
  if (slugs.length === 0) {
    return [];
  }

  await ensureStarterRecipes();
  const { recipes } = await getCollections();
  const docs = await recipes.find({ slug: { $in: slugs } }).toArray();
  const order = new Map(slugs.map((slug, index) => [slug, index]));

  return docs
    .sort((left, right) => (order.get(left.slug) ?? 0) - (order.get(right.slug) ?? 0))
    .map((recipe) => serializeRecipe(recipe));
}
