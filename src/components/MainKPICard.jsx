import React from 'react';
import { Box, Typography, LinearProgress, useTheme } from '@mui/material';

export default function MainKPICard({ 
    title, 
    value, 
    subtitle, 
    icon, 
    type = 'default', 
    progress,
    onClick 
}) {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    // Mapowanie typów na kolory z theme
    const getTypeColors = (type) => {
        switch (type) {
            case 'success':
                return {
                    color: theme.palette.success.main,
                    bgColor: theme.palette.success.light + '20'
                };
            case 'warning':
                return {
                    color: theme.palette.warning.main,
                    bgColor: theme.palette.warning.light + '20'
                };
            case 'error':
                return {
                    color: theme.palette.error.main,
                    bgColor: theme.palette.error.light + '20'
                };
            case 'info':
                return {
                    color: theme.palette.info.main,
                    bgColor: theme.palette.info.light + '20'
                };
            case 'primary':
                return {
                    color: theme.palette.primary.main,
                    bgColor: theme.palette.primary.light + '20'
                };
            case 'secondary':
                return {
                    color: theme.palette.secondary.main,
                    bgColor: theme.palette.secondary.light + '20'
                };
            default:
                return {
                    color: theme.palette.primary.main,
                    bgColor: theme.palette.primary.light + '20'
                };
        }
    };

    const { color, bgColor } = getTypeColors(type);

    return (
        <Box
            onClick={onClick}
            sx={{
                flex: '1 1 280px',
                minWidth: '280px',
                maxWidth: '320px',
                p: 3,
                borderRadius: 3,
                // Theme-responsive background
                background: isDarkMode 
                    ? 'rgba(255, 255, 255, 0.02)' 
                    : theme.palette.background.paper,
                border: isDarkMode 
                    ? '1px solid rgba(255, 255, 255, 0.1)' 
                    : `1px solid ${theme.palette.divider}`,
                backdropFilter: 'blur(10px)',
                // Theme-responsive shadow
                boxShadow: isDarkMode
                    ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                cursor: onClick ? 'pointer' : 'default',
                '&:hover': {
                    transform: 'translateY(-4px)', // Mniejszy lift
                    background: isDarkMode 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : theme.palette.background.paper,
                    border: `1px solid ${color}60`,
                    boxShadow: isDarkMode
                        ? `0 20px 40px -12px ${color}30`
                        : `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px ${color}30`
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: `linear-gradient(90deg, ${color}, ${color}80)`,
                    opacity: 0.8
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                {icon && (
                    <Box 
                        sx={{ 
                            p: 2, 
                            borderRadius: 2, 
                            background: `linear-gradient(135deg, ${color}20, ${color}10)`,
                            color: color,
                            mr: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem'
                        }}
                    >
                        {icon}
                    </Box>
                )}
                <Box>
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            fontWeight: 'medium',
                            color: isDarkMode 
                                ? 'rgba(255, 255, 255, 0.7)' 
                                : theme.palette.text.secondary,
                            mb: 1
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            fontWeight: 'bold',
                            color: isDarkMode 
                                ? 'white' 
                                : theme.palette.text.primary,
                            lineHeight: 1
                        }}
                    >
                        {value}
                    </Typography>
                </Box>
            </Box>
            
            {subtitle && (
                <Typography 
                    variant="body2" 
                    sx={{ 
                        color: isDarkMode 
                            ? 'rgba(255, 255, 255, 0.6)' 
                            : theme.palette.text.secondary,
                        fontSize: '0.875rem',
                        mb: progress !== undefined ? 2 : 0
                    }}
                >
                    {subtitle}
                </Typography>
            )}

            {progress !== undefined && (
                <Box sx={{ mt: 2 }}>
                    <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                        sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: isDarkMode 
                                ? 'rgba(255, 255, 255, 0.1)' 
                                : `${color}20`, // Używaj koloru typu z alpha
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 3,
                                background: `linear-gradient(90deg, ${color}, ${color}80)`
                            }
                        }} 
                    />
                </Box>
            )}
        </Box>
    );
}