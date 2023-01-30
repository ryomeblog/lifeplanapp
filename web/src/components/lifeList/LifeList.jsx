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
    CardHeader,
    FormGroup,
    FormControl,
    CardActions,

} from "@mui/material";
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import BackIcon from '@mui/icons-material/ArrowBackIosNew';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LifeListModal from './LifeListModal';
import SendIcon from '@mui/icons-material/Send';
import AWS from '../../config/AWS';

const LifeList = (props) => {
    const navigate = useNavigate();
    const params = useParams();
    const documentClient = new AWS.DynamoDB.DocumentClient();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [ascOrDec, setAscOrDec] = useState(true);
    const [household, setHousehold] = useState([]);
    const [lifeplanYears, setLifeplanYears] = useState([]);
    const [lifeplanYear, setLifeplanYear] = useState("");
    const [fireMoney, setFireMoney] = useState(5);
    const [investment, setInvestment] = useState(0);

    // 関数
    const selectLifePlanYear = (year) => {
        navigate(`/life/${params.lifeId}/${year}`);
    };

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

    const investmentTotalVal = (paymentArr) => {
        return totalVal(paymentArr.investment);
    }

    const taxTotalVal = (paymentArr) => {
        return totalVal(paymentArr.tax);
    }

    const moneyFormat = (num) => {
        return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    }

    const updateLifeListDB = async (updateHousehold) => {
        const dynamoParams = {
            TableName: 'life',
            Key: {
                life_id: params.lifeId
            },
            UpdateExpression: 'set household = :household',
            ExpressionAttributeValues: {
                ':household': updateHousehold
            },
            ReturnValues: 'ALL_NEW'
        }
        await documentClient.update(dynamoParams, (err, data) => {
            if (!err) {
                let getLifeplanYears = [];
                for (const row of data.Attributes.household) {
                    getLifeplanYears.push({
                        income: incomeTotalVal(row.income),
                        payment: paymentTotalVal(row.payment),
                        investment: investmentTotalVal(row.payment),
                        tax: taxTotalVal(row.payment),
                        event: row.event,
                        year: row.year
                    });
                }
                setHousehold(data.Attributes.household);
                setLifeplanYears(getLifeplanYears);
            } else {
                console.log(JSON.stringify(err, null, 2));
            }
        });
    }

    const deleteByYear = (year) => {
        let deleteIndex = 0;
        for (const [index, row] of household.entries()) {
            if (row.year === year) {
                deleteIndex = index;
                break;
            }
        }
        return deleteIndex;
    }

    const deleteLifeList = (year) => {
        let updateHousehold = household;
        delete updateHousehold[deleteByYear(year)];
        updateLifeListDB(updateHousehold);
    }

    const copyLifeList = (copyYear, year) => {
        let updateHousehold = household;
        let householdVals = {};
        for (const row of updateHousehold) {
            if (Number(row.year) === Number(copyYear)) {
                householdVals = {
                    event: row.event,
                    payment: row.payment,
                    income: row.income,
                    year: year
                };
                break;
            }
        }
        updateHousehold.push(householdVals);
        updateLifeListDB(updateHousehold);
    }

    const createLifePlan = () => {
        let updateHousehold = household;
        updateHousehold.push({
            event: [],
            payment: {
                "insurance": [],
                "durable_consumables": [],
                "consumables": [],
                "travel_hobbie_friend": [],
                "tax": [],
                "subscription": [],
                "rent": [],
                "utilities": [],
                "food": [],
                "others": [],
                "network": [],
                "investment": [],
                "child": []
            },
            income: {
                "grants": [],
                "temporary": [],
                "capital": [],
                "forest": [],
                "miscellaneous": [],
                "business": [],
                "interest": [],
                "dividend": [],
                "pension": [],
                "employment": [],
                "retirement": [],
                "real_estate": []
            },
            year: lifeplanYear
        });
        updateLifeListDB(updateHousehold);
    }

    useEffect(() => {
        const dynamoParams = {
            TableName: 'life',
            KeyConditionExpression: 'life_id = :life_id',
            ExpressionAttributeValues: {
                ':life_id': params.lifeId
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
                        investment: investmentTotalVal(row.payment),
                        tax: taxTotalVal(row.payment),
                        event: row.event,
                        year: row.year
                    });
                }
                setHousehold(data.Items[0].household);
                setLifeplanYears(getLifeplanYears);
            } else {
                console.log(JSON.stringify(err, null, 2));
            }
        });
    }, []);

    return (
        <Grid
            container
            alignItems="center"
            justifyContent="center"
            paddingTop={10}>
            <Grid item xs={0} sm={0} md={1} lg={1}></Grid>
            <Grid item xs={12} sm={12} md={10} lg={10}>
                <Card>
                    <CardHeader style={{ textAlign: "center", backgroundColor: "#af52bf", color: "#FFFFFF" }} title="ライフプラン登録" />
                    <CardContent>
                        <FormGroup>
                            <FormControl
                                required
                                fullWidth
                                margin="normal">
                                <TextField
                                    type="number"
                                    label="年 *"
                                    placeholder="年を入力してください"
                                    onChange={(event) => { setLifeplanYear(event.target.value) }}
                                />
                            </FormControl>
                        </FormGroup>
                    </CardContent>
                    <CardActions>
                        <Button
                            variant="contained"
                            size="large"
                            type="submit"
                            fullWidth
                            onClick={createLifePlan}
                        >
                            <SendIcon />送信
                        </Button>
                    </CardActions>
                </Card>
                <br />
                <Card>
                    <Stack direction="row" style={{ textAlign: "center", backgroundColor: "#af52bf" }}>
                        <Button variant="contained" onClick={() => { navigate(`/`); }}>
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
                                            投資額
                                        </TableCell>
                                        <TableCell
                                            align='left'
                                        >
                                            <TextField
                                                sx={{ m: 1, width: '120px' }}
                                                type="number"
                                                label="FIRE年利 *"
                                                placeholder="FIRE年利を入力してください"
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
                                        <TableCell
                                            align='right'
                                        >
                                            詳細
                                        </TableCell>
                                        <TableCell
                                            align='right'
                                        >
                                            コピー
                                        </TableCell>
                                        <TableCell
                                            align='right'
                                        >
                                            削除
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
                                                <TableRow hover tabIndex={-1} key={lifeplanYear.year} >
                                                    <TableCell>
                                                        {lifeplanYear.year}
                                                    </TableCell>
                                                    <TableCell>
                                                        {moneyFormat(lifeplanYear.payment)}円<br />
                                                        （{moneyFormat((Number(lifeplanYear.payment) - Number(lifeplanYear.tax) - Number(lifeplanYear.investment)))}円）
                                                    </TableCell>
                                                    <TableCell>
                                                        {moneyFormat(lifeplanYear.income)}円
                                                    </TableCell>
                                                    <TableCell>
                                                        <strong style={{ color: `${Number(lifeplanYear.income) - Number(lifeplanYear.payment) > 0 ? 'blue' : 'red'}` }}>
                                                            {moneyFormat(Number(lifeplanYear.income) - Number(lifeplanYear.payment))}円<br />
                                                            （{moneyFormat(Number(lifeplanYear.income) - (Number(lifeplanYear.payment) - Number(lifeplanYear.tax) - Number(lifeplanYear.investment)))}円）
                                                        </strong>
                                                    </TableCell>
                                                    <TableCell>
                                                        {moneyFormat(lifeplanYear.investment)}円
                                                    </TableCell>
                                                    <TableCell>
                                                        {moneyFormat(Math.round((Number(lifeplanYear.payment) - Number(lifeplanYear.tax) - Number(lifeplanYear.investment)) * (100 / fireMoney)))}円
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
                                                    <TableCell align="right">
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            type="submit"
                                                            color="info"
                                                            onClick={() => selectLifePlanYear(lifeplanYear.year)}
                                                        >
                                                            <ContentPasteSearchIcon />
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <LifeListModal
                                                            copyYear={lifeplanYear.year}
                                                            copyLifeList={copyLifeList} />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            type="submit"
                                                            color="error"
                                                            onClick={() => { deleteLifeList(lifeplanYear.year) }}
                                                        >
                                                            <DeleteForeverIcon />
                                                        </Button>
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
            </Grid>
            <Grid item xs={0} sm={0} md={1} lg={1}></Grid>
        </Grid>
    );
};

export default LifeList;