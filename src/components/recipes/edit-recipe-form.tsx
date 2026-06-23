"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import Link from "next/link";

import { useAppState } from "@/hooks/use-state";
import { FeedbackBanner } from "@/components/ui/feedback-banner";
import type { RecipeRecord } from "@/types/app";

interface EditRecipeFormProps {
  recipe: RecipeRecord;
}

export function EditRecipeForm({ recipe }: EditRecipeFormProps) {
  const router = useRouter();
  const { setNotification, clearNotification } = useAppState();

  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState(recipe.title);
  const [description, setDescription] = useState(recipe.description);
  const [imageUrl, setImageUrl] = useState(recipe.imageUrl || "");
  const [cookTimeMinutes, setCookTimeMinutes] = useState<number>(recipe.cookTimeMinutes);
  const [servings, setServings] = useState<number>(recipe.servings);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Chef">(recipe.difficulty);
  const [tagsInput, setTagsInput] = useState(recipe.tags.join(", "));
  
  const [ingredients, setIngredients] = useState<string[]>(recipe.ingredients || [""]);
  const [steps, setSteps] = useState<string[]>(recipe.steps || [""]);
  const [chefTip, setChefTip] = useState(recipe.chefTip || "");

  function handleAddIngredient() {
    setIngredients([...ingredients, ""]);
  }

  function handleRemoveIngredient(index: number) {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, idx) => idx !== index));
    } else {
      setIngredients([""]);
    }
  }

  function handleIngredientChange(index: number, value: string) {
    const next = [...ingredients];
    next[index] = value;
    setIngredients(next);
  }

  function handleAddStep() {
    setSteps([...steps, ""]);
  }

  function handleRemoveStep(index: number) {
    if (steps.length > 1) {
      setSteps(steps.filter((_, idx) => idx !== index));
    } else {
      setSteps([""]);
    }
  }

  function handleStepChange(index: number, value: string) {
    const next = [...steps];
    next[index] = value;
    setSteps(next);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearNotification();
    setBusy(true);

    const parsedTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const parsedIngredients = ingredients
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    const parsedSteps = steps
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (parsedTags.length === 0) {
      setNotification({ tone: "error", message: "Please specify at least one tag." });
      setBusy(false);
      return;
    }

    if (parsedIngredients.length === 0) {
      setNotification({ tone: "error", message: "Please specify at least one ingredient." });
      setBusy(false);
      return;
    }

    if (parsedSteps.length === 0) {
      setNotification({ tone: "error", message: "Please specify at least one step in the method." });
      setBusy(false);
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim() || undefined,
      cookTimeMinutes: Number(cookTimeMinutes),
      servings: Number(servings),
      difficulty,
      tags: parsedTags,
      ingredients: parsedIngredients,
      steps: parsedSteps,
      chefTip: chefTip.trim() || undefined,
    };

    try {
      const response = await fetch(`/api/recipes/${recipe.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok || body.success === false) {
        throw new Error(body.error?.message ?? "Failed to update recipe.");
      }

      setNotification({ tone: "success", message: "Recipe updated successfully!" });
      router.push(`/recipes/${body.data.recipe.slug}`);
      router.refresh();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "An unexpected error occurred.";
      setNotification({ tone: "error", message: msg });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto mt-8 max-w-3xl">
      <div className="panel rounded-[1.75rem] bg-white p-7 shadow-sm">
        <div className="mb-6">
          <p className="section-kicker">Edit Recipe</p>
          <h2 className="section-title">Modify recipe details</h2>
        </div>

        <div className="mb-5">
          <FeedbackBanner />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <label className="block space-y-2 col-span-2">
              <span className="text-sm font-medium text-stone-700">Recipe Title</span>
              <input
                className="field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Golden Turmeric Tofu Bowl"
                required
                minLength={3}
                maxLength={120}
              />
            </label>

            <label className="block space-y-2 col-span-2">
              <span className="text-sm font-medium text-stone-700">Short Description</span>
              <textarea
                className="field min-h-[100px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this dish, its flavor profile, and why it's special."
                required
                minLength={5}
                maxLength={1000}
              />
            </label>

            <label className="block space-y-2 col-span-2">
              <span className="text-sm font-medium text-stone-700">Image URL (Optional)</span>
              <input
                type="url"
                className="field"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-stone-700">Cook Time (Minutes)</span>
              <input
                type="number"
                min="1"
                className="field"
                value={cookTimeMinutes}
                onChange={(e) => setCookTimeMinutes(Number(e.target.value))}
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-stone-700">Servings</span>
              <input
                type="number"
                min="1"
                className="field"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                required
              />
            </label>

            <div className="block space-y-2">
              <span className="text-sm font-medium text-stone-700">Difficulty</span>
              <div className="flex rounded-full bg-stone-100 p-1">
                {(["Easy", "Medium", "Chef"] as const).map((level) => (
                  <Button
                    key={level}
                    type="button"
                    className={`flex-1 rounded-full px-4 py-2 text-sm font-bold ${
                      difficulty === level ? "bg-stone-950 text-white" : "text-stone-500 bg-transparent"
                    }`}
                    onPress={() => setDifficulty(level)}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-stone-700">Tags (comma-separated)</span>
              <input
                className="field"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Dinner, Plant-based, Quick"
                required
              />
            </label>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-stone-950 uppercase tracking-wider">Ingredients</span>
              <Button type="button" onPress={handleAddIngredient} className="secondary-button !py-1.5 !px-3 text-xs">
                + Add Ingredient
              </Button>
            </div>
            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    className="field"
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    placeholder={`Ingredient ${index + 1}`}
                    required
                  />
                  <Button
                    type="button"
                    onPress={() => handleRemoveIngredient(index)}
                    className="secondary-button !px-3"
                  >
                    &times;
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-stone-950 uppercase tracking-wider">Method (Steps)</span>
              <Button type="button" onPress={handleAddStep} className="secondary-button !py-1.5 !px-3 text-xs">
                + Add Step
              </Button>
            </div>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <span className="mt-3 text-sm font-bold text-stone-500 w-6">{index + 1}.</span>
                  <textarea
                    className="field min-h-[60px]"
                    value={step}
                    onChange={(e) => handleStepChange(index, e.target.value)}
                    placeholder={`Step ${index + 1}`}
                    required
                  />
                  <Button
                    type="button"
                    onPress={() => handleRemoveStep(index)}
                    className="secondary-button !px-3 mt-1"
                  >
                    &times;
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-stone-700">Chef Tip (Optional)</span>
            <textarea
              className="field min-h-[80px]"
              value={chefTip}
              onChange={(e) => setChefTip(e.target.value)}
              placeholder="Any hints or substitutions for this recipe..."
              maxLength={1000}
            />
          </label>

          <div className="flex items-center gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1 primary-button"
              isDisabled={busy}
            >
              {busy ? "Saving..." : "Save Changes"}
            </Button>
            <Link href={`/recipes/${recipe.slug}`} className="secondary-button flex-1 text-center">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
