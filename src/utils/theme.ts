import {createTheme} from '@mui/material/styles';
import {amber, deepPurple} from '@mui/material/colors';

const theme = createTheme({
    palette: {
        primary: {
            main: deepPurple[500],
        },
        secondary: {
            main: amber[500],
        },
        background: {
            default: '#fff',
        },
        text: {
            primary: '#4a148c',
            secondary: '#273d78',
        },
    },
    typography: {
        fontFamily: 'MagicFont, Arial, sans-serif',
        h1: {
            fontFamily: 'MagicFont, Arial, sans-serif',
        },
        h2: {
            fontFamily: 'MagicFont, Arial, sans-serif',
        },
    },
});

export default theme;
