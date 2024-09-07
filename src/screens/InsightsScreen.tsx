import React from 'react';
import {Container, Typography} from '@mui/material';
import {PieChart} from '@mui/x-charts/PieChart';
import {BarChart, Gauge, gaugeClasses} from "@mui/x-charts";
import {calculateInsights} from "../utils/userServices.ts";
import {StarFilled} from "@ant-design/icons";
import "../style/style.scss"
import NoRecipes from "../components/NoRecipes.tsx";

const starColors = ["#ffad35", "#bdbdbd", "#bf876b"]

const InsightsScreen: React.FC = () => {
    const insights = calculateInsights();
    if (!insights) {
        return <Container><NoRecipes/></Container>
    }

    return (
        <Container sx={{width: "100%", display: "flex", justifyContent: "stretch", flexDirection: "column"}}>
            <div className="graphContainer">
                <Typography align={"center"} sx={{margin: 2}} variant={"h5"}>Your Favorite Meals</Typography>
                {insights.favoriteRecipes.map((recipe, i) =>
                    <Container key={i}
                               sx={{display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 3}}>
                        <div>
                            {
                                Array(insights.favoriteRecipes.length - i).fill(null).map((_e, j) => <StarFilled
                                    key={"" + i + j} style={{color: starColors[i]}}/>)
                            }
                        </div>
                        <div>{`${i + 1}. ${recipe.title}`}</div>
                        <Typography variant={"body2"}>Views: {recipe.viewCount}</Typography>
                    </Container>
                )}
            </div>
            <div className="graphContainer">
                <Typography align={"center"} sx={{margin: 2}} variant={"h5"}>Ratio of Custom Recipes</Typography>
                <PieChart
                    series={[{
                        arcLabel: (item) => `${(item.value * 100).toFixed(0)}%`,
                        data: [{id: 0, value: insights.customRecipesPercentage, label: 'Custom Recipes'}, {
                            id: 1,
                            value: 1 - insights.customRecipesPercentage,
                            label: 'Magic Recipes'
                        },],
                    },]}
                    margin={{left: -100}}
                    height={200}
                />
            </div>
            <div className="graphContainer">
                <Typography align={"center"} sx={{margin: 2}} variant={"h5"}>Your Favorite Meal Categories</Typography>
                <BarChart
                    xAxis={[{
                        scaleType: 'band',
                        data: Object.keys(insights.labelHistogram).map((i => i.length < 8 ? i : i.slice(0, 4) + "..."))
                    }]}
                    series={[{
                        data: Object.values(insights.labelHistogram),
                        valueFormatter: (_v, {dataIndex}) => {
                            return Object.keys(insights.ingredientsHistogram)[dataIndex]
                        }
                    }]}
                    height={200}
                />
            </div>
            <div className="graphContainer">
                <Typography align={"center"} sx={{margin: 2}} variant={"h5"}>Your Favorite Ingredients</Typography>
                <BarChart
                    xAxis={[{
                        scaleType: 'band',
                        data: Object.keys(insights.ingredientsHistogram).map((i => i.length < 8 ? i : i.slice(0, 4) + "..."))
                    }]}
                    series={[{
                        data: Object.values(insights.ingredientsHistogram),
                        valueFormatter: (_v, {dataIndex}) => {
                            return Object.keys(insights.ingredientsHistogram)[dataIndex]
                        }
                    }]}
                    height={200}
                />
            </div>
            <div className="graphContainer">
                <Typography align={"center"} sx={{margin: 2}} variant={"h5"}>Vegan / Vegetarian Meals</Typography>
                <Gauge
                    value={insights.veganVegetarianCount}
                    valueMax={insights.recipeCount}
                    startAngle={-90}
                    endAngle={90}
                    sx={{
                        [`& .${gaugeClasses.valueText}`]: {
                            fontSize: 40,
                            transform: 'translate(0px, -30px)',
                            marginTop: -20
                        },
                    }}
                    text={`${insights.veganVegetarianCount} / ${insights.recipeCount}`}
                    height={200}
                />
            </div>
        </Container>
    );
};

export default InsightsScreen;
