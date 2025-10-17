/**
 * Helpery do filtrowania danych dashboard
 */

/**
 * Sprawdza czy filtry są aktywne
 * @param {object} filters - Obiekt z filtrami
 * @returns {boolean} - True jeśli jakikolwiek filtr jest aktywny
 */
export const hasActiveFilters = (filters) => {
    return Object.values(filters).some(value => 
        value !== null && value !== undefined && value !== '' && value !== 'all'
    );
};

/**
 * Filtruje dane na podstawie kryteriów wyszukiwania
 * @param {object} row - Wiersz danych
 * @param {string} searchTerm - Termin wyszukiwania
 * @returns {boolean} - True jeśli wiersz pasuje do kryteriów
 */
const matchesSearchFilter = (row, searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') return true;
    
    const term = searchTerm.trim();
    
    // Jeśli wpisano samą liczbę, szukaj po StoreId
    if (/^\d+$/.test(term)) {
        return String(row.StoreId) === term;
    }
    
    // Jeśli to tekst, szukaj we wszystkich kolumnach tekstowych
    const searchLower = term.toLowerCase();
    const searchableFields = [
        'StoreId', 'Gospodarz_Sklepu', 'Lider', 'LW', 'BlockerName', 
        'Wplyw', 'Opis', 'Rekomendacja', 'Rekomendacja_dzialania',
        'Trend_analiza', 'Decyzja', 'Powod_decyzji'
    ];
    
    return searchableFields.some(field => 
        String(row[field] || '').toLowerCase().includes(searchLower)
    );
};

/**
 * Filtruje dane na podstawie wszystkich aktywnych filtrów
 * @param {array} data - Tablica danych do filtrowania
 * @param {object} filters - Obiekt z filtrami
 * @returns {array} - Przefiltrowane dane
 */
export const filterData = (data, filters) => {
    if (!data || data.length === 0) {
        return [];
    }

    // Jeśli nie ma żadnych filtrów, zwróć wszystkie dane
    if (!hasActiveFilters(filters)) {
        return data;
    }

    console.log('🔍 Filtrowanie - Aktywne filtry:', filters);
    console.log('📊 Dane przed filtrowaniem:', data.length, 'wierszy');

    const result = data.filter(row => {
        // Filtr wyszukiwania
        if (!matchesSearchFilter(row, filters.search)) {
            return false;
        }

        // Filtr StoreId
        if (filters.storeId && filters.storeId !== 'all') {
            if (String(row.StoreId) !== String(filters.storeId)) {
                return false;
            }
        }

        // Filtr Gospodarza Sklepu
        if (filters.gospodarz && filters.gospodarz !== 'all') {
            if (row.Gospodarz_Sklepu !== filters.gospodarz) {
                return false;
            }
        }

        // Filtr Lidera
        if (filters.lider && filters.lider !== 'all') {
            if (row.Lider !== filters.lider) {
                return false;
            }
        }

        // Filtr LW
        if (filters.lw && filters.lw !== 'all') {
            if (row.LW !== filters.lw) {
                return false;
            }
        }

        // Filtr BlockerName
        if (filters.blocker && filters.blocker !== 'all') {
            if (row.BlockerName !== filters.blocker) {
                return false;
            }
        }

        // Filtr Wpływu
        if (filters.wplyw && filters.wplyw !== 'all') {
            if (row.Wplyw !== filters.wplyw) {
                return false;
            }
        }

        // Filtr Rekomendacji
        if (filters.rekomendacja && filters.rekomendacja !== 'all') {
            if (row.Rekomendacja_dzialania !== filters.rekomendacja) {
                return false;
            }
        }

        return true;
    });
    
    console.log('✅ Wynik filtrowania:', result.length, 'wierszy');
    return result;
};