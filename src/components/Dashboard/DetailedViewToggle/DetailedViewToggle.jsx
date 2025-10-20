import React from 'react';
import { 
    Box, 
    FormControlLabel, 
    Switch, 
    Typography, 
    Chip,
    Paper,
    useTheme,
    Tooltip
} from '@mui/material';
import { ViewColumn, ViewWeek, Info } from '@mui/icons-material';

/**
 * Toggle do przełączania między widokiem podstawowym a szczegółowym tabeli
 */
export const DetailedViewToggle = ({ 
    detailedView, 
    onToggle, 
    columnStats 
}) => {
    const theme = useTheme();

    return (
        <Paper 
            elevation={0}
            sx={{ 
                p: 2, 
                mb: 2,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                backgroundColor: 'background.paper',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                    borderColor: theme.palette.primary.main,
                    boxShadow: theme.shadows[2]
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControlLabel
                    control={
                        <Switch 
                            checked={detailedView} 
                            onChange={(e) => onToggle(e.target.checked)}
                            color="primary"
                        />
                    }
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {detailedView ? (
                                <ViewColumn sx={{ color: 'primary.main' }} />
                            ) : (
                                <ViewWeek sx={{ color: 'text.secondary' }} />
                            )}
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                Widok szczegółowy
                            </Typography>
                        </Box>
                    }
                />
                
                <Chip 
                    label={detailedView ? 'Rozszerzone kolumny' : 'Tylko kluczowe'}
                    size="small"
                    color={detailedView ? 'primary' : 'default'}
                    variant={detailedView ? 'filled' : 'outlined'}
                    sx={{
                        transition: 'all 0.3s ease',
                        fontWeight: 600
                    }}
                />
                
                <Tooltip 
                    title={
                        detailedView 
                            ? 'Wyświetla rozszerzony zestaw kolumn dla bieżącej zakładki' 
                            : 'Wyświetla tylko kluczowe kolumny dla bieżącej zakładki'
                    }
                    arrow
                >
                    <Info sx={{ fontSize: 18, color: 'text.secondary', cursor: 'help' }} />
                </Tooltip>
            </Box>

            {columnStats && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Wyświetlane kolumny:
                    </Typography>
                    <Chip 
                        label={`${columnStats.visible} / ${columnStats.total}`}
                        size="small"
                        variant="outlined"
                        sx={{ 
                            fontWeight: 600,
                            transition: 'all 0.3s ease'
                        }}
                    />
                    {!detailedView && columnStats.hidden > 0 && (
                        <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{
                                opacity: 0,
                                animation: 'fadeIn 0.5s ease forwards',
                                '@keyframes fadeIn': {
                                    '0%': { opacity: 0 },
                                    '100%': { opacity: 1 }
                                }
                            }}
                        >
                            ({columnStats.hidden} ukrytych)
                        </Typography>
                    )}
                </Box>
            )}
        </Paper>
    );
};
