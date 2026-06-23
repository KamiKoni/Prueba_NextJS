import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { SessionNav } from "@/components/auth/session-nav";
import { getRecipeBySlug } from "@/lib/recipes";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <section className="mx-auto w-full max-w-6xl px-5 py-6 lg:px-8">
        <nav className="flex items-center justify-between gap-4">
          <Link className="font-serif text-3xl text-stone-950" href="/">
            Pantry Routes
          </Link>
          <SessionNav />
        </nav>

        <article className="mt-8 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-[0_20px_70px_rgba(40,28,18,0.08)]">
          <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
            <div className="min-h-[22rem] bg-stone-200">
              <Image
                alt={recipe.title}
                className="h-full w-full object-cover"
                height={900}
                priority
                src={recipe.imageUrl}
                width={900}
              />
            </div>
            <div className="p-6 lg:p-9">
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <span className="mini-pill" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="mt-5 font-serif text-5xl leading-tight text-stone-950">{recipe.title}</h1>
              <p className="mt-4 text-lg leading-8 text-stone-600">{recipe.description}</p>
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <span className="metric-card rounded-lg p-4 text-sm font-bold">{recipe.cookTimeMinutes} min</span>
                <span className="metric-card rounded-lg p-4 text-sm font-bold">{recipe.servings} servings</span>
                <span className="metric-card rounded-lg p-4 text-sm font-bold">{recipe.difficulty}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-8 p-6 lg:grid-cols-[0.8fr_1.2fr] lg:p-9">
            <section>
              <p className="section-kicker">Ingredients</p>
              <ul className="mt-4 space-y-3 text-stone-700">
                {recipe.ingredients?.map((ingredient) => (
                  <li className="rounded-lg bg-stone-50 px-4 py-3" key={ingredient}>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <p className="section-kicker">Method</p>
              <ol className="mt-4 space-y-4">
                {recipe.steps?.map((step, index) => (
                  <li className="rounded-lg border border-stone-200 p-4 text-stone-700" key={step}>
                    <span className="mr-3 font-bold text-stone-950">{index + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
              {recipe.chefTip && (
                <p className="mt-6 rounded-lg bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">
                  {recipe.chefTip}
                </p>
              )}
            </section>
          </div>
        </article>
      </section>
    </main>
  );
}
