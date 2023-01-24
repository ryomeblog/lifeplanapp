import {
    Box,
    Button,
    Modal,
    Card,
    CardContent,
    CardHeader,
    FormGroup,
    FormControl,
    TextField,
    CardActions
} from "@mui/material";
import React, { useState } from 'react';
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

const UserModal = (props) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [userName, setUserName] = useState("");
    const [birthday, setBirthday] = useState(1997);

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
                        <CardHeader style={{ textAlign: "center", backgroundColor: "#af52bf", color: "#FFFFFF" }} title="ユーザ登録" />
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
                            </FormGroup>
                        </CardContent>
                        <CardActions>
                            <Button
                                variant="contained"
                                size="large"
                                type="submit"
                                fullWidth
                                onClick={() => props.createUser(birthday, userName)}
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
export default UserModal;