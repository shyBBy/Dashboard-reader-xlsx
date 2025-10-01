import React from 'react';
import { useNavigate } from 'react-router';
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
        const storeId = row.StoreId;
        if (storeId) {
            console.log('🏪 Przechodzę do sklepu:', storeId);
            navigate(`/sklep/${storeId}`);
        } else {
            console.warn('⚠️ Brak StoreId w wierszu:', row);
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
        <Box sx={{ width: '100%', mt: 2 }}>
            <Paper elevation={3} sx={{ width: '100%', mb: 2 }}>
                <TableContainer 
                    sx={{ 
                        maxHeight: 600, 
                        '&::-webkit-scrollbar': {
                            width: '8px',
                            height: '8px'
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: '#f1f1f1'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#888',
                            borderRadius: '4px'
                        }
                    }}
                >
                    <Table stickyHeader size="medium">
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
                        backgroundColor: 'grey.50'
                    }}
                />
            </Paper>
        </Box>
    );
};