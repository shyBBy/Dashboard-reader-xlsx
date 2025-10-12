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
import AssessmentIcon from '@mui/icons-material/Assessment';
import { AppBarMobileViewNavigationList } from './AppBarMobileViewNavigationList';
import { FileInfoBar } from '../FileInfoBar/FileInfoBar';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import './AppBarMobileView.css';
import { useTheme } from '@mui/material/styles';

export const AppBarMobileView = () => {
    const { handleDrawerToggleSideBar, mobileOpenSideBar } = useMobileView();
    const theme = useTheme();

    return (
        <>
            <AppBar 
                position="absolute" 
                sx={{ 
                    backgroundColor: theme.palette.background.paper,
                    backdropFilter: 'blur(10px)',
                    borderBottom: `1px solid ${theme.palette.divider}`
                }} 
                open={mobileOpenSideBar}
            >
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
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 2,
                            mr: 2,
                            boxShadow: `0 4px 12px ${theme.palette.primary.main}30`
                        }}>
                            <AssessmentIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
                        </Box>
                    </Box>
                    
                    <Typography
                        component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                        sx={{ flexGrow: 0, mr: 3 }}
                    >
                        Dashboard Reader XLSX
                    </Typography>

                    {/* Informacje o pliku i przyciski zarządzania */}
                    <FileInfoBar />

                    <Box sx={{ flexGrow: 1 }} />
                    
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1 
                    }}>
                        {/* Theme Toggle */}
                        <ThemeToggle variant="icon" />
                        
                        {/* User Avatar */}
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
            
            <Drawer 
                variant="permanent" 
                open={mobileOpenSideBar}
            >
                <Toolbar
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        px: [1],
                        backgroundColor: theme.palette.background.paper
                    }}
                >
                    <IconButton 
                        onClick={handleDrawerToggleSideBar}
                        sx={{
                            color: theme.palette.text.primary,
                            '&:hover': {
                                backgroundColor: `${theme.palette.primary.main}20`
                            }
                        }}
                    >
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider sx={{ borderColor: theme.palette.divider }} />
                <List component="nav">
                    <AppBarMobileViewNavigationList open={mobileOpenSideBar} />
                </List>
            </Drawer>
        </>
    );
};