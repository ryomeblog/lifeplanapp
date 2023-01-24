import {
    Grid,
    Card,
    CardContent,
    Box,
    Stack,
    Button,
    ButtonGroup,
    Typography,
} from "@mui/material";
import BackIcon from '@mui/icons-material/ArrowBackIosNew';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import PaymentDetail from './payment/PaymentDetail';
import IncomeDetail from './income/IncomeDetail';
import EventDetail from './event/EventDetail';

const Detail = (props) => {
    const [btnState, setBtnState] = useState(0);
    const navigate = useNavigate();
    const params = useParams();

    const buttons = [
        <Button key="payment" variant={btnState == 0 ? "contained" : "outlined"} onClick={() => { setBtnState(0); }}>支出</Button>,
        <Button key="income" variant={btnState == 1 ? "contained" : "outlined"} onClick={() => { setBtnState(1); }}>収入</Button>,
        <Button key="event" variant={btnState == 2 ? "contained" : "outlined"} onClick={() => { setBtnState(2); }}>イベント</Button>,
    ];

    return (
        <Grid
            container
            justifyContent="center"
            paddingTop={10}>
            <Grid item xs={0} sm={0} md={2} lg={2}></Grid>
            <Grid item xs={12} sm={12} md={8} lg={8}>
                <Card>
                    <Stack direction="row" style={{ textAlign: "center", backgroundColor: "#af52bf" }}>
                        <Button variant="contained" onClick={() => { navigate(`/life/${params.lifeId}`); }}>
                            <BackIcon />
                        </Button>

                        <Typography style={{ color: "#FFFFFF" }} fontSize={40} component="div">
                            {params.year}年 ライフプラン
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
                            <ButtonGroup size="large">
                                {buttons}
                            </ButtonGroup>
                        </Box>
                        {btnState === 0 && <PaymentDetail lifeId={params.lifeId} year={params.year}/> }
                        {btnState === 1 && <IncomeDetail lifeId={params.lifeId} year={params.year}/> }
                        {btnState === 2 && <EventDetail lifeId={params.lifeId} year={params.year}/> }
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={0} sm={0} md={2} lg={2}>
            </Grid>
        </Grid>
    );
};

export default Detail;