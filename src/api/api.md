# Blokery DZZwD API - Dokumentacja dla React.js

## 🌐 Base URL
```
http://localhost:8000
```

## 📋 Spis treści
- [Health Check](#health-check)
- [Blockers API](#blockers-api)
- [Stores API](#stores-api)
- [TypeScript Interfaces](#typescript-interfaces)
- [Axios Examples](#axios-examples)

---

## 🏥 Health Check

### GET `/`
**Opis:** Sprawdza status API i liczbę załadowanych rekordów  
**Odpowiedź:**
```json
{
  "success": true,
  "message": "Blokery DZZwD API is running",
  "data": {
    "app": "Blokery DZZwD API",
    "version": "1.0.0",
    "status": "healthy",
    "records_loaded": 20374
  }
}
```

---

## 🚫 Blockers API

### GET `/api/blockers/`
**Opis:** Pobiera wszystkie blokery (20,374 rekordów)  
**Odpowiedź:**
```json
{
  "success": true,
  "message": "Successfully retrieved all blockers",
  "data": [
    {
      "StoreId": 1,
      "Gospodarz_Sklepu": "Antoni Pietruszka",
      "Lider": "0",
      "LW": "Marcin Potępa",
      "BlockerName": "StoreVolume",
      "Ostatnie_zam": "2025-10-09T00:00:00",
      "Bloker_ostatnie_zam": 198,
      "Najblizsze_zam": "2025-10-13T00:00:00",
      "Bloker_najblizsze_zam": 198,
      "Kolejne_zam": "2025-10-16T00:00:00",
      "Bloker_kolejne_zam": 101,
      "Zera_w_blokerze_ostatnie_zam": 24,
      "Udzial_procentowy_zer_w_powodzie": 0.12,
      "Dostepnosc_siec": 96.44,
      "Dostepnosc_drogeria": 97.36,
      "Suma_linii": 1484,
      "Wplyw": "WYSOKI",
      "Opis": "wysyłka ograniczona przez brak miejsca w widełkach drogerii",
      "Rekomendacja": "Analiza poprawności widełek lub zmniejszenie zatowarowania drogerii",
      "Trend_analiza": "PROBLEM_W_PRZYSZLOSCI",
      "Decyzja": "REKOMENDUJ",
      "Kwalifikuje_sie": 1,
      "Waga": 1.0
      // ... więcej pól z Excel
    }
  ],
  "total": 20374
}
```

### GET `/api/blockers/stats`
**Opis:** Statystyki blokerów  
**Odpowiedź:**
```json
{
  "success": true,
  "message": "Successfully retrieved blockers statistics",
  "data": {
    "total_records": 20374,
    "unique_stores": 762,
    "unique_blockers": 15,
    "high_impact_count": 8756
  }
}
```

### GET `/api/blockers/store/{store_id}`
**Opis:** Blokery dla konkretnego sklepu  
**Parametry:** `store_id` (int) - ID sklepu  
**Przykład:** `/api/blockers/store/1`  
**Odpowiedź:** Jak `/api/blockers/` ale tylko dla danego sklepu

### GET `/api/blockers/blocker/{blocker_name}`
**Opis:** Blokery o konkretnej nazwie  
**Parametry:** `blocker_name` (string) - nazwa blokera  
**Przykład:** `/api/blockers/blocker/StoreVolume`

### GET `/api/blockers/high-impact`
**Opis:** Tylko blokery o wysokim wpływie (`Wplyw = "WYSOKI"`)

### GET `/api/blockers/search?q={query}`
**Opis:** Wyszukiwanie blokerów  
**Query params:** `q` (string, min 2 znaki) - fraza do wyszukania  
**Przykład:** `/api/blockers/search?q=volume`

### POST `/api/blockers/refresh`
**Opis:** Odświeża dane z pliku Excel

---

## 🏪 Stores API

### GET `/api/stores/`
**Opis:** Lista wszystkich sklepów z podstawowymi informacjami  
**Odpowiedź:**
```json
{
  "success": true,
  "message": "Successfully retrieved all stores",
  "data": [
    {
      "store_id": 1,
      "store_manager": "Antoni Pietruszka",
      "leader": "0",
      "lw": "Marcin Potępa",
      "blocker_count": 42
    },
    {
      "store_id": 2,
      "store_manager": "Jan Kowalski",
      "leader": "Maria Nowak",
      "lw": "Piotr Wiśniewski",
      "blocker_count": 18
    }
  ],
  "total": 762
}
```

### GET `/api/stores/{store_id}`
**Opis:** Podstawowe informacje o sklepie  
**Parametry:** `store_id` (int) - ID sklepu  
**Przykład:** `/api/stores/32`  
**Odpowiedź:**
```json
{
  "success": true,
  "message": "Successfully retrieved store 32 information",
  "data": {
    "store_id": 32,
    "store_manager": "Antoni Pietruszka",
    "leader": "0",
    "lw": "Marcin Potępa",
    "total_records": 42
  }
}
```

### GET `/api/stores/{store_id}/blockers`
**Opis:** Wszystkie blokery dla sklepu  
**Parametry:** `store_id` (int) - ID sklepu  
**Przykład:** `/api/stores/32/blockers`  
**Odpowiedź:** Jak `/api/blockers/` ale tylko dla danego sklepu

### GET `/api/stores/{store_id}/stats`
**Opis:** Kompletne statystyki sklepu  
**Parametry:** `store_id` (int) - ID sklepu  
**Przykład:** `/api/stores/32/stats`  
**Odpowiedź:**
```json
{
  "success": true,
  "message": "Successfully retrieved statistics for store 32",
  "data": {
    "store_id": 32,
    "store_manager": "Antoni Pietruszka",
    "leader": "0",
    "lw": "Marcin Potępa",
    "total_blockers": 42,
    "high_impact_blockers": 18,
    "unique_blocker_types": 7,
    "last_order_date": "2025-10-09T00:00:00",
    "next_order_date": "2025-10-13T00:00:00"
  }
}
```

### GET `/api/stores/{store_id}/high-impact`
**Opis:** Blokery wysokiego wpływu dla sklepu  
**Parametry:** `store_id` (int) - ID sklepu  
**Przykład:** `/api/stores/32/high-impact`

### GET `/api/stores/{store_id}/blockers/{blocker_name}`
**Opis:** Konkretny typ blokera dla sklepu  
**Parametry:** 
- `store_id` (int) - ID sklepu
- `blocker_name` (string) - nazwa blokera  
**Przykład:** `/api/stores/32/blockers/StoreVolume`

### GET `/api/stores/search/?q={query}`
**Opis:** Wyszukiwanie sklepów po menedżerze/liderze/LW  
**Query params:** `q` (string, min 2 znaki) - fraza do wyszukania  
**Przykład:** `/api/stores/search/?q=Antoni`

---

## 🔧 TypeScript Interfaces

```typescript
// Podstawowa odpowiedź API
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  total?: number;
}

// Rekord blokera (pełny)
interface BlockerRecord {
  StoreId: number;
  Gospodarz_Sklepu: string;
  Lider: string;
  LW: string;
  BlockerName: string;
  Ostatnie_zam: string; // ISO date
  Bloker_ostatnie_zam: number;
  Najblizsze_zam: string; // ISO date
  Bloker_najblizsze_zam: number;
  Kolejne_zam: string; // ISO date
  Bloker_kolejne_zam: number;
  Zera_w_blokerze_ostatnie_zam: number;
  Udzial_procentowy_zer_w_powodzie: number;
  Dostepnosc_siec: number;
  Dostepnosc_drogeria: number;
  Suma_linii: number;
  Wplyw: "WYSOKI" | "SREDNI" | "NISKI";
  Opis: string;
  Rekomendacja: string;
  Trend_analiza: string;
  Decyzja: string;
  Kwalifikuje_sie: number;
  Waga: number;
  // ... więcej pól z Excel
}

// Statystyki blokerów
interface BlockerStats {
  total_records: number;
  unique_stores: number;
  unique_blockers: number;
  high_impact_count: number;
}

// Podstawowe info o sklepie
interface StoreBasic {
  store_id: number;
  store_manager: string;
  leader: string;
  lw: string;
  blocker_count: number;
}

// Szczegółowe statystyki sklepu
interface StoreStats {
  store_id: number;
  store_manager: string;
  leader: string;
  lw: string;
  total_blockers: number;
  high_impact_blockers: number;
  unique_blocker_types: number;
  last_order_date: string; // ISO date
  next_order_date: string; // ISO date
}

// Status aplikacji
interface AppStatus {
  app: string;
  version: string;
  status: string;
  records_loaded: number;
}
```

---

## 📡 Axios Examples

```typescript
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

// Health check
const checkHealth = async (): Promise<ApiResponse<AppStatus>> => {
  const response = await axios.get(`${API_BASE}/`);
  return response.data;
};

// Wszystkie blokery
const getAllBlockers = async (): Promise<ApiResponse<BlockerRecord[]>> => {
  const response = await axios.get(`${API_BASE}/api/blockers/`);
  return response.data;
};

// Statystyki blokerów
const getBlockerStats = async (): Promise<ApiResponse<BlockerStats>> => {
  const response = await axios.get(`${API_BASE}/api/blockers/stats`);
  return response.data;
};

// Wszystkie sklepy
const getAllStores = async (): Promise<ApiResponse<StoreBasic[]>> => {
  const response = await axios.get(`${API_BASE}/api/stores/`);
  return response.data;
};

// Konkretny sklep
const getStore = async (storeId: number): Promise<ApiResponse<StoreBasic>> => {
  const response = await axios.get(`${API_BASE}/api/stores/${storeId}`);
  return response.data;
};

// Statystyki sklepu
const getStoreStats = async (storeId: number): Promise<ApiResponse<StoreStats>> => {
  const response = await axios.get(`${API_BASE}/api/stores/${storeId}/stats`);
  return response.data;
};

// Blokery dla sklepu
const getStoreBlockers = async (storeId: number): Promise<ApiResponse<BlockerRecord[]>> => {
  const response = await axios.get(`${API_BASE}/api/stores/${storeId}/blockers`);
  return response.data;
};

// Wyszukiwanie sklepów
const searchStores = async (query: string): Promise<ApiResponse<StoreBasic[]>> => {
  const response = await axios.get(`${API_BASE}/api/stores/search/?q=${encodeURIComponent(query)}`);
  return response.data;
};

// Wyszukiwanie blokerów
const searchBlockers = async (query: string): Promise<ApiResponse<BlockerRecord[]>> => {
  const response = await axios.get(`${API_BASE}/api/blockers/search?q=${encodeURIComponent(query)}`);
  return response.data;
};
```

---

## 🚨 Error Handling

Wszystkie endpointy mogą zwrócić błędy w formacie:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Error type",
  "details": "Detailed error info"
}
```

**Kody HTTP:**
- `200` - OK
- `404` - Not Found (np. sklep nie istnieje)
- `422` - Validation Error (błędne parametry)
- `500` - Internal Server Error

---

## 🎯 React Hook Example

```typescript
import { useState, useEffect } from 'react';

const useStoreData = (storeId: number) => {
  const [data, setData] = useState<StoreStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);
        const response = await getStoreStats(storeId);
        
        if (response.success) {
          setData(response.data);
          setError(null);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError('Failed to fetch store data');
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [storeId]);

  return { data, loading, error };
};
```

---

## 📝 Notatki dla developera

1. **CORS jest skonfigurowany** - React app powinien działać bez problemów
2. **Wszystkie daty w formacie ISO** - użyj `new Date(dateString)` w JS
3. **Pole `success`** - zawsze sprawdzaj przed użyciem `data`
4. **Paginacja** - aktualnie brak, wszystkie dane są zwracane na raz
5. **Cache** - rozważ cache'owanie danych w React (React Query/SWR)
6. **Loading states** - dane mogą być duże (20k+ rekordów)

---

## 🔗 Przydatne linki

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Health Check:** http://localhost:8000/