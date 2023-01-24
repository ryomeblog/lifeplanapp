import {
    Box,
    Button,
    Typography,
    Popover,
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

const HomeModal = (props) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [lifePlanName, setLifePlanName] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);

    const anchorOpen = Boolean(anchorEl);

    const anchorHandleClick = (event) => {
        props.copyJson(props.lifePlanId);
        setAnchorEl(event.currentTarget);
    };

    const anchorHandleClose = () => {
        setAnchorEl(null);
    };

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
                        <CardHeader style={{ textAlign: "center", backgroundColor: "#af52bf", color: "#FFFFFF" }} title="ライフプランコピー" />
                        <CardContent>
                            <FormGroup>
                                <Typography variant="h6" component="h2">
                                    {props.lifePlanId}
                                    <Button variant="text" color="inherit" size="small" onClick={anchorHandleClick}><ContentCopyIcon /></Button>
                                    <Popover
                                        open={anchorOpen}
                                        anchorEl={anchorEl}
                                        onClose={anchorHandleClose}
                                        anchorOrigin={{
                                          vertical: 'top',
                                          horizontal: 'left',
                                        }}
                                        transformOrigin={{
                                          vertical: 'bottom',
                                          horizontal: 'left',
                                        }}
                                    >
                                        <Typography sx={{ p: 2 }}>クリップボードにJSONをコピーしました。</Typography>
                                    </Popover>
                                </Typography>
                            </FormGroup>
                            <FormGroup>
                                <FormControl
                                    required
                                    fullWidth
                                    margin="normal">
                                    <TextField
                                        type="text"
                                        label="ライフプラン名 *"
                                        placeholder="ライフプラン名を入力してください"
                                        onChange={(event) => { setLifePlanName(event.target.value) }}
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
                                onClick={() => props.copyLifePlan(props.lifePlanId, lifePlanName)}
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
export default HomeModal;