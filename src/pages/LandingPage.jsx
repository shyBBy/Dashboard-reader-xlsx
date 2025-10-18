import React from 'react';
import { 
    Box, 
    Container,
    Typography, 
    Button,
    Stack,
    Avatar,
    useTheme,
    Divider
} from '@mui/material';
import { 
    Dashboard,
    Upload,
    Info,
    Analytics
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const theme = useTheme();
    const currentYear = new Date().getFullYear();

    return (
        <Box sx={{ 
            minHeight: '100vh',
            backgroundColor: 'background.default',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Hero Section z buttonami */}
            <Container maxWidth="xl" sx={{ py: 6, flex: 1 }}>
                <Box sx={{ 
                    textAlign: 'center', 
                    mb: 8,
                    background: `linear-gradient(145deg, ${theme.vars.palette.primary.main}08 0%, ${theme.vars.palette.primary.main}15 100%)`,
                    borderRadius: 4,
                    p: 6,
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <Box sx={{
                        position: 'absolute',
                        top: -50,
                        right: -50,
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        background: `linear-gradient(45deg, ${theme.vars.palette.primary.main}10, ${theme.vars.palette.secondary.main}10)`,
                        opacity: 0.5
                    }} />
                    
                    <Avatar
                        sx={{
                            bgcolor: 'primary.main',
                            width: 120,
                            height: 120,
                            mx: 'auto',
                            mb: 3,
                            boxShadow: `0 20px 40px ${theme.vars.palette.primary.main}40`
                        }}
                    >
                        <Dashboard sx={{ fontSize: 60 }} />
                    </Avatar>
                    
                    <Typography variant="h2" component="h1" gutterBottom fontWeight="bold" color="primary.main">
                        Dashboard Analiz Blokerów
                    </Typography>
                    <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
                        Zaawansowany system analizy i rekomendacji dla problemów magazynowych
                    </Typography>
                    
                    <Stack 
                        direction={{ xs: 'column', sm: 'row' }} 
                        spacing={2} 
                        justifyContent="center"
                        sx={{ mb: 2 }}
                    >
                        <Button
                            component={Link}
                            to="/dashboard"
                            variant="contained"
                            size="large"
                            startIcon={<Dashboard />}
                            sx={{ 
                                px: 6, 
                                py: 2,
                                fontSize: '1.1rem',
                                borderRadius: 3,
                                boxShadow: `0 8px 20px ${theme.vars.palette.primary.main}40`,
                                '&:hover': {
                                    boxShadow: `0 12px 24px ${theme.vars.palette.primary.main}50`
                                }
                            }}
                        >
                            Przejdź do Dashboard
                        </Button>
                        
                        <Button
                            component={Link}
                            to="/api-test"
                            variant="contained"
                            color="secondary"
                            size="large"
                            startIcon={<Analytics />}
                            sx={{ 
                                px: 4, 
                                py: 2, 
                                fontSize: '1.1rem', 
                                borderRadius: 3,
                                boxShadow: `0 8px 20px ${theme.vars.palette.secondary.main}40`,
                                '&:hover': {
                                    boxShadow: `0 12px 24px ${theme.vars.palette.secondary.main}50`
                                }
                            }}
                        >
                            Test API
                        </Button>
                        
                        <Button
                            component={Link}
                            to="/info"
                            variant="outlined"
                            size="large"
                            startIcon={<Info />}
                            sx={{ px: 4, py: 2, fontSize: '1.1rem', borderRadius: 3 }}
                        >
                            Dowiedz się więcej o blokerze DZZWD
                        </Button>
                    </Stack>
                </Box>


            </Container>

            {/* Footer z Copyright */}
            <Box sx={{ 
                mt: 'auto',
                py: 3,
                backgroundColor: 'background.paper',
                borderTop: `1px solid ${theme.vars.palette.divider}`
            }}>
                <Container maxWidth="xl">
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <Avatar
                            sx={{
                                bgcolor: 'primary.main',
                                width: 32,
                                height: 32
                            }}
                        >
                            <Dashboard sx={{ fontSize: 20 }} />
                        </Avatar>
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                            © {currentYear} Dashboard Analiz Blokerów DZZWD. 
                            Wszystkie prawa zastrzeżone.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default LandingPage;