import React from 'react';
import { TableRow, TableCell } from '@mui/material';
import { TableCellRenderer } from './TableCellRenderer';
import { getCellStyle } from '../../helpers/cellStyling.helper';
import { generateRowKey, generateCellKey } from '../../helpers/dataFormatting.helper';
import { useTheme } from '@mui/material';

/**
 * Komponent pojedynczego wiersza tabeli
 */
export const TableDataRow = ({ row, index, headers, onRowClick }) => {
    const theme = useTheme();
    const uniqueKey = generateRowKey(row, index);

    const handleRowClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log('🖱️ TableDataRow - Kliknięto wiersz (przed onRowClick):', row.StoreId);
        onRowClick(row);
    };

    return (
        <TableRow 
            key={uniqueKey}
            hover
            onClick={handleRowClick}
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
                    key={generateCellKey(header, headerIndex)}
                    sx={{
                        ...getCellStyle(header, row[header], theme),
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
                    <TableCellRenderer 
                        header={header} 
                        value={row[header]} 
                    />
                </TableCell>
            ))}
        </TableRow>
    );
};