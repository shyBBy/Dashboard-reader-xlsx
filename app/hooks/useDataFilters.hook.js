import { useState, useMemo, useCallback } from 'react';
import { filterData } from '../helpers/dataFiltering.helper';

/**
 * Custom hook do zarządzania filtrami danych
 * @param {array} data - Dane do filtrowania
 * @returns {object} - Stan i funkcje do zarządzania filtrami
 */
export const useDataFilters = (data) => {
    const [filters, setFilters] = useState({});

    // Przefiltrowane dane
    const filteredData = useMemo(() => {
        return filterData(data, filters);
    }, [data, filters]);

    // Funkcja do zmiany filtrów
    const handleFiltersChange = useCallback((newFilters) => {
        setFilters(newFilters);
    }, []);

    // Funkcja do resetowania filtrów
    const resetFilters = useCallback(() => {
        setFilters({});
    }, []);

    // Funkcja do ustawiania pojedynczego filtra
    const setFilter = useCallback((key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);

    return {
        // Stan
        filters,
        filteredData,
        
        // Funkcje
        handleFiltersChange,
        resetFilters,
        setFilter,
        setFilters,
        
        // Statystyki
        originalCount: data?.length || 0,
        filteredCount: filteredData.length
    };
};