import React from 'react';
import { 
    IconButton, 
    Tooltip, 
    Box, 
    useTheme as useMuiTheme,
    Fade 
} from '@mui/material';
import { 
    Brightness4, 
    Brightness7,
    DarkMode,
    LightMode 
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';

/**
 * Komponent przełącznika Dark/Light theme
 * Pokazuje różne ikony w zależności od aktualnego trybu
 */
export const ThemeToggle = ({ variant = 'icon' }) => {
    const { isDarkMode, toggleTheme } = useTheme();
    const muiTheme = useMuiTheme();

    // Różne warianty wyświetlania
    const renderIconButton = () => (
        <Tooltip 
            title={isDarkMode ? 'Przełącz na tryb jasny' : 'Przełącz na tryb ciemny'}
            arrow
            placement="bottom"
        >
            <IconButton
                onClick={toggleTheme}
                sx={{
                    color: 'text.primary',
                    backgroundColor: isDarkMode 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(148, 163, 184, 0.1)', // Slate-400 dla light mode
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${muiTheme.palette.divider}`,
                    '&:hover': {
                        backgroundColor: isDarkMode 
                            ? 'rgba(255, 255, 255, 0.2)' 
                            : 'rgba(148, 163, 184, 0.2)', // Lepszy hover w light mode
                        transform: 'scale(1.05)',
                    },
                    transition: 'all 0.2s ease-in-out',
                }}
            >
                <Fade in={true} timeout={300}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {isDarkMode ? (
                            <LightMode sx={{ fontSize: 20 }} />
                        ) : (
                            <DarkMode sx={{ fontSize: 20 }} />
                        )}
                    </Box>
                </Fade>
            </IconButton>
        </Tooltip>
    );

    const renderWithLabel = () => (
        <Tooltip 
            title={isDarkMode ? 'Przełącz na tryb jasny' : 'Przełącz na tryb ciemny'}
            arrow
            placement="bottom"
        >
            <Box
                onClick={toggleTheme}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    padding: '8px 12px',
                    borderRadius: 2,
                    backgroundColor: isDarkMode 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(148, 163, 184, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${muiTheme.palette.divider}`,
                    cursor: 'pointer',
                    color: 'text.primary',
                    '&:hover': {
                        backgroundColor: isDarkMode 
                            ? 'rgba(255, 255, 255, 0.2)' 
                            : 'rgba(148, 163, 184, 0.2)',
                        transform: 'scale(1.02)',
                    },
                    transition: 'all 0.2s ease-in-out',
                }}
            >
                <Fade in={true} timeout={300}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {isDarkMode ? (
                            <LightMode sx={{ fontSize: 18 }} />
                        ) : (
                            <DarkMode sx={{ fontSize: 18 }} />
                        )}
                    </Box>
                </Fade>
                <Box sx={{ 
                    fontSize: '0.875rem', 
                    fontWeight: 500,
                    userSelect: 'none' 
                }}>
                    {isDarkMode ? 'Jasny' : 'Ciemny'}
                </Box>
            </Box>
        </Tooltip>
    );

    const renderMinimal = () => (
        <IconButton
            onClick={toggleTheme}
            sx={{
                color: 'text.secondary',
                '&:hover': {
                    color: 'text.primary',
                    backgroundColor: 'action.hover',
                },
                transition: 'all 0.2s ease-in-out',
            }}
        >
            {isDarkMode ? (
                <Brightness7 sx={{ fontSize: 20 }} />
            ) : (
                <Brightness4 sx={{ fontSize: 20 }} />
            )}
        </IconButton>
    );

    // Wybierz wariant na podstawie props
    switch (variant) {
        case 'labeled':
            return renderWithLabel();
        case 'minimal':
            return renderMinimal();
        case 'icon':
        default:
            return renderIconButton();
    }
};

export default ThemeToggle;