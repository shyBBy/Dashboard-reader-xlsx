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
                        sx={(theme) => ({
                            fontWeight: 'bold',
                            fontSize: '0.95rem',
                            backgroundColor: theme.palette.mode === 'dark' 
                                ? theme.palette.grey[400]
                                : theme.palette.primary.main,
                            color: theme.palette.mode === 'dark' 
                                ? theme.palette.text.primary
                                : theme.palette.common.white,
                            minWidth: 140,
                            padding: '16px 12px',
                            borderRight: theme.palette.mode === 'dark'
                                ? `1px solid ${theme.palette.divider}`
                                : '1px solid rgba(255,255,255,0.2)',
                            position: 'sticky',
                            top: 0,
                            zIndex: 10,
                            boxShadow: theme.palette.mode === 'dark'
                                ? '0 2px 8px rgba(0,0,0,0.45)'
                                : '0 2px 4px rgba(0,0,0,0.1)'
                        })}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TableSortLabel
                                active={orderBy === header}
                                direction={orderBy === header ? order : 'asc'}
                                onClick={() => onRequestSort(header)}
                                sx={(theme) => ({
                                    color: theme.palette.mode === 'dark'
                                        ? `${theme.palette.text.primary} !important`
                                        : 'white !important',
                                    '& .MuiTableSortLabel-icon': {
                                        color: theme.palette.mode === 'dark'
                                            ? `${theme.palette.text.primary} !important`
                                            : 'white !important',
                                        opacity: orderBy === header ? 1 : 0.5
                                    },
                                    '&:hover': {
                                        color: theme.palette.mode === 'dark'
                                            ? `${theme.palette.text.secondary} !important`
                                            : 'rgba(255,255,255,0.8) !important'
                                    },
                                    fontSize: '0.95rem',
                                    fontWeight: 'bold'
                                })}
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