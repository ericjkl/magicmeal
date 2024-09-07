import '../style/splashScreen.scss';
import {LocalDiningRounded} from "@mui/icons-material";
import React from "react";

const SplashScreen: React.FC<{ fadeOut: boolean }> = ({fadeOut}) => {

    return (
        <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
            <div className="logo-container">
                <LocalDiningRounded sx={{transform: "scale(2)", margin: 2}} width="100%" height={300}/>
            </div>
        </div>
    );
};

export default SplashScreen;
