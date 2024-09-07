export type RecipeType = {
    title: string;
    image?: string;
    description: string;
    ingredients: { name: string; quantity: string; }[];
    labels?: string[];
    videoUrl?: string;
    sourceUrl?: string;
    key: string;
    viewCount?: number;
    createdLocally: boolean;
}