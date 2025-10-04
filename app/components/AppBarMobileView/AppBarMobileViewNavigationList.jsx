import React from 'react';
import { 
    ListItemButton, 
    ListItemIcon, 
    ListItemText, 
    Tooltip,
    Divider 
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export const AppBarMobileViewNavigationList = ({ open }) => {
    const location = useLocation();
    const theme = useTheme();

    const navigationItems = [
        {
            key: 'dashboard',
            to: '/dashboard',
            icon: DashboardIcon,
            title: 'Dashboard',
            tooltip: 'Dashboard'
        },
        {
            key: 'upload',
            to: '/upload',
            icon: UploadFileIcon,
            title: 'Wgraj Excel',
            tooltip: 'Wgraj plik Excel'
        },
        {
            key: 'charts',
            to: '/charts',
            icon: BarChartIcon,
            title: 'Wykresy',
            tooltip: 'Generuj wykresy'
        },
        {
            key: 'analytics',
            to: '/analytics',
            icon: TrendingUpIcon,
            title: 'Analityki',
            tooltip: 'Analizy danych'
        }
    ];

    return (
        <React.Fragment>
            {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname.includes(item.to);
                
                return (
                    <ListItemButton 
                        key={item.key} 
                        component={Link} 
                        to={item.to}
                        sx={{
                            mx: 1,
                            mb: 0.5,
                            borderRadius: 2,
                            backgroundColor: isActive ? `${theme.palette.primary.main}20` : 'transparent',
                            border: isActive ? `1px solid ${theme.palette.primary.main}60` : '1px solid transparent',
                            backdropFilter: isActive ? 'blur(10px)' : 'none',
                            justifyContent: open ? 'flex-start' : 'center',
                            px: open ? 2 : 1,
                            '&:hover': {
                                backgroundColor: isActive ? `${theme.palette.primary.main}30` : `${theme.palette.primary.main}10`,
                                border: `1px solid ${theme.palette.primary.main}40`,
                                transform: open ? 'translateX(4px)' : 'scale(1.1)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <Tooltip title={item.tooltip}>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <IconComponent 
                                    sx={{ 
                                        color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                                        fontSize: '1.25rem'
                                    }}
                                />
                            </ListItemIcon>
                        </Tooltip>
                        {open && (
                            <ListItemText 
                                primary={item.title}
                                sx={{
                                    '& .MuiListItemText-primary': {
                                        color: isActive ? theme.palette.text.primary : theme.palette.text.secondary,
                                        fontWeight: isActive ? 600 : 400,
                                        fontSize: '0.875rem'
                                    }
                                }}
                            />
                        )}
                    </ListItemButton>
                );
            })}
            
            <Divider sx={{ 
                my: 2, 
                mx: 1, 
                borderColor: theme.palette.divider,
                opacity: 0.6
            }} />
        </React.Fragment>
    );
};