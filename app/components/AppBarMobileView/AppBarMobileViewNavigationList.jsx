import React from 'react';
import { 
    ListItemButton, 
    ListItemIcon, 
    ListItemText, 
    Tooltip,
    Divider 
} from '@mui/material';
import { Link, useLocation } from 'react-router';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export const AppBarMobileViewNavigationList = () => {
    const location = useLocation();

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
                    <ListItemButton key={item.key} component={Link} to={item.to}>
                        <Tooltip title={item.tooltip}>
                            <ListItemIcon>
                                <IconComponent 
                                    className={isActive ? "active" : "inactive"} 
                                />
                            </ListItemIcon>
                        </Tooltip>
                        <ListItemText 
                            primary={item.title} 
                            className={isActive ? "active" : "inactive"}
                        />
                    </ListItemButton>
                );
            })}
            
            <Divider sx={{ my: 1 }} />
        </React.Fragment>
    );
};