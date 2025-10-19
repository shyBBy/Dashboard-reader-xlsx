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

const minimalLightPalette = {
    primary: {
        lighter: '#C8FAD6',
        light: '#5BE49B',
        main: '#00A76F',
        dark: '#007867',
        darker: '#004B50',
        contrastText: '#FFFFFF',
    },
    secondary: {
        lighter: '#EFD6FF',
        light: '#C684FF',
        main: '#8E33FF',
        dark: '#5119B7',
        darker: '#27097A',
        contrastText: '#FFFFFF',
    },
    info: {
        lighter: '#CAFDF5',
        light: '#61F3F3',
        main: '#00B8D9',
        dark: '#006C9C',
        darker: '#003768',
        contrastText: '#FFFFFF',
    },
    success: {
        lighter: '#D3FCD2',
        light: '#77ED8B',
        main: '#22C55E',
        dark: '#118D57',
        darker: '#065E49',
        contrastText: '#ffffff',
    },
    warning: {
        lighter: '#FFF5CC',
        light: '#FFD666',
        main: '#FFAB00',
        dark: '#B76E00',
        darker: '#7A4100',
        contrastText: '#1C252E',
    },
    error: {
        lighter: '#FFE9D5',
        light: '#FFAC82',
        main: '#FF5630',
        dark: '#B71D18',
        darker: '#7A0916',
        contrastText: '#FFFFFF',
    },
    grey: {
        50: '#FCFDFD',
        100: '#F9FAFB',
        200: '#F4F6F8',
        300: '#DFE3E8',
        400: '#C4CDD5',
        500: '#919EAB',
        600: '#637381',
        700: '#454F5B',
        800: '#1C252E',
        900: '#141A21',
        A100: '#f5f5f5',
        A200: '#eeeeee',
        A400: '#bdbdbd',
        A700: '#616161',
    },
    text: {
        primary: '#1C252E',
        secondary: '#637381',
        disabled: '#919EAB',
    },
    divider: 'rgba(145, 158, 171, 0.2)',
    background: {
        paper: '#FFFFFF',
        default: '#FFFFFF',
        neutral: '#F4F6F8',
    },
    action: {
        active: '#637381',
        hover: 'rgba(145, 158, 171, 0.08)',
        selected: 'rgba(145, 158, 171, 0.16)',
        disabled: 'rgba(145, 158, 171, 0.8)',
        disabledBackground: 'rgba(145, 158, 171, 0.24)',
        focus: 'rgba(145, 158, 171, 0.24)',
        hoverOpacity: 0.08,
        selectedOpacity: 0.16,
        disabledOpacity: 0.48,
        focusOpacity: 0.12,
        activatedOpacity: 0.12,
    },
};

const minimalDarkPalette = {
    primary: {
        light: '#5eead4',
        main: '#14b8a6',
        dark: '#0f766e',
        contrastText: '#ffffff',
    },
    secondary: {
        light: '#c4b5fd',
        main: '#8b5cf6',
        dark: '#5b21b6',
        contrastText: '#ffffff',
    },
    info: {
        light: '#67e8f9',
        main: '#06b6d4',
        dark: '#0e7490',
        contrastText: '#ffffff',
    },
    success: {
        light: '#4ade80',
        main: '#22c55e',
        dark: '#15803d',
        contrastText: '#051b11',
    },
    warning: {
        light: '#facc15',
        main: '#f59e0b',
        dark: '#b45309',
        contrastText: '#0b1b1a',
    },
    error: {
        light: '#fb7185',
        main: '#f43f5e',
        dark: '#be123c',
        contrastText: '#ffffff',
    },
    grey: {
        100: '#0f172a',
        200: '#111c2d',
        300: '#1a2435',
        400: '#222d40',
        500: '#334155',
        600: '#475569',
        700: '#94a3b8',
        800: '#cbd5f1',
        900: '#e2e8f0',
    },
    text: {
        primary: '#e2e8f0',
        secondary: 'rgba(226, 232, 240, 0.72)',
        disabled: 'rgba(148, 163, 184, 0.44)',
    },
    divider: 'rgba(148, 163, 184, 0.18)',
    background: {
        paper: '#111c2d',
        default: '#0b1424',
        neutral: 'rgba(71, 85, 105, 0.18)',
    },
    action: {
        active: 'rgba(226, 232, 240, 0.72)',
        hover: 'rgba(148, 163, 184, 0.12)',
        selected: 'rgba(148, 163, 184, 0.18)',
        disabled: 'rgba(148, 163, 184, 0.38)',
        disabledBackground: 'rgba(51, 65, 85, 0.24)',
        focus: 'rgba(148, 163, 184, 0.24)',
        hoverOpacity: 0.12,
        selectedOpacity: 0.18,
        disabledOpacity: 0.4,
        focusOpacity: 0.24,
        activatedOpacity: 0.16,
    },
};

