import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Typography,
    Chip,
    Tooltip,
    IconButton,
    TableSortLabel,
    useTheme
} from '@mui/material';
import { Info, Warning, CheckCircle, Error } from '@mui/icons-material';

export const DynamicDataTable = ({ data, headers, filteredData }) => {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [orderBy, setOrderBy] = useState('');
    const [order, setOrder] = useState('asc');

    // NAPRAWIONE: Używaj filteredData jeśli istnieje, w przeciwnym razie data
    const dataToDisplay = filteredData !== undefined ? filteredData : (data || []);
    
    // Debug tylko przy zmianach danych
    useEffect(() => {
        console.log('🔄 TABELA OTRZYMAŁA:', {
            originalDataLength: data?.length || 0,
            filteredDataLength: filteredData?.length || 0,
            filteredDataType: typeof filteredData,
            filteredDataIsArray: Array.isArray(filteredData),
            displayingLength: dataToDisplay.length,
            displayingFirstRow: dataToDisplay[0]?.StoreId || 'BRAK'
        });
    }, [data?.length, filteredData?.length, dataToDisplay.length]); // Tylko przy zmianach długości danych

    // Reset strony do 0 gdy zmienią się dane (jak w Twojej starej aplikacji)
    useEffect(() => {
        setPage(0);
    }, [filteredData]);

    // Funkcja do sortowania
    const sortedData = useMemo(() => {
        if (!orderBy) return dataToDisplay;

        return [...dataToDisplay].sort((a, b) => {
            const aVal = a[orderBy];
            const bVal = b[orderBy];
            
            // Obsługa liczb
            const aNum = parseFloat(aVal);
            const bNum = parseFloat(bVal);
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return order === 'asc' ? aNum - bNum : bNum - aNum;
            }
            
            // Obsługa stringów
            const aStr = String(aVal || '').toLowerCase();
            const bStr = String(bVal || '').toLowerCase();
            
            if (order === 'asc') {
                return aStr.localeCompare(bStr);
            } else {
                return bStr.localeCompare(aStr);
            }
        });
    }, [dataToDisplay, orderBy, order]);

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Obsługa kliknięcia w wiersz - nawigacja do widoku pojedynczego sklepu
    const handleRowClick = (row) => {
        const storeId = row.StoreId;
        if (storeId) {
            console.log('🏪 Przechodzę do sklepu:', storeId);
            navigate(`/sklep/${storeId}`);
        } else {
            console.warn('⚠️ Brak StoreId w wierszu:', row);
        }
    };

    // Funkcja do stylizowania komórek na podstawie wartości
    const getCellStyle = (header, value) => {
        const theme = useTheme();
        
        switch (header) {
            case 'Wplyw':
                if (value === 'WYSOKI') return { 
                    backgroundColor: theme.palette.error.light + '20', 
                    color: theme.palette.error.dark,
                    fontWeight: 'bold'
                };
                if (value === 'SREDNI') return { 
                    backgroundColor: theme.palette.warning.light + '20', 
                    color: theme.palette.warning.dark,
                    fontWeight: 'bold'
                };
                if (value === 'NISKI') return { 
                    backgroundColor: theme.palette.info.light + '20', 
                    color: theme.palette.info.dark,
                    fontWeight: 'bold'
                };
                if (value === 'ZEROWY') return { 
                    backgroundColor: theme.palette.success.light + '20', 
                    color: theme.palette.success.dark,
                    fontWeight: 'bold'
                };
                break;
            case 'Decyzja':
                if (value === 'REKOMENDUJ') return { 
                    backgroundColor: theme.palette.success.light + '25', 
                    color: theme.palette.success.dark,
                    fontWeight: 'bold'
                };
                if (value && value.includes('BRAK AKCJI')) return { 
                    backgroundColor: theme.palette.error.light + '25', 
                    color: theme.palette.error.dark,
                    fontWeight: 'bold'
                };
                break;
            case 'Trend_analiza':
                if (value && value.includes('NASILAJACY')) return { 
                    backgroundColor: theme.palette.error.light + '15', 
                    color: theme.palette.error.dark
                };
                if (value && value.includes('MALEJACY')) return { 
                    backgroundColor: theme.palette.success.light + '15', 
                    color: theme.palette.success.dark
                };
                break;
            case 'StoreId':
                return {
                    backgroundColor: theme.palette.primary.light + '10',
                    color: theme.palette.primary.dark,
                    fontWeight: 'bold',
                    fontSize: '0.95rem'
                };
            default:
                return {
                    color: theme.palette.text.primary
                };
        }
    };

    // Funkcja do renderowania wartości komórki
    const renderCellValue = (header, value) => {
        const theme = useTheme();
        
        // Procenty
        if (typeof value === 'string' && value.includes('%')) {
            const percentage = parseFloat(value);
            return (
                <Chip 
                    label={value} 
                    size="medium" 
                    variant="filled"
                    sx={{
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                        backgroundColor: percentage >= 95 ? theme.palette.success.main : 
                                       percentage >= 90 ? theme.palette.warning.main : 
                                       theme.palette.error.main,
                        color: 'white'
                    }}
                />
            );
        }
        
        // Daty
        if (header && (header.includes('DATE') || header.includes('zam'))) {
            const formattedDate = value ? new Date(value).toLocaleDateString('pl-PL') : '-';
            return (
                <Typography variant="body2" sx={{ fontWeight: 'medium', color: theme.palette.text.primary }}>
                    {formattedDate}
                </Typography>
            );
        }
        
        // StoreId - wyróżnij
        if (header === 'StoreId') {
            return (
                <Typography variant="body2" sx={{ 
                    fontWeight: 'bold', 
                    fontSize: '0.95rem',
                    color: theme.palette.primary.main
                }}>
                    {value || '-'}
                </Typography>
            );
        }
        
        // BlockerName - wyróżnij
        if (header === 'BlockerName') {
            return (
                <Typography variant="body2" sx={{ 
                    fontWeight: 'medium', 
                    fontSize: '0.9rem',
                    color: theme.palette.secondary.main
                }}>
                    {value || '-'}
                </Typography>
            );
        }
        
        // Długie teksty - skróć i dodaj tooltip
        if (typeof value === 'string' && value.length > 40) {
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
                        {value.substring(0, 35)}...
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
                    {value || '-'}
                </Typography>
            );
        }
        
        // Pozostałe wartości
        return (
            <Typography variant="body2" sx={{ 
                fontSize: '0.85rem',
                color: theme.palette.text.primary
            }}>
                {value || '-'}
            </Typography>
        );
    };

    // Funkcja do renderowania ikony w nagłówku
    const getHeaderIcon = (header) => {
        if (header === 'Wplyw') return <Warning fontSize="small" />;
        if (header === 'Decyzja') return <CheckCircle fontSize="small" />;
        if (header === 'DOSTEPNOSC_DROGERIA') return <Info fontSize="small" />;
        if (header === 'Trend_analiza') return <Error fontSize="small" />;
        return null;
    };

    if (!data || data.length === 0) {
        return (
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    Brak danych do wyświetlenia
                </Typography>
            </Paper>
        );
    }

    return (
        <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
                📋 Tabela danych ({sortedData.length} rekordów)
            </Typography>
            
            <TableContainer 
                component={Paper} 
                elevation={4}
                sx={{ 
                    maxHeight: 800,
                    borderRadius: 2,
                    border: `1px solid`,
                    borderColor: 'divider'
                }}
            >
                <Table stickyHeader size="medium">
                    <TableHead>
                        <TableRow>
                            {headers?.map((header, index) => (
                                <TableCell 
                                    key={`header-${header || 'empty'}-${index}`}
                                    sx={{ 
                                        fontWeight: 'bold',
                                        fontSize: '0.95rem',
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                        minWidth: 140,
                                        padding: '16px 12px',
                                        borderRight: `1px solid rgba(255,255,255,0.2)`,
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 10,
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {getHeaderIcon(header)}
                                        <TableSortLabel
                                            active={orderBy === header}
                                            direction={orderBy === header ? order : 'asc'}
                                            onClick={() => handleRequestSort(header)}
                                            sx={{
                                                color: 'white !important',
                                                fontSize: '0.95rem',
                                                fontWeight: 'bold',
                                                '&:hover': { 
                                                    color: 'rgba(255,255,255,0.8) !important' 
                                                },
                                                '& .MuiTableSortLabel-icon': {
                                                    color: 'white !important'
                                                },
                                                '&.Mui-active': {
                                                    color: 'white !important'
                                                }
                                            }}
                                        >
                                            {header}
                                        </TableSortLabel>
                                    </Box>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedData.map((row, index) => {
                            // nie mamy zadnego UUID to robimy tak
                            const uniqueKey = `${row.StoreId || 'noStore'}-${row.BlockerName || 'noBlocker'}-${index}`;
                            return (
                            <TableRow 
                                key={uniqueKey}
                                hover
                                onClick={() => handleRowClick(row)}
                                sx={{ 
                                    '&:nth-of-type(even)': { 
                                        backgroundColor: 'rgba(0, 0, 0, 0.02)'
                                    },
                                    '&:hover': {
                                        backgroundColor: 'primary.light',
                                        transform: 'scale(1.001)',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        transition: 'all 0.2s ease'
                                    },
                                    cursor: 'pointer'
                                }}
                            >
                                {headers?.map((header, headerIndex) => (
                                    <TableCell 
                                        key={`cell-${header || 'empty'}-${headerIndex}`}
                                        sx={{
                                            ...getCellStyle(header, row[header]),
                                            fontSize: '0.9rem',
                                            padding: '12px',
                                            borderRight: `1px solid`,
                                            borderColor: 'divider',
                                            maxWidth: 250,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            lineHeight: 1.4
                                        }}
                                    >
                                        {renderCellValue(header, row[header])}
                                    </TableCell>
                                ))}
                            </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};