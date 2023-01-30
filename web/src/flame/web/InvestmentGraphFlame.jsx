import { Grid } from "@mui/material";
import React, { useState } from 'react';
import ViewLifePlan from '../../components/common/ViewLifePlan';
import Graph from '../../components/investment/Graph';
import Profit from '../../components/investment/Profit';

const ComparisonFlame = (props) => {
    const [profit, setProfit] = useState(5);
    const [lifeId, setLifeId] = useState("");

    return (
        <Grid
            container
            style={{ backgroundColor: "#834bff" }}
            sx={{ minHeight: "100vh" }}>

            <Grid item xs={8}
                justifyContent="center"
                paddingTop={10}>
                {lifeId && <Graph lifeId={lifeId} setLifeId={setLifeId} profit={profit} />}
            </Grid>

            <Grid item xs={4}
                justifyContent="center"
                paddingTop={10}>
                <Profit setProfit={setProfit}  profit={profit}/>
                <ViewLifePlan setLifeId={setLifeId}/>
            </Grid>
        </Grid>
    )
}

export default ComparisonFlame;