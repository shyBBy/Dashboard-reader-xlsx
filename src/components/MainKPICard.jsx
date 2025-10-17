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
                borderRadius: 4,
                // Modern card design with subtle gradients
                background: isDarkMode 
                    ? `linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)` 
                    : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(249, 250, 251, 0.8) 100%)`,
                border: isDarkMode 
                    ? '1px solid rgba(255, 255, 255, 0.08)' 
                    : `1px solid rgba(229, 231, 235, 0.6)`,
                backdropFilter: 'blur(20px)',
                // Modern shadow system
                boxShadow: isDarkMode
                    ? '0 4px 20px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.3)'
                    : '0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                cursor: onClick ? 'pointer' : 'default',
                '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    background: isDarkMode 
                        ? `linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)` 
                        : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(243, 244, 246, 0.9) 100%)`,
                    border: `1px solid ${color}40`,
                    boxShadow: isDarkMode
                        ? `0 20px 40px rgba(0, 0, 0, 0.5), 0 8px 32px ${color}20`
                        : `0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 32px ${color}15`
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${color}, ${color}60, ${color})`,
                    opacity: 0.9,
                    borderRadius: '16px 16px 0 0'
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100px',
                    height: '100px',
                    background: `radial-gradient(circle, ${color}08 0%, transparent 70%)`,
                    opacity: 0.6
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                {icon && (
                    <Box 
                        sx={{ 
                            width: 56,
                            height: 56,
                            borderRadius: 3, 
                            background: `linear-gradient(135deg, ${color}15, ${color}08)`,
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${color}20`,
                            color: color,
                            mr: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.75rem',
                            boxShadow: `0 4px 12px ${color}15`,
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                inset: 0,
                                borderRadius: 3,
                                background: `linear-gradient(135deg, ${color}10, transparent)`,
                                opacity: 0.7
                            }
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
                <Box sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                            Progress
                        </Typography>
                        <Typography variant="caption" sx={{ color: color, fontWeight: 600 }}>
                            {Math.round(progress)}%
                        </Typography>
                    </Box>
                    <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                        sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: isDarkMode 
                                ? 'rgba(255, 255, 255, 0.08)' 
                                : `${color}12`,
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                background: `linear-gradient(90deg, ${color}, ${color}CC, ${color}80)`,
                                boxShadow: `0 2px 8px ${color}30`
                            }
                        }} 
                    />
                </Box>
            )}
        </Box>
    );
}