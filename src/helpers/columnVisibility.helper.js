/**
 * Helper do zarządzania widocznością kolumn w tabeli
 */

/**
 * Kluczowe kolumny - wyświetlane domyślnie w widoku podstawowym (11 kolumn)
 */
export const ESSENTIAL_COLUMNS = [
    'StoreId',
    'Gospodarz_Sklepu',               // UWAGA: Wielkie S!
    'Ostatnie_zam',
    'Bloker_ostatnie_zam',
    'Najblizsze_zam',
    'Bloker_najblizsze_zam',
    'Kolejne_zam',
    'Bloker_kolejne_zam',
    'Zera_w_blokerze_ostatnie_zam',
    'Dostepnosc_drogeria',
    'Rekomendacja_dzialania'
];

/**
 * Filtruje nagłówki w zależności od trybu widoku
 * @param {Array<string>} allHeaders - Wszystkie nagłówki z pliku
 * @param {boolean} detailedView - Czy widok szczegółowy jest włączony
 * @returns {Array<string>} - Przefiltrowane nagłówki
 */
export const getVisibleHeaders = (allHeaders, detailedView) => {
    if (!allHeaders || allHeaders.length === 0) {
        return [];
    }

    // Jeśli widok szczegółowy - pokaż wszystkie
    if (detailedView) {
        return allHeaders;
    }

    // Widok podstawowy - tylko kluczowe kolumny (w kolejności z pliku)
    return allHeaders.filter(header => ESSENTIAL_COLUMNS.includes(header));
};

/**
 * Filtruje wiersz danych aby zawierał tylko widoczne kolumny
 * @param {Object} row - Wiersz danych
 * @param {Array<string>} visibleHeaders - Widoczne nagłówki
 * @returns {Object} - Przefiltrowany wiersz
 */
export const getVisibleRowData = (row, visibleHeaders) => {
    const filteredRow = {};
    visibleHeaders.forEach(header => {
        filteredRow[header] = row[header];
    });
    return filteredRow;
};

/**
 * Zwraca statystyki widoczności kolumn
 * @param {Array<string>} allHeaders - Wszystkie nagłówki
 * @param {boolean} detailedView - Czy widok szczegółowy jest włączony
 * @returns {Object} - { visible: number, hidden: number, total: number }
 */
export const getColumnStats = (allHeaders, detailedView) => {
    const total = allHeaders?.length || 0;
    const visible = detailedView ? total : Math.min(ESSENTIAL_COLUMNS.length, total);
    const hidden = total - visible;

    return { visible, hidden, total };
};
