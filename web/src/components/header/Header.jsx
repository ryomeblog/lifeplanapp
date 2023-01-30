import {
    AppBar,
    Toolbar,
    Typography,
    makeStyles,
    Button,
    IconButton,
    Drawer,
    Link,
    MenuItem,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { color } from "@mui/system";
import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";


const Header = (props) => {

    const headersData = [
        {
            label: "json",
            href: "/json",
        },
        {
            label: "比較",
            href: "/comparison",
        },
        {
            label: "投資グラフ",
            href: "/investment",
        }
    ];

    const displayDesktop = () => {
        return (
            <Toolbar>
                <Button
                    variant="contained"
                    color="secondary"
                    component={RouterLink}
                    to="/"
                >
                    ライフプランアプリ
                </Button>
                <div>{getMenuButtons()}</div>
            </Toolbar>
        );
    };

    const getMenuButtons = () => {
        return headersData.map(({ label, href }) => {
            return (
                <Button
                    {...{
                        key: label,
                        color: "inherit",
                        to: href,
                        component: RouterLink
                    }}
                >
                    {label}
                </Button>
            );
        });
    };

    return (
        <header>
            <AppBar>
                {displayDesktop()}
            </AppBar>
        </header>
    );

}

export default Header;



