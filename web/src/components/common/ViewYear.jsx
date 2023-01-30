import {
    Grid,
    Card,
    CardContent,
    Stack,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    IconButton,
    Typography,
    TextField,
    InputAdornment,
} from "@mui/material";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import BackIcon from '@mui/icons-material/ArrowBackIosNew';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AWS from '../../config/AWS';

const ViewYear = (props) => {
    const navigate = useNavigate();
    const documentClient = new AWS.DynamoDB.DocumentClient();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [ascOrDec, setAscOrDec] = useState(true);
    const [lifeplanYears, setLifeplanYears] = useState([]);
    const [fireMoney, setFireMoney] = useState(5);

    // 関数
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const totalVal = (arr) => {
        let val = 0;
        try {
            for (const row of arr) {
                val += Math.round(row.money * (12 / row.monthly));
            }
        } catch (error) {
            console.log('err', error);
            console.log('arr', arr);
        }
        return val;
    }

    const paymentTotalVal = (paymentArr) => {
        let val = 0;
        val += totalVal(paymentArr.rent);
        val += totalVal(paymentArr.utilities);
        val += totalVal(paymentArr.food);
        val += totalVal(paymentArr.network);
        val += totalVal(paymentArr.consumables);
        val += totalVal(paymentArr.durable_consumables);
        val += totalVal(paymentArr.insurance);
        val += totalVal(paymentArr.subscription);
        val += totalVal(paymentArr.travel_hobbie_friend);
        val += totalVal(paymentArr.child);
        val += totalVal(paymentArr.tax);
        val += totalVal(paymentArr.investment);
        val += totalVal(paymentArr.others);
        return val;
    }

    const incomeTotalVal = (incomeArr) => {
        let val = 0;
        val += totalVal(incomeArr.employment);
        val += totalVal(incomeArr.business);
        val += totalVal(incomeArr.interest);
        val += totalVal(incomeArr.dividend);
        val += totalVal(incomeArr.capital);
        val += totalVal(incomeArr.real_estate);
        val += totalVal(incomeArr.temporary);
        val += totalVal(incomeArr.retirement);
        val += totalVal(incomeArr.forest);
        val += totalVal(incomeArr.miscellaneous);
        val += totalVal(incomeArr.pension);
        val += totalVal(incomeArr.grants);
        return val;
    }

    const moneyFormat = (num) => {
        return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    }

    useEffect(() => {
        const dynamoParams = {
            TableName: 'life',
            KeyConditionExpression: 'life_id = :life_id',
            ExpressionAttributeValues: {
                ':life_id': props.lifeId
            }
        };
        documentClient.query(dynamoParams, (err, data) => {
            if (!err) {
                if (!data.Items[0]) return;
                let getLifeplanYears = [];
                for (const row of data.Items[0].household) {
                    getLifeplanYears.push({
                        income: incomeTotalVal(row.income),
                        payment: paymentTotalVal(row.payment),
                        event: row.event,
                        year: row.year
                    });
                }
                setLifeplanYears(getLifeplanYears);
            } else {
                console.log(JSON.stringify(err, null, 2));
            }
        });
    }, []);

    return (

        <Card>
            <Stack direction="row" style={{ textAlign: "center", backgroundColor: "#af52bf" }}>
                <Button variant="contained" onClick={() => { props.setLifeId(""); }}>
                    <BackIcon />
                </Button>

                <Typography style={{ color: "#FFFFFF" }} fontSize={40} component="div">
                    年別収支一覧
                </Typography>
            </Stack>
            <CardContent>
                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    align='left'
                                >
                                    年
                                    <IconButton size="small" onClick={() => { setAscOrDec(!ascOrDec) }}>
                                        {ascOrDec ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </IconButton>
                                </TableCell>
                                <TableCell
                                    align='left'
                                >
                                    支出額
                                </TableCell>
                                <TableCell
                                    align='left'
                                >
                                    収入額
                                </TableCell>
                                <TableCell
                                    align='left'
                                >
                                    収支差額
                                </TableCell>
                                <TableCell
                                    align='left'
                                >
                                    <TextField
                                        sx={{ m: 1, width: '120px' }}
                                        type="number"
                                        label="FIRE年利（想定） *"
                                        placeholder="FIRE年利（想定）を入力してください"
                                        value={fireMoney}
                                        onChange={(event) => { setFireMoney(event.target.value) }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="start">%</InputAdornment>,
                                        }}
                                    />
                                </TableCell>
                                <TableCell
                                    align='left'
                                >
                                    イベント
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lifeplanYears
                                .sort((val1, val2) => {
                                    return ascOrDec ? val1.year - val2.year : val2.year - val1.year;
                                })
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((lifeplanYear) => {
                                    return (
                                        <TableRow hover tabIndex={-1} key={lifeplanYear.year} onClick={() => { props.setYear(lifeplanYear.year) }}>
                                            <TableCell>
                                                {lifeplanYear.year}
                                            </TableCell>
                                            <TableCell>
                                                {moneyFormat(lifeplanYear.payment)}円
                                            </TableCell>
                                            <TableCell>
                                                {moneyFormat(lifeplanYear.income)}円
                                            </TableCell>
                                            <TableCell>
                                                <strong style={{ color: `${Number(lifeplanYear.income) - Number(lifeplanYear.payment) > 0 ? 'blue' : 'red'}` }}>
                                                    {moneyFormat(Number(lifeplanYear.income) - Number(lifeplanYear.payment))}円
                                                </strong>
                                            </TableCell>
                                            <TableCell>
                                                {moneyFormat(Math.round(Number(lifeplanYear.payment) * (100 / fireMoney)))}円
                                            </TableCell>
                                            <TableCell>
                                                {lifeplanYear.event.map((event) => {
                                                    return (
                                                        <span key={event.name}>
                                                            {event.name}<br />
                                                        </span>
                                                    )
                                                })}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={lifeplanYears.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </CardContent>
        </Card>
    )
};

export default ViewYear;