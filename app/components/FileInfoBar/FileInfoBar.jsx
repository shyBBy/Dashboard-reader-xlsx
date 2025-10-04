import React, { useState, useEffect } from 'react';
import { 
    Box,
    Typography,
    IconButton,
    Chip,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    useTheme
} from '@mui/material';
import {
    Description,
    Delete,
    Refresh,
    Schedule,
    CheckCircle
} from '@mui/icons-material';
import { useExcelData } from '../../context/ExcelDataContext';
import { useNavigate } from 'react-router';

export const FileInfoBar = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { 
        hasData, 
        fileName, 
        loadedAt, 
        totalRows, 
        clearData, 
        sessionTimeRemaining,
        isSessionExpired 
    } = useExcelData();
    
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState(sessionTimeRemaining);

    // Aktualizuj pozostały czas co sekundę
    useEffect(() => {
        if (!hasData) return;

        const interval = setInterval(() => {
            setTimeLeft(sessionTimeRemaining);
        }, 1000);

        return () => clearInterval(interval);
    }, [hasData, sessionTimeRemaining]);

    // Jeśli nie ma danych, nie pokazuj paska
    if (!hasData) {
        return null;
    }

    const handleClearData = () => {
        clearData();
        setConfirmDialogOpen(false);
        navigate('/upload');
    };

    const handleRefreshData = () => {
        navigate('/upload');
    };

    const formatTimeRemaining = (ms) => {
        if (ms <= 0) return '0m';
        const minutes = Math.floor(ms / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        return minutes > 0 ? `${minutes}m` : `${seconds}s`;
    };

    const formatLoadedTime = (timestamp) => {
        if (!timestamp) return '';
        return new Date(timestamp).toLocaleString('pl-PL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            {/* Mobilna wersja - tylko ikona z tooltipem */}
            <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
                <Tooltip 
                    title={
                        <Box>
                            <Typography variant="caption" component="div" sx={{ fontWeight: 600 }}>
                                {fileName}
                            </Typography>
                            <Typography variant="caption" component="div">
                                {formatLoadedTime(loadedAt)} • {totalRows.toLocaleString()} wierszy
                            </Typography>
                            <Typography variant="caption" component="div">
                                Pozostało: {formatTimeRemaining(timeLeft)}
                            </Typography>
                        </Box>
                    }
                    arrow
                >
                    <IconButton 
                        size="small"
                        sx={{
                            color: theme.palette.primary.main,
                            backgroundColor: `${theme.palette.primary.main}15`,
                            '&:hover': {
                                backgroundColor: `${theme.palette.primary.main}25`
                            }
                        }}
                    >
                        <Description fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Desktopowa wersja */}
            <Box sx={{
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                gap: { sm: 1, md: 2 },
                px: { sm: 1, md: 2 },
                py: 1,
                backgroundColor: `${theme.palette.background.paper}80`,
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: `0 2px 8px ${theme.palette.primary.main}10`,
                maxWidth: { sm: '300px', md: '400px', lg: '500px' }
            }}>
                {/* Ikona pliku */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: theme.palette.primary.main
                }}>
                    <Description fontSize="small" />
                </Box>

                {/* Informacje o pliku */}
                <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <Typography 
                        variant="body2" 
                        component="div"
                        sx={{ 
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            color: theme.palette.text.primary,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: { sm: '120px', md: '180px', lg: '200px' }
                        }}
                    >
                        {fileName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                color: theme.palette.text.secondary,
                                fontSize: '0.7rem'
                            }}
                        >
                            {formatLoadedTime(loadedAt)} • {totalRows.toLocaleString()} wierszy
                        </Typography>
                    </Box>
                </Box>

                {/* Status sesji */}
                <Tooltip 
                    title={
                        <Box>
                            <Typography variant="body2" component="div">
                                Sesja wygaśnie za {formatTimeRemaining(timeLeft)}
                            </Typography>
                            <Typography variant="caption" component="div" sx={{ mt: 0.5, opacity: 0.8 }}>
                                ⚠️ Dane nie są zapisywane - po odświeżeniu F5 trzeba ponownie wczytać plik
                            </Typography>
                        </Box>
                    }
                >
                    <Chip
                        icon={isSessionExpired ? <Schedule /> : <CheckCircle />}
                        label={formatTimeRemaining(timeLeft)}
                        size="small"
                        variant="outlined"
                        sx={{
                            fontSize: '0.7rem',
                            height: '24px',
                            borderColor: isSessionExpired ? theme.palette.error.main : 
                                        timeLeft < 10 * 60 * 1000 ? theme.palette.warning.main : // < 10min
                                        theme.palette.success.main,
                            color: isSessionExpired ? theme.palette.error.main :
                                   timeLeft < 10 * 60 * 1000 ? theme.palette.warning.main :
                                   theme.palette.success.main,
                            '& .MuiChip-icon': {
                                fontSize: '0.9rem'
                            }
                        }}
                    />
                </Tooltip>

                {/* Przyciski akcji */}
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Odśwież dane">
                        <IconButton 
                            size="small" 
                            onClick={handleRefreshData}
                            sx={{
                                color: theme.palette.primary.main,
                                '&:hover': {
                                    backgroundColor: `${theme.palette.primary.main}20`
                                }
                            }}
                        >
                            <Refresh fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Wyczyść dane">
                        <IconButton 
                            size="small" 
                            onClick={() => setConfirmDialogOpen(true)}
                            sx={{
                                color: theme.palette.error.main,
                                '&:hover': {
                                    backgroundColor: `${theme.palette.error.main}20`
                                }
                            }}
                        >
                            <Delete fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Dialog potwierdzenia */}
            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: theme.palette.background.paper,
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${theme.palette.divider}`
                    }
                }}
            >
                <DialogTitle>
                    <Typography variant="h6" component="div">
                        🗑️ Wyczyść dane
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Czy na pewno chcesz wyczyścić wczytane dane?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Plik: <strong>{fileName}</strong><br/>
                        Wczytano: {formatLoadedTime(loadedAt)}<br/>
                        Wierszy: {totalRows.toLocaleString()}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setConfirmDialogOpen(false)}
                        sx={{ color: theme.palette.text.secondary }}
                    >
                        Anuluj
                    </Button>
                    <Button 
                        onClick={handleClearData} 
                        variant="contained"
                        color="error"
                        startIcon={<Delete />}
                    >
                        Wyczyść dane
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};