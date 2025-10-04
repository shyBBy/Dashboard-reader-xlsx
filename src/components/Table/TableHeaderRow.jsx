import React from 'react';
import { TableHead, TableRow, TableCell, Box, TableSortLabel } from '@mui/material';
import { generateHeaderKey } from '../../helpers/dataFormatting.helper';

/**
 * Komponent nagłówka tabeli z sortowaniem
 */
export const TableHeaderRow = ({ headers, orderBy, order, onRequestSort }) => {
    return (
        <TableHead>
            <TableRow>
                {headers?.map((header, index) => (
                    <TableCell 
                        key={generateHeaderKey(header, index)}
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
                            <TableSortLabel
                                active={orderBy === header}
                                direction={orderBy === header ? order : 'asc'}
                                onClick={() => onRequestSort(header)}
                                sx={{
                                    color: 'white !important',
                                    '& .MuiTableSortLabel-icon': {
                                        color: 'white !important',
                                        opacity: orderBy === header ? 1 : 0.5
                                    },
                                    '&:hover': {
                                        color: 'rgba(255,255,255,0.8) !important'
                                    },
                                    fontSize: '0.95rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                {header}
                            </TableSortLabel>
                        </Box>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};