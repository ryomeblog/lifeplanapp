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
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
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

const LifeListModal = (props) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [year, setYear] = useState(0);

    return (
        <div>
            <Button variant="contained" color="inherit" size="small" onClick={handleOpen}><ContentCopyIcon /></Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Card>
                        <CardHeader style={{ textAlign: "center", backgroundColor: "#af52bf", color: "#FFFFFF" }} title="収支コピー" />
                        <CardContent>
                            <FormGroup>
                                <Typography variant="h6" component="h2">
                                    {props.copyYear}年
                                </Typography>
                            </FormGroup>
                            <FormGroup>
                                <FormControl
                                    required
                                    fullWidth
                                    margin="normal">
                                    <TextField
                                        type="number"
                                        label="年 *"
                                        placeholder="年を入力してください"
                                        onChange={(event) => { setYear(event.target.value) }}
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
                                onClick={() => props.copyLifeList(props.copyYear, year)}
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
export default LifeListModal;