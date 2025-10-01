import { useState, useMemo, useEffect } from 'react';
import { sortData, toggleSortOrder } from '../helpers/dataSorting.helper';
import { getPaginatedData, validatePageNumber } from '../utils/pagination.utils';

/**
 * Custom hook do zarządzania stanem i logiką tabeli
 * @param {array} data - Dane do wyświetlenia w tabeli
 * @param {array} filteredData - Przefiltrowane dane (opcjonalne)
 * @param {number} initialRowsPerPage - Początkowa liczba wierszy na stronie
 * @returns {object} - Stan i funkcje do zarządzania tabelą
 */
export const useTableLogic = (data, filteredData, initialRowsPerPage = 50) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
    const [orderBy, setOrderBy] = useState('');
    const [order, setOrder] = useState('asc');

    // Wybierz dane do wyświetlenia
    const dataToDisplay = filteredData !== undefined ? filteredData : (data || []);

    // Debug informacje o danych (tylko przy zmianach)
    useEffect(() => {
        console.log('🔄 TABELA OTRZYMAŁA:', {
            originalDataLength: data?.length || 0,
            filteredDataLength: filteredData?.length || 0,
            filteredDataType: typeof filteredData,
            filteredDataIsArray: Array.isArray(filteredData),
            displayingLength: dataToDisplay.length,
            displayingFirstRow: dataToDisplay[0]?.StoreId || 'BRAK'
        });
    }, [data?.length, filteredData?.length, dataToDisplay.length]);

    // Reset strony przy zmianie danych
    useEffect(() => {
        setPage(0);
    }, [dataToDisplay.length]);

    // Posortowane dane
    const sortedData = useMemo(() => {
        return sortData(dataToDisplay, orderBy, order);
    }, [dataToDisplay, orderBy, order]);

    // Dane dla aktualnej strony
    const paginatedData = useMemo(() => {
        return getPaginatedData(sortedData, page, rowsPerPage);
    }, [sortedData, page, rowsPerPage]);

    // Funkcje do obsługi zdarzeń
    const handleRequestSort = (property) => {
        const newSort = toggleSortOrder(orderBy, order, property);
        setOrder(newSort.order);
        setOrderBy(newSort.orderBy);
    };

    const handleChangePage = (event, newPage) => {
        const validPage = validatePageNumber(newPage, sortedData.length, rowsPerPage);
        setPage(validPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0); // Reset do pierwszej strony
    };

    return {
        // Stan
        page,
        rowsPerPage,
        orderBy,
        order,
        
        // Dane
        dataToDisplay,
        sortedData,
        paginatedData,
        
        // Funkcje
        handleRequestSort,
        handleChangePage,
        handleChangeRowsPerPage,
        
        // Helpery
        setPage,
        setRowsPerPage
    };
};