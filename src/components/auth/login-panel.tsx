"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@heroui/react";

import { FeedbackBanner } from "@/components/ui/feedback-banner";
import { useAppState } from "@/hooks/use-state";

export function LoginPanel({ initialMode = "login" }: { initialMode?: "login" | "register" }) {
  const router = useRouter();
  const { session, busy, login, register } = useAppState();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [router, session]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      if (mode === "register") {
        await register(name, email, password);
        setMode("login");
        setPassword("");
        return;
      }

      await login(email, password);
      router.replace("/");
    } catch {
      // Feedback is handled in app state.
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-10">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="auth-hero">
          <p className="section-kicker text-white/70">Pantry Routes</p>
          <h1 className="mt-5 font-serif text-5xl leading-tight text-white lg:text-6xl">
            Save your cooking nights in one warm little kitchen.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/78">
            Register to unlock the recipe shelf. New users are stored in MongoDB,
            authenticated with secure cookies, and greeted by email.
          </p>
        </section>

        <section className="panel rounded-[1.75rem] bg-white p-7">
          <div className="flex rounded-full bg-stone-100 p-1">
            {(["login", "register"] as const).map((item) => (
              <Button
                key={item}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-bold ${
                  mode === item ? "bg-stone-950 text-white" : "text-stone-500"
                }`}
                variant={mode === item ? "primary" : "ghost"}
                onPress={() => setMode(item)}
              >
                {item === "login" ? "Sign in" : "Register"}
              </Button>
            ))}
          </div>

          <div className="mt-7">
            <p className="section-kicker">{mode === "login" ? "Welcome back" : "Join the kitchen"}</p>
            <h2 className="section-title">{mode === "login" ? "Open your shelf" : "Create account"}</h2>
          </div>

          <div className="mt-5">
            <FeedbackBanner />
          </div>

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            {mode === "register" && (
              <label className="block space-y-2">
                <span className="text-sm font-medium text-stone-700">Name</span>
                <input
                  className="field"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Julia Child"
                  required
                />
              </label>
            )}

            <label className="block space-y-2">
              <span className="text-sm font-medium text-stone-700">Email</span>
              <input
                className="field"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="cook@example.com"
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-stone-700">Password</span>
              <input
                className="field"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
            </label>

            <Button className="w-full" isDisabled={busy} type="submit" variant="primary">
              {busy ? "Working..." : mode === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <Link className="mt-5 inline-flex text-sm font-semibold text-stone-500 hover:text-stone-900" href="/">
            Back to recipes
          </Link>
        </section>
      </div>
    </main>
  );
}
