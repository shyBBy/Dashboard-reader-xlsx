# 🐛 Bug Fixes - Kolumny blokerów

## Problem

Kolumny z liczbami blokerów wyświetlały `-` zamiast wartości liczbowych:
- `Bloker_ostatnie_zam` ❌
- `Bloker_najblizsze_zam` ❌
- `Bloker_kolejne_zam` ❌
- `Zera_w_blokerze_ostatnie_zam` ❌

## Przyczyny

### 1. **isDateField() wykrywał kolumny blokerów jako daty**

**Przed:**
```javascript
isDateField(header) {
    return header.includes('DATE') || header.endsWith('_ZAM');
}
```

**Problem:** `Bloker_ostatnie_zam.endsWith('_ZAM')` → `true` → próba formatowania liczby jako daty → `-`

**Po:**
```javascript
isDateField(header) {
    if (header.includes('bloker') || header.includes('zera_')) {
        return false; // NIE są datami!
    }
    
    return header.includes('DATE') || 
           header === 'Ostatnie_zam' || 
           header === 'Najblizsze_zam' || 
           header === 'Kolejne_zam';
}
```

### 2. **ExcelUploader zamieniał `0` na pusty string**

**Przed:**
```javascript
obj[header] = row[index] || '';
```

**Problem:** `0 || ''` → `''` → formatDisplayValue zwraca `-`

**Po:**
```javascript
const value = row[index];
obj[header] = (value !== null && value !== undefined) ? value : '';
```

### 3. **formatDisplayValue traktował `0` jako falsy**

**Przed:**
```javascript
if (!value) return '-';
```

**Problem:** `!0` → `true` → zwraca `-`

**Po:**
```javascript
if (value === null || value === undefined || value === '') {
    return '-';
}
// 0 jest poprawną wartością!
```

## Rozwiązania

| Bug | Fix | Status |
|-----|-----|--------|
| Kolumny blokerów jako daty | Dodano wykluczenie "bloker" i "zera_" w `isDateField()` | ✅ Naprawione |
| `0` → `''` w ExcelUploader | Zmieniono `||` na explicit check `!== null && !== undefined` | ✅ Naprawione |
| formatDisplayValue zwraca `-` dla `0` | Dodano komentarz "0 jest poprawną wartością" | ✅ Naprawione |
| Zmiana domyślnych kolumn | Zaktualizowano `ESSENTIAL_COLUMNS` z 7 na 11 kolumn | ✅ Naprawione |

## Testy

### Before:
```
| Bloker_ostatnie_zam | Bloker_najblizsze_zam | Bloker_kolejne_zam |
|---------------------|------------------------|---------------------|
| -                   | -                      | -                   |
| -                   | -                      | -                   |
```

### After:
```
| Bloker_ostatnie_zam | Bloker_najblizsze_zam | Bloker_kolejne_zam |
|---------------------|------------------------|---------------------|
| 504                 | 8                      | 6                   |
| 0                   | 3                      | 0                   |
```

## Debug logging

Dodano logowanie pierwszych 3 wierszy po wczytaniu XLSX:

```javascript
console.log('🔍 DEBUG - Pierwsze 3 wiersze danych:');
formattedData.slice(0, 3).forEach((row, idx) => {
    console.log(`Wiersz ${idx + 1}:`, {
        StoreId: row.StoreId,
        Bloker_ostatnie_zam: row.Bloker_ostatnie_zam,
        Bloker_najblizsze_zam: row.Bloker_najblizsze_zam,
        Bloker_kolejne_zam: row.Bloker_kolejne_zam,
        Zera_w_blokerze_ostatnie_zam: row.Zera_w_blokerze_ostatnie_zam
    });
});
```

## Pliki zmienione

1. ✅ `src/helpers/dataFormatting.helper.js` - isDateField() logic
2. ✅ `src/helpers/columnVisibility.helper.js` - ESSENTIAL_COLUMNS (7→11)
3. ✅ `src/pages/Upload/components/ExcelUploader/ExcelUploader.jsx` - 0 handling + debug logs
4. ✅ `docs/DETAILED_VIEW.md` - Dokumentacja

## Weryfikacja

Po wgraniu pliku XLSX sprawdź konsolę:
```
🔍 DEBUG - Pierwsze 3 wiersze danych:
Wiersz 1: {
  StoreId: 1234,
  Bloker_ostatnie_zam: 504,  ✅ Liczba, nie "-"
  Bloker_najblizsze_zam: 8,  ✅ Liczba, nie "-"
  Bloker_kolejne_zam: 6,     ✅ Liczba, nie "-"
  Zera_w_blokerze_ostatnie_zam: 3  ✅ Liczba, nie "-"
}
```
