/**
 * Helper do walidacji i kompatybilności ze schematem XLSX
 * Based on: xlsx.schema.json (POWODY_BLOKERA_DZZWD)
 */

/**
 * Wymagane kolumny dla pełnej funkcjonalności aplikacji
 */
export const REQUIRED_COLUMNS = {
    CORE: ['StoreId', 'BlockerName'],
    DATES: ['Ostatnie_zam', 'Najblizsze_zam', 'Kolejne_zam'],
    METRICS: ['Bloker_ostatnie_zam', 'Bloker_najblizsze_zam', 'Bloker_kolejne_zam'],
    BUSINESS: ['Wplyw', 'Decyzja', 'Rekomendacja_dzialania'],
    AVAILABILITY: ['Dostepnosc_siec', 'Dostepnosc_drogeria']
};

/**
 * Waliduje czy plik zawiera minimalne wymagane kolumny
 * @param {Array<string>} headers - Nagłówki z pliku XLSX
 * @returns {Object} - { valid: boolean, missing: Array<string>, warnings: Array<string> }
 */
export const validateSchema = (headers) => {
    const result = {
        valid: true,
        missing: [],
        warnings: [],
        present: headers
    };

    // Sprawdź core columns (WYMAGANE)
    REQUIRED_COLUMNS.CORE.forEach(col => {
        if (!headers.includes(col)) {
            result.valid = false;
            result.missing.push(col);
        }
    });

    // Sprawdź business columns (ZALECANE)
    REQUIRED_COLUMNS.BUSINESS.forEach(col => {
        if (!headers.includes(col)) {
            result.warnings.push(`Brak kolumny biznesowej: ${col}`);
        }
    });

    // Sprawdź date columns (ZALECANE)
    REQUIRED_COLUMNS.DATES.forEach(col => {
        if (!headers.includes(col)) {
            result.warnings.push(`Brak kolumny daty: ${col}`);
        }
    });

    return result;
};

/**
 * Wykrywa typy kolumn na podstawie nazwy i wartości próbki
 * @param {string} columnName - Nazwa kolumny
 * @param {Array} sampleValues - Próbka wartości (pierwsze 10 wierszy)
 * @returns {string} - 'date', 'number', 'percentage', 'string', 'boolean'
 */
export const detectColumnType = (columnName, sampleValues) => {
    const lowerName = columnName.toLowerCase();

    // Wykryj daty
    if (lowerName.includes('date') || 
        lowerName.includes('data') || 
        lowerName.endsWith('_zam') ||
        lowerName.includes('refdate') ||
        lowerName.includes('projekcji')) {
        return 'date';
    }

    // Wykryj procenty
    if (lowerName.includes('udzial') || 
        lowerName.includes('dostepnosc') || 
        lowerName.includes('odchylenie') ||
        lowerName.includes('procentowy')) {
        return 'percentage';
    }

    // Wykryj liczby na podstawie próbki
    const numericCount = sampleValues.filter(v => 
        typeof v === 'number' || !isNaN(parseFloat(v))
    ).length;

    if (numericCount > sampleValues.length * 0.8) {
        return 'number';
    }

    // Wykryj boolean
    const booleanValues = ['TAK', 'NIE', 'TRUE', 'FALSE', '1', '0', 'YES', 'NO'];
    const boolCount = sampleValues.filter(v => 
        booleanValues.includes(String(v).toUpperCase())
    ).length;

    if (boolCount > sampleValues.length * 0.8) {
        return 'boolean';
    }

    return 'string';
};

/**
 * Generuje raport kompatybilności pliku ze schematem
 * @param {Object} excelData - Dane z pliku Excel
 * @returns {Object} - Raport z analizą
 */
export const generateCompatibilityReport = (excelData) => {
    if (!excelData || !excelData.headers || !excelData.data) {
        return {
            compatible: false,
            error: 'Brak danych do analizy'
        };
    }

    const validation = validateSchema(excelData.headers);
    
    // Wykryj typy kolumn
    const columnTypes = {};
    excelData.headers.forEach(header => {
        const sampleValues = excelData.data
            .slice(0, 10)
            .map(row => row[header])
            .filter(v => v !== null && v !== undefined && v !== '');
        
        columnTypes[header] = detectColumnType(header, sampleValues);
    });

    const report = {
        compatible: validation.valid,
        totalColumns: excelData.headers.length,
        totalRows: excelData.totalRows,
        validation,
        columnTypes,
        dataQuality: {
            emptyRows: 0,
            duplicates: 0,
            missingValues: 0
        },
        recommendations: []
    };

    // Sprawdź jakość danych
    const storeIds = new Set();
    excelData.data.forEach((row, index) => {
        // Puste wiersze
        const emptyCount = Object.values(row).filter(v => !v).length;
        if (emptyCount === Object.keys(row).length) {
            report.dataQuality.emptyRows++;
        }

        // Duplikaty StoreId
        if (row.StoreId) {
            if (storeIds.has(row.StoreId)) {
                report.dataQuality.duplicates++;
            }
            storeIds.add(row.StoreId);
        }

        // Brakujące wartości w kluczowych kolumnach
        if (!row.StoreId || !row.BlockerName) {
            report.dataQuality.missingValues++;
        }
    });

    // Generuj rekomendacje
    if (report.dataQuality.emptyRows > 0) {
        report.recommendations.push(`🧹 Wykryto ${report.dataQuality.emptyRows} pustych wierszy - rozważ ich usunięcie`);
    }

    if (report.dataQuality.missingValues > 0) {
        report.recommendations.push(`⚠️ Wykryto ${report.dataQuality.missingValues} wierszy z brakującymi kluczowymi danymi (StoreId/BlockerName)`);
    }

    if (!validation.valid) {
        report.recommendations.push(`❌ Plik nie zawiera wymaganych kolumn: ${validation.missing.join(', ')}`);
    }

    if (validation.warnings.length > 0) {
        report.recommendations.push(`⚠️ Brak niektórych zalecanych kolumn - część funkcji może nie działać`);
    }

    return report;
};

/**
 * Loguje raport kompatybilności do konsoli
 * @param {Object} report - Raport z generateCompatibilityReport
 */
export const logCompatibilityReport = (report) => {
    console.log('📋 === RAPORT KOMPATYBILNOŚCI XLSX ===');
    console.log(`✅ Kompatybilny: ${report.compatible ? 'TAK' : 'NIE'}`);
    console.log(`📊 Kolumny: ${report.totalColumns} | Wiersze: ${report.totalRows}`);
    
    if (report.validation.missing.length > 0) {
        console.warn('❌ Brakujące wymagane kolumny:', report.validation.missing);
    }

    if (report.validation.warnings.length > 0) {
        console.warn('⚠️ Ostrzeżenia:', report.validation.warnings);
    }

    console.log('📈 Jakość danych:', report.dataQuality);

    if (report.recommendations.length > 0) {
        console.log('💡 Rekomendacje:');
        report.recommendations.forEach(rec => console.log(`  ${rec}`));
    }

    console.log('🔍 Wykryte typy kolumn:', report.columnTypes);
    console.log('=================================');
};
