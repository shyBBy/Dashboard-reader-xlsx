import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Konstanta dla czasu wygaśnięcia sesji (1 godzina w milisekundach)
const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 godzina
const STORAGE_KEY = 'dashboard-session-metadata';

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

    // Sprawdź localStorage przy starcie - tylko metadane
    useEffect(() => {
        try {
            const savedMetadata = localStorage.getItem(STORAGE_KEY);
            if (savedMetadata) {
                const parsed = JSON.parse(savedMetadata);
                const now = Date.now();
                
                // Sprawdź czy sesja nie wygasła
                if (parsed.loadedAt && (now - parsed.loadedAt) < SESSION_TIMEOUT) {
                    setLoadedAt(parsed.loadedAt);
                    console.log('📊 Metadane sesji przywrócone:', {
                        fileName: parsed.fileName,
                        loadedAt: new Date(parsed.loadedAt).toLocaleString('pl-PL'),
                        totalRows: parsed.totalRows
                    });
                    
                    // Uwaga: Dane nie są przywracane automatycznie - użytkownik musi ponownie wczytać plik
                    console.log('ℹ️ Dane pliku nie są przechowywane - proszę ponownie wczytać plik');
                } else {
                    localStorage.removeItem(STORAGE_KEY);
                    console.log('🕐 Sesja wygasła');
                }
            }
        } catch (err) {
            console.warn('⚠️ Błąd odczytu metadanych sesji:', err.message);
            try {
                localStorage.removeItem(STORAGE_KEY);
            } catch (cleanupErr) {
                console.warn('⚠️ Nie można wyczyścić localStorage:', cleanupErr.message);
            }
        }
    }, []);

    // Automatyczne sprawdzanie wygaśnięcia danych co minutę
    useEffect(() => {
        if (!loadedAt || !excelData) return;

        const interval = setInterval(() => {
            const now = Date.now();
            if (loadedAt && (now - loadedAt) >= SESSION_TIMEOUT) {
                clearData();
                console.log('🕐 Dane automatycznie wygasły po godzinie');
                
                // Powiadom użytkownika
                if (typeof window !== 'undefined' && window.location.pathname !== '/upload') {
                    alert('⏰ Sesja wygasła! Dane zostały automatycznie wyczyszczone po godzinie braku aktywności.');
                }
            }
        }, 60000); // Sprawdzaj co minutę

        return () => clearInterval(interval);
    }, [loadedAt, excelData]);

    // Funkcja do wczytywania danych
    const loadData = useCallback((data) => {
        setLoading(true);
        setError(null);
        
        try {
            const now = Date.now();
            setExcelData(data);
            setLoadedAt(now);
            
            // Zapisz tylko metadane do localStorage (bez danych pliku)
            try {
                const sessionMetadata = {
                    fileName: data?.fileName,
                    totalRows: data?.totalRows,
                    headers: data?.headers,
                    loadedAt: now
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionMetadata));
                console.log('📊 Metadane sesji zapisane do localStorage');
            } catch (storageErr) {
                console.warn('⚠️ Nie można zapisać metadanych do localStorage:', storageErr.message);
                // Kontynuuj bez localStorage - aplikacja będzie działać normalnie
            }
            
            console.log('📊 Dane wczytane do Context:', {
                fileName: data?.fileName,
                totalRows: data?.totalRows,
                loadedAt: new Date(now).toLocaleString('pl-PL')
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
        
        // Usuń metadane z localStorage
        try {
            localStorage.removeItem(STORAGE_KEY);
            console.log('🗑️ Dane i metadane sesji zostały wyczyszczone');
        } catch (err) {
            console.warn('⚠️ Nie można usunąć metadanych z localStorage:', err.message);
        }
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
        headers: excelData?.headers || [],
        
        // Sesja
        sessionTimeRemaining: loadedAt ? Math.max(0, SESSION_TIMEOUT - (Date.now() - loadedAt)) : 0,
        isSessionExpired: loadedAt ? (Date.now() - loadedAt) >= SESSION_TIMEOUT : false
    };

    return (
        <ExcelDataContext.Provider value={value}>
            {children}
        </ExcelDataContext.Provider>
    );
};