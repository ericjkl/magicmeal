import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    TextField,
    Typography
} from '@mui/material';
import {RecipeType} from "../types/RecipeType.ts";
import {ExpandLess, ExpandMore, PlayArrow} from "@mui/icons-material";
import {checkRecipeExists, createOrUpdateRecipe, removeRecipe, saveRecipe} from "../utils/recipeServices.ts";
import {HeartFilled, HeartOutlined} from "@ant-design/icons";
import EditIcon from '@mui/icons-material/Edit';

const Recipe: React.FC<{ recipe: RecipeType, initiallyCollapsed?: boolean, onRecipeModified?: () => void }> = (
    {
        recipe,
        initiallyCollapsed = true,
        onRecipeModified = () => null
    }) => {
    const [recipeSavedState, setRecipeSavedState] = useState(checkRecipeExists(recipe.key) >= 0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(initiallyCollapsed);
    const [editFormOpen, setEditFormOpen] = useState(false);

    useEffect(() => {
        setRecipeSavedState(checkRecipeExists(recipe.key) >= 0)
    }, [recipe]);

    console.log(recipe)

    return (<>
        <Card sx={{margin: 'auto', marginTop: 4, width: "100%"}}>
            {"image" in recipe ? <CardMedia
                component="img"
                height="140"
                image={recipe.image}
                alt={recipe.title}
            /> : null}
            <CardContent>
                <Box sx={{display: "flex", flexDirection: "row"}}>
                    <Typography gutterBottom variant="h5" component="div">
                        {recipe.title}
                    </Typography>
                    <Button onClick={() => {
                        if (recipeSavedState) {
                            setDialogOpen(true)
                        } else {
                            saveRecipe(recipe)
                            setRecipeSavedState(true)
                        }

                    }} sx={{
                        marginTop: -1.1,
                        justifyContent: "center",
                        borderRadius: 1000
                    }}>
                        {recipeSavedState ? <HeartFilled style={{fontSize: 25}}/> :
                            <HeartOutlined style={{fontSize: 25}}/>}
                    </Button>
                    {
                        recipe.createdLocally ?
                            <Button onClick={() => setEditFormOpen(true)} sx={{
                                marginTop: -1.1,
                                marginLeft: -2,
                                justifyContent: "center",
                                borderRadius: 1000
                            }}>
                                <EditIcon style={{fontSize: 25}}/>
                            </Button>
                            :
                            null
                    }

                    <Button onClick={() => {
                        setIsCollapsed(!isCollapsed)
                        if (isCollapsed) {
                            recipe.viewCount = recipe.viewCount === undefined ? 1 : recipe.viewCount + 1
                            saveRecipe(recipe)
                        }
                    }} sx={{marginLeft: 'auto'}}>
                        {isCollapsed ? <ExpandMore/> : <ExpandLess/>}
                    </Button>
                </Box>
                <Box>
                    {recipe.labels?.map((label, i) => (<Chip key={i} label={label} sx={{marginRight: 1}}/>))}
                </Box>
                <Collapse in={!isCollapsed} timeout="auto" unmountOnExit>
                    <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                        {recipe.ingredients.map((value, i) => (<ListItem key={i} dense disablePadding>
                            <ListItemText primary={`${value.quantity} ${value.name}`}/>
                        </ListItem>))}
                    </List>
                    <Typography variant="body2" color="text.secondary">
                        {recipe.description}
                    </Typography>
                    {"videoUrl" in recipe &&
                        <Button sx={{marginTop: 1}} variant="contained" startIcon={<PlayArrow/>}
                                href={recipe.videoUrl}>
                            Watch Tutorial
                        </Button>}
                </Collapse>
            </CardContent>
        </Card>
        <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Are you sure?"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {`Do you want to remove the recipe "${recipe.title}" from your list? This action cannot be undone.`}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    removeRecipe(recipe.key)
                    setDialogOpen(false)
                    setRecipeSavedState(false)
                    onRecipeModified()
                }}>Yes, remove it</Button>
                <Button onClick={() => setDialogOpen(false)} autoFocus>
                    No, keep it
                </Button>
            </DialogActions>
        </Dialog>
        <Dialog
            open={editFormOpen}
            onClose={() => {
                console.log("close")
                setEditFormOpen(false)
            }}
            PaperProps={{
                component: 'form',
                onSubmit: (e: React.FormEvent<HTMLFormElement>) => createOrUpdateRecipe(e, () => {
                    setEditFormOpen(false);
                    onRecipeModified();
                }, recipe.key),
            }}
        >
            <DialogTitle>Edit Recipe</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Modify the details of your own recipe.
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
                    defaultValue={recipe.title}
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
                    defaultValue={recipe.ingredients.map((e) => e.quantity + " " + e.name).join("\n")}
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
                    defaultValue={recipe.description}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setEditFormOpen(false)}>Cancel</Button>
                <Button type="submit">Add</Button>
            </DialogActions>
        </Dialog>
    </>);
};

export default Recipe;