const minimalShadows = [
    'none',
    '0px 2px 1px -1px rgba(145, 158, 171, 0.2),0px 1px 1px 0px rgba(145, 158, 171, 0.14),0px 1px 3px 0px rgba(145, 158, 171, 0.12)',
    '0px 3px 1px -2px rgba(145, 158, 171, 0.2),0px 2px 2px 0px rgba(145, 158, 171, 0.14),0px 1px 5px 0px rgba(145, 158, 171, 0.12)',
    '0px 3px 3px -2px rgba(145, 158, 171, 0.2),0px 3px 4px 0px rgba(145, 158, 171, 0.14),0px 1px 8px 0px rgba(145, 158, 171, 0.12)',
    '0px 2px 4px -1px rgba(145, 158, 171, 0.2),0px 4px 5px 0px rgba(145, 158, 171, 0.14),0px 1px 10px 0px rgba(145, 158, 171, 0.12)',
    '0px 3px 5px -1px rgba(145, 158, 171, 0.2),0px 5px 8px 0px rgba(145, 158, 171, 0.14),0px 1px 14px 0px rgba(145, 158, 171, 0.12)',
    '0px 3px 5px -1px rgba(145, 158, 171, 0.2),0px 6px 10px 0px rgba(145, 158, 171, 0.14),0px 1px 18px 0px rgba(145, 158, 171, 0.12)',
    '0px 4px 5px -2px rgba(145, 158, 171, 0.2),0px 7px 10px 1px rgba(145, 158, 171, 0.14),0px 2px 16px 1px rgba(145, 158, 171, 0.12)',
    '0px 5px 5px -3px rgba(145, 158, 171, 0.2),0px 8px 10px 1px rgba(145, 158, 171, 0.14),0px 3px 14px 2px rgba(145, 158, 171, 0.12)',
    '0px 5px 6px -3px rgba(145, 158, 171, 0.2),0px 9px 12px 1px rgba(145, 158, 171, 0.14),0px 3px 16px 2px rgba(145, 158, 171, 0.12)',
    '0px 6px 6px -3px rgba(145, 158, 171, 0.2),0px 10px 14px 1px rgba(145, 158, 171, 0.14),0px 4px 18px 3px rgba(145, 158, 171, 0.12)',
    '0px 6px 7px -4px rgba(145, 158, 171, 0.2),0px 11px 15px 1px rgba(145, 158, 171, 0.14),0px 4px 20px 3px rgba(145, 158, 171, 0.12)',
    '0px 7px 8px -4px rgba(145, 158, 171, 0.2),0px 12px 17px 2px rgba(145, 158, 171, 0.14),0px 5px 22px 4px rgba(145, 158, 171, 0.12)',
    '0px 7px 8px -4px rgba(145, 158, 171, 0.2),0px 13px 19px 2px rgba(145, 158, 171, 0.14),0px 5px 24px 4px rgba(145, 158, 171, 0.12)',
    '0px 7px 9px -4px rgba(145, 158, 171, 0.2),0px 14px 21px 2px rgba(145, 158, 171, 0.14),0px 5px 26px 4px rgba(145, 158, 171, 0.12)',
    '0px 8px 9px -5px rgba(145, 158, 171, 0.2),0px 15px 22px 2px rgba(145, 158, 171, 0.14),0px 6px 28px 5px rgba(145, 158, 171, 0.12)',
    '0px 8px 10px -5px rgba(145, 158, 171, 0.2),0px 16px 24px 2px rgba(145, 158, 171, 0.14),0px 6px 30px 5px rgba(145, 158, 171, 0.12)',
    '0px 8px 11px -5px rgba(145, 158, 171, 0.2),0px 17px 26px 2px rgba(145, 158, 171, 0.14),0px 6px 32px 5px rgba(145, 158, 171, 0.12)',
    '0px 9px 11px -5px rgba(145, 158, 171, 0.2),0px 18px 28px 2px rgba(145, 158, 171, 0.14),0px 7px 34px 6px rgba(145, 158, 171, 0.12)',
    '0px 9px 12px -6px rgba(145, 158, 171, 0.2),0px 19px 29px 2px rgba(145, 158, 171, 0.14),0px 7px 36px 6px rgba(145, 158, 171, 0.12)',
    '0px 10px 13px -6px rgba(145, 158, 171, 0.2),0px 20px 31px 3px rgba(145, 158, 171, 0.14),0px 8px 38px 7px rgba(145, 158, 171, 0.12)',
    '0px 10px 13px -6px rgba(145, 158, 171, 0.2),0px 21px 33px 3px rgba(145, 158, 171, 0.14),0px 8px 40px 7px rgba(145, 158, 171, 0.12)',
    '0px 10px 14px -6px rgba(145, 158, 171, 0.2),0px 22px 35px 3px rgba(145, 158, 171, 0.14),0px 8px 42px 7px rgba(145, 158, 171, 0.12)',
    '0px 11px 14px -7px rgba(145, 158, 171, 0.2),0px 23px 36px 3px rgba(145, 158, 171, 0.14),0px 9px 44px 8px rgba(145, 158, 171, 0.12)',
    '0px 11px 15px -7px rgba(145, 158, 171, 0.2),0px 24px 38px 3px rgba(145, 158, 171, 0.14),0px 9px 46px 8px rgba(145, 158, 171, 0.12)',
];

