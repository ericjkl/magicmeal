import React, {useState} from 'react';
import {Box, Button, CircularProgress, Container, InputAdornment, TextField, Typography} from '@mui/material';
import {searchRecipe} from '../utils/apiAdapter.ts';
import Recipe from '../components/Recipe.tsx';
import {RecipeType} from "../types/RecipeType.ts";
import SearchIcon from '@mui/icons-material/Search';
import {RightOutlined} from "@ant-design/icons";

const SearchScreen: React.FC = () => {
    const [recipes, setRecipes] = useState<RecipeType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const search = () => {
        setError(null)
        if (searchQuery === "") {
            return
        }
        setLoading(true)
        searchRecipe(searchQuery)
            .then(r => {
                setRecipes(r)
                if (!r || r.length === 0) {
                    setError("Sorry! We couldn't find any recipe titled " + searchQuery);
                }
            })
            .catch((e) => setError(e));
        setLoading(false)
    }


    return (<Container sx={{width: "100%"}}>
            <Box display="flex" justifyContent="center" mb={2} sx={{flexDirection: "row", marginTop: 4}}>
                <TextField
                    id="input-with-icon-textfield"
                    label="Search for a recipe"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    fullWidth
                    InputProps={{
                        startAdornment: (<InputAdornment position="start">
                            <SearchIcon/>
                        </InputAdornment>),
                    }}
                />
                <Button onClick={() => search()} sx={{marginLeft: 2, borderRadius: 999}} variant="outlined">
                    <RightOutlined style={{fontSize: 20, color: "#000"}}/>
                </Button>
            </Box>

            {loading ? <CircularProgress color="secondary"/> :
                <>
                    {(recipes && recipes.length > 0 && !error) ?
                        recipes.map((recipe: RecipeType) => (<Recipe recipe={recipe} key={recipe.key}/>))
                        :
                        <Typography variant="body1" color="error">
                            {error && String(error)}
                        </Typography>}
                </>

            }


        </Container>


    );
};

export default SearchScreen;
