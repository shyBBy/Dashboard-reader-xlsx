import React from 'react';
import { 
    Container, 
    Typography, 
    Box, 
    Paper, 
    Stack 
} from '@mui/material';
import { Dashboard, BarChart, PieChart, ShowChart } from '@mui/icons-material';
import { SampleCharts } from '../components/Charts/SampleCharts';

export const MainView = () => {
    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #171717FF 0%, #242424FF 50%, #171717FF 100%)',
            py: 4
        }}>
            <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                {/* Header */}
                <Box sx={{ 
                    textAlign: 'center', 
                    mb: { xs: 4, sm: 6, md: 8 },
                    px: { xs: 1, sm: 2 }
                }}>
                    <Dashboard sx={{ 
                        fontSize: { xs: 48, sm: 56, md: 64 }, 
                        color: 'primary.main', 
                        mb: 2 
                    }} />
                    <Typography 
                        variant="h1" 
                        component="h1" 
                        gutterBottom
                        sx={{
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                            fontWeight: 'bold',
                            mb: 2
                        }}
                    >
                        Dashboard Reader XLSX
                    </Typography>
                    <Typography 
                        variant="subtitle1" 
                        color="text.secondary"
                        sx={{
                            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                            maxWidth: 600,
                            mx: 'auto'
                        }}
                    >
                        Aplikacja do analizy plików Excel i generowania dashboardów
                    </Typography>
                </Box>

            {/* Content Cards */}
            <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 2, sm: 3, md: 4 }}
                    sx={{
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'stretch'
                    }}
                >
                    {/* Card 1 - Bar Charts */}
                    <Paper 
                        elevation={8} 
                        sx={{ 
                            p: { xs: 3, sm: 4 },
                            textAlign: 'center',
                            minHeight: { xs: 200, sm: 220, md: 240 },
                            minWidth: { xs: '100%', sm: 280, md: 320 },
                            maxWidth: { xs: '100%', sm: 350 },
                            flex: { sm: '1 1 280px' },
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            backgroundColor: 'background.paper',
                            border: '1px solid rgba(236, 54, 86, 0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                border: '1px solid rgba(236, 54, 86, 0.3)',
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 25px rgba(236, 54, 86, 0.15)'
                            }
                        }}
                    >
                        <BarChart sx={{ 
                            fontSize: { xs: 40, sm: 48, md: 56 }, 
                            color: 'primary.main', 
                            mb: 2 
                        }} />
                        <Typography 
                            variant="h6" 
                            gutterBottom
                            sx={{ 
                                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                                fontWeight: 600
                            }}
                        >
                            Wykresy słupkowe
                        </Typography>
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                lineHeight: 1.5,
                                px: 1
                            }}
                        >
                            Generuj wykresy słupkowe na podstawie danych z Excel
                        </Typography>
                    </Paper>

                    {/* Card 2 - Pie Charts */}
                    <Paper 
                        elevation={8} 
                        sx={{ 
                            p: { xs: 3, sm: 4 },
                            textAlign: 'center',
                            minHeight: { xs: 200, sm: 220, md: 240 },
                            minWidth: { xs: '100%', sm: 280, md: 320 },
                            maxWidth: { xs: '100%', sm: 350 },
                            flex: { sm: '1 1 280px' },
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            backgroundColor: 'background.paper',
                            border: '1px solid rgba(236, 54, 86, 0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                border: '1px solid rgba(236, 54, 86, 0.3)',
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 25px rgba(236, 54, 86, 0.15)'
                            }
                        }}
                    >
                        <PieChart sx={{ 
                            fontSize: { xs: 40, sm: 48, md: 56 }, 
                            color: 'primary.main', 
                            mb: 2 
                        }} />
                        <Typography 
                            variant="h6" 
                            gutterBottom
                            sx={{ 
                                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                                fontWeight: 600
                            }}
                        >
                            Wykresy kołowe
                        </Typography>
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                lineHeight: 1.5,
                                px: 1
                            }}
                        >
                            Twórz wykresy kołowe dla lepszej wizualizacji
                        </Typography>
                    </Paper>

                    {/* Card 3 - Analytics */}
                    <Paper 
                        elevation={8} 
                        sx={{ 
                            p: { xs: 3, sm: 4 },
                            textAlign: 'center',
                            minHeight: { xs: 200, sm: 220, md: 240 },
                            minWidth: { xs: '100%', sm: 280, md: 320 },
                            maxWidth: { xs: '100%', sm: 350 },
                            flex: { sm: '1 1 280px' },
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            backgroundColor: 'background.paper',
                            border: '1px solid rgba(236, 54, 86, 0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                border: '1px solid rgba(236, 54, 86, 0.3)',
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 25px rgba(236, 54, 86, 0.15)'
                            }
                        }}
                    >
                        <ShowChart sx={{ 
                            fontSize: { xs: 40, sm: 48, md: 56 }, 
                            color: 'primary.main', 
                            mb: 2 
                        }} />
                        <Typography 
                            variant="h6" 
                            gutterBottom
                            sx={{ 
                                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                                fontWeight: 600
                            }}
                        >
                            Analizy trendów
                        </Typography>
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                lineHeight: 1.5,
                                px: 1
                            }}
                        >
                            Analizuj trendy i wzorce w danych
                        </Typography>
                    </Paper>
                </Stack>
            </Box>

            {/* Sample Charts Section */}
            <Box sx={{ mt: { xs: 4, sm: 6, md: 8 } }}>
                <Typography 
                    variant="h4" 
                    component="h2" 
                    gutterBottom
                    sx={{
                        textAlign: 'center',
                        color: 'primary.main',
                        fontWeight: 'bold',
                        mb: 4
                    }}
                >
                    Przykładowe wykresy MUI X Charts
                </Typography>
                <SampleCharts />
            </Box>

                {/* Footer info */}
                <Box sx={{ 
                    mt: { xs: 4, sm: 6, md: 8 }, 
                    textAlign: 'center',
                    px: { xs: 1, sm: 2 }
                }}>
                    <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                        Wersja 1.0.0 • Zbudowane z React + Material-UI + MUI X Charts
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};