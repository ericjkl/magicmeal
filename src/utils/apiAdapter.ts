import Axios from 'axios';
import {RecipeType} from '../types/RecipeType.ts';
import {setupCache} from 'axios-cache-interceptor';
import {RecipeResponseType} from "../types/RecipeResponseType.ts";

const axiosInstance = Axios.create();
const axiosCached = setupCache(axiosInstance, {cacheTakeover: false});

const parseRecipeResponse = (recipeData: RecipeResponseType) => {
    const ingredients = Array.from({length: 20}, (_, i) => ({
        // @ts-expect-error indexing recipeData with "strIngredient1" to "strIngredient20" is valid and safe
        name: recipeData[`strIngredient${i + 1}`]?.trim(),
        // @ts-expect-error indexing recipeData with "strMeasure1" to "strMeasure20" is valid and safe
        quantity: recipeData[`strMeasure${i + 1}`]?.trim(),
    })).filter(item => item.name && item.name !== '' && item.quantity && item.quantity !== '');

    return {
        title: recipeData.strMeal,
        image: recipeData.strMealThumb,
        description: recipeData.strInstructions,
        labels: [recipeData.strArea, recipeData.strCategory],
        ingredients: ingredients,
        videoUrl: recipeData.strYoutube,
        sourceUrl: recipeData.strSource,
        key: recipeData.idMeal,
        createdLocally: false,
    };
}

export const searchRecipe = async (query: string): Promise<RecipeType[]> => {
    const searchResponse = await axiosCached.get('https://www.themealdb.com/api/json/v1/1/search.php?s=' + query, {
        headers: {
            Accept: 'application/json',
        },
    });

    if (searchResponse.status >= 400) {
        return Promise.reject(new Error(`Response status: ${searchResponse.status}`));
    }

    return searchResponse.data.meals?.map((recipeData: RecipeResponseType) => parseRecipeResponse(recipeData))
};

export const fetchRandomRecipe = async (category?: string | null): Promise<RecipeType | null> => {
    console.log(category)
    let url = 'https://www.themealdb.com/api/json/v1/1/random.php';

    if (category && category !== 'all') {
        try {
            const filterResponse = await axiosCached.get('https://www.themealdb.com/api/json/v1/1/filter.php', {
                params: {
                    c: category,
                },
                headers: {
                    Accept: 'application/json',
                },
            });

            if (filterResponse.status >= 400) {
                return Promise.reject(new Error(`Response status: ${filterResponse.status}`));
            }

            const filterData = filterResponse.data;
            console.log(filterData)
            const randRecipeId = filterData.meals[Math.floor(Math.random() * filterData.meals.length)].idMeal;
            url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${randRecipeId}`;
        } catch (error) {
            console.error('Error fetching category recipes:', error);
            return null;
        }
    }

    try {
        const response = await Axios.get(url, {
            headers: {
                Accept: 'application/json',
            },
        });

        if (response.status !== 200) {
            return Promise.reject(new Error(`Response status: ${response.status}`));
        }

        return parseRecipeResponse(response.data.meals[0]);
    } catch (error) {
        console.error('Error fetching recipe:', error);
        return null;
    }
};
