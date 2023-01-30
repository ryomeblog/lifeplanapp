import { Grid } from "@mui/material";
import React, { useState } from 'react';
import ViewLifePlan from '../../components/common/ViewLifePlan';
import ViewYear from '../../components/common/ViewYear';
import ViewDetail from '../../components/common/ViewDetail';

const ComparisonFlame = (props) => {
    const [leftLifeId, setLeftLifeId] = useState("");
    const [leftYear, setLeftYear] = useState(0);
    const [rightLifeId, setRightLifeId] = useState("");
    const [rightYear, setRightYear] = useState(0);

    return (
        <Grid
            container
            style={{ backgroundColor: "#834bff" }}
            sx={{ minHeight: "100vh" }}>
            <Grid item xs={6}
                justifyContent="center"
                paddingTop={10}>
                {!leftLifeId && <ViewLifePlan setLifeId={setLeftLifeId} />}
                {leftLifeId && !leftYear && <ViewYear setLifeId={setLeftLifeId} lifeId={leftLifeId} setYear={setLeftYear} />}
                {(leftLifeId && leftYear) ? <ViewDetail lifeId={leftLifeId} year={leftYear} setYear={setLeftYear} /> : <></>}
            </Grid>

            <Grid item xs={6}
                justifyContent="center"
                paddingTop={10}>
                {!rightLifeId && <ViewLifePlan setLifeId={setRightLifeId} />}
                {rightLifeId && !rightYear && <ViewYear setLifeId={setRightLifeId} lifeId={rightLifeId} setYear={setRightYear} />}
                {(rightLifeId && rightYear) ? <ViewDetail lifeId={rightLifeId} year={rightYear} setYear={setRightYear} /> : <></>}
            </Grid>
        </Grid>
    )
}

export default ComparisonFlame;