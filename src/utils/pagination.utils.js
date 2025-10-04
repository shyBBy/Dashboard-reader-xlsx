/**
 * Utilities do obsługi paginacji tabeli
 */

/**
 * Pobiera dane dla aktualnej strony
 * @param {array} data - Pełna tablica danych
 * @param {number} page - Numer strony (zaczynając od 0)
 * @param {number} rowsPerPage - Liczba wierszy na stronie
 * @returns {array} - Dane dla aktualnej strony
 */
export const getPaginatedData = (data, page, rowsPerPage) => {
    if (!data || data.length === 0) return [];
    
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    
    return data.slice(startIndex, endIndex);
};

/**
 * Oblicza informacje o paginacji
 * @param {array} data - Pełna tablica danych
 * @param {number} page - Aktualny numer strony
 * @param {number} rowsPerPage - Liczba wierszy na stronie
 * @returns {object} - Informacje o paginacji
 */
export const getPaginationInfo = (data, page, rowsPerPage) => {
    const totalRows = data?.length || 0;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const currentPageRows = getPaginatedData(data, page, rowsPerPage).length;
    const startRow = totalRows > 0 ? page * rowsPerPage + 1 : 0;
    const endRow = page * rowsPerPage + currentPageRows;
    
    return {
        totalRows,
        totalPages,
        currentPageRows,
        startRow,
        endRow,
        isFirstPage: page === 0,
        isLastPage: page >= totalPages - 1
    };
};

/**
 * Waliduje i koryguje numer strony
 * @param {number} page - Numer strony do walidacji
 * @param {number} totalRows - Całkowita liczba wierszy
 * @param {number} rowsPerPage - Liczba wierszy na stronie
 * @returns {number} - Poprawiony numer strony
 */
export const validatePageNumber = (page, totalRows, rowsPerPage) => {
    if (totalRows === 0) return 0;
    
    const maxPage = Math.ceil(totalRows / rowsPerPage) - 1;
    
    if (page < 0) return 0;
    if (page > maxPage) return maxPage;
    
    return page;
};