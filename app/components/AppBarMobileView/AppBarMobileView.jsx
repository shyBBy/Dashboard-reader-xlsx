import React from 'react';
import { 
    Avatar, 
    Box, 
    Divider, 
    IconButton, 
    List, 
    Toolbar, 
    Typography 
} from '@mui/material';
import { AppBar, Drawer, useMobileView } from '../../context/MobileViewContext';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { AppBarMobileViewNavigationList } from './AppBarMobileViewNavigationList';
import './AppBarMobileView.css';
import theme from '../../theme';

export const AppBarMobileView = () => {
    const { handleDrawerToggleSideBar, mobileOpenSideBar } = useMobileView();

    return (
        <>
            <AppBar position="absolute" sx={{ backgroundColor: theme.palette.background.paper }} open={mobileOpenSideBar}>
                <Toolbar
                    sx={{
                        pr: '24px', // keep right padding when drawer closed
                    }}
                >
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerToggleSideBar}
                        sx={{
                            marginRight: '36px',
                            ...(mobileOpenSideBar && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mr: 2 
                    }}>
                        <Box sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 1,
                            mr: 2
                        }}>
                            📊
                        </Box>
                    </Box>
                    
                    <Typography
                        component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                        sx={{ flexGrow: 1 }}
                    >
                        Dashboard Reader XLSX
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />
                    
                    <Box sx={{ display: { xs: 'flex', md: 'flex' } }}>
                        <IconButton sx={{ p: 0 }}>
                            <Avatar 
                                alt="User" 
                                sx={{ 
                                    bgcolor: 'primary.main',
                                    width: 32,
                                    height: 32
                                }}
                            >
                                U
                            </Avatar>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            
            <Drawer variant="permanent" open={mobileOpenSideBar}>
                <Toolbar
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        px: [1],
                    }}
                >
                    <IconButton onClick={handleDrawerToggleSideBar}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List component="nav">
                    <AppBarMobileViewNavigationList />
                </List>
            </Drawer>
        </>
    );
};