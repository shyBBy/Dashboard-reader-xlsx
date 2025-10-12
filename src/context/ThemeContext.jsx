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

// Definicje kolorów dla obu trybów
const lightPalette = {
    mode: 'light',
    primary: {
        main: '#4f46e5', // Ciemniejszy indigo - lepszy kontrast
        light: '#6366f1',
        dark: '#3730a3',
    },
    secondary: {
        main: '#0891b2', // Ciemniejszy cyan - lepszy kontrast
        light: '#06b6d4',
        dark: '#0e7490',
    },
    success: {
        main: '#059669', // Ciemniejszy emerald
        light: '#10b981',
        dark: '#047857',
    },
    warning: {
        main: '#d97706', // Ciemniejszy amber
        light: '#f59e0b',
        dark: '#b45309',
    },
    error: {
        main: '#dc2626', // Ciemniejszy red
        light: '#ef4444',
        dark: '#b91c1c',
    },
    info: {
        main: '#2563eb', // Ciemniejszy blue
        light: '#3b82f6',
        dark: '#1d4ed8',
    },
    background: {
        default: '#f8fafc', // Slate-50
        paper: '#ffffff',
        secondary: '#f1f5f9', // Slate-100
    },
    text: {
        primary: '#0f172a', // Slate-900 - ciemny tekst
        secondary: '#475569', // Ciemniejszy secondary text - Slate-600
    },
    divider: '#cbd5e1', // Ciemniejszy divider - Slate-300
    glass: {
        background: 'rgba(255, 255, 255, 0.95)', // Bardziej nieprzezroczyste
        backdrop: 'rgba(148, 163, 184, 0.1)', // Slate-400 z alpha
        border: 'rgba(148, 163, 184, 0.3)', // Bardziej widoczny border
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
                        ? 'rgba(255, 255, 255, 0.98)' // Prawie nieprzezroczyste w light mode
                        : palette.glass.background,
                    backdropFilter: 'blur(20px)',
                    border: palette.mode === 'light'
                        ? `1px solid rgba(148, 163, 184, 0.2)` // Subtelny border w light
                        : `1px solid ${palette.glass.border}`,
                    boxShadow: palette.mode === 'light' 
                        ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' // Tailwind shadow-md
                        : '0 8px 32px rgba(0, 0, 0, 0.3)',
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
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 500,
                },
                contained: {
                    boxShadow: palette.mode === 'light'
                        ? '0 4px 12px rgba(0, 0, 0, 0.15)'
                        : '0 4px 12px rgba(0, 0, 0, 0.4)',
                    '&:hover': {
                        boxShadow: palette.mode === 'light'
                            ? '0 6px 16px rgba(0, 0, 0, 0.2)'
                            : '0 6px 16px rgba(0, 0, 0, 0.5)',
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
                        borderRadius: 8,
                        backgroundColor: palette.mode === 'light' 
                            ? 'rgba(255, 255, 255, 0.9)' // Bardziej nieprzezroczyste
                            : 'rgba(30, 41, 59, 0.7)',
                        backdropFilter: 'blur(10px)',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: palette.mode === 'light'
                                ? 'rgba(148, 163, 184, 0.4)' // Wyraźniejszy border
                                : 'rgba(71, 85, 105, 0.3)',
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