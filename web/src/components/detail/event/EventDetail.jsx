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
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import EventModal from './EventModal';
import UserModal from './UserModal';
import AWS from '../../../config/AWS';

const EventDetail = (props) => {
    const params = useParams();
    const documentClient = new AWS.DynamoDB.DocumentClient();
    const [user, setUser] = useState([]);
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

    // 関数
    const deleteByEventName = (eventArr, eventName) => {
        let deleteIndex = 0;
        for (const [index, row] of eventArr.entries()) {
            if (row.name === eventName) {
                deleteIndex = index;
                break;
            }
        }
        return deleteIndex;
    }
    const deleteByUserName = (userArr, userName) => {
        let deleteIndex = 0;
        for (const [index, row] of userArr.entries()) {
            if (row.user_name === userName) {
                deleteIndex = index;
                break;
            }
        }
        return deleteIndex;
    }

    const updateEventDB = async (eventVals) => {
        let updateHousehold = household;
        for (const i in updateHousehold) {
            if (updateHousehold[i].year === Number(props.year)) {
                updateHousehold[i].event = eventVals;
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
                setHousehold(data.Attributes.household);
            } else {
                console.log(JSON.stringify(err, null, 2));
            }
        });
    }

    const updateUserDB = async (userVals) => {
        const dynamoParams = {
            TableName: 'life',
            Key: {
                life_id: props.lifeId
            },
            UpdateExpression: 'set #u = :u',
            ExpressionAttributeNames: {
                '#u' : 'users'
            },
            ExpressionAttributeValues: {
                ':u': userVals
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
                setUser(data.Attributes.users);
                setHouseholdVals(queryVals);
                setHousehold(data.Attributes.household);
            } else {
                console.log(JSON.stringify(err, null, 2));
            }
        });
    }

    const deleteUser = (userName) => {
        let deleteUserVals = user;
        delete deleteUserVals[deleteByUserName(deleteUserVals, userName)];
        updateUserDB(deleteUserVals);
    }

    const createUser = (createBirthday, createUserName) => {
        let createUserVals = user;
        createUserVals.push({
            birthday: createBirthday,
            user_name: createUserName
        });
        updateUserDB(createUserVals);
    }

    const deleteEvent = (eventName) => {
        let deleteEventVals = householdVals.event;
        delete deleteEventVals[deleteByEventName(deleteEventVals, eventName)];
        updateEventDB(deleteEventVals);
    }

    const createEvent = (eventName) => {
        let createEventVals = householdVals.event;
        createEventVals.push({
            name: eventName
        });
        updateEventDB(createEventVals);
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
                setUser(data.Items[0].users);
                setHouseholdVals(queryVals);
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

    return (
        <>
            <Typography variant="h5" gutterBottom component="div">
                ユーザ
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>名前</TableCell>
                            <TableCell>年齢</TableCell>
                            <TableCell align="right">
                                <UserModal createUser={createUser} />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {user.map((row) => (
                            <TableRow key={row.user_name}>
                                <TableCell>
                                    {row.user_name}
                                </TableCell>
                                <TableCell>
                                    {Number(props.year) - Number(row.birthday) >= 0 ? (Number(props.year) - Number(row.birthday)) + '歳' : '生まれていない'}
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        type="submit"
                                        color="error"
                                        onClick={() => deleteUser(row.user_name)}
                                    >
                                        <DeleteForeverIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <br />
            <Typography variant="h5" gutterBottom component="div">
                イベント
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>イベント名</TableCell>
                            <TableCell align="right">
                                <EventModal createEvent={createEvent} />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {householdVals.event.map((row) => (
                            <TableRow key={row.name}>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        type="submit"
                                        color="error"
                                        onClick={() => deleteEvent(row.name)}
                                    >
                                        <DeleteForeverIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
};

export default EventDetail;