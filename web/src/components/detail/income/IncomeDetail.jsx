import { Stack } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Text } from 'recharts';
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import AWS from '../../../config/AWS';
import IncomeDetailTables from './IncomeDetailTables';

const IncomeDetail = (props) => {
    const params = useParams();
    const documentClient = new AWS.DynamoDB.DocumentClient();
    const [graphData, setGraphData] = useState([]);
    const [household, setHousehold] = useState([]);
    const [householdVals, setHouseholdVals] = useState({
        income: {
            grants: [],
            temporary: [],
            capital: [],
            forest: [],
            miscellaneous: [],
            business: [],
            interest: [],
            dividend: [],
            pension: [],
            employment: [],
            retirement: [],
            real_estate: []
        },
        payment: {
            rent: [],
            utilities: [],
            food: [],
            network: [],
            consumables: [],
            durable_consumables: [],
            insurance: [],
            subscription: [],
            travel_hobbie_friend: [],
            child: [],
            tax: [],
            others: []
        },
        event: [],
        year: Number(props.year)
    });

    const COLORS = [
        '#ff6c2d',
        '#ff93b9',
        '#71afb9',
        '#a0a19c',
        '#6441da',
        '#8e41c3',
        '#bb806d',
        '#bb973b',
        '#e6be3b',
        '#28e1ad',
        '#ADFF2F',
        '#f8307e'
    ];

    const createGraphData = (income) => {
        return [
            { name: '給与所得', value: totalVal(income.employment) },
            { name: '事業所得', value: totalVal(income.business) },
            { name: '利子所得', value: totalVal(income.interest) },
            { name: '配当所得', value: totalVal(income.dividend) },
            { name: '譲渡所得', value: totalVal(income.capital) },
            { name: '不動産所得', value: totalVal(income.real_estate) },
            { name: '一時所得', value: totalVal(income.temporary) },
            { name: '退職所得', value: totalVal(income.retirement) },
            { name: '山林所得', value: totalVal(income.forest) },
            { name: '雑所得', value: totalVal(income.miscellaneous) },
            { name: '年金', value: totalVal(income.pension) },
            { name: '助成金', value: totalVal(income.grants) }
        ];
    }

    const updateIncomeDB = async (incomeVals) => {
        let updateHousehold = household;
        for (const i in updateHousehold) {
            if (updateHousehold[i].year === Number(props.year)) {
                updateHousehold[i].income = incomeVals;
                break;
            }
        }
        const dynamoParams = {
            TableName: 'life',
            Key: {
                life_id: props.lifeId
            },
            UpdateExpression: 'set household = :household',
            ExpressionAttributeValues: {
                ':household': updateHousehold
            },
            ReturnValues: 'ALL_NEW'
        }
        await documentClient.update(dynamoParams, (err, data) => {
            if (!err) {
                let queryVals = {};
                for (const row of data.Attributes.household) {
                    if (Number(row.year) === Number(props.year)) {
                        queryVals = row;
                        break;
                    }
                }
                setHouseholdVals(queryVals);
                setGraphData(createGraphData(queryVals.income));
                setHousehold(data.Attributes.household);
            } else {
                console.log(JSON.stringify(err, null, 2));
            }
        });
    }

    const deleteIncome = (category, incomeName) => {
        let deleteIncomeVals = householdVals.income;
        switch (category) {
            case 'employment':
                // 給与所得
                delete deleteIncomeVals.employment[deleteByIncomeName(deleteIncomeVals.employment, incomeName)];
                break;
            case 'business':
                // 事業所得
                delete deleteIncomeVals.business[deleteByIncomeName(deleteIncomeVals.business, incomeName)];
                break;
            case 'interest':
                // 利子所得
                delete deleteIncomeVals.interest[deleteByIncomeName(deleteIncomeVals.interest, incomeName)];
                break;
            case 'dividend':
                // 配当所得
                delete deleteIncomeVals.dividend[deleteByIncomeName(deleteIncomeVals.dividend, incomeName)];
                break;
            case 'capital':
                // 譲渡所得
                delete deleteIncomeVals.capital[deleteByIncomeName(deleteIncomeVals.capital, incomeName)];
                break;
            case 'real_estate':
                // 不動産所得
                delete deleteIncomeVals.real_estate[deleteByIncomeName(deleteIncomeVals.real_estate, incomeName)];
                break;
            case 'temporary':
                // 一時所得
                delete deleteIncomeVals.temporary[deleteByIncomeName(deleteIncomeVals.temporary, incomeName)];
                break;
            case 'retirement':
                // 退職所得
                delete deleteIncomeVals.retirement[deleteByIncomeName(deleteIncomeVals.retirement, incomeName)];
                break;
            case 'forest':
                // 山林所得
                delete deleteIncomeVals.forest[deleteByIncomeName(deleteIncomeVals.forest, incomeName)];
                break;
            case 'miscellaneous':
                // 雑所得
                delete deleteIncomeVals.miscellaneous[deleteByIncomeName(deleteIncomeVals.miscellaneous, incomeName)];
                break;
            case 'pension':
                // 年金
                delete deleteIncomeVals.pension[deleteByIncomeName(deleteIncomeVals.pension, incomeName)];
                break;
            case 'grants':
                // 助成金
                delete deleteIncomeVals.grants[deleteByIncomeName(deleteIncomeVals.grants, incomeName)];
                break;
        }
        updateIncomeDB(deleteIncomeVals);
    }

    const createIncome = (category, incomeName, incomeMoney, incomeMonthly) => {
        let createIncomeVals = householdVals.income;
        const addvals = {
            money: incomeMoney,
            monthly: incomeMonthly,
            name: incomeName
        }
        switch (category) {
            case 'employment':
                createIncomeVals.employment.push(addvals);
                break;
            case 'business':
                createIncomeVals.business.push(addvals);
                break;
            case 'interest':
                createIncomeVals.interest.push(addvals);
                break;
            case 'dividend':
                createIncomeVals.dividend.push(addvals);
                break;
            case 'capital':
                createIncomeVals.capital.push(addvals);
                break;
            case 'real_estate':
                createIncomeVals.real_estate.push(addvals);
                break;
            case 'temporary':
                createIncomeVals.temporary.push(addvals);
                break;
            case 'retirement':
                createIncomeVals.retirement.push(addvals);
                break;
            case 'forest':
                createIncomeVals.forest.push(addvals);
                break;
            case 'miscellaneous':
                createIncomeVals.miscellaneous.push(addvals);
                break;
            case 'pension':
                createIncomeVals.pension.push(addvals);
                break;
            case 'grants':
                createIncomeVals.grants.push(addvals);
                break;
        }
        updateIncomeDB(createIncomeVals);
    }

    const totalVal = (incomeArr) => {
        let val = 0;
        for (const row of incomeArr) {
            val += row.money / row.monthly;
        }
        return val * 12;
    }

    const deleteByIncomeName = (incomeArr, incomeName) => {
        let deleteIndex = 0;
        for (const [index, row] of incomeArr.entries()) {
            if (row.name === incomeName) {
                deleteIndex = index;
                break;
            }
        }
        return deleteIndex;
    }

    const init = async () => {
        let queryVals = {};

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
                for (const row of data.Items[0].household) {
                    if (Number(row.year) === Number(props.year)) {
                        queryVals = row;
                        break;
                    }
                }
                setHouseholdVals(queryVals);
                setGraphData(createGraphData(queryVals.income));
                setHousehold(data.Items[0].household);
            } else {
                console.log(JSON.stringify(err, null, 2));
            }
        });
    }

    useEffect(() => {
        // 初期処理
        init();
    }, []);

    const getLabel = ({
        name,
        cx,
        cy,
        x,
        y,
        midAngle,
        innerRadius,
        outerRadius,
        percent
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const RADIAN = Math.PI / 180;
        const inx = cx + radius * Math.cos(-midAngle * RADIAN);
        const iny = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <>
                <Text x={x} y={y} textAnchor={x > cx ? "start" : "end"} fill="#000000">
                    {name}
                </Text>
                <Text
                    x={inx}
                    y={iny}
                    fill="white"
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                >
                    {`${(percent * 100).toFixed(0)}%`}
                </Text>
            </>
        );
    };

    return (
        <>
            <Stack spacing={3} style={{ width: '100%', height: '350px' }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={graphData}
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            fill="#8884d8"
                            nameKey="name"
                            dataKey="value"
                            label={getLabel}
                            style={{ fontSize: '11px' }}
                        >
                            {graphData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </Stack>
            <IncomeDetailTables householdVals={householdVals} deleteIncome={deleteIncome} createIncome={createIncome} />
        </>
    );
};

export default IncomeDetail;