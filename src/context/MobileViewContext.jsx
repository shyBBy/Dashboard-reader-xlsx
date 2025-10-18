import React, { createContext, useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';

const drawerSideBarWidth = 240;

export const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.vars.palette.background.paper,
    backdropFilter: 'blur(20px)',
    borderBottom: `1px solid ${theme.vars.palette.divider}`,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerSideBarWidth,
        width: `calc(100% - ${drawerSideBarWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

export const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerSideBarWidth,
            backgroundColor: theme.vars.palette.background.paper,
            backdropFilter: 'blur(10px)',
            borderRight: `1px solid ${theme.vars.palette.divider}`,
            backgroundImage: 'none',
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

export const MobileViewContext = createContext(null);

export const MobileViewProvider = ({ children }) => {
    const [mobileOpenSideBar, setMobileOpenSideBar] = useState(false);

    const handleDrawerToggleSideBar = () => {
        setMobileOpenSideBar(!mobileOpenSideBar);
    };

    return (
        <MobileViewContext.Provider value={{
            drawerSideBarWidth,
            handleDrawerToggleSideBar,
            mobileOpenSideBar
        }}>
            {children}
        </MobileViewContext.Provider>
    );
};

export const useMobileView = () => {
    const context = useContext(MobileViewContext);
    if (!context) {
        throw new Error('useMobileView must be used within a MobileViewProvider');
    }
    return context;
};