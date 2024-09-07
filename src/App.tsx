import React, {useEffect} from 'react';
import {BrowserRouter, Link, Route, Routes} from 'react-router-dom';
import {ThemeProvider} from '@mui/material/styles';
import {BottomNavigation, BottomNavigationAction, CssBaseline} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import HomeScreen from './screens/HomeScreen.tsx';
import theme from './utils/theme';
import AppBarMagicMeal from "./components/AppBar.tsx";
import {Person, QueryStats} from "@mui/icons-material";
import MyMealsScreen from "./screens/MyMealsScreen.tsx";
import InsightsScreen from "./screens/InsightsScreen.tsx";
import SplashScreen from "./components/SplashScreen.tsx";
import SearchScreen from "./screens/SearchScreen.tsx";
import SearchIcon from "@mui/icons-material/Search";

function App() {
    const [value, setValue] = React.useState(0);
    const [loaded, setLoaded] = React.useState(false)

    useEffect(() => {
        if (document.readyState === 'complete') {
            setLoaded(true);
        } else {
            window.addEventListener('load', () => setLoaded(true));
        }

        return () => {
            window.removeEventListener('load', () => setLoaded(true));
        };
    }, []);

    return (<ThemeProvider theme={theme}>
        <SplashScreen fadeOut={loaded}/>
        <CssBaseline/>
        <BrowserRouter basename={import.meta.env.MODE === 'development' ? undefined : "/demos/magicmeal"}>
            <AppBarMagicMeal/>
            <Routes>
                <Route path="/" element={<HomeScreen/>}/>
                <Route path="/search" element={<SearchScreen/>}/>
                <Route path="/my-meals" element={<MyMealsScreen/>}/>
                <Route path="/insights" element={<InsightsScreen/>}/>
            </Routes>

            <BottomNavigation
                value={value}
                onChange={(_event, newValue) => setValue(newValue)}
                showLabels
                sx={{position: 'fixed', bottom: 0, left: 0, width: '100%', backgroundColor: "#9ab1d8"}}
            >
                <BottomNavigationAction component={Link} to="/" label="Home" icon={<HomeIcon/>}/>
                <BottomNavigationAction component={Link} to="/search" label="Search" icon={<SearchIcon/>}/>
                <BottomNavigationAction component={Link} to="/my-meals" label="My Meals" icon={<Person/>}/>
                <BottomNavigationAction component={Link} to="/insights" label="Insights" icon={<QueryStats/>}/>
            </BottomNavigation>
        </BrowserRouter>
    </ThemeProvider>);
}

export default App