const minimalCustomShadows = {
    z1: '0 1px 2px 0 rgba(145, 158, 171, 0.16)',
    z4: '0 4px 8px 0 rgba(145, 158, 171, 0.16)',
    z8: '0 8px 16px 0 rgba(145, 158, 171, 0.16)',
    z12: '0 12px 24px -4px rgba(145, 158, 171, 0.16)',
    z16: '0 16px 32px -4px rgba(145, 158, 171, 0.16)',
    z20: '0 20px 40px -4px rgba(145, 158, 171, 0.16)',
    z24: '0 24px 48px 0 rgba(145, 158, 171, 0.16)',
    dialog: '-40px 40px 80px -8px rgba(0, 0, 0, 0.24)',
    card: '0 0 2px 0 rgba(145, 158, 171, 0.2),0 12px 24px -4px rgba(145, 158, 171, 0.12)',
    dropdown: '0 0 2px 0 rgba(145, 158, 171, 0.24),-20px 20px 40px -4px rgba(145, 158, 171, 0.24)',
    primary: '0 8px 16px 0 rgba(0, 167, 111, 0.24)',
    secondary: '0 8px 16px 0 rgba(142, 51, 255, 0.24)',
    info: '0 8px 16px 0 rgba(0, 184, 217, 0.24)',
    success: '0 8px 16px 0 rgba(34, 197, 94, 0.24)',
    warning: '0 8px 16px 0 rgba(255, 171, 0, 0.24)',
    error: '0 8px 16px 0 rgba(255, 86, 48, 0.24)',
};

// Definicja colorSchemes - nowe API z MUI v6+
const getColorSchemes = () => ({
    light: {
        palette: minimalLightPalette,
    },
    dark: {
        palette: minimalDarkPalette,
    },
});

