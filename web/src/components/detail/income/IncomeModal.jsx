import {
    Box,
    Button,
    Typography,
    Modal,
    Card,
    CardContent,
    CardHeader,
    FormGroup,
    FormControl,
    TextField,
    CardActions
} from "@mui/material";
import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const IncomeModal = (props) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [name, setName] = useState("");
    const [monthly, setMonthly] = useState(0);
    const [money, setMoney] = useState(0);

    return (
        <div>
            <Button variant="contained" size="small" onClick={handleOpen}><AddIcon /></Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Card>
                        <CardHeader style={{ textAlign: "center", backgroundColor: "#af52bf", color: "#FFFFFF" }} title="収入登録" />
                        <CardContent>
                            <FormGroup>
                                <Typography variant="h6" component="h2">
                                    {props.name}
                                </Typography>

                            </FormGroup>
                            <FormGroup>
                                <FormControl
                                    required
                                    fullWidth
                                    margin="normal">
                                    <TextField
                                        type="text"
                                        label="収入名 *"
                                        placeholder="収入名を入力してください"
                                        onChange={(event) => { setName(event.target.value) }}
                                    />
                                </FormControl>
                            </FormGroup>
                            <FormGroup>
                                <FormControl
                                    required
                                    margin="normal"
                                    direction="row">
                                    <TextField
                                        type="number"
                                        label="頻度（か月） *"
                                        placeholder="頻度（か月）を入力してください"
                                        onChange={(event) => { setMonthly(event.target.value) }}
                                    />
                                </FormControl>
                            </FormGroup>
                            <FormGroup>
                                <FormControl
                                    required
                                    fullWidth
                                    margin="normal">
                                    <TextField
                                        type="number"
                                        label="収入額 *"
                                        placeholder="収入額を入力してください"
                                        onChange={(event) => { setMoney(event.target.value) }}
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
                                onClick={() => props.createIncome(props.category, name, money, monthly)}
                            >
                                <SendIcon />送信
                            </Button>
                        </CardActions>
                    </Card>
                </Box>
            </Modal>
        </div>
    );
}
export default IncomeModal;