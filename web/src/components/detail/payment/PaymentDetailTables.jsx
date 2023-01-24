import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Collapse,
    Typography,
    Paper,
    Chip
} from "@mui/material";
import React, { useState } from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PaymentModal from './PaymentModal';

const PaymentDetailTables = (props) => {

    // 関数
    const totalVal = (paymentArr) => {
        let val = 0;
        try {
            for (const row of paymentArr) {
                val += Math.round(row.money * (12 / row.monthly));
            }
        } catch (error) {
            console.log('err', error);
            console.log('paymentArr', paymentArr);
        }
        return val;
    }

    const totalAllVal = (paymentArr) => {
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
        val += totalVal(paymentArr.others);
        return val;
    }

    const moneyFormat = (num) => {
        return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>支出</TableCell>
                        <TableCell>支出額</TableCell>
                        <TableCell>支出割合</TableCell>
                        <TableCell align="right">登録</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <DetailTable
                        row={props.householdVals.payment.rent}
                        totalVal={totalAllVal(props.householdVals.payment)}
                        val={totalVal(props.householdVals.payment.rent)}
                        name="家賃"
                        category="rent"
                        deletePayment={props.deletePayment}
                        createPayment={props.createPayment} />
                    <DetailTable
                        row={props.householdVals.payment.utilities}
                        totalVal={totalAllVal(props.householdVals.payment)}
                        val={totalVal(props.householdVals.payment.utilities)}
                        name="水道光熱費"
                        category="utilities"
                        deletePayment={props.deletePayment}
                        createPayment={props.createPayment} />
                    <DetailTable
                        row={props.householdVals.payment.food}
                        totalVal={totalAllVal(props.householdVals.payment)}
                        val={totalVal(props.householdVals.payment.food)}
                        name="食費"
                        category="food"
                        deletePayment={props.deletePayment}
                        createPayment={props.createPayment} />
                    <DetailTable
                        row={props.householdVals.payment.network}
                        totalVal={totalAllVal(props.householdVals.payment)}
                        val={totalVal(props.householdVals.payment.network)}
                        name="通信費"
                        category="network"
                        deletePayment={props.deletePayment}
                        createPayment={props.createPayment} />
                    <DetailTable
                        row={props.householdVals.payment.consumables}
                        totalVal={totalAllVal(props.householdVals.payment)}
                        val={totalVal(props.householdVals.payment.consumables)}
                        name="消耗品"
                        category="consumables"
                        deletePayment={props.deletePayment}
                        createPayment={props.createPayment} />
                    <DetailTable
                        row={props.householdVals.payment.durable_consumables}
                        totalVal={totalAllVal(props.householdVals.payment)}
                        val={totalVal(props.householdVals.payment.durable_consumables)}
                        name="耐久消耗品"
                        category="durable_consumables"
                        deletePayment={props.deletePayment}
                        createPayment={props.createPayment} />
                    <DetailTable
                        row={props.householdVals.payment.insurance}
                        totalVal={totalAllVal(props.householdVals.payment)}
                        val={totalVal(props.householdVals.payment.insurance)}
                        name="保険"
                        category="insurance"
                        deletePayment={props.deletePayment}
                        createPayment={props.createPayment} />
                    <DetailTable
                        row={props.householdVals.payment.subscription}
                        totalVal={totalAllVal(props.householdVals.payment)}
                        val={totalVal(props.householdVals.payment.subscription)}
                        name="サブスクリプション"
                        category="subscription"
                        deletePayment={props.deletePayment}
                        createPayment={props.createPayment} />
                    <DetailTable
                        row={props.householdVals.payment.travel_hobbie_friend}
                        totalVal={totalAllVal(props.householdVals.payment)}
                        val={totalVal(props.householdVals.payment.travel_hobbie_friend)}
                        name="交際費・旅行・趣味"
                        category="travel_hobbie_friend"
                        deletePayment={props.deletePayment}
                        createPayment={props.createPayment} />
                    <DetailTable
                        row={props.householdVals.payment.child}
                        totalVal={totalAllVal(props.householdVals.payment)}
                        val={totalVal(props.householdVals.payment.child)}
                        name="子育て"
                        category="child"
                        deletePayment={props.deletePayment}
                        createPayment={props.createPayment} />
                    <DetailTable
                        row={props.householdVals.payment.tax}
                        totalVal={totalAllVal(props.householdVals.payment)}
                        val={totalVal(props.householdVals.payment.tax)}
                        name="税金"
                        category="tax"
                        deletePayment={props.deletePayment}
                        createPayment={props.createPayment} />
                    <DetailTable
                        row={props.householdVals.payment.others}
                        totalVal={totalAllVal(props.householdVals.payment)}
                        val={totalVal(props.householdVals.payment.others)}
                        name="その他"
                        category="others"
                        deletePayment={props.deletePayment}
                        createPayment={props.createPayment} />
                </TableBody>
            </Table>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>合計支出額：</TableCell>
                        <TableCell><strong style={{ color: 'red' }}>{moneyFormat(totalAllVal(props.householdVals.payment))}円</strong></TableCell>
                    </TableRow>
                </TableHead>
            </Table>
        </TableContainer>
    )
}

const DetailTable = (props) => {
    const [open, setOpen] = useState(false);

    const moneyFormat = (num) => {
        return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    }

    return (
        <>
            <TableRow>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {props.name}
                </TableCell>
                <TableCell>
                    {moneyFormat(props.val)}円
                </TableCell>
                <TableCell>
                    <Chip label={Math.round(Number(props.val) / Number(props.totalVal) * 100) + "%"} color="primary" />
                </TableCell>
                <TableCell align="right">
                    <PaymentModal name={props.name} category={props.category} createPayment={props.createPayment} />
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                内訳
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>支出名</TableCell>
                                        <TableCell>支出額</TableCell>
                                        <TableCell>支出頻度</TableCell>
                                        <TableCell>1か月あたりの支出額</TableCell>
                                        <TableCell>年間支出額</TableCell>
                                        <TableCell>支出割合</TableCell>
                                        <TableCell align="right">削除</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {props.row.map((paymentRow) => (
                                        <TableRow key={paymentRow.name}>
                                            <TableCell component="th" scope="row">
                                                {paymentRow.name}
                                            </TableCell>
                                            <TableCell>{moneyFormat(paymentRow.money)}円</TableCell>
                                            <TableCell>{paymentRow.monthly}か月</TableCell>
                                            <TableCell>{moneyFormat(Math.round(paymentRow.money / paymentRow.monthly))}円</TableCell>
                                            <TableCell>{moneyFormat(Math.round(paymentRow.money * (12 / paymentRow.monthly)))}円</TableCell>
                                            <TableCell>
                                                <Chip label={Math.round(paymentRow.money * (12 / paymentRow.monthly) / props.val * 100) + "%"} color="primary" />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    type="submit"
                                                    color="error"
                                                    onClick={() => props.deletePayment(props.category, paymentRow.name)}
                                                >
                                                    <DeleteForeverIcon />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

export default PaymentDetailTables;