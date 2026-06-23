import { ObjectId } from "mongodb";

import { getCollections, type RecipeDocument } from "@/lib/mongodb";
import type { CreateRecipePayload, RecipeRecord } from "@/types/app";

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
  {
    slug: "miso-glazed-salmon-bowl",
    title: "Miso Glazed Salmon Bowl",
    description: "Silky salmon over jasmine rice with cucumber, avocado, and sesame crunch.",
    imageUrl:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
    cookTimeMinutes: 30,
    servings: 2,
    difficulty: "Medium",
    tags: ["Seafood", "Bowl", "Dinner"],
    ingredients: [
      "Salmon fillets",
      "White miso",
      "Jasmine rice",
      "Avocado",
      "Cucumber",
      "Sesame seeds",
      "Soy sauce",
    ],
    steps: [
      "Whisk miso, soy sauce, honey, and rice vinegar into a glossy glaze.",
      "Brush salmon with glaze and roast until just opaque in the center.",
      "Cook rice and fan avocado and cucumber over each bowl.",
      "Flake salmon on top and finish with sesame seeds and extra glaze.",
    ],
    chefTip: "Pull salmon off the heat when the center is still slightly translucent—it keeps cooking.",
    internalNotes: "Showcase Cloudinary fetch optimization on Unsplash hero shots.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    slug: "rustic-tomato-gnocchi",
    title: "Rustic Tomato Gnocchi",
    description: "Pillowy gnocchi in a slow-simmered tomato basil sauce with burrata.",
    imageUrl:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80",
    cookTimeMinutes: 35,
    servings: 4,
    difficulty: "Easy",
    tags: ["Italian", "Vegetarian", "Comfort"],
    ingredients: [
      "Potato gnocchi",
      "Crushed tomatoes",
      "Garlic",
      "Fresh basil",
      "Burrata",
      "Olive oil",
      "Parmesan",
    ],
    steps: [
      "Sweat garlic in olive oil, then add crushed tomatoes and simmer.",
      "Pan-sear gnocchi until golden before tossing in the sauce.",
      "Fold in torn basil off the heat and season to taste.",
      "Serve with torn burrata and shaved parmesan.",
    ],
    chefTip: "Sear gnocchi in a single layer so they develop a crisp shell.",
    internalNotes: "Detail page hides internalNotes from card view.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    slug: "chocolate-lava-mug-cake",
    title: "Chocolate Lava Mug Cake",
    description: "Single-serve molten chocolate cake ready in under ten minutes.",
    imageUrl:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
    cookTimeMinutes: 9,
    servings: 1,
    difficulty: "Easy",
    tags: ["Dessert", "Quick", "Chocolate"],
    ingredients: [
      "Dark chocolate",
      "Butter",
      "Egg",
      "Sugar",
      "Flour",
      "Cocoa powder",
      "Vanilla extract",
    ],
    steps: [
      "Melt chocolate and butter together until smooth.",
      "Whisk in egg, sugar, and vanilla, then fold in flour and cocoa.",
      "Pour into a buttered mug and bake until the edges set but the center jiggles.",
      "Rest one minute, then dust with cocoa and serve warm.",
    ],
    chefTip: "Stop baking when the top looks set but a gentle poke still feels soft in the middle.",
    internalNotes: "Great weeknight demo for favorites and detail view.",
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

const starterSlugs = starterRecipes.map((recipe) => recipe.slug);
let seedPromise: Promise<void> | null = null;

async function seedStarterRecipesOnce() {
  const { recipes } = await getCollections();
  const existingSlugs = await recipes.distinct("slug", { slug: { $in: starterSlugs } });

  if (existingSlugs.length === starterSlugs.length) {
    return;
  }

  const missing = starterRecipes.filter((recipe) => !existingSlugs.includes(recipe.slug));

  if (missing.length === 0) {
    return;
  }

  await recipes.bulkWrite(
    missing.map((recipe) => ({
      updateOne: {
        filter: { slug: recipe.slug },
        update: { $setOnInsert: { ...recipe, _id: new ObjectId() } },
        upsert: true,
      },
    }))
  );
}

export function ensureStarterRecipes() {
  if (!seedPromise) {
    seedPromise = seedStarterRecipesOnce().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }

  return seedPromise;
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

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export async function createRecipe(payload: CreateRecipePayload) {
  const { recipes } = await getCollections();

  let baseSlug = slugify(payload.title);
  if (!baseSlug) {
    baseSlug = "recipe";
  }

  let slug = baseSlug;
  let counter = 1;
  while (await recipes.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const now = new Date();
  const doc: RecipeDocument = {
    _id: new ObjectId(),
    slug,
    title: payload.title,
    description: payload.description,
    imageUrl: payload.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
    cookTimeMinutes: payload.cookTimeMinutes,
    servings: payload.servings,
    difficulty: payload.difficulty,
    tags: payload.tags,
    ingredients: payload.ingredients,
    steps: payload.steps,
    chefTip: payload.chefTip || "",
    internalNotes: "Created by user",
    createdAt: now,
    updatedAt: now,
  };

  await recipes.insertOne(doc);
  return serializeRecipe(doc, true);
}
