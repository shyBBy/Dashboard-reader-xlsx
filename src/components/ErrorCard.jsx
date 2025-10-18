import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { 
    ErrorOutline, 
    Refresh, 
    Settings,
    CloudOff,
    Warning
} from '@mui/icons-material';

export default function ErrorCard({ 
    title = "Błąd połączenia", 
    message, 
    icon: IconComponent = ErrorOutline,
    onRetry,
    type = 'error'
}) {
    const theme = useTheme();

    // Mapowanie typów na kolory
    const getTypeColors = (type) => {
        switch (type) {
            case 'warning':
                return {
                    color: theme.palette.warning.main,
                    bgColor: theme.palette.warning.light + '20',
                    borderColor: theme.palette.warning.main + '30'
                };
            case 'info':
                return {
                    color: theme.palette.info.main,
                    bgColor: theme.palette.info.light + '20',
                    borderColor: theme.palette.info.main + '30'
                };
            default: // error
                return {
                    color: theme.palette.error.main,
                    bgColor: theme.palette.error.light + '20',
                    borderColor: theme.palette.error.main + '30'
                };
        }
    };

    const colors = getTypeColors(type);

    return (
        <Box sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: 'background.default'
        }}>
            <Box
                sx={{
                    maxWidth: 500,
                    mx: 'auto',
                    p: 4,
                    background: `linear-gradient(135deg, ${theme.vars.palette.background.paper} 0%, ${theme.vars.palette.background.default} 100%)`,
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4,
                    border: `2px solid ${colors.borderColor}`,
                    boxShadow: `0 20px 40px ${colors.color}15, 0 4px 20px rgba(0, 0, 0, 0.08)`,
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 25px 50px ${colors.color}20, 0 8px 30px rgba(0, 0, 0, 0.12)`
                    }
                }}
            >
                {/* Ikona */}
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: colors.bgColor,
                        border: `3px solid ${colors.color}40`,
                        mb: 3,
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: -4,
                            left: -4,
                            right: -4,
                            bottom: -4,
                            borderRadius: '50%',
                            background: `conic-gradient(${colors.color}40, transparent, ${colors.color}40)`,
                            animation: 'spin 3s linear infinite',
                            zIndex: -1
                        },
                        '@keyframes spin': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' }
                        }
                    }}
                >
                    <IconComponent 
                        sx={{ 
                            fontSize: 40,
                            color: colors.color
                        }} 
                    />
                </Box>

                {/* Tytuł */}
                <Typography 
                    variant="h4" 
                    component="h1"
                    gutterBottom
                    sx={{ 
                        fontWeight: 'bold',
                        color: 'text.primary',
                        mb: 2
                    }}
                >
                    {title}
                </Typography>

                {/* Wiadomość */}
                <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ 
                        mb: 3,
                        lineHeight: 1.6,
                        maxWidth: 400,
                        mx: 'auto'
                    }}
                >
                    {message}
                </Typography>

                {/* Przycisk Retry */}
                {onRetry && (
                    <Button
                        variant="contained"
                        startIcon={<Refresh />}
                        onClick={onRetry}
                        sx={{
                            backgroundColor: colors.color,
                            color: 'white',
                            px: 4,
                            py: 1.5,
                            borderRadius: 3,
                            fontWeight: 600,
                            textTransform: 'none',
                            boxShadow: `0 4px 20px ${colors.color}30`,
                            '&:hover': {
                                backgroundColor: colors.color,
                                filter: 'brightness(1.1)',
                                boxShadow: `0 6px 25px ${colors.color}40`,
                                transform: 'translateY(-1px)'
                            },
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Spróbuj ponownie
                    </Button>
                )}

                {/* Dodatkowe info */}
                <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                        display: 'block',
                        mt: 3,
                        opacity: 0.7,
                        fontSize: '0.75rem'
                    }}
                >
                    Sprawdź czy serwer Python FastAPI działa na: http://localhost:8000
                </Typography>
            </Box>
        </Box>
    );
}