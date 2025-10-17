import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Context dla theme
const ThemeContext = createContext();

// Hook do używania theme context
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeContextProvider');
    }
    return context;
};

// Definicje kolorów dla obu trybów - Premium MUI Style
const lightPalette = {
    mode: 'light',
    primary: {
        main: '#635BFF', // Modern purple-blue
        light: '#8B7EFF',
        dark: '#4F46E5',
    },
    secondary: {
        main: '#00C9A7', // Modern teal
        light: '#4DDDCD',
        dark: '#00A085',
    },
    success: {
        main: '#22C55E', // Fresh green
        light: '#4ADE80',
        dark: '#16A34A',
    },
    warning: {
        main: '#F59E0B', // Warm orange
        light: '#FBBF24',
        dark: '#D97706',
    },
    error: {
        main: '#EF4444', // Modern red
        light: '#F87171',
        dark: '#DC2626',
    },
    info: {
        main: '#3B82F6', // Clean blue
        light: '#60A5FA',
        dark: '#2563EB',
    },
    background: {
        default: '#F9FAFB', // Ultra light gray
        paper: '#FFFFFF',
        secondary: '#F3F4F6', // Soft gray
    },
    text: {
        primary: '#111827', // Rich dark
        secondary: '#6B7280', // Soft gray text
    },
    divider: '#E5E7EB', // Light divider
    glass: {
        background: 'rgba(255, 255, 255, 0.95)',
        backdrop: 'rgba(148, 163, 184, 0.1)',
        border: 'rgba(229, 231, 235, 0.8)',
    },
};

const darkPalette = {
    mode: 'dark',
    primary: {
        main: '#8b5cf6', // Violet - bardziej widoczny w dark mode
        light: '#a78bfa',
        dark: '#7c3aed',
    },
    secondary: {
        main: '#06b6d4', // Cyan - pozostaje ten sam
        light: '#22d3ee',
        dark: '#0891b2',
    },
    success: {
        main: '#10b981', // Emerald
        light: '#34d399',
        dark: '#059669',
    },
    warning: {
        main: '#f59e0b', // Amber
        light: '#fbbf24',
        dark: '#d97706',
    },
    error: {
        main: '#f87171', // Red - jaśniejszy w dark mode
        light: '#fca5a5',
        dark: '#ef4444',
    },
    info: {
        main: '#60a5fa', // Blue - jaśniejszy w dark mode
        light: '#93c5fd',
        dark: '#3b82f6',
    },
    background: {
        default: '#0f172a', // Slate-900
        paper: '#1e293b', // Slate-800
        secondary: '#334155', // Slate-700
    },
    text: {
        primary: '#f8fafc', // Slate-50
        secondary: '#cbd5e1', // Slate-300
    },
    divider: '#475569', // Slate-600
    glass: {
        background: 'rgba(30, 41, 59, 0.85)', // Slate-800 z alpha
        backdrop: 'rgba(15, 23, 42, 0.3)', // Slate-900 z alpha
        border: 'rgba(71, 85, 105, 0.3)', // Slate-600 z alpha
    },
};

