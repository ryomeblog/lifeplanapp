import {
    Grid,
    Card,
    CardContent,
    CardHeader,
    FormGroup,
    FormControl,
    TextField,
    CardActions,
    IconButton,
    Button
} from "@mui/material";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import HomeModal from './HomeModal'
import AWS from '../../config/AWS';

const Home = (props) => {
    const navigate = useNavigate();
    const documentClient = new AWS.DynamoDB.DocumentClient();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [lifeplans, setLifeplans] = useState([]);
    const [lifePlanName, setLifePlanName] = useState("");
    const [users, setUsers] = useState([]);
    const [userName, setUserName] = useState("");
    const [birthday, setBirthday] = useState(1997);
    const [ascOrDec, setAscOrDec] = useState(true);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const putLifeplansDB = async (putLifeplan) => {
        const dynamoParams = {
            TableName: 'life',
            Item: putLifeplan
        }
        await documentClient.put(dynamoParams, (err, data) => {
            if (!err) {
                init();
            } else {
                console.log(JSON.stringify(err, null, 2));
            }
        });
    };

    const deleteLifeplansDB = async (deleteLifePlanId) => {
        const dynamoParams = {
            TableName: 'life',
            Key: {
                life_id: deleteLifePlanId
            }
        }
        await documentClient.delete(dynamoParams, (err, data) => {
            if (!err) {
                init();
            } else {
                console.log(JSON.stringify(err, null, 2));
            }
        });
    };

    const copyLifePlan = (putLifePlanId, putLifePlanName) => {
        let lifePlan = {}
        for (const row of lifeplans) {
            if (row.life_id === putLifePlanId) {
                lifePlan = {
                    household: row.household,
                    life_name: putLifePlanName,
                    life_id: createLifePlanId(),
                    users: row.user
                };
                break;
            }
        }
        putLifeplansDB(lifePlan);
    };

    const createLifePlanId = () => {
        const today = new Date();
        return String(today.getFullYear()) + String('00' + (today.getMonth() + 1)).slice(-2) + String('00' + today.getDate()).slice(-2) +
            String('00' + today.getHours()).slice(-2) + String('00' + today.getMinutes()).slice(-2) + String('00' + today.getSeconds()).slice(-2);
    };

    const addUser = () => {
        setUsers([...users, {
            user_name: userName,
            birthday: birthday
        }]);
    };

    const createLifePlan = () => {
        let lifePlan = {
            household: [],
            life_name: lifePlanName,
            life_id: createLifePlanId(),
            users: users
        };
        putLifeplansDB(lifePlan);
    };

    const selectLifePlan = (selectLifeId) => {
        navigate(`/life/${selectLifeId}`);
    };

    const copyJson = async (copyLifePlanId) => {
        let copyLifePlanJson = {};
        for (const row of lifeplans) {
            if (row.life_id === copyLifePlanId) {
                copyLifePlanJson = row;
                break;
            }
        }
        await global.navigator.clipboard.writeText(JSON.stringify(copyLifePlanJson));
    }

    const init = () => {
        const scanAll = async () => {
            let params = {
                TableName: 'life',
            };
            let items = [];

            const scan = async () => {
                const result = await documentClient.scan(params).promise();
                items.push(...result.Items);

                if (result.LastEvaluatedKey) {
                    params.ExclusiveStartKey = result.LastEvaluatedKey
                    await scan();
                }
            };

            try {
                await scan();
                return items;
            } catch (err) {
                console.error(`[Error]: ${JSON.stringify(err)}`);
                return err;
            }
        };

        (async () => {
            setLifeplans(await scanAll());
        })();
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <Grid
            container
            alignItems="center"
            justifyContent="center"
            paddingTop={10}>
            <Grid item xs={0} sm={0} md={2} lg={2}></Grid>
            <Grid item xs={12} sm={12} md={8} lg={8}>
                <Card>
                    <CardHeader style={{ textAlign: "center", backgroundColor: "#af52bf", color: "#FFFFFF" }} title="ライフプラン登録" />
                    <CardContent>
                        <FormGroup>
                            <FormControl
                                required
                                fullWidth
                                margin="normal">
                                <TextField
                                    type="text"
                                    label="ライフプラン名 *"
                                    placeholder="ライフプラン名を入力してください"
                                    onChange={(event) => { setLifePlanName(event.target.value); }}
                                />
                            </FormControl>
                        </FormGroup>
                    </CardContent>
                    <CardContent>
                        <FormGroup>
                            <FormControl
                                required
                                fullWidth
                                margin="normal">
                                <TextField
                                    type="text"
                                    label="ユーザ名 *"
                                    placeholder="ユーザ名を入力してください"
                                    onChange={(event) => { setUserName(event.target.value); }}
                                />
                            </FormControl>
                            <FormControl
                                required
                                fullWidth
                                margin="normal">
                                <TextField
                                    type="number"
                                    label="生年 *"
                                    placeholder="生年を入力してください"
                                    onChange={(event) => { setBirthday(event.target.value); }}
                                />
                            </FormControl>
                            <FormControl
                                required
                                fullWidth
                                margin="normal">
                                <Button
                                    variant="contained"
                                    size="large"
                                    type="submit"
                                    fullWidth
                                    onClick={() => { addUser(); }}
                                >
                                    <AddIcon />追加
                                </Button>
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

                    <TableContainer>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        align='left'
                                    >
                                        ユーザ名
                                    </TableCell>
                                    <TableCell
                                        align='left'
                                    >
                                        生年
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users
                                    .sort()
                                    .map((user) => {
                                        return (
                                            <TableRow hover tabIndex={-1} key={user.user_name}>
                                                <TableCell>
                                                    {user.user_name}
                                                </TableCell>
                                                <TableCell>
                                                    {user.birthday}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
                <br />
                <Card>
                    <CardHeader style={{ textAlign: "center", backgroundColor: "#af52bf", color: "#FFFFFF" }} title="ライフプラン一覧" />
                    <CardContent>
                        <TableContainer>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            align='left'
                                        >
                                            LifeId
                                            <IconButton size="small" onClick={() => { setAscOrDec(!ascOrDec) }}>
                                                {ascOrDec ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                            </IconButton>
                                        </TableCell>
                                        <TableCell
                                            align='left'
                                        >
                                            LifeName
                                        </TableCell>
                                        <TableCell
                                            align='left'
                                        >
                                            世帯人数
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
                                    {lifeplans
                                        .sort((val1, val2) => {
                                            return ascOrDec ? val1.life_id - val2.life_id : val2.life_id - val1.life_id;
                                        })
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((lifeplan) => {
                                            return (
                                                <TableRow hover tabIndex={-1} key={lifeplan.life_id}>
                                                    <TableCell>
                                                        {lifeplan.life_id}
                                                    </TableCell>
                                                    <TableCell>
                                                        {lifeplan.life_name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {lifeplan.users.length}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            type="submit"
                                                            color="info"
                                                            onClick={() => selectLifePlan(lifeplan.life_id)}
                                                        >
                                                            <ContentPasteSearchIcon />
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <HomeModal
                                                            lifePlanId={lifeplan.life_id}
                                                            copyLifePlan={copyLifePlan}
                                                            copyJson={copyJson} />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            type="submit"
                                                            color="error"
                                                            onClick={() => { deleteLifeplansDB(lifeplan.life_id) }}
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
                            count={lifeplans.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={0} sm={0} md={2} lg={2}></Grid>
        </Grid>
    );
};

export default Home;