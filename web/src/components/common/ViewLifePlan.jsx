import {
    Box,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    IconButton,
} from "@mui/material";
import React, { useState, useEffect } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AWS from '../../config/AWS';

const ViewLifePlan = (props) => {
    const documentClient = new AWS.DynamoDB.DocumentClient();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [lifeplans, setLifeplans] = useState([]);
    const [ascOrDec, setAscOrDec] = useState(true);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

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
                                        <TableRow hover tabIndex={-1} key={lifeplan.life_id} onClick={() => { props.setLifeId(lifeplan.life_id) }}>
                                            <TableCell>
                                                {lifeplan.life_id}
                                            </TableCell>
                                            <TableCell>
                                                {lifeplan.life_name}
                                            </TableCell>
                                            <TableCell>
                                                {lifeplan.users.length}
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
    );
}
export default ViewLifePlan;