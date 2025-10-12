/**
 * Helpery do obliczeń biznesowych na danych Excel
 * Reużywalne funkcje dla KPI, analiz, statystyk itp.
 */

/**
 * Zlicza unikalne sklepy w danych
 * @param {Array} data - Dane Excel
 * @returns {number} - Liczba unikalnych sklepów
 */
export const countUniqueStores = (data) => {
    if (!data || data.length === 0) return 0;
    return new Set(data.map(row => row.StoreId)).size;
};

/**
 * Zlicza blockery według wpływu
 * @param {Array} data - Dane Excel
 * @param {Array} impactLevels - Poziomy wpływu do zliczenia ['WYSOKI', 'SREDNI']
 * @returns {number} - Liczba blockerów o podanych poziomach wpływu
 */
export const countBlockersByImpact = (data, impactLevels) => {
    if (!data || data.length === 0) return 0;
    return data.filter(row => impactLevels.includes(row.Wplyw)).length;
};

/**
 * Zlicza blockery według decyzji
 * @param {Array} data - Dane Excel
 * @param {Array} decisions - Decyzje do zliczenia ['REKOMENDUJ']
 * @returns {number} - Liczba blockerów o podanych decyzjach
 */
export const countBlockersByDecision = (data, decisions) => {
    if (!data || data.length === 0) return 0;
    return data.filter(row => decisions.includes(row.Decyzja)).length;
};

/**
 * Oblicza średnią dostępność w drogeriach
 * @param {Array} data - Dane Excel
 * @returns {number} - Średnia dostępność w procentach
 */
export const calculateAvailabilityAverage = (data) => {
    if (!data || data.length === 0) return 0;
    
    const availabilityValues = data
        .map(row => {
            // Spróbuj różnych wariantów nazwy kolumny (case-insensitive)
            const dostepnosc = row.Dostepnosc_drogeria || 
                             row.DOSTEPNOSC_DROGERIA || 
                             row.dostepnosc_drogeria ||
                             row.Dostępność_drogeria;
                             
            if (typeof dostepnosc === 'string') {
                return parseFloat(dostepnosc.replace('%', '').replace(',', '.'));
            } else if (typeof dostepnosc === 'number') {
                // Jeśli wartość <= 1, to format dziesiętny (0.90 = 90%)
                if (dostepnosc <= 1) {
                    return dostepnosc * 100;
                }
                return dostepnosc; // Format procentowy (90)
            }
            return 0;
        })
        .filter(val => !isNaN(val) && val > 0);
    
    return availabilityValues.length > 0 
        ? availabilityValues.reduce((sum, val) => sum + val, 0) / availabilityValues.length 
        : 0;
};

/**
 * Analizuje trendy w danych
 * @param {Array} data - Dane Excel
 * @returns {Object} - Obiekt z liczbami trendów {nasilajacy, malejacy, stabilny}
 */
export const analyzeTrends = (data) => {
    if (!data || data.length === 0) {
        return { nasilajacy: 0, malejacy: 0, stabilny: 0 };
    }
    
    return data.reduce((acc, row) => {
        const trend = row.Trend_analiza;
        if (trend && trend.includes('NASILAJACY')) {
            acc.nasilajacy++;
        } else if (trend && trend.includes('MALEJACY')) {
            acc.malejacy++;
        } else {
            acc.stabilny++;
        }
        return acc;
    }, { nasilajacy: 0, malejacy: 0, stabilny: 0 });
};

/**
 * Pobiera pre-obliczone wartości z SAS (pierwszego wiersza)
 * @param {Array} data - Dane Excel
 * @param {string} columnName - Nazwa kolumny do pobrania
 * @returns {number} - Wartość z pierwszego wiersza
 */
export const getPreCalculatedValue = (data, columnName) => {
    if (!data || data.length === 0) return 0;
    return parseInt(data[0][columnName]) || 0;
};

/**
 * Oblicza wszystkie podstawowe metryki KPI jednym wywołaniem
 * @param {Array} data - Dane Excel (pełne lub przefiltrowane)
 * @returns {Object} - Obiekt ze wszystkimi metrykami KPI
 */
export const calculateAllKPIMetrics = (data) => {
    if (!data || data.length === 0) {
        return {
            totalStores: 0,
            totalBlockers: 0,
            highImpactBlockers: 0,
            lowImpactBlockers: 0,
            recomendedActions: 0,
            availabilityAvg: 0,
            trendsCount: { nasilajacy: 0, malejacy: 0, stabilny: 0 },
            storesWithOrderToday: 0,
            sumaLiniiToday: 0
        };
    }

    return {
        totalStores: countUniqueStores(data),
        totalBlockers: data.length,
        highImpactBlockers: countBlockersByImpact(data, ['WYSOKI', 'SREDNI']),
        lowImpactBlockers: countBlockersByImpact(data, ['NISKI', 'ZEROWY']),
        recomendedActions: countBlockersByDecision(data, ['REKOMENDUJ']),
        availabilityAvg: Math.round(calculateAvailabilityAverage(data) * 100) / 100,
        trendsCount: analyzeTrends(data),
        // Pre-obliczone wartości z SAS
        storesWithOrderToday: getPreCalculatedValue(data, 'LICZBA_SKLEPOW_DZIS'),
        sumaLiniiToday: Math.round(getPreCalculatedValue(data, 'SUMA_LINII_ZAM_DZIS'))
    };
};

/**
 * Formatuje wartości do wyświetlenia (z separatorami tysięcy)
 * @param {number} value - Wartość do sformatowania
 * @returns {string} - Sformatowana wartość
 */
export const formatDisplayValue = (value) => {
    if (typeof value === 'number') {
        return value.toLocaleString();
    }
    return String(value);
};

/**
 * Oblicza procent jednej wartości względem drugiej
 * @param {number} part - Część
 * @param {number} total - Całość
 * @returns {number} - Procent (0-100)
 */
export const calculatePercentage = (part, total) => {
    if (!total || total === 0) return 0;
    return (part / total) * 100;
};

/**
 * Określa typ karty KPI na podstawie poziomu dostępności
 * @param {number} availability - Poziom dostępności w %
 * @returns {string} - Typ karty ('success', 'info', 'warning', 'error')
 */
export const getAvailabilityCardType = (availability) => {
    if (availability >= 96.7) return 'success';
    if (availability >= 92) return 'info';
    if (availability >= 89) return 'warning';
    return 'error';
};