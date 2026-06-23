import { RecipeCard } from "@/components/recipes/recipe-card";
import { SessionNav } from "@/components/auth/session-nav";
import { getRecipeCards } from "@/lib/recipes";

export default async function Home() {
  const recipes = await getRecipeCards();

  return (
    <main className="min-h-screen">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-6 lg:px-8">
        <nav className="flex items-center justify-between gap-4">
          <p className="font-serif text-3xl text-stone-950">Pantry Routes</p>
          <SessionNav />
        </nav>

        <header className="recipe-hero">
          <div className="max-w-3xl">
            <p className="section-kicker text-white/75">MongoDB recipe shelf</p>
            <h1 className="mt-4 font-serif text-5xl leading-tight text-white lg:text-7xl">
              Recipes worth opening twice.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/78 lg:text-lg">
              Browse concise recipe cards, then open a dynamic detail page for ingredients,
              steps, and chef notes that stay off the card.
            </p>
          </div>
        </header>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </section>
      </section>
    </main>
  );
}
