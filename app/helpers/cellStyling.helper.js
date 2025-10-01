/**
 * Helpery do stylizacji komórek tabeli na podstawie zawartości
 */

/**
 * Generuje style dla komórek na podstawie nagłówka i wartości
 * @param {string} header - Nazwa nagłówka kolumny
 * @param {any} value - Wartość komórki
 * @param {object} theme - Motyw Material-UI
 * @returns {object} - Obiekt z stylami CSS
 */
export const getCellStyle = (header, value, theme) => {
    switch (header) {
        case 'Wplyw':
            return getImpactStyle(value, theme);
        case 'Decyzja':
            return getDecisionStyle(value, theme);
        case 'Trend_analiza':
            return getTrendStyle(value, theme);
        default:
            return {};
    }
};

/**
 * Style dla kolumny "Wpływ"
 */
const getImpactStyle = (value, theme) => {
    const baseStyle = { fontWeight: 'bold' };
    
    switch (value) {
        case 'WYSOKI':
            return {
                ...baseStyle,
                backgroundColor: theme.palette.error.light + '20',
                color: theme.palette.error.dark
            };
        case 'SREDNI':
            return {
                ...baseStyle,
                backgroundColor: theme.palette.warning.light + '20',
                color: theme.palette.warning.dark
            };
        case 'NISKI':
            return {
                ...baseStyle,
                backgroundColor: theme.palette.info.light + '20',
                color: theme.palette.info.dark
            };
        case 'ZEROWY':
            return {
                ...baseStyle,
                backgroundColor: theme.palette.success.light + '20',
                color: theme.palette.success.dark
            };
        default:
            return {};
    }
};

/**
 * Style dla kolumny "Decyzja"
 */
const getDecisionStyle = (value, theme) => {
    const baseStyle = { fontWeight: 'bold' };
    
    if (value === 'REKOMENDUJ') {
        return {
            ...baseStyle,
            backgroundColor: theme.palette.success.light + '25',
            color: theme.palette.success.dark
        };
    }
    
    if (value && value.includes('BRAK AKCJI')) {
        return {
            ...baseStyle,
            backgroundColor: theme.palette.error.light + '25',
            color: theme.palette.error.dark
        };
    }
    
    return {};
};

/**
 * Style dla kolumny "Trend_analiza"
 */
const getTrendStyle = (value, theme) => {
    if (value && value.includes('NASILAJACY')) {
        return {
            backgroundColor: theme.palette.error.light + '15',
            color: theme.palette.error.dark
        };
    }
    
    if (value && value.includes('MALEJACY')) {
        return {
            backgroundColor: theme.palette.success.light + '15',
            color: theme.palette.success.dark
        };
    }
    
    return {};
};