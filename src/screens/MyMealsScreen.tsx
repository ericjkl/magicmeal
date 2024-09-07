import React, {useEffect, useState} from 'react';
import {
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
    TextField
} from '@mui/material';
import Recipe from '../components/Recipe.tsx';
import {RecipeType} from "../types/RecipeType.ts";
import AddIcon from '@mui/icons-material/Add';
import {createOrUpdateRecipe, getSavedRecipes} from "../utils/recipeServices.ts";
import NoRecipes from "../components/NoRecipes.tsx";

const HomeScreen: React.FC = () => {
    const [savedRecipes, setSavedRecipes] = useState<RecipeType[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const getRecipes = () => {
        setLoading(true);
        try {
            const savedRecipes = getSavedRecipes();
            setSavedRecipes(savedRecipes);
            setError(null);
        } catch (err) {
            setSavedRecipes(null);
            setError("Sorry! Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getRecipes();
    }, []);

    if (loading) {
        return <CircularProgress/>;
    }

    return (
        <Container>
            {
                savedRecipes ?
                    (savedRecipes.length > 0 ?
                            savedRecipes.map((recipe: RecipeType) => (
                                <Recipe recipe={recipe} key={recipe.key} onRecipeModified={getRecipes}/>
                            ))
                            :
                            <NoRecipes/>
                    )
                    :
                    <div>{error}</div>
            }
            <Fab color="primary" aria-label="add" onClick={() => setDialogOpen(true)} style={{
                margin: 0,
                top: 'auto',
                right: 30,
                bottom: 80,
                left: 'auto',
                position: 'fixed',
            }}>
                <AddIcon/>
            </Fab>
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                PaperProps={{
                    component: 'form',
                    onSubmit: (e: React.FormEvent<HTMLFormElement>) => createOrUpdateRecipe(e, () => {
                        setDialogOpen(false);
                        getRecipes();
                    }),
                }}
            >
                <DialogTitle>Add Custom Recipe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the details of your own recipe that you want to save.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label="Recipe Name"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="ingredients"
                        label="Ingredients"
                        type="text"
                        fullWidth
                        variant="standard"
                        multiline
                        minRows={3}
                    />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="description"
                        label="Recipe Description"
                        type="text"
                        fullWidth
                        variant="standard"
                        multiline
                        minRows={3}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button type="submit">Add</Button>
                </DialogActions>
            </Dialog>
        </Container>

    );
};

export default HomeScreen;