// Wspólne ustawienia komponentów z CSS Variables
const getComponentOverrides = () => ({
    MuiPaper: {
        styleOverrides: {
            root: ({ theme }) => {
                const isDark = theme.palette.mode === 'dark';
                return {
                    backgroundImage: 'none',
                    borderRadius: theme.shape.borderRadius * 2,
                    border: `1px solid ${theme.vars.palette.divider}`,
                    backgroundColor: theme.vars.palette.background.paper,
                    boxShadow: isDark ? '0 24px 48px rgba(2, 6, 23, 0.55)' : theme.customShadows.card,
                    transition: theme.transitions.create(['box-shadow', 'transform'], {
                        duration: 200,
                    }),
                };
            },
        },
    },
    MuiCard: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: theme.shape.borderRadius * 2,
                boxShadow: theme.customShadows.card,
            }),
        },
    },
    MuiAppBar: {
        styleOverrides: {
            root: ({ theme }) => ({
                backgroundColor: theme.vars.palette.background.paper,
                color: theme.vars.palette.text.primary,
                boxShadow: 'none',
                borderBottom: `1px solid ${theme.vars.palette.divider}`,
            }),
        },
    },
    MuiButton: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: theme.shape.borderRadius,
                textTransform: 'none',
                fontWeight: 700,
                letterSpacing: 0,
                padding: '10px 22px',
                transition: theme.transitions.create(['box-shadow', 'transform'], {
                    duration: 150,
                }),
            }),
            contained: ({ theme }) => ({
                boxShadow: theme.customShadows.primary,
                '&:hover': {
                    boxShadow: theme.customShadows.primary,
                    transform: 'translateY(-1px)',
                },
            }),
            outlined: {
                borderWidth: 1,
                '&:hover': {
                    borderWidth: 1,
                    transform: 'translateY(-1px)',
                },
            },
            text: {
                '&:hover': {
                    backgroundColor: 'rgba(145, 158, 171, 0.08)',
                },
            },
        },
    },
    MuiChip: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: theme.shape.borderRadius,
                fontWeight: 600,
            }),
        },
    },
    MuiOutlinedInput: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: theme.shape.borderRadius,
                '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.vars.palette.divider,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.vars.palette.text.primary,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.vars.palette.primary.main,
                    borderWidth: 1.5,
                },
            }),
        },
    },
    MuiTableContainer: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: theme.shape.borderRadius * 2,
                boxShadow: theme.customShadows.card,
                border: `1px solid ${theme.vars.palette.divider}`,
            }),
        },
    },
    MuiListItemButton: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: theme.shape.borderRadius,
                '&.Mui-selected': {
                    backgroundColor: 'rgba(0, 167, 111, 0.08)',
                    color: theme.vars.palette.primary.main,
                    '& .MuiListItemIcon-root': {
                        color: theme.vars.palette.primary.main,
                    },
                },
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
                palette: mode === 'dark' ? minimalDarkPalette : minimalLightPalette,
                cssVariables: {
                    colorSchemeSelector: 'data-mui-color-scheme',
                    cssVarPrefix: 'mui',
                },
                colorSchemes: getColorSchemes(),
                typography: {
                    fontFamily: '"Public Sans Variable", "Public Sans", "Barlow", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    h1: {
                        fontFamily: '"Barlow", "Public Sans Variable", sans-serif',
                        fontWeight: 800,
                        fontSize: '2.5rem',
                        lineHeight: 1.25,
                        letterSpacing: 0,
                    },
                    h2: {
                        fontFamily: '"Barlow", "Public Sans Variable", sans-serif',
                        fontWeight: 800,
                        fontSize: '2rem',
                        lineHeight: 1.3333333333,
                        letterSpacing: 0,
                    },
                    h3: {
                        fontFamily: '"Barlow", "Public Sans Variable", sans-serif',
                        fontWeight: 700,
                        fontSize: '1.5rem',
                        lineHeight: 1.5,
                    },
                    h4: {
                        fontWeight: 700,
                        fontSize: '1.25rem',
                        lineHeight: 1.5,
                    },
                    h5: {
                        fontWeight: 700,
                        fontSize: '1.125rem',
                        lineHeight: 1.5,
                    },
                    h6: {
                        fontWeight: 600,
                        fontSize: '1.0625rem',
                        lineHeight: 1.5555555556,
                    },
                    subtitle1: {
                        fontWeight: 600,
                        fontSize: '1rem',
                        lineHeight: 1.5,
                    },
                    subtitle2: {
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        lineHeight: 1.5714285714,
                    },
                    body1: {
                        fontWeight: 400,
                        fontSize: '1rem',
                        lineHeight: 1.5,
                    },
                    body2: {
                        fontWeight: 400,
                        fontSize: '0.875rem',
                        lineHeight: 1.5714285714,
                    },
                    caption: {
                        fontWeight: 400,
                        fontSize: '0.75rem',
                        lineHeight: 1.5,
                    },
                    overline: {
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        lineHeight: 1.5,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                    },
                    button: {
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        lineHeight: 1.7142857143,
                        textTransform: 'none',
                    },
                },
                spacing: 8,
                shape: {
                    borderRadius: 8,
                },
                shadows: minimalShadows,
                customShadows: minimalCustomShadows,
                components: getComponentOverrides(),
            }),
        [mode]
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