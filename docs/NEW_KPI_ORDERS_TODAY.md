# 📊 Nowe KPI - Zamówienia dzisiaj

## ✅ Zmiany

### 1. **Naprawiono brak kolumny `Gospodarz_Sklepu`**

**Problem:** Kolumna nie pojawiała się w domyślnym widoku

**Przyczyna:** Case sensitivity - w schemacie jest `Gospodarz_Sklepu` (wielkie S), a w ESSENTIAL_COLUMNS było `Gospodarz_sklepu` (małe s)

**Rozwiązanie:**
```javascript
// BEFORE
'Gospodarz_sklepu'  ❌

// AFTER
'Gospodarz_Sklepu'  ✅
```

### 2. **Dodano KPI: "Zamówienia dzisiaj"**

**Metryka:** Liczba sklepów, które miały ostatnie zamówienie **dzisiaj**

**Implementacja:**
```javascript
// Grupuj po StoreId
const storesByDate = new Map();
dataToAnalyze.forEach(row => {
    if (!storesByDate.has(row.StoreId)) {
        storesByDate.set(row.StoreId, {
            ostatnieZam: row.Ostatnie_zam,
            sumaLinii: row.Suma_linii
        });
    }
});

// Zlicz sklepy gdzie Ostatnie_zam === dzisiaj
storesByDate.forEach((storeData, storeId) => {
    if (isSameDay(storeData.ostatnieZam, today)) {
        storesWithOrderToday++;
    }
});
```

**Wyświetlanie:**
- **Ikona:** `<Today />` (kalendarz)
- **Typ:** `primary` (niebieski)
- **Progress bar:** % sklepów z zamówieniem dzisiaj
- **Subtitle:** "Sklepy z ostatnim zam. dzisiaj"

### 3. **Dodano KPI: "Suma linii dzisiaj"**

**Metryka:** Suma wartości `Suma_linii` dla sklepów, które miały ostatnie zamówienie **dzisiaj**

**Przykład z screenshota:**
- Sklep **2382** - Ostatnie_zam: **08-10-2025** → Suma_linii: **2030**
- Sklep **14** - Ostatnie_zam: **08-10-2025** → Suma_linii: **1571**
- **Suma:** 2030 + 1571 = **3601**

**Implementacja:**
```javascript
storesByDate.forEach((storeData, storeId) => {
    if (isSameDay(storeData.ostatnieZam, today)) {
        sumaLiniiToday += parseFloat(storeData.sumaLinii) || 0;
    }
});
```

**Wyświetlanie:**
- **Ikona:** `<ShoppingCart />` (koszyk)
- **Typ:** `success` (zielony)
- **Wartość:** Liczba sformatowana z separatorami (np. "3 601")
- **Subtitle:** "Łączna suma linii dla zamówień dzisiaj"

### 4. **Dodano helper `isSameDay()`**

**Funkcja:** Porównuje dwie daty (tylko dzień, ignoruje godziny)

**Obsługuje:**
- Excel serial numbers (45204)
- Stringi DD-MM-YYYY
- Stringi YYYY-MM-DD
- Obiekty Date

```javascript
export const isSameDay = (date1, date2) => {
    const d1 = parseDate(date1);
    const d2 = parseDate(date2);
    
    if (!d1 || !d2) return false;
    
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
};
```

## 📊 Layout KPI Cards

**Nowy układ (9 kart):**
1. Sklepy
2. Blockery łącznie
3. Wysokie ryzyko
4. Rekomendacje
5. Dostępność
6. Trendy nasilające
7. **🆕 Zamówienia dzisiaj**
8. **🆕 Suma linii dzisiaj**
9. Niskie ryzyko

## 🐛 Debug

Po wczytaniu danych w konsoli zobaczysz:
```javascript
📅 KPI - Zamówienia dzisiaj: {
  today: "09.10.2025",
  storesWithOrderToday: 2,
  sumaLiniiToday: 3601,
  storesMatching: [
    { storeId: 2382, ostatnieZam: "08-10-2025", sumaLinii: 2030 },
    { storeId: 14, ostatnieZam: "08-10-2025", sumaLinii: 1571 }
  ]
}
```

## 📁 Zmienione pliki

1. ✅ `src/helpers/columnVisibility.helper.js` - Fix: Gospodarz_Sklepu
2. ✅ `src/helpers/dataFormatting.helper.js` - Dodano: parseDate(), isSameDay()
3. ✅ `src/components/KPICards/KPICards.jsx` - Dodano: 2 nowe KPI + debug logging

## 🎯 Testowanie

### Scenariusz 1: Dzisiaj jest 08-10-2025
```
Plik XLSX ma sklepy:
- Sklep 2382: Ostatnie_zam = 08-10-2025, Suma_linii = 2030
- Sklep 14: Ostatnie_zam = 08-10-2025, Suma_linii = 1571
- Sklep 123: Ostatnie_zam = 07-10-2025, Suma_linii = 500

Oczekiwany wynik:
- Zamówienia dzisiaj: 2
- Suma linii dzisiaj: 3601
```

### Scenariusz 2: Dzisiaj jest 09-10-2025
```
(Brak sklepów z zamówieniem 09-10-2025)

Oczekiwany wynik:
- Zamówienia dzisiaj: 0
- Suma linii dzisiaj: 0
```

## ⚠️ Uwagi

1. **Grupowanie po StoreId**: Jeden sklep może mieć wiele wierszy (różne blokery), ale bierzemy tylko **pierwszą** wartość `Suma_linii` dla danego `StoreId`
2. **Data dzisiejsza**: Pobierana z `new Date()` - zależy od czasu systemowego przeglądarki
3. **Formatowanie**: `Suma_linii` jest formatowana z separatorami tysięcy (3 601 zamiast 3601)

## 🚀 Przykład użycia

```javascript
// W KPICards.jsx
const metrics = {
    ...
    storesWithOrderToday: 2,      // Liczba sklepów
    sumaLiniiToday: 3601          // Suma Suma_linii
};

// Rendering
<MainKPICard
    title="Zamówienia dzisiaj"
    value={metrics.storesWithOrderToday.toLocaleString()}
    subtitle="Sklepy z ostatnim zam. dzisiaj"
    icon={<Today />}
    type="primary"
    progress={(metrics.storesWithOrderToday / metrics.totalStores) * 100}
/>
```
