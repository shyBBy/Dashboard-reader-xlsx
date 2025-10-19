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
 * @param {string|number} value - Wartość do sformatowania (może być decimal 0.25 lub procent 25)
 * @returns {string} - Sformatowana wartość procentowa
 */
export const formatPercentage = (value) => {
    if (typeof value === 'string' && value.includes('%')) {
        return value;
    }
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '-';
    
    // Jeśli wartość jest między 0 a 1, to jest decimal (np. 0.25 = 25%)
    if (numValue >= 0 && numValue <= 1) {
        return `${(numValue * 100).toFixed(1)}%`;
    }
    
    // Jeśli wartość > 1, to już jest procentem (np. 25)
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

const EXCEL_ESCAPE_REGEX = /_x([0-9A-Fa-f]{4})_/g;

/**
 * Dekoduje sekwencje w stylu Excel `_x0020_` na odpowiadające znaki.
 * @param {string} value - tekst do dekodowania
 * @returns {string}
 */
export const decodeExcelEscapes = (value) => {
    if (typeof value !== 'string' || value.length === 0) {
        return value;
    }

    return value.replace(EXCEL_ESCAPE_REGEX, (_, hex) => {
        const codePoint = parseInt(hex, 16);
        if (Number.isNaN(codePoint)) {
            return _;
        }
        return String.fromCharCode(codePoint);
    });
};

/**
 * Czyści tekst pochodzący z Excela: dekoduje sekwencje `_xNNNN_`, usuwa nadmiarowe białe znaki.
 * @param {string} value
 * @returns {string}
 */
export const normalizeExcelText = (value) => {
    if (typeof value !== 'string') {
        return value;
    }

    const decoded = decodeExcelEscapes(value);
    if (typeof decoded !== 'string') {
        return decoded;
    }

    return decoded
        .replace(/\r\n|\r|\n/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();
};

/**
 * Rekurencyjnie normalizuje wszystkie stringi w obiekcie/ tablicy dekodując sekwencje `_xNNNN_`.
 * @param {any} input
 * @returns {any}
 */
export const normalizeExcelDataset = (input) => {
    if (input instanceof Date) {
        return input;
    }

    if (Array.isArray(input)) {
        return input.map((item) => normalizeExcelDataset(item));
    }

    if (input && typeof input === 'object') {
        return Object.entries(input).reduce((acc, [key, value]) => {
            acc[key] = normalizeExcelDataset(value);
            return acc;
        }, {});
    }

    if (typeof input === 'string') {
        return normalizeExcelText(input);
    }

    return input;
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
 * Konwertuje datę Excel (serial number) na obiekt Date
 * @param {number} excelDate - Numer seryjny daty Excel
 * @returns {Date} - Obiekt Date
 */
const excelDateToJSDate = (excelDate) => {
    // Excel przechowuje daty jako liczbę dni od 1 stycznia 1900
    // (z błędem 1900 jako rok przestępny)
    const excelEpoch = new Date(1899, 11, 30); // 30 grudnia 1899
    const msPerDay = 86400000; // 24 * 60 * 60 * 1000
    return new Date(excelEpoch.getTime() + excelDate * msPerDay);
};

/**
 * Parsuje datę z różnych formatów do obiektu Date
 * @param {string|Date|number} dateValue - Wartość daty
 * @returns {Date|null} - Obiekt Date lub null jeśli niepoprawna
 */
export const parseDate = (dateValue) => {
    if (!dateValue) return null;
    
    try {
        let date;
        
        // Obsługa numeru seryjnego Excel (np. 45204)
        if (typeof dateValue === 'number' && dateValue > 1000 && dateValue < 100000) {
            date = excelDateToJSDate(dateValue);
        }
        // Obsługa stringa "DD-MM-YYYY", "D-M-YYYY", "DD.MM.YYYY", "D.M.YYYY" itp.
        else if (typeof dateValue === 'string') {
            // Sprawdź czy to format europejski (DD-MM-YYYY lub DD.MM.YYYY)
            const separators = ['-', '.', '/'];
            let parsed = false;
            
            for (const sep of separators) {
                if (dateValue.includes(sep)) {
                    const parts = dateValue.split(sep);
                    
                    // Format DD-MM-YYYY lub D-M-YYYY (dzień na początku)
                    if (parts.length === 3 && parts[0].length <= 2 && parts[1].length <= 2) {
                        const day = parseInt(parts[0], 10);
                        const month = parseInt(parts[1], 10);
                        const year = parseInt(parts[2], 10);
                        
                        // Walidacja zakresu
                        if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900) {
                            date = new Date(year, month - 1, day);
                            parsed = true;
                            break;
                        }
                    }
                }
            }
            
            // Jeśli nie udało się parsować jako format europejski, próbuj standardowego parsowania
            if (!parsed) {
                date = new Date(dateValue);
            }
        }
        // Obsługa obiektu Date
        else if (dateValue instanceof Date) {
            date = dateValue;
        } else {
            return null;
        }
        
        if (isNaN(date.getTime())) return null;
        
        return date;
    } catch (error) {
        return null;
    }
};

/**
 * Porównuje dwie daty (tylko dzień, bez godzin)
 * @param {Date|string|number} date1 - Pierwsza data
 * @param {Date|string|number} date2 - Druga data
 * @returns {boolean} - True jeśli ten sam dzień
 */
export const isSameDay = (date1, date2) => {
    const d1 = parseDate(date1);
    const d2 = parseDate(date2);
    
    if (!d1 || !d2) return false;
    
    const result = d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
    
    // Debug dla pierwszych 5 wywołań
    if (typeof window !== 'undefined' && !window.__isSameDayDebugCount) {
        window.__isSameDayDebugCount = 0;
    }
    if (window.__isSameDayDebugCount < 5) {
        console.log('🔍 isSameDay debug:', {
            date1_raw: date1,
            date2_raw: date2,
            date1_parsed: d1?.toLocaleDateString('pl-PL'),
            date2_parsed: d2?.toLocaleDateString('pl-PL'),
            result
        });
        window.__isSameDayDebugCount++;
    }
    
    return result;
};

/**
 * Formatuje datę do formatu DD-MM-YYYY
 * @param {string|Date|number} dateValue - Wartość daty do sformatowania
 * @returns {string} - Sformatowana data lub '-'
 */
export const formatDate = (dateValue) => {
    if (!dateValue) return '-';
    
    try {
        let date;
        
        // Obsługa numeru seryjnego Excel (np. 45204)
        if (typeof dateValue === 'number' && dateValue > 1000 && dateValue < 100000) {
            date = excelDateToJSDate(dateValue);
        }
        // Obsługa stringa "DD-MM-YYYY" lub "YYYY-MM-DD"
        else if (typeof dateValue === 'string') {
            // Sprawdź czy to format DD-MM-YYYY
            if (dateValue.includes('-') && dateValue.split('-')[0].length === 2) {
                const [day, month, year] = dateValue.split('-');
                date = new Date(year, month - 1, day);
            } else {
                date = new Date(dateValue);
            }
        }
        // Obsługa obiektu Date
        else if (dateValue instanceof Date) {
            date = dateValue;
        } else {
            return '-';
        }
        
        if (isNaN(date.getTime())) return '-';
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}-${month}-${year}`;
    } catch (error) {
        console.warn('Błąd formatowania daty:', dateValue, error);
        return '-';
    }
};

/**
 * Sprawdza czy wartość może być datą (zawiera słowo DATE lub kończy się DOKŁADNIE na _zam, ale NIE zawiera "bloker")
 * @param {string} header - Nazwa nagłówka
 * @returns {boolean}
 */
export const isDateField = (header) => {
    if (!header || typeof header !== 'string') return false;
    
    const upperHeader = header.toUpperCase();
    const lowerHeader = header.toLowerCase();
    
    // Jeśli zawiera "bloker" to NA PEWNO nie jest datą (to liczba!)
    if (lowerHeader.includes('bloker') || lowerHeader.includes('zera_')) {
        return false;
    }
    
    // Tylko kolumny z "DATE" lub DOKŁADNIE kończące się na "_zam"
    return upperHeader.includes('DATE') || 
           upperHeader === 'OSTATNIE_ZAM' || 
           upperHeader === 'NAJBLIZSZE_ZAM' || 
           upperHeader === 'KOLEJNE_ZAM' ||
           (upperHeader.startsWith('DATA_') && !upperHeader.includes('CHAR'));
};

/**
 * Sprawdza czy pole jest procentem (zawiera "udzial", "dostepnosc", "odchylenie")
 * @param {string} header - Nazwa nagłówka
 * @returns {boolean}
 */
export const isPercentageField = (header) => {
    if (!header || typeof header !== 'string') return false;
    
    const lowerHeader = header.toLowerCase();
    return lowerHeader.includes('udzial') || 
           lowerHeader.includes('dostepnosc') || 
           lowerHeader.includes('odchylenie') ||
           lowerHeader.includes('procent');
};

/**
 * Formatuje wartość do wyświetlenia w tabeli
 * @param {any} value - Wartość do sformatowania
 * @param {string} header - Nazwa nagłówka (opcjonalnie dla dat i procentów)
 * @returns {string} - Sformatowana wartość
 */
export const formatDisplayValue = (value, header = '') => {
    // WAŻNE: 0 jest poprawną wartością! Nie traktuj jako pustej.
    if (value === null || value === undefined || value === '') {
        return '-';
    }
    
    if (typeof value === 'string') {
        const normalized = normalizeExcelText(value);
        if (normalized.length === 0) {
            return '-';
        }
        value = normalized;
    }

    // Sprawdź czy to pole daty
    if (isDateField(header)) {
        return formatDate(value);
    }
    
    // Sprawdź czy to pole procentowe
    if (isPercentageField(header)) {
        return formatPercentage(value);
    }
    
    // Wartości liczbowe
    if (isNumeric(value)) {
        const numValue = parseFloat(value);
        // Jeśli to całkowita, pokaż bez miejsc po przecinku
        if (Number.isInteger(numValue)) {
            return numValue.toLocaleString('pl-PL'); // Formatowanie z separatorami tysięcy
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