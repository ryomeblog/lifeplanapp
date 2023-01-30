import { Box } from "@material-ui/core";
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import AWS from '../../config/AWS';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Graph = (props) => {

    const documentClient = new AWS.DynamoDB.DocumentClient();
    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: '投資グラフ',
            },
        },
    };
    const [graphData, setGraphData] = useState({
        labels: [
            "2021",
            "2022",
            "2023",
            "2024",
            "2025",
            "2026",
            "2027",
        ],
        datasets: [
            {
                label: "データ1",
                data: [10, 40, 30, 40, 50, 80, 2000],
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
        ],
    });

    const createGraphData = (payment) => {
        return [];
    }

    const totalVal = (arr) => {
        let val = 0;
        for (const row of arr) {
            val += row.money / row.monthly;
        }
        return val * 12;
    }

    const totalAllVal = (paymentArr, incomeArr) => {
        return totalVal(paymentArr.investment) - totalVal(incomeArr.dividend);
    }

    const init = async () => {
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
                let labelArr = [];
                let vals = [];
                let valProfits = [];
                let principal = 0; // 元本
                let totalProfit = 0; // 合計運用益
                let principalProfit = 0; // 元本 + 運用益
                for (const row of data.Items[0].household.sort((val1, val2) => { return val1.year - val2.year })) {
                    let nowProfit = Math.round((principal + totalProfit) * (0.01 * props.profit)); // 今年の運用益
                    principal += totalAllVal(row.payment, row.income);
                    totalProfit += nowProfit;
                    principalProfit = principal + totalProfit;
                    
                    // グラフ変数
                    labelArr.push(row.year);
                    vals.push(principal);
                    valProfits.push(principalProfit);
                }

                let updateGraphData = {
                    labels: labelArr,
                    datasets: [
                        {
                            label: data.Items[0].life_name + '_元本',
                            data: vals,
                            borderColor: "rgb(255, 99, 132)",
                            backgroundColor: "rgba(255, 99, 132, 0.5)",
                        },
                        {
                            label: data.Items[0].life_name + '_利益込み（配当マイナス）',
                            data: valProfits,
                            borderColor: "rgb(173, 255, 47)",
                            backgroundColor: "rgba(173, 255, 47, 0.5)",
                        },
                    ],
                };
                setGraphData(updateGraphData);
            } else {
                console.log(JSON.stringify(err, null, 2));
            }
        });
    }

    useEffect(() => {
        // 初期処理
        init();
    }, [props.lifeId, props.profit]);

    return (
        <Box style={{ backgroundColor: "#FFFFFF" }}>
            <Line options={options} data={graphData} />
        </Box>
    );
};

export default Graph;