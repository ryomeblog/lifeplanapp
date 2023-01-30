import {
    Box,
    Grid,
    Card,
    CardContent,
    Stack,
    Button,
    ButtonGroup,
    Typography,
} from "@mui/material";
import React, { useState } from 'react';
import BackIcon from '@mui/icons-material/ArrowBackIosNew';
import PaymentDetail from '../../components/detail/payment/PaymentDetail';
import IncomeDetail from '../../components/detail/income/IncomeDetail';
import EventDetail from '../../components/detail/event/EventDetail';


const ViewDetail = (props) => {

    const [btnState, setBtnState] = useState(0);

    const buttons = [
        <Button key="payment" variant={btnState == 0 ? "contained" : "outlined"} onClick={() => { setBtnState(0); }}>支出</Button>,
        <Button key="income" variant={btnState == 1 ? "contained" : "outlined"} onClick={() => { setBtnState(1); }}>収入</Button>,
        <Button key="event" variant={btnState == 2 ? "contained" : "outlined"} onClick={() => { setBtnState(2); }}>イベント</Button>,
    ];
    return (
        <Card>
            <Stack direction="row" style={{ textAlign: "center", backgroundColor: "#af52bf" }}>
                <Button variant="contained" onClick={() => { props.setYear(0); }}>
                    <BackIcon />
                </Button>

                <Typography style={{ color: "#FFFFFF" }} fontSize={40} component="div">
                    {props.year}年 ライフプラン
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
                {btnState === 0 && <PaymentDetail lifeId={props.lifeId} year={props.year} />}
                {btnState === 1 && <IncomeDetail lifeId={props.lifeId} year={props.year} />}
                {btnState === 2 && <EventDetail lifeId={props.lifeId} year={props.year} />}
            </CardContent>
        </Card>
    );
}
export default ViewDetail;