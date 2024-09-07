import React, {useEffect, useState} from 'react';
import {Container, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography} from '@mui/material';
import {getUserPreferences, saveUserPreferences} from '../utils/userServices.ts';

const SettingScreen: React.FC = () => {
    const [preference, setPreference] = useState('all');

    useEffect(() => {
        const savedPreferences = getUserPreferences();
        if (savedPreferences) {
            setPreference(savedPreferences);
        }
    }, []);

    const handleSave = (preference: string) => {
        saveUserPreferences(preference);
        setPreference(preference);
    };

    return (
        <Container sx={{width: "100%"}}>
            <Typography variant="h4" component="h2" gutterBottom align="center">
                Recipe Preferences
            </Typography>
            <FormControl component="fieldset">
                <FormLabel component="legend">Choose your magical recipe preferences</FormLabel>
                <RadioGroup
                    aria-label="preference"
                    name="preference"
                    value={preference}
                    onChange={(e) => handleSave(e.target.value)}
                >
                    <FormControlLabel value="all" control={<Radio/>} label="All"/>
                    <FormControlLabel value="vegetarian" control={<Radio/>} label="Vegetarian"/>
                    <FormControlLabel value="vegan" control={<Radio/>} label="Vegan"/>
                </RadioGroup>
            </FormControl>
        </Container>
    );
};

export default SettingScreen;
