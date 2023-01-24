import {
    Box,
    Card,
    CardHeader,
} from "@mui/material";

const Err = (props) => {

    const cardStyle = {
        display: "block",
        transitionDuration: "0.3s",
        variant: "outlined",
        textAlign: "center"
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <Card style={cardStyle}>
                <Card style={{ backgroundColor: "#af52bf", color: "#FFFFFF" }}>
                    <CardHeader title={props.title} />
                </Card>
                {props.errMsg}
            </Card>
        </Box>
    );
};

export default Err;