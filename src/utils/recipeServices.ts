import {RecipeType} from "../types/RecipeType.ts";
import React from "react";

export const getSavedRecipes = (): RecipeType[] => {
    return JSON.parse(localStorage.getItem("recipes") || "[]")
}

export const saveRecipe = (recipe: RecipeType) => {
    const recipes = getSavedRecipes()
    const existingIndex = checkRecipeExists(recipe.key, recipes)
    if (existingIndex >= 0) {
        recipes.splice(existingIndex, 1, recipe)
    } else {
        recipes.push(recipe)
    }
    localStorage.setItem("recipes", JSON.stringify(recipes))
}

export const checkRecipeExists = (recipeKey: string, recipes: RecipeType[] = getSavedRecipes()) => {
    return recipes.findIndex((existingRecipe: RecipeType) => recipeKey === existingRecipe.key);
}

export const removeRecipe = (recipeKey: string) => {
    const updatedRecipes = getSavedRecipes().filter((existingRecipe: RecipeType) => existingRecipe.key !== recipeKey);
    localStorage.setItem("recipes", JSON.stringify(updatedRecipes))
}

export const createOrUpdateRecipe = (event: React.FormEvent<HTMLFormElement>, callbackFn: () => void, key: string = self.crypto.randomUUID()) => {
    event.preventDefault();
    const formData = Object.fromEntries((new FormData(event.currentTarget)).entries());
    const recipeData: RecipeType = {
        title: String(formData.name),
        description: String(formData.description),
        ingredients: String(formData.ingredients).split("\n").map((value) => ({name: value, quantity: ""})),
        key: key,
        createdLocally: true,
    }
    saveRecipe(recipeData)
    callbackFn()
}

