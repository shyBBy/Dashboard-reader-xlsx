import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableContainer,
    TablePagination,
    Typography
} from '@mui/material';
import { useTableLogic } from '../../hooks/useTableLogic.hook';
import { TableHeaderRow } from '../Table/TableHeaderRow';
import { TableDataRow } from '../Table/TableDataRow';

/**
 * Zrefaktorowany komponent tabeli danych - teraz znacznie krótszy i czytelniejszy!
 */
export const DynamicDataTable = ({ data, headers, filteredData }) => {
    const navigate = useNavigate();
    
    // Cała logika tabeli przeniesiona do custom hooka
    const {
        page,
        rowsPerPage,
        orderBy,
        order,
        dataToDisplay,
        paginatedData,
        handleRequestSort,
        handleChangePage,
        handleChangeRowsPerPage
    } = useTableLogic(data, filteredData);

    // Obsługa kliknięcia w wiersz - nawigacja do widoku pojedynczego sklepu
    const handleRowClick = (row) => {
        try {
            const storeId = row.StoreId;
            console.log('🖱️ [NAVIGATE] DynamicDataTable - handleRowClick START:', { row, storeId });
            console.log('�️ [NAVIGATE] StoreId details:', {
                value: storeId,
                type: typeof storeId,
                asString: String(storeId),
                asNumber: Number(storeId)
            });
            console.log('�📊 [NAVIGATE] Aktualny stan danych:', { 
                hasData: !!dataToDisplay?.length, 
                dataLength: dataToDisplay?.length,
                firstRow: dataToDisplay?.[0]
            });
            
            if (storeId) {
                console.log('🏪 [NAVIGATE] DynamicDataTable - Nawiguję do sklepu:', storeId);
                console.log('🔄 [NAVIGATE] DynamicDataTable - Przed navigate...');
                
                // Używamy programmatic navigation bez odświeżania strony
                navigate(`/sklep/${storeId}`, { replace: false });
                
                console.log('✅ [NAVIGATE] DynamicDataTable - Navigate wywołane');
            } else {
                console.warn('⚠️ DynamicDataTable - Brak StoreId w wierszu:', row);
            }
        } catch (error) {
            console.error('❌ DynamicDataTable - Błąd w handleRowClick:', error);
        }
    };

    // Sprawdź czy są dane do wyświetlenia
    if (!dataToDisplay || dataToDisplay.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    🔍 Brak danych do wyświetlenia
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Wgraj plik Excel lub sprawdź filtry
                </Typography>
            </Box>
        );
    }

    return (
        <Box 
            sx={{ width: '100%', mt: 2 }}
            onSubmit={(e) => e.preventDefault()}
        >
            <Paper elevation={3} sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
                <TableContainer 
                    sx={{ 
                        maxHeight: { xs: 400, sm: 600, md: 700, lg: 800, xl: 900 },
                        width: '100%',
                        transition: 'all 0.3s ease',
                        '&::-webkit-scrollbar': {
                            width: '8px',
                            height: '8px'
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: 'grey.100'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'grey.400',
                            borderRadius: '4px',
                            '&:hover': {
                                backgroundColor: 'grey.600'
                            }
                        }
                    }}
                >
                    <Table 
                        stickyHeader 
                        size="medium"
                        sx={{
                            '& th, & td': {
                                transition: 'all 0.2s ease'
                            }
                        }}
                    >
                        {/* Nagłówek tabeli - wydzielony do osobnego komponentu */}
                        <TableHeaderRow 
                            headers={headers}
                            orderBy={orderBy}
                            order={order}
                            onRequestSort={handleRequestSort}
                        />
                        
                        {/* Ciało tabeli */}
                        <TableBody>
                            {paginatedData.map((row, index) => (
                                <TableDataRow
                                    key={`row-${page * rowsPerPage + index}`}
                                    row={row}
                                    index={page * rowsPerPage + index}
                                    headers={headers}
                                    onRowClick={handleRowClick}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                
                {/* Paginacja */}
                <TablePagination
                    rowsPerPageOptions={[25, 50, 100, 200]}
                    component="div"
                    count={dataToDisplay.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Wierszy na stronę:"
                    labelDisplayedRows={({ from, to, count }) => 
                        `${from}-${to} z ${count !== -1 ? count : `więcej niż ${to}`}`
                    }
                    sx={{
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        backgroundColor: 'background.paper',
                        color: 'text.primary',
                        '& .MuiTablePagination-toolbar': {
                            paddingLeft: 2,
                            paddingRight: 2,
                            backgroundColor: 'background.paper'
                        },
                        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                            fontSize: '0.9rem',
                            fontWeight: 'medium',
                            color: 'text.primary'
                        }
                    }}
                />
            </Paper>
        </Box>
    );
};