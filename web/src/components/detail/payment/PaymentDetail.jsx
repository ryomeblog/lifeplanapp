import { Stack } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Text } from 'recharts';
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import AWS from '../../../config/AWS';
import PaymentDetailTables from './PaymentDetailTables';

const PaymentDetail = (props) => {
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

    const createGraphData = (payment) => {
        return [
            { name: '家賃', value: totalVal(payment.rent) },
            { name: '水道光熱費', value: totalVal(payment.utilities) },
            { name: '食費', value: totalVal(payment.food) },
            { name: '通信費', value: totalVal(payment.network) },
            { name: '消耗品', value: totalVal(payment.consumables) },
            { name: '耐久消耗品', value: totalVal(payment.durable_consumables) },
            { name: '保険', value: totalVal(payment.insurance) },
            { name: 'サブスクリプション', value: totalVal(payment.subscription) },
            { name: '交際費・旅行・趣味', value: totalVal(payment.travel_hobbie_friend) },
            { name: '子育て', value: totalVal(payment.child) },
            { name: '税金', value: totalVal(payment.tax) },
            { name: 'その他', value: totalVal(payment.others) }
        ];
    }

    const updatePaymentDB = async (paymentVals) => {
        let updateHousehold = household;
        for (const i in updateHousehold) {
            if (Number(updateHousehold[i].year) === Number(props.year)) {
                updateHousehold[i].payment = paymentVals;
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
                setGraphData(createGraphData(queryVals.payment));
                setHousehold(data.Attributes.household);
            } else {
                console.log(JSON.stringify(err, null, 2));
            }
        });
    }

    const deletePayment = (category, paymentName) => {
        let deletePaymentVals = householdVals.payment;
        switch (category) {
            case 'rent':
                // 家賃
                delete deletePaymentVals.rent[deleteByPaymentName(deletePaymentVals.rent, paymentName)];
                break;
            case 'utilities':
                // 水道光熱費
                delete deletePaymentVals.utilities[deleteByPaymentName(deletePaymentVals.utilities, paymentName)];
                break;
            case 'food':
                // 食費
                delete deletePaymentVals.food[deleteByPaymentName(deletePaymentVals.food, paymentName)];
                break;
            case 'network':
                // 通信費
                delete deletePaymentVals.network[deleteByPaymentName(deletePaymentVals.network, paymentName)];
                break;
            case 'consumables':
                // 消耗品
                delete deletePaymentVals.consumables[deleteByPaymentName(deletePaymentVals.consumables, paymentName)];
                break;
            case 'durable_consumables':
                // 耐久消耗品
                delete deletePaymentVals.durable_consumables[deleteByPaymentName(deletePaymentVals.durable_consumables, paymentName)];
                break;
            case 'insurance':
                // 保険
                delete deletePaymentVals.insurance[deleteByPaymentName(deletePaymentVals.insurance, paymentName)];
                break;
            case 'subscription':
                // サブスクリプション
                delete deletePaymentVals.subscription[deleteByPaymentName(deletePaymentVals.subscription, paymentName)];
                break;
            case 'travel_hobbie_friend':
                // 交際費・旅行・趣味
                delete deletePaymentVals.travel_hobbie_friend[deleteByPaymentName(deletePaymentVals.travel_hobbie_friend, paymentName)];
                break;
            case 'child':
                // 子育て
                delete deletePaymentVals.child[deleteByPaymentName(deletePaymentVals.child, paymentName)];
                break;
            case 'tax':
                // 税金
                delete deletePaymentVals.tax[deleteByPaymentName(deletePaymentVals.tax, paymentName)];
                break;
            case 'others':
                // その他
                delete deletePaymentVals.others[deleteByPaymentName(deletePaymentVals.others, paymentName)];
                break;
        }
        updatePaymentDB(deletePaymentVals);
    }

    const createPayment = (category, paymentName, paymentMoney, paymentMonthly) => {
        let createPaymentVals = householdVals.payment;
        const addvals = {
            money: paymentMoney,
            monthly: paymentMonthly,
            name: paymentName
        }
        switch (category) {
            case 'rent':
                createPaymentVals.rent.push(addvals);
                break;
            case 'utilities':
                createPaymentVals.utilities.push(addvals);
                break;
            case 'food':
                createPaymentVals.food.push(addvals);
                break;
            case 'network':
                createPaymentVals.network.push(addvals);
                break;
            case 'consumables':
                createPaymentVals.consumables.push(addvals);
                break;
            case 'durable_consumables':
                createPaymentVals.durable_consumables.push(addvals);
                break;
            case 'insurance':
                createPaymentVals.insurance.push(addvals);
                break;
            case 'subscription':
                createPaymentVals.subscription.push(addvals);
                break;
            case 'travel_hobbie_friend':
                createPaymentVals.travel_hobbie_friend.push(addvals);
                break;
            case 'child':
                createPaymentVals.child.push(addvals);
                break;
            case 'tax':
                createPaymentVals.tax.push(addvals);
                break;
            case 'others':
                createPaymentVals.others.push(addvals);
                break;
        }
        updatePaymentDB(createPaymentVals);
    }

    const totalVal = (paymentArr) => {
        let val = 0;
        for (const row of paymentArr) {
            val += row.money / row.monthly;
        }
        return val * 12;
    }

    const deleteByPaymentName = (paymentArr, paymentName) => {
        let deleteIndex = 0;
        for (const [index, row] of paymentArr.entries()) {
            if (row.name === paymentName) {
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
                setGraphData(createGraphData(queryVals.payment));
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
            <PaymentDetailTables householdVals={householdVals} deletePayment={deletePayment} createPayment={createPayment} />
        </>
    );
};

export default PaymentDetail;