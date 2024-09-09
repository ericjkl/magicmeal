import React from 'react';
import {
    Typography
} from '@mui/material';
import "../style/style.scss"

const Visualization: React.FC<{ title: string, children: React.ReactNode}> = (
    {
        title,
        children ,
    }) => {

    return (<>
        <div className="graphContainer">
            <Typography align={"center"} sx={{margin: 2}} variant={"h5"}>{title}</Typography>
            {children}
        </div>
    </>);
};

export default Visualization;
