import {RecipeType} from "../types/RecipeType.ts";

export const saveUserPreferences = (preference: string) => {
    localStorage.setItem('preferences', JSON.stringify(preference));
};

export const getUserPreferences = (): string => {
    return JSON.parse(localStorage.getItem('preferences') || '"all"');
};

export const calculateInsights = () => {
    const recipes: RecipeType[] = JSON.parse(localStorage.getItem("recipes") || "[]")
    if (recipes.length < 1) {
        return null
    }
    const customRecipesCount = recipes.filter((recipe: RecipeType) => !("image" in recipe)).length

    const labelHistogram: Record<string, number> = {};
    recipes.forEach((recipe: RecipeType) => {
        if (recipe.labels) {
            recipe.labels.forEach(label => {
                if (label in labelHistogram) {
                    labelHistogram[label]++;
                } else {
                    labelHistogram[label] = 1;
                }
            });
        }
    });

    const ingredientsHistogram: Record<string, number> = {};
    recipes.forEach((recipe: RecipeType) => {
        recipe.ingredients.forEach(ingredient => {
            if (ingredient.name in ingredientsHistogram) {
                ingredientsHistogram[ingredient.name]++;
            } else {
                ingredientsHistogram[ingredient.name] = 1;
            }
        });
    });

    let veganVegetarianCount = 0;
    recipes.forEach((recipe: RecipeType) => {
        recipe.labels?.map(label => {
            if (!label) return
            label = label.toLowerCase();
            if (label === "vegan" || label === "vegetarian") {
                veganVegetarianCount++;
            }
        });
    });

    return {
        customRecipesPercentage: customRecipesCount / recipes.length,
        labelHistogram: Object.fromEntries(Object.entries(labelHistogram).sort((a, b) => b[1] - a[1]).slice(0, 10)),
        ingredientsHistogram: Object.fromEntries(Object.entries(ingredientsHistogram).sort((a, b) => b[1] - a[1]).slice(0, 10)),
        veganVegetarianCount: veganVegetarianCount,
        recipeCount: recipes.length,
        favoriteRecipes: recipes.filter((r) => r.viewCount !== undefined).sort(
            (a, b) => b.viewCount && a.viewCount ? b.viewCount - a.viewCount : 0
        ).slice(0, 3)
    }
}