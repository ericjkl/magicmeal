import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import {useNavigate} from 'react-router-dom';

// Replace this with your actual app icon if needed
import HomeIcon from '@mui/icons-material/Home';

const AppBarMagicMeal = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar sx={{backgroundColor: '#4A148C'}}>
                <Toolbar>
                    {/* App Icon */}
                    <IconButton edge="start" color="inherit" aria-label="home" onClick={() => navigate('/')}>
                        <HomeIcon/>
                    </IconButton>

                    {/* App Name */}
                    <Typography variant="h6" sx={{flexGrow: 1, textAlign: 'center'}}>
                        MagicMeal
                    </Typography>

                    <div style={{width: 25}}></div>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default AppBarMagicMeal;
