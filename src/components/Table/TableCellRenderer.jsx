import React from 'react';
import { Typography, Tooltip, Chip, useTheme } from '@mui/material';
import { Info, Warning, CheckCircle, Error } from '@mui/icons-material';
import { formatDisplayValue, isLongText, truncateText, isDateField, formatDate, isPercentageField, formatPercentage } from '../../helpers/dataFormatting.helper';

/**
 * Komponent do renderowania wartości komórki tabeli
 */
export const TableCellRenderer = ({ header, value }) => {
    const theme = useTheme();

    // Specjalne renderowanie dla różnych kolumn
    switch (header) {
        case 'StoreId':
            return (
                <Typography variant="body2" sx={{ 
                    fontWeight: 'bold', 
                    fontSize: '0.95rem',
                    color: theme.vars.palette.primary.main
                }}>
                    {formatDisplayValue(value)}
                </Typography>
            );

        case 'BlockerName':
            return (
                <Typography variant="body2" sx={{ 
                    fontWeight: 'medium', 
                    fontSize: '0.9rem',
                    color: theme.vars.palette.secondary.main
                }}>
                    {formatDisplayValue(value)}
                </Typography>
            );

        case 'Wplyw':
            return (
                <Chip 
                    label={value || '-'}
                    size="small"
                    variant="outlined"
                    icon={<Warning fontSize="small" />}
                    sx={{ fontSize: '0.75rem', minWidth: 80 }}
                />
            );

        case 'Decyzja':
            return (
                <Chip 
                    label={value || '-'}
                    size="small"
                    variant="filled"
                    icon={<CheckCircle fontSize="small" />}
                    sx={{ fontSize: '0.75rem', minWidth: 100 }}
                />
            );

        case 'DOSTEPNOSC_DROGERIA':
            return (
                <Chip 
                    label={value || '-'}
                    size="small"
                    variant="outlined"
                    icon={<Info fontSize="small" />}
                    sx={{ fontSize: '0.75rem', minWidth: 70 }}
                />
            );

        case 'Trend_analiza':
            return (
                <Chip 
                    label={value || '-'}
                    size="small"
                    variant="filled"
                    icon={<Error fontSize="small" />}
                    sx={{ fontSize: '0.75rem', minWidth: 90 }}
                />
            );

        default:
            // Sprawdź czy to pole daty
            if (isDateField(header)) {
                return (
                    <Typography variant="body2" sx={{ 
                        fontWeight: 'medium',
                        fontSize: '0.9rem',
                        color: theme.vars.palette.secondary.main
                    }}>
                        {formatDate(value)}
                    </Typography>
                );
            }

            // Długie teksty - skróć i dodaj tooltip
            if (isLongText(value)) {
                return (
                    <Tooltip title={value} arrow placement="top">
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                cursor: 'help',
                                fontSize: '0.85rem',
                                lineHeight: 1.3,
                                color: theme.palette.text.primary
                            }}
                        >
                            {truncateText(value, 35)}
                        </Typography>
                    </Tooltip>
                );
            }

            // Wartości liczbowe
            if (typeof value === 'number' || (typeof value === 'string' && !isNaN(parseFloat(value)))) {
                return (
                    <Typography variant="body2" sx={{ 
                        fontWeight: 'medium',
                        fontSize: '0.9rem',
                        textAlign: 'right',
                        color: theme.palette.text.primary
                    }}>
                        {formatDisplayValue(value, header)}
                    </Typography>
                );
            }

            // Domyślne renderowanie
            return (
                <Typography variant="body2" sx={{ 
                    fontSize: '0.85rem',
                    color: theme.palette.text.primary
                }}>
                    {formatDisplayValue(value, header)}
                </Typography>
            );
    }
};