// Wspólne ustawienia typografii i komponentów
const getThemeConfig = (palette) => ({
    palette,
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 800,
            letterSpacing: '-0.025em',
        },
        h2: {
            fontWeight: 700,
            letterSpacing: '-0.025em',
        },
        h3: {
            fontWeight: 700,
            letterSpacing: '-0.02em',
        },
        h4: {
            fontWeight: 600,
            letterSpacing: '-0.02em',
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
        button: {
            fontWeight: 500,
            textTransform: 'none', // Wyłącz UPPERCASE
        },
    },
    shape: {
        borderRadius: 12, // Bardziej zaokrąglone rogi
    },
    components: {
        // Paper - glass morphism effect
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: palette.mode === 'light' 
                        ? '#FFFFFF'
                        : palette.glass.background,
                    backdropFilter: 'blur(20px)',
                    border: palette.mode === 'light'
                        ? '1px solid rgba(229, 231, 235, 0.6)'
                        : `1px solid ${palette.glass.border}`,
                    boxShadow: palette.mode === 'light' 
                        ? '0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)'
                        : '0 8px 32px rgba(0, 0, 0, 0.3)',
                    borderRadius: '16px'
                },
            },
        },
        // AppBar
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: palette.mode === 'light'
                        ? 'rgba(255, 255, 255, 0.95)' // Prawie białe w light mode
                        : palette.glass.background,
                    backdropFilter: 'blur(20px)',
                    borderBottom: palette.mode === 'light'
                        ? `1px solid rgba(148, 163, 184, 0.2)` // Subtelny border
                        : `1px solid ${palette.glass.border}`,
                    boxShadow: palette.mode === 'light'
                        ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' // Tailwind shadow-sm
                        : 'none',
                    color: palette.text.primary,
                },
            },
        },
        // Buttons
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '10px 24px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                },
                contained: {
                    boxShadow: palette.mode === 'light' 
                        ? '0 4px 20px rgba(0, 0, 0, 0.1)' 
                        : '0 4px 20px rgba(0, 0, 0, 0.4)',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: palette.mode === 'light' 
                            ? '0 8px 25px rgba(0, 0, 0, 0.15)' 
                            : '0 8px 25px rgba(0, 0, 0, 0.5)',
                    },
                },
                outlined: {
                    borderWidth: '1.5px',
                    '&:hover': {
                        borderWidth: '1.5px',
                        transform: 'translateY(-1px)',
                    },
                },
            },
        },
        // Cards - glass effect
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: palette.mode === 'light'
                        ? 'rgba(255, 255, 255, 0.98)' // Prawie nieprzezroczyste
                        : palette.glass.background,
                    backdropFilter: 'blur(20px)',
                    border: palette.mode === 'light'
                        ? `1px solid rgba(148, 163, 184, 0.15)` // Subtelny border
                        : `1px solid ${palette.glass.border}`,
                    boxShadow: palette.mode === 'light'
                        ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' // Tailwind shadow-md
                        : '0 8px 32px rgba(0, 0, 0, 0.3)',
                },
            },
        },
        // TextField
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        backgroundColor: palette.mode === 'light' 
                            ? 'rgba(249, 250, 251, 0.8)' 
                            : 'rgba(30, 41, 59, 0.7)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: palette.mode === 'light' 
                                ? 'rgba(229, 231, 235, 0.8)' 
                                : 'rgba(71, 85, 105, 0.3)',
                            borderWidth: '1.5px',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: palette.primary?.main || '#635BFF',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: palette.primary?.main || '#635BFF',
                            borderWidth: '2px',
                        },
                    },
                },
            },
        },
        // Tables
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    backgroundColor: palette.mode === 'light'
                        ? 'rgba(255, 255, 255, 0.98)' // Prawie nieprzezroczyste
                        : palette.glass.background,
                    backdropFilter: 'blur(20px)',
                    border: palette.mode === 'light'
                        ? `1px solid rgba(148, 163, 184, 0.2)` // Wyraźniejszy border
                        : `1px solid ${palette.glass.border}`,
                    boxShadow: palette.mode === 'light'
                        ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        : 'none',
                },
            },
        },
    },
});

export const ThemeContextProvider = ({ children }) => {
    // Stan theme - sprawdź localStorage lub użyj system preference
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme-mode');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        // Sprawdź system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Słuchaj zmian system preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            // Tylko jeśli użytkownik nie ustawił ręcznie theme
            if (!localStorage.getItem('theme-mode')) {
                setIsDarkMode(e.matches);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Zapisz wybór w localStorage
    useEffect(() => {
        localStorage.setItem('theme-mode', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    // Toggle funkcja
    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    // Stwórz theme na podstawie trybu
    const theme = createTheme(getThemeConfig(isDarkMode ? darkPalette : lightPalette));

    const contextValue = {
        isDarkMode,
        toggleTheme,
        theme,
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};