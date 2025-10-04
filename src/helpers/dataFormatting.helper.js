/**
 * Helpery do formatowania i walidacji danych
 */

/**
 * Sprawdza czy wartość jest liczbą
 * @param {any} value - Wartość do sprawdzenia
 * @returns {boolean}
 */
export const isNumeric = (value) => {
    return typeof value === 'number' || (typeof value === 'string' && !isNaN(parseFloat(value)));
};

/**
 * Formatuje wartość procentową
 * @param {string|number} value - Wartość do sformatowania
 * @returns {string} - Sformatowana wartość procentowa
 */
export const formatPercentage = (value) => {
    if (typeof value === 'string' && value.includes('%')) {
        return value;
    }
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '-';
    
    return `${numValue.toFixed(1)}%`;
};

/**
 * Skraca długi tekst i dodaje wielokropek
 * @param {string} text - Tekst do skrócenia
 * @param {number} maxLength - Maksymalna długość (domyślnie 40)
 * @returns {string} - Skrócony tekst
 */
export const truncateText = (text, maxLength = 40) => {
    if (!text || typeof text !== 'string') return '-';
    
    if (text.length <= maxLength) return text;
    
    return `${text.substring(0, maxLength - 3)}...`;
};

/**
 * Sprawdza czy tekst jest długi i potrzebuje skrócenia
 * @param {string} text - Tekst do sprawdzenia
 * @param {number} maxLength - Maksymalna długość (domyślnie 40)
 * @returns {boolean}
 */
export const isLongText = (text, maxLength = 40) => {
    return typeof text === 'string' && text.length > maxLength;
};

/**
 * Formatuje datę do formatu DD-MM-YYYY
 * @param {string|Date} dateValue - Wartość daty do sformatowania
 * @returns {string} - Sformatowana data lub '-'
 */
export const formatDate = (dateValue) => {
    if (!dateValue) return '-';
    
    try {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) return '-';
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}-${month}-${year}`;
    } catch (error) {
        return '-';
    }
};

/**
 * Sprawdza czy wartość może być datą (zawiera słowo DATE lub kończy się na _zam)
 * @param {string} header - Nazwa nagłówka
 * @returns {boolean}
 */
export const isDateField = (header) => {
    if (!header || typeof header !== 'string') return false;
    
    const upperHeader = header.toUpperCase();
    return upperHeader.includes('DATE') || upperHeader.endsWith('_ZAM');
};

/**
 * Formatuje wartość do wyświetlenia w tabeli
 * @param {any} value - Wartość do sformatowania
 * @param {string} header - Nazwa nagłówka (opcjonalnie dla dat)
 * @returns {string} - Sformatowana wartość
 */
export const formatDisplayValue = (value, header = '') => {
    if (value === null || value === undefined || value === '') {
        return '-';
    }
    
    // Sprawdź czy to pole daty
    if (isDateField(header)) {
        return formatDate(value);
    }
    
    // Wartości liczbowe
    if (isNumeric(value)) {
        const numValue = parseFloat(value);
        // Jeśli to całkowita, pokaż bez miejsc po przecinku
        if (Number.isInteger(numValue)) {
            return numValue.toString();
        }
        // Inaczej z 2 miejscami po przecinku
        return numValue.toFixed(2);
    }
    
    return String(value);
};

/**
 * Generuje unikalny klucz dla wiersza tabeli
 * @param {object} row - Wiersz danych
 * @param {number} index - Indeks wiersza
 * @returns {string} - Unikalny klucz
 */
export const generateRowKey = (row, index) => {
    const storeId = row.StoreId || 'noStore';
    const blockerName = row.BlockerName || 'noBlocker';
    return `${storeId}-${blockerName}-${index}`;
};

/**
 * Generuje unikalny klucz dla nagłówka
 * @param {string} header - Nazwa nagłówka
 * @param {number} index - Indeks nagłówka
 * @returns {string} - Unikalny klucz
 */
export const generateHeaderKey = (header, index) => {
    return `header-${header || 'empty'}-${index}`;
};

/**
 * Generuje unikalny klucz dla komórki
 * @param {string} header - Nazwa nagłówka
 * @param {number} index - Indeks komórki
 * @returns {string} - Unikalny klucz
 */
export const generateCellKey = (header, index) => {
    return `cell-${header || 'empty'}-${index}`;
};