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

const COMMON_ALWAYS_COLUMNS = [
    'StoreId',
    'Nazwa_sklepu',
    'Gospodarz_Sklepu',
    'Lider',
    'LW',
    'Dostepnosc_drogeria',
    'Dostepnosc_siec',
    'Decyzja',
    'Rekomendacja_dzialania'
];

export const TABLE_ORDER_TAB_DEFINITIONS = [
    {
        id: 'last',
        label: 'Ostatnie zam.',
        keywords: ['ostatnie'],
        essentialColumns: [
            'StoreId',
            'Gospodarz_Sklepu',
            'Ostatnie_zam',
            'Bloker_ostatnie_zam',
            'Zera_w_blokerze_ostatnie_zam',
            'Dostepnosc_drogeria',
            'Rekomendacja_dzialania'
        ]
    },
    {
        id: 'next',
        label: 'Najbliższe zam.',
        keywords: ['najblizsze'],
        essentialColumns: [
            'StoreId',
            'Gospodarz_Sklepu',
            'Najblizsze_zam',
            'Bloker_najblizsze_zam',
            'Dostepnosc_drogeria',
            'Rekomendacja_dzialania'
        ]
    },
    {
        id: 'future',
        label: 'Kolejne zam.',
        keywords: ['kolejne'],
        essentialColumns: [
            'StoreId',
            'Gospodarz_Sklepu',
            'Kolejne_zam',
            'Bloker_kolejne_zam',
            'Dostepnosc_drogeria',
            'Rekomendacja_dzialania'
        ]
    }
];

const TABLE_ORDER_TAB_MAP = TABLE_ORDER_TAB_DEFINITIONS.reduce((acc, definition) => {
    acc[definition.id] = definition;
    return acc;
}, {});

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

const normalize = (value) => value?.toLowerCase?.() ?? '';

const getExistingColumns = (candidateColumns, allHeaders) => {
    const allowed = new Set(candidateColumns);
    return allHeaders.filter((header) => allowed.has(header));
};

const getKeywordColumns = (keywords = [], allHeaders = []) => {
    if (!keywords.length) return [];
    const keywordSet = new Set();
    allHeaders.forEach((header) => {
        const lowerHeader = normalize(header);
        if (keywords.some((keyword) => lowerHeader.includes(keyword))) {
            keywordSet.add(header);
        }
    });
    return allHeaders.filter((header) => keywordSet.has(header));
};

/**
 * Zwraca nagłówki dedykowane dla konkretnej zakładki tabeli (ostatnie / najbliższe / kolejne zam.)
 * @param {Array<string>} allHeaders - Wszystkie nagłówki
 * @param {boolean} detailedView - Czy włączony jest widok szczegółowy
 * @param {'last'|'next'|'future'} tabId - Id zakładki
 * @returns {Array<string>} - Lista nagłówków do wyświetlenia
 */
export const getTabHeaders = (allHeaders, detailedView, tabId) => {
    if (!allHeaders || !allHeaders.length) {
        return [];
    }

    const definition = TABLE_ORDER_TAB_MAP[tabId];
    if (!definition) {
        return getVisibleHeaders(allHeaders, detailedView);
    }

    if (!detailedView) {
        return getExistingColumns(definition.essentialColumns, allHeaders);
    }

    const keywordColumns = getKeywordColumns(definition.keywords, allHeaders);
    const alwaysColumns = getExistingColumns(COMMON_ALWAYS_COLUMNS, allHeaders);
    const allowed = new Set([...keywordColumns, ...alwaysColumns]);

    const tabHeaders = allHeaders.filter((header) => allowed.has(header));

    if (tabHeaders.length > 0) {
        return tabHeaders;
    }

    return getExistingColumns(definition.essentialColumns, allHeaders);
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

export const getTabColumnStats = (allHeaders, detailedView, tabId) => {
    const total = allHeaders?.length || 0;
    const tabHeaders = getTabHeaders(allHeaders, detailedView, tabId);
    const visible = tabHeaders.length;
    const hidden = Math.max(total - visible, 0);

    return { visible, hidden, total };
};
