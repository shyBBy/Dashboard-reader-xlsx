/**
 * Helpery do sortowania danych w tabeli
 */

/**
 * Sortuje tablicę danych na podstawie wybranej kolumny i kierunku
 * @param {array} data - Tablica danych do sortowania
 * @param {string} orderBy - Nazwa kolumny do sortowania
 * @param {string} order - Kierunek sortowania ('asc' lub 'desc')
 * @returns {array} - Posortowana tablica danych
 */
export const sortData = (data, orderBy, order) => {
    if (!data || data.length === 0 || !orderBy) {
        return data || [];
    }

    return [...data].sort((a, b) => {
        const aVal = a[orderBy];
        const bVal = b[orderBy];
        
        // Obsługa null/undefined
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return order === 'asc' ? -1 : 1;
        if (bVal == null) return order === 'asc' ? 1 : -1;
        
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
};

/**
 * Przełącza kierunek sortowania
 * @param {string} currentOrderBy - Aktualna kolumna sortowania
 * @param {string} currentOrder - Aktualny kierunek sortowania
 * @param {string} newProperty - Nowa kolumna do sortowania
 * @returns {object} - Nowy stan sortowania { orderBy, order }
 */
export const toggleSortOrder = (currentOrderBy, currentOrder, newProperty) => {
    const isAsc = currentOrderBy === newProperty && currentOrder === 'asc';
    return {
        orderBy: newProperty,
        order: isAsc ? 'desc' : 'asc'
    };
};