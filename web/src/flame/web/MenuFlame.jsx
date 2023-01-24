import React from 'react';
import {
    Box,
    Grid,
} from "@mui/material";


const MenuFlame = (props) => {
    return (
        <Grid container>
            <Grid item xs={12} style={{ backgroundColor: "#834bff" }}>
                <Box
                    direction="column"
                    sx={{ minHeight: "100vh" }}>
                    {props.component}
                </Box>
            </Grid>
        </Grid>
    )
}

export default MenuFlame;