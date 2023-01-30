import {
    Box,
    Grid,
    Card,
    CardContent,
    Stack,
    Button,
    ButtonGroup,
    Typography,
    TextField,
    InputAdornment,
} from "@mui/material";
import React, { useState } from 'react';

const Profit = (props) => {
    return (
        <Card>
            <Stack direction="row" style={{ textAlign: "center", backgroundColor: "#af52bf" }}>
                <Typography style={{ color: "#FFFFFF" }} fontSize={40} component="div">
                    FIRE年利
                </Typography>
            </Stack>
            <CardContent>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <TextField
                        sx={{ m: 1, width: '120px' }}
                        type="number"
                        label="FIRE年利 *"
                        placeholder="FIRE年利を入力してください"
                        value={props.profit}
                        onChange={(event) => { props.setProfit(event.target.value) }}
                        InputProps={{
                            endAdornment: <InputAdornment position="start">%</InputAdornment>,
                        }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
}
export default Profit;