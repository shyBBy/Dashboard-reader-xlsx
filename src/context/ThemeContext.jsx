import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Context dla theme
const ThemeContext = createContext();

// Hook do używania app theme context (isDarkMode, toggleTheme, etc.)
export const useAppTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useAppTheme must be used within a ThemeContextProvider');
    }
    return context;
};

// Re-export MUI useTheme dla wygody (zwraca theme object)
export { useTheme } from '@mui/material/styles';

// Glass morphism values jako stałe (używane w component overrides)
const glassEffects = {
    light: {
        background: 'rgba(255, 255, 255, 0.95)',
        backdrop: 'rgba(148, 163, 184, 0.1)',
        border: 'rgba(229, 231, 235, 0.8)',
    },
    dark: {
        background: 'rgba(30, 41, 59, 0.85)',
        backdrop: 'rgba(15, 23, 42, 0.3)',
        border: 'rgba(71, 85, 105, 0.3)',
    },
};

// Definicja colorSchemes - nowe API z MUI v6+
const getColorSchemes = () => ({
    light: {
        palette: {
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
            },
            text: {
                primary: '#111827', // Rich dark
                secondary: '#6B7280', // Soft gray text
            },
            divider: '#E5E7EB', // Light divider
        },
    },
    dark: {
        palette: {
            primary: {
                main: '#8b5cf6', // Violet - bardziej widoczny w dark mode
                light: '#a78bfa',
                dark: '#7c3aed',
            },
            secondary: {
                main: '#06b6d4', // Cyan
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
            },
            text: {
                primary: '#f8fafc', // Slate-50
                secondary: '#cbd5e1', // Slate-300
            },
            divider: '#475569', // Slate-600
        },
    },
});

// Wspólne ustawienia komponentów z CSS Variables
const getComponentOverrides = () => ({
    // Paper - glass morphism effect z CSS Variables
    MuiPaper: {
        styleOverrides: {
            root: ({ theme }) => ({
                backgroundImage: 'none',
                backgroundColor: theme.vars.palette.background.paper,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${theme.vars.palette.divider}`,
                boxShadow: theme.shadows[3],
                borderRadius: 16,
            }),
        },
    },
    // AppBar z CSS Variables
    MuiAppBar: {
        styleOverrides: {
            root: ({ theme }) => ({
                backgroundColor: theme.vars.palette.background.paper,
                backdropFilter: 'blur(20px)',
                borderBottom: `1px solid ${theme.vars.palette.divider}`,
                boxShadow: theme.shadows[1],
                color: theme.vars.palette.text.primary,
            }),
        },
    },
    // Buttons
    MuiButton: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: 12,
                textTransform: 'none',
                fontWeight: 600,
                padding: '10px 24px',
                transition: theme.transitions.create(['all'], {
                    duration: 300,
                }),
            }),
            contained: ({ theme }) => ({
                boxShadow: theme.shadows[4],
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[8],
                },
            }),
            outlined: {
                borderWidth: '1.5px',
                '&:hover': {
                    borderWidth: '1.5px',
                    transform: 'translateY(-1px)',
                },
            },
        },
    },
    // Cards - glass effect z CSS Variables
    MuiCard: {
        styleOverrides: {
            root: ({ theme }) => ({
                backgroundColor: theme.vars.palette.background.paper,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${theme.vars.palette.divider}`,
                boxShadow: theme.shadows[4],
            }),
        },
    },
    // TextField z CSS Variables
    MuiTextField: {
        styleOverrides: {
            root: ({ theme }) => ({
                '& .MuiOutlinedInput-root': {
                    borderRadius: 12,
                    backgroundColor: 'rgba(var(--mui-palette-background-default-channel) / 0.8)',
                    backdropFilter: 'blur(10px)',
                    transition: theme.transitions.create(['all'], {
                        duration: 300,
                    }),
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.vars.palette.divider,
                        borderWidth: '1.5px',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.vars.palette.primary.main,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.vars.palette.primary.main,
                        borderWidth: '2px',
                    },
                },
            }),
        },
    },
    // Tables z CSS Variables
    MuiTableContainer: {
        styleOverrides: {
            root: ({ theme }) => ({
                backgroundColor: theme.vars.palette.background.paper,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${theme.vars.palette.divider}`,
                boxShadow: theme.shadows[2],
            }),
        },
    },
});

export const ThemeContextProvider = ({ children }) => {
    // Stan theme mode - sprawdź localStorage lub użyj system preference
    const [mode, setMode] = useState(() => {
        const savedMode = localStorage.getItem('theme-mode');
        if (savedMode) {
            return savedMode;
        }
        // Sprawdź system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    // Oblicz isDarkMode dla backward compatibility
    const isDarkMode = mode === 'dark';

    // Stwórz theme z CSS Variables i colorSchemes
    const theme = useMemo(
        () =>
            createTheme({
                // 🔥 NOWE: Włącz CSS Variables
                cssVariables: {
                    colorSchemeSelector: 'data-mui-color-scheme',
                    cssVarPrefix: 'mui',
                },
                // 🔥 NOWE: ColorSchemes zamiast pojedynczej palety
                colorSchemes: getColorSchemes(),
                
                // Typography - wspólne dla obu trybów
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
                        textTransform: 'none',
                    },
                },
                
                // Shape
                shape: {
                    borderRadius: 12,
                },
                
                // Component overrides używające CSS Variables
                components: getComponentOverrides(),
            }),
        [] // Theme jest tworzony raz, color scheme zmienia się przez CSS variables
    );

    // Ustaw color scheme na document element (dla CSS Variables)
    useEffect(() => {
        document.documentElement.setAttribute('data-mui-color-scheme', mode);
        localStorage.setItem('theme-mode', mode);
    }, [mode]);

    // Słuchaj zmian system preference (tylko jeśli użytkownik nie ustawił ręcznie)
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            // Tylko jeśli użytkownik nie ustawił ręcznie theme
            const savedMode = localStorage.getItem('theme-mode');
            if (!savedMode || savedMode === 'system') {
                setMode(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Toggle funkcja
    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const contextValue = {
        isDarkMode, // Backward compatibility
        mode,
        toggleTheme,
        theme,
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            <ThemeProvider theme={theme}>
                <CssBaseline enableColorScheme />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};