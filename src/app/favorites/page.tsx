import Link from "next/link";

import { SessionNav } from "@/components/auth/session-nav";
import { FavoritesView } from "@/components/recipes/favorites-view";

export default function FavoritesPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto w-full max-w-7xl px-5 py-6 lg:px-8">
        <nav className="flex items-center justify-between gap-4">
          <Link className="font-serif text-3xl text-stone-950" href="/">
            Pantry Routes
          </Link>
          <SessionNav />
        </nav>
        <FavoritesView />
      </section>
    </main>
  );
}
