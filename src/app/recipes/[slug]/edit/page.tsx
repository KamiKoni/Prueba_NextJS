import Link from "next/link";
import { notFound } from "next/navigation";

import { SessionNav } from "@/components/auth/session-nav";
import { EditRecipeForm } from "@/components/recipes/edit-recipe-form";
import { getRecipeBySlug } from "@/lib/recipes";

export const dynamic = "force-dynamic";

export default async function EditRecipePage({
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
      <section className="mx-auto w-full max-w-7xl px-5 py-6 lg:px-8">
        <nav className="flex items-center justify-between gap-4">
          <Link className="font-serif text-3xl text-stone-950" href="/">
            Pantry Routes
          </Link>
          <SessionNav />
        </nav>
        <EditRecipeForm recipe={recipe} />
      </section>
    </main>
  );
}
