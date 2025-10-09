import React, { createContext, useContext, useState, useCallback } from 'react';

// Tworzenie Context
const ExcelDataContext = createContext();

// Hook do używania Context
export const useExcelData = () => {
    const context = useContext(ExcelDataContext);
    if (!context) {
        throw new Error('useExcelData must be used within ExcelDataProvider');
    }
    return context;
};

// Provider dla Context
export const ExcelDataProvider = ({ children }) => {
    const [excelData, setExcelData] = useState(null);
    const [loadedAt, setLoadedAt] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Brak sessionStorage - duże pliki nie mieszczą się w quota
    // Dane dostępne tylko w pamięci podczas sesji

    // Funkcja do wczytywania danych
    const loadData = useCallback((data) => {
        setLoading(true);
        setError(null);
        
        try {
            const now = Date.now();
            setExcelData(data);
            setLoadedAt(now);
            
            console.log('� Dane wczytane do Context (tylko pamięć):', {
                fileName: data?.fileName,
                totalRows: data?.totalRows,
                loadedAt: new Date(now).toLocaleString('pl-PL'),
                note: 'Dane dostępne tylko w sesji - po F5 należy wgrać plik ponownie'
            });
        } catch (err) {
            setError(err.message);
            console.error('❌ Błąd wczytywania danych:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Funkcja do usuwania danych (reset)
    const clearData = useCallback(() => {
        setExcelData(null);
        setLoadedAt(null);
        setError(null);
        setLoading(false);
        console.log('🗑️ Dane wyczyszczone z Context');
    }, []);

    // Funkcja do obsługi błędów
    const handleError = useCallback((errorMessage) => {
        setError(errorMessage);
        setLoading(false);
        console.error('❌ Błąd:', errorMessage);
    }, []);

    const value = {
        // Stan
        excelData,
        loadedAt,
        loading,
        error,
        
        // Funkcje
        loadData,
        clearData,
        handleError,
        
        // Pomocnicze
        hasData: !!excelData,
        totalRows: excelData?.totalRows || 0,
        fileName: excelData?.fileName || null,
        headers: excelData?.headers || []
    };

    return (
        <ExcelDataContext.Provider value={value}>
            {children}
        </ExcelDataContext.Provider>
    );
};