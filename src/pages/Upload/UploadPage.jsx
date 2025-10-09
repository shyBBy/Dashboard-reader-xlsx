import React, { useEffect } from 'react';
import { 
    Typography, 
    Box, 
    Paper, 
    Button, 
    Alert, 
    Grid, 
    Chip,
    Stack,
    Container,
    useTheme
} from '@mui/material';
import { 
    UploadFile, 
    Delete, 
    Dashboard, 
    CheckCircle, 
    Description
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { ExcelUploader } from './components/ExcelUploader/ExcelUploader';
import { useExcelData } from '../../context/ExcelDataContext';



const UploadView = () => {
    const { hasData, loadData, clearData, handleError, fileName, totalRows } = useExcelData();
    const navigate = useNavigate();
    const theme = useTheme();

    const handleDataLoaded = (data) => {
        loadData(data);
        // Automatyczne przekierowanie na dashboard po załadowaniu
        console.log('✅ Dane załadowane, przekierowuję na /dashboard');
        setTimeout(() => {
            navigate('/dashboard');
        }, 500); // Krótkie opóźnienie dla UX (user widzi sukces)
    };

    const handleClearData = () => {
        clearData();
    };

    return (
        <Container 
            maxWidth="xl" 
            sx={{ 
                py: 3,
                px: { xs: 2, sm: 3, md: 4 },
                // Bezpieczna animacja CSS tylko przy pierwszym załadowaniu
                opacity: 0,
                animation: 'fadeInUp 0.8s ease forwards',
                '@keyframes fadeInUp': {
                    '0%': {
                        opacity: 0,
                        transform: 'translateY(30px)'
                    },
                    '100%': {
                        opacity: 1,
                        transform: 'translateY(0)'
                    }
                }
            }}
        >
            {/* Hero Section - piękny gradient bez problematycznych animacji */}
            <Box 
                sx={{ 
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}10 100%)`,
                    p: 4, 
                    textAlign: 'center', 
                    mb: 4,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <UploadFile 
                    sx={{ 
                        fontSize: 48, 
                        color: 'primary.main', 
                        mb: 2
                    }} 
                />
                <Typography 
                    variant="h4" 
                    gutterBottom 
                    sx={{ 
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 1
                    }}
                >
                    Dashboard Reader XLSX
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 0 }}>
                    Profesjonalna analiza danych Excel z zaawansowanymi narzędziami
                </Typography>
            </Box>

            {/* Status obecnych danych */}
            {hasData && (
                <Alert 
                    severity="success" 
                    sx={{ 
                        mb: 4,
                        borderRadius: 2
                    }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={handleClearData}
                            startIcon={<Delete />}
                            sx={{ fontWeight: 'medium' }}
                        >
                            Usuń dane
                        </Button>
                    }
                >
                    <Stack spacing={1}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            ✅ Dane pomyślnie załadowane!
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                            <Chip 
                                label={fileName} 
                                color="success" 
                                size="small" 
                                icon={<Description />}
                            />
                            <Chip 
                                label={`${totalRows} wierszy`} 
                                color="success" 
                                size="small" 
                                variant="outlined"
                            />
                        </Box>
                    </Stack>
                </Alert>
            )}

            {/* Layout różny w zależności od stanu danych */}
            {hasData ? (
                // Layout gdy dane SĄ załadowane - MODERNISTYCZNY CZYSTY DESIGN!
                <Box 
                    sx={{ 
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '50vh'
                    }}
                >
                    {/* Profesjonalna karta sukcesu */}
                    <Paper 
                        elevation={0}
                        sx={{ 
                            p: 5,
                            textAlign: 'center',
                            borderRadius: 3,
                            maxWidth: 600,
                            width: '100%',
                            backgroundColor: 'background.paper',
                            border: `1px solid ${theme.palette.divider}`
                        }}
                    >
                        {/* Czysta ikona sukcesu - jak w modernize */}
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                            <Box 
                                sx={{ 
                                    width: 64, 
                                    height: 64, 
                                    borderRadius: '50%',
                                    backgroundColor: 'success.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: theme.shadows[8]
                                }}
                            >
                                <CheckCircle 
                                    sx={{ 
                                        fontSize: 32, 
                                        color: 'white'
                                    }} 
                                />
                            </Box>
                        </Box>

                        {/* Czysta typografia jak w modernize */}
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                fontWeight: 600,
                                color: 'text.primary',
                                mb: 2,
                                fontSize: '1.5rem'
                            }}
                        >
                            Dane zostały pomyślnie załadowane
                        </Typography>
                        
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: 'text.secondary',
                                mb: 4,
                                fontWeight: 400,
                                maxWidth: 480,
                                mx: 'auto',
                                lineHeight: 1.6
                            }}
                        >
                            Plik został przetworzony. Możesz teraz przejść do dashboardu aby zobaczyć szczegółowe analizy danych.
                        </Typography>
                        
                        {/* Buttons z nowoczesnymi efektami */}
                        <Stack 
                            direction={{ xs: 'column', sm: 'row' }} 
                            spacing={2} 
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Button
                                component={Link}
                                to="/dashboard"
                                variant="contained"
                                size="large"
                                startIcon={<Dashboard />}
                                sx={{ 
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: 500,
                                    borderRadius: 2,
                                    fontSize: '1rem',
                                    minWidth: 200,
                                    textTransform: 'none',
                                    backgroundColor: 'primary.main',
                                    boxShadow: theme.shadows[4],
                                    '&:hover': {
                                        backgroundColor: 'primary.dark',
                                        boxShadow: theme.shadows[8]
                                    }
                                }}
                            >
                                Otwórz Dashboard
                            </Button>
                            
                            <Button
                                onClick={handleClearData}
                                variant="outlined"
                                size="large"
                                startIcon={<Delete />}
                                color="error"
                                sx={{ 
                                    px: 4, 
                                    py: 1.5, 
                                    borderRadius: 2,
                                    minWidth: 160,
                                    fontWeight: 500,
                                    fontSize: '1rem',
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: 'error.main',
                                        color: 'white'
                                    }
                                }}
                            >
                                Usuń dane
                            </Button>
                        </Stack>
                    </Paper>
                </Box>
            ) : (
                // Layout gdy dane NIE SĄ załadowane - tylko uploader, minimalistycznie
                <Box 
                    sx={{ 
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '60vh'
                    }}
                >
                    <Box sx={{ width: '100%', maxWidth: 800 }}>
                        <Paper 
                            elevation={2} 
                            sx={{ 
                                p: 4, 
                                borderRadius: 2,
                                textAlign: 'center',
                                backgroundColor: 'background.paper',
                                border: `1px solid ${theme.palette.divider}`
                            }}
                        >
                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                                        Wgraj plik Excel
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                                        Przeciągnij plik lub kliknij aby rozpocząć analizę danych
                                    </Typography>
                                </Box>
                                
                                <ExcelUploader 
                                    onDataLoaded={handleDataLoaded}
                                    onError={handleError}
                                />
                            </Stack>
                        </Paper>
                    </Box>
                </Box>
            )}
        </Container>
    );
};

export const UploadPage = () => {
    return <UploadView />;
};