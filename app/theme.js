import { createTheme } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/asap';
import '@fontsource/bebas-neue';

const theme = createTheme({
    palette: {
        mode: 'dark', // Zmieniamy na dark mode jak w starej app
        primary: {
            main: '#EC3656FF',
        },
        secondary: {
            main: '#9c9c9c',
        },
        background: {
            default: '#171717FF',
            paper: '#242424FF',
        },
        text: {
            primary: '#BABABAFF',
            secondary: '#BABABAFF',
            disabled: 'rgba(86,86,86,0.55)',
        },
        divider: '#191923',
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
    },
});

export default theme;
export { theme };