import { createTheme } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/asap';
import '@fontsource/bebas-neue';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#6366f1', // Indigo dla primary
            light: '#818cf8',
            dark: '#4f46e5',
        },
        secondary: {
            main: '#06b6d4', // Cyan dla secondary
            light: '#0891b2',
            dark: '#0e7490',
        },
        success: {
            main: '#10b981', // Emerald green
            light: '#34d399',
            dark: '#059669',
        },
        warning: {
            main: '#f59e0b', // Amber
            light: '#fbbf24',
            dark: '#d97706',
        },
        error: {
            main: '#ef4444', // Red
            light: '#f87171',
            dark: '#dc2626',
        },
        info: {
            main: '#3b82f6', // Blue
            light: '#60a5fa',
            dark: '#2563eb',
        },
        background: {
            default: '#0f172a', // Slate 900 - very dark blue
            paper: 'rgba(30, 41, 59, 0.8)', // Slate 800 with transparency
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
            disabled: 'rgba(255, 255, 255, 0.4)',
        },
        divider: 'rgba(99, 102, 241, 0.2)',
        // Dodajemy custom kolory dla KPI cards
        kpi: {
            cardBackground: 'rgba(30, 41, 59, 0.8)',
            cardBorder: 'rgba(99, 102, 241, 0.3)',
            cardHover: 'rgba(30, 41, 59, 0.9)',
        },
    },
    typography: {
        fontFamily: 'Asap',
        h1: {
            fontFamily: 'Bebas Neue',
        },
        fontSize: 13,
        subtitle1: {
            fontSize: 14,
            fontWeight: 300,
        },
        subtitle2: {
            fontSize: 12,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    backdropFilter: 'blur(10px)',
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    '& .MuiTableCell-root': {
                        backgroundColor: 'rgba(30, 41, 59, 0.9)',
                        color: '#ffffff',
                        fontWeight: 600,
                        borderBottom: '1px solid rgba(99, 102, 241, 0.3)',
                    },
                },
            },
        },
        MuiTableBody: {
            styleOverrides: {
                root: {
                    '& .MuiTableCell-root': {
                        backgroundColor: 'rgba(30, 41, 59, 0.4)',
                        color: '#ffffff',
                        borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
                    },
                    '& .MuiTableRow-root:hover': {
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    },
                },
            },
        },
    },
});

export default theme;
export { theme };