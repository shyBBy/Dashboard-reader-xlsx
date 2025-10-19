import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Api from '../api/api';
import { normalizeExcelDataset } from '../helpers/dataFormatting.helper';

// Context dla danych z API
const ApiDataContext = createContext();

// Hook do używania API data context
export const useApiData = () => {
  const context = useContext(ApiDataContext);
  if (!context) {
    throw new Error('useApiData must be used within an ApiDataProvider');
  }
  return context;
};

/**
 * Provider dla danych z Python FastAPI
 * Zastępuje ExcelDataContext - teraz dane przychodzą z API, nie z uploadu
 */
export const ApiDataProvider = ({ children }) => {
  // Stan danych
  const [blockers, setBlockers] = useState([]);
  const [stores, setStores] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Stan API connection
  const [isApiConnected, setIsApiConnected] = useState(false);

  // Sprawdź połączenie z API
  const checkApiConnection = useCallback(async () => {
    try {
      const response = await Api.healthCheck();
      if (response.success) {
        setIsApiConnected(true);
        setError(null);
        return true;
      } else {
        setIsApiConnected(false);
        setError('API nie odpowiada poprawnie');
        return false;
      }
    } catch (error) {
      setIsApiConnected(false);
      setError(`Błąd połączenia z API: ${error.message}`);
      console.error('API connection failed:', error);
      return false;
    }
  }, []);

  // Pobierz wszystkie dane
  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Sprawdź czy API działa
      const isConnected = await checkApiConnection();
      if (!isConnected) {
        return;
      }

      // Pobierz równolegle wszystkie potrzebne dane
      const [blockersResponse, storesResponse, statsResponse] = await Promise.all([
        Api.getAllBlockers(),
        Api.getAllStores(),
        Api.getBlockerStats(),
      ]);

      // Sprawdź czy wszystkie odpowiedzi są OK
      if (blockersResponse.success && storesResponse.success && statsResponse.success) {
        setBlockers(normalizeExcelDataset(blockersResponse.data || []));
        setStores(normalizeExcelDataset(storesResponse.data || []));
        setStats(normalizeExcelDataset(statsResponse.data || null));
        setLastUpdated(new Date());
        setError(null);
        
        console.log(`✅ Dane załadowane: ${blockersResponse.data?.length || 0} blokerów, ${storesResponse.data?.length || 0} sklepów`);
      } else {
        const errors = [
          !blockersResponse.success && `Blokery: ${blockersResponse.message}`,
          !storesResponse.success && `Sklepy: ${storesResponse.message}`,
          !statsResponse.success && `Statystyki: ${statsResponse.message}`,
        ].filter(Boolean);
        
        setError(`Błąd pobierania danych: ${errors.join(', ')}`);
      }
    } catch (error) {
      setError(`Błąd podczas pobierania danych: ${error.message}`);
      console.error('Fetch data error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [checkApiConnection]);

  // Odśwież dane z serwera (wymusza reload Excel w Python)
  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await Api.refreshData();
      if (response.success) {
        // Po odświeżeniu pobierz dane ponownie
        await fetchAllData();
      } else {
        setError(`Błąd odświeżania danych: ${response.message}`);
      }
    } catch (error) {
      setError(`Błąd odświeżania danych: ${error.message}`);
      console.error('Refresh data error:', error);
    }
  }, [fetchAllData]);

  // Pobierz dane konkretnego sklepu
  const getStoreData = useCallback(async (storeId) => {
    try {
      const response = await Api.getStoreStats(storeId);
      if (response.success) {
        return normalizeExcelDataset(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(`Błąd pobierania danych sklepu ${storeId}:`, error);
      throw error;
    }
  }, []);

  // Pobierz blokery dla sklepu
  const getStoreBlockers = useCallback(async (storeId) => {
    try {
      const response = await Api.getStoreBlockers(storeId);
      if (response.success) {
        return normalizeExcelDataset(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(`Błąd pobierania blokerów sklepu ${storeId}:`, error);
      throw error;
    }
  }, []);

  // Wyszukaj blokery
  const searchBlockers = useCallback(async (query) => {
    try {
      if (!query || query.length < 2) return [];
      
      const response = await Api.searchBlockers(query);
      if (response.success) {
        return normalizeExcelDataset(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(`Błąd wyszukiwania blokerów:`, error);
      return [];
    }
  }, []);

  // Wyszukaj sklepy
  const searchStores = useCallback(async (query) => {
    try {
      if (!query || query.length < 2) return [];
      
      const response = await Api.searchStores(query);
      if (response.success) {
        return normalizeExcelDataset(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(`Błąd wyszukiwania sklepów:`, error);
      return [];
    }
  }, []);

  // Załaduj dane przy starcie
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Context value
  const contextValue = {
    // Data
    blockers,
    stores,
    stats,
    
    // States
    isLoading,
    error,
    isApiConnected,
    lastUpdated,
    
    // Actions
    fetchAllData,
    refreshData,
    getStoreData,
    getStoreBlockers,
    searchBlockers,
    searchStores,
    checkApiConnection,
    
    // Computed values (kompatybilność z ExcelDataContext)
    hasData: blockers.length > 0,
    totalRows: blockers.length,
    totalStores: stores.length,
    
    // Legacy compatibility - mapuje na nowy format
    excelData: {
      data: blockers,
      headers: blockers.length > 0 ? Object.keys(blockers[0]) : [],
      fileName: 'API Data',
      totalRows: blockers.length,
    },
  };

  return (
    <ApiDataContext.Provider value={contextValue}>
      {children}
    </ApiDataContext.Provider>
  );
};