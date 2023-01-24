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
import IncomeModal from './IncomeModal';

const IncomeDetailTables = (props) => {

    // 関数
    const totalVal = (incomeArr) => {
        let val = 0;
        try {
            for (const row of incomeArr) {
                val += Math.round(row.money * (12 / row.monthly));
            }
        } catch (error) {
            console.log('err', error);
            console.log('incomeArr', incomeArr);
        }
        return val;
    }

    const totalAllVal = (incomeArr) => {
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

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>収入</TableCell>
                        <TableCell>収入額</TableCell>
                        <TableCell>収入割合</TableCell>
                        <TableCell align="right">登録</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <DetailTable
                        row={props.householdVals.income.employment}
                        totalVal={totalAllVal(props.householdVals.income)}
                        val={totalVal(props.householdVals.income.employment)}
                        name="給与所得"
                        category="employment"
                        deleteIncome={props.deleteIncome}
                        createIncome={props.createIncome} />
                    <DetailTable
                        row={props.householdVals.income.business}
                        totalVal={totalAllVal(props.householdVals.income)}
                        val={totalVal(props.householdVals.income.business)}
                        name="事業所得"
                        category="business"
                        deleteIncome={props.deleteIncome}
                        createIncome={props.createIncome} />
                    <DetailTable
                        row={props.householdVals.income.interest}
                        totalVal={totalAllVal(props.householdVals.income)}
                        val={totalVal(props.householdVals.income.interest)}
                        name="利子所得"
                        category="interest"
                        deleteIncome={props.deleteIncome}
                        createIncome={props.createIncome} />
                    <DetailTable
                        row={props.householdVals.income.dividend}
                        totalVal={totalAllVal(props.householdVals.income)}
                        val={totalVal(props.householdVals.income.dividend)}
                        name="配当所得"
                        category="dividend"
                        deleteIncome={props.deleteIncome}
                        createIncome={props.createIncome} />
                    <DetailTable
                        row={props.householdVals.income.capital}
                        totalVal={totalAllVal(props.householdVals.income)}
                        val={totalVal(props.householdVals.income.capital)}
                        name="譲渡所得"
                        category="capital"
                        deleteIncome={props.deleteIncome}
                        createIncome={props.createIncome} />
                    <DetailTable
                        row={props.householdVals.income.real_estate}
                        totalVal={totalAllVal(props.householdVals.income)}
                        val={totalVal(props.householdVals.income.real_estate)}
                        name="不動産所得"
                        category="real_estate"
                        deleteIncome={props.deleteIncome}
                        createIncome={props.createIncome} />
                    <DetailTable
                        row={props.householdVals.income.temporary}
                        totalVal={totalAllVal(props.householdVals.income)}
                        val={totalVal(props.householdVals.income.temporary)}
                        name="一時所得"
                        category="temporary"
                        deleteIncome={props.deleteIncome}
                        createIncome={props.createIncome} />
                    <DetailTable
                        row={props.householdVals.income.retirement}
                        totalVal={totalAllVal(props.householdVals.income)}
                        val={totalVal(props.householdVals.income.retirement)}
                        name="退職所得"
                        category="retirement"
                        deleteIncome={props.deleteIncome}
                        createIncome={props.createIncome} />
                    <DetailTable
                        row={props.householdVals.income.forest}
                        totalVal={totalAllVal(props.householdVals.income)}
                        val={totalVal(props.householdVals.income.forest)}
                        name="山林所得"
                        category="forest"
                        deleteIncome={props.deleteIncome}
                        createIncome={props.createIncome} />
                    <DetailTable
                        row={props.householdVals.income.miscellaneous}
                        totalVal={totalAllVal(props.householdVals.income)}
                        val={totalVal(props.householdVals.income.miscellaneous)}
                        name="雑所得"
                        category="miscellaneous"
                        deleteIncome={props.deleteIncome}
                        createIncome={props.createIncome} />
                    <DetailTable
                        row={props.householdVals.income.pension}
                        totalVal={totalAllVal(props.householdVals.income)}
                        val={totalVal(props.householdVals.income.pension)}
                        name="年金"
                        category="pension"
                        deleteIncome={props.deleteIncome}
                        createIncome={props.createIncome} />
                    <DetailTable
                        row={props.householdVals.income.grants}
                        totalVal={totalAllVal(props.householdVals.income)}
                        val={totalVal(props.householdVals.income.grants)}
                        name="助成金"
                        category="grants"
                        deleteIncome={props.deleteIncome}
                        createIncome={props.createIncome} />
                </TableBody>
            </Table>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>合計収入額：</TableCell>
                        <TableCell><strong style={{ color: 'blue' }}>{moneyFormat(totalAllVal(props.householdVals.income))}円</strong></TableCell>
                    </TableRow>
                </TableHead>
            </Table>
        </TableContainer>
    )
};

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
                    <IncomeModal name={props.name} category={props.category} createIncome={props.createIncome} />
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
                                        <TableCell>収入名</TableCell>
                                        <TableCell>収入額</TableCell>
                                        <TableCell>収入頻度</TableCell>
                                        <TableCell>1か月あたりの収入額</TableCell>
                                        <TableCell>年間収入額</TableCell>
                                        <TableCell>収入割合</TableCell>
                                        <TableCell align="right">削除</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {props.row.map((incomeRow) => (
                                        <TableRow key={incomeRow.name}>
                                            <TableCell component="th" scope="row">
                                                {incomeRow.name}
                                            </TableCell>
                                            <TableCell>{moneyFormat(incomeRow.money)}円</TableCell>
                                            <TableCell>{incomeRow.monthly}か月</TableCell>
                                            <TableCell>{moneyFormat(Math.round(incomeRow.money / incomeRow.monthly))}円</TableCell>
                                            <TableCell>{moneyFormat(Math.round(incomeRow.money * (12 / incomeRow.monthly)))}円</TableCell>
                                            <TableCell>
                                                <Chip label={Math.round(incomeRow.money * (12 / incomeRow.monthly) / props.val * 100) + "%"} color="primary" />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    type="submit"
                                                    color="error"
                                                    onClick={() => props.deleteIncome(props.category, incomeRow.name)}
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

export default IncomeDetailTables;