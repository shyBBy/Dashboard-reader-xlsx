# 👁️ Widok Szczegółowy - Dokumentacja

## 📋 Opis funkcji

Toggle "Widok szczegółowy" pozwala użytkownikowi przełączać się między dwoma trybami wyświetlania tabeli:

### 🔹 Widok podstawowy (domyślny)
- **Wyświetla**: 11 najważniejszych kolumn biznesowych
- **Cel**: Szybki przegląd kluczowych informacji
- **Kolumny**:
  1. `StoreId` - ID sklepu
  2. `Gospodarz_sklepu` - Imię i nazwisko gospodarza
  3. `Ostatnie_zam` - Data ostatniego zamówienia
  4. `Bloker_ostatnie_zam` - Liczba blokerów w ostatnim zamówieniu
  5. `Najblizsze_zam` - Data najbliższego zamówienia
  6. `Bloker_najblizsze_zam` - Liczba blokerów w najbliższym zamówieniu
  7. `Kolejne_zam` - Data kolejnego zamówienia
  8. `Bloker_kolejne_zam` - Liczba blokerów w kolejnym zamówieniu
  9. `Zera_w_blokerze_ostatnie_zam` - Liczba zer w blokerze ostatniego zamówienia
  10. `Dostepnosc_drogeria` - Dostępność w drogerii (%)
  11. `Rekomendacja_dzialania` - Sugerowane działanie

### 🔸 Widok szczegółowy
- **Wyświetla**: Wszystkie 50 kolumn z pliku XLSX
- **Cel**: Pełna analiza danych
- **Kolumny**: Wszystkie dostępne w pliku

## 🎨 UI/UX

### Komponenty
```
📦 DetailedViewToggle
├── Switch - Przełącznik (domyślnie wyłączony)
├── ViewWeek/ViewColumn - Ikona stanu
├── Chip - "Tylko kluczowe" / "Wszystkie kolumny"
├── Info icon - Tooltip z wyjaśnieniem
└── Stats - "7 / 50" kolumny (43 ukrytych)
```

### Położenie
```
Dashboard
├── KPI Cards
├── Divider
├── 👉 DetailedViewToggle (nowy)
├── DataFilters
└── DynamicDataTable
```

## 🔧 Techniczne

### Pliki
1. **Helper**: `src/helpers/columnVisibility.helper.js`
   - `ESSENTIAL_COLUMNS` - lista 7 kluczowych kolumn
   - `getVisibleHeaders()` - filtruje nagłówki
   - `getColumnStats()` - statystyki kolumn

2. **Komponent**: `src/components/DetailedViewToggle/DetailedViewToggle.jsx`
   - Switch z animacjami
   - Tooltip z wyjaśnieniem
   - Responsywny layout

3. **Integracja**: `src/components/Dashboard/Dashboard.jsx`
   - `useState(detailedView)` - state (domyślnie `false`)
   - Przekazanie `visibleHeaders` do tabeli

### Flow danych
```
User clicks Switch
  ↓
setDetailedView(true/false)
  ↓
getVisibleHeaders(allHeaders, detailedView)
  ↓
visibleHeaders → DynamicDataTable
  ↓
Tabela renderuje tylko widoczne kolumny
```

## 🎯 Przykłady użycia

### Domyślny stan (11 kolumn)
```javascript
detailedView: false
visibleHeaders: ['StoreId', 'Gospodarz_sklepu', 'Ostatnie_zam', 'Bloker_ostatnie_zam', ...]
columnStats: { visible: 11, hidden: 39, total: 50 }
```

### Po włączeniu (50 kolumn)
```javascript
detailedView: true
visibleHeaders: ['StoreId', 'BlockerName', ..., 'Powod_wykluczenia']
columnStats: { visible: 50, hidden: 0, total: 50 }
```

## ✨ Animacje

- **Switch**: Płynne przejście `transition: 0.3s ease`
- **Chip**: Zmiana koloru z `outlined` → `filled`
- **Paper**: Hover effect z `boxShadow`
- **Tabela**: Kolumny fade-in `transition: 0.2s ease`

## 🚀 Zalety

1. **Uproszczony widok** - Użytkownik nie jest przytłoczony 50 kolumnami
2. **Szybszy przegląd** - 7 kolumn zmieści się na ekranie bez scrollowania
3. **Elastyczność** - Jeden klik = pełne dane
4. **Wydajność** - Mniej DOM elements w widoku podstawowym
5. **UX** - Tooltip wyjaśnia co robi toggle

## 📊 Metryki

- **Domyślnie**: 11 kolumn (22% wszystkich)
- **Po włączeniu**: 50 kolumn (100%)
- **Ukryte**: 39 kolumn (78%)
- **Szerokość tabeli**: ~40% mniejsza w widoku podstawowym

## 🔮 Przyszłe ulepszenia

- [ ] Zapamiętanie preferencji w `localStorage`
- [ ] Custom wybór kolumn (multi-select)
- [ ] Predefiniowane widoki (Finanse, Logistyka, Sprzedaż)
- [ ] Export tylko widocznych kolumn do CSV/XLSX
- [ ] Keyboard shortcut (np. `Ctrl+D`)
