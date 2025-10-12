import React from 'react';
import { Box, Container, CssBaseline, Grid, Typography, Toolbar, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AppBarMobileView } from '../components/AppBarMobileView/AppBarMobileView';

export const Copyright = (props) => {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link 
                color="inherit" 
                href="https://dev-olczak.pl/" 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ 
                    textDecoration: 'none', 
                    '&:hover': { 
                        textDecoration: 'underline',
                        color: 'primary.main'
                    } 
                }}
            >
                Dawid 'shyBBy' Olczak
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
};

export const MainLayout = ({ children }) => {
    const theme = useTheme();
    
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBarMobileView />
            <Box
                component="main"
                sx={{
                    backgroundColor: theme.palette.background.default,
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />
                <Container maxWidth={false} sx={{ mt: 4, mb: 4, px: 3, width: '100%' }}>
                    <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
                        {children}
                    </Grid>
                    <Copyright sx={{ pt: 4 }} />
                </Container>
            </Box>
        </Box>
    );
};