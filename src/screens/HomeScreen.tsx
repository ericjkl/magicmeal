import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography
} from '@mui/material';
import {fetchRandomRecipe} from '../utils/apiAdapter.ts';
import Recipe from '../components/Recipe.tsx';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import {RecipeType} from "../types/RecipeType.ts";
import {LocalDiningRounded} from "@mui/icons-material";
import SettingsIcon from "@mui/icons-material/Settings";
import {createOrUpdateRecipe} from "../utils/recipeServices.ts";
import {getUserPreferences, saveUserPreferences} from "../utils/userServices.ts";

const HomeScreen: React.FC = () => {
    const [recipe, setRecipe] = useState<RecipeType | null>(null);
    const [preference, setPreference] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [preferenceDialogOpen, setPreferenceDialogOpen] = useState(false);

    const handlePreference = (newPreference: string) => {
        if (preference !== newPreference) {
            saveUserPreferences(newPreference);
            setPreference(newPreference);
            getRecipe(newPreference);
        }
    };

    const getRecipe = async (newPreference?: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchRandomRecipe(newPreference || preference);
            setRecipe(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const savedPreferences = getUserPreferences();
        if (savedPreferences) {
            setPreference(savedPreferences);
        }
        getRecipe().then()
    }, []);


    return (<>
            <Container sx={{width: "100%"}}>
                <Box display="flex" justifyContent="center" alignItems="center" mb={2} flexDirection={"column"}>
                    <LocalDiningRounded sx={{transform: "scale(2)", margin: 2}}/>
                    <Typography variant="h3" component="h1" gutterBottom align="center">
                        MagicMeal
                    </Typography>
                </Box>
                <Box display="flex" justifyContent="center" alignItems={"center"} mb={2} sx={{marginTop: 4}}>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AutoFixHighIcon/>}
                        onClick={() => getRecipe()}
                    >
                        Fetch New Magic Recipe
                    </Button>
                    <Button onClick={() => setPreferenceDialogOpen(true)} sx={{borderRadius: 999}}>
                        <SettingsIcon style={{fontSize: 28, color: "#333333", marginTop: 1}}/>
                    </Button>
                </Box>

                {loading && <CircularProgress color="secondary"/>}
                {error && (<Typography variant="body1" color="error">
                    Error: {error}
                </Typography>)}
                {recipe && <Recipe recipe={recipe} initiallyCollapsed={false}/>}
                {preference && <Typography variant="body1" marginTop={4} component="div">
                    Your Meal was magically retrieved considering yor preference: {preference}.
                </Typography>}
            </Container>
            <Dialog
                open={preferenceDialogOpen}
                onClose={() => setPreferenceDialogOpen(false)}
                PaperProps={{
                    component: 'form',
                    onSubmit: (e: React.FormEvent<HTMLFormElement>) => createOrUpdateRecipe(e, () => {
                        setPreferenceDialogOpen(false);
                    }),
                }}
            >
                <DialogTitle>Recipe Preferences</DialogTitle>
                <DialogContent>
                    <FormControl component="fieldset">
                        <RadioGroup
                            aria-label="preference"
                            name="preference"
                            value={preference}
                            onChange={(e) => handlePreference(e.target.value)}
                        >
                            <FormControlLabel value="all" control={<Radio/>} label="All"/>
                            <FormControlLabel value="vegetarian" control={<Radio/>} label="Vegetarian"/>
                            <FormControlLabel value="vegan" control={<Radio/>} label="Vegan"/>
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button type="submit">Ok</Button>
                </DialogActions>
            </Dialog>
        </>


    );
};

export default HomeScreen;
