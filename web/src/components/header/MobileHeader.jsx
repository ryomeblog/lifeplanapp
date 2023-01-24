import {
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    Link,
    MenuItem,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

const Header = (props) => {

    const [drawerOpen, setDrawerOpen] = useState(false);
    const headersData = [
        {
            label: "page2",
            href: "/page2",
        },
        {
            label: "page1",
            href: "/page1",
        },
        {
            label: "battle",
            href: "/battle",
        }
    ];


    const displayMobile = () => {
        const handleDrawerOpen = () => setDrawerOpen(true);
        const handleDrawerClose = () => setDrawerOpen(false);

        return (
            <Toolbar>
                <IconButton
                    {...{
                        edge: "start",
                        color: "inherit",
                        "aria-label": "menu",
                        "aria-haspopup": "true",
                        onClick: handleDrawerOpen,
                    }}
                >
                    <MenuIcon />
                </IconButton>

                <Drawer
                    {...{
                        anchor: "left",
                        open: drawerOpen,
                        onClose: handleDrawerClose,
                    }}
                >
                    <div>{getDrawerChoices()}</div>
                </Drawer>

                <Button
                    variant="contained"
                    color="succses"
                    component={RouterLink}
                    to="/menu"
                >
                    Hyper-Inflation Card Battle
                </Button>
            </Toolbar>
        );
    };

    const getDrawerChoices = () => {
        return headersData.map(({ label, href }) => {
            return (
                <Link
                    {...{
                        component: RouterLink,
                        to: href,
                        color: "inherit",
                        key: label,
                    }}
                >
                    <MenuItem>{label}</MenuItem>
                </Link>
            );
        });
    };

    return (
        <header>
            <AppBar>
                {displayMobile()}
            </AppBar>
        </header>
    );
}


export default Header;