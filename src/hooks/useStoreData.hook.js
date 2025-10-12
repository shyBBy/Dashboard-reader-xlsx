import { useState, useEffect } from 'react';
import api from '../api/api';

/**
 * Hook do pobierania danych konkretnego sklepu
 * @param {string} storeId - ID sklepu
 * @returns {Object} - dane sklepu, loading, error
 */
export const useStoreData = (storeId) => {
    const [storeData, setStoreData] = useState(null);
    const [storeBlockers, setStoreBlockers] = useState([]);
    const [storeStats, setStoreStats] = useState(null);
    const [storeHighImpact, setStoreHighImpact] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!storeId) return;

        const fetchStoreData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                console.log(`🏪 Pobieranie danych dla sklepu ${storeId}...`);

                // Najpierw spróbuj pobrać blokery - to jest główne źródło danych
                const blockersResponse = await api.getStoreBlockers(storeId);
                console.log(`📦 Blokery dla sklepu ${storeId}:`, blockersResponse);
                
                setStoreBlockers(blockersResponse?.data || blockersResponse || []);

                // Opcjonalnie pobierz inne dane (mogą nie istnieć)
                try {
                    const [storeResponse, statsResponse, highImpactResponse] = await Promise.allSettled([
                        api.getStore(storeId),
                        api.getStoreStats(storeId),
                        api.getStoreHighImpactBlockers(storeId)
                    ]);

                    if (storeResponse.status === 'fulfilled') {
                        setStoreData(storeResponse.value);
                    }
                    if (statsResponse.status === 'fulfilled') {
                        setStoreStats(statsResponse.value);
                    }
                    if (highImpactResponse.status === 'fulfilled') {
                        setStoreHighImpact(highImpactResponse.value || []);
                    }

                    console.log(`✅ Dane sklepu ${storeId} pobrane:`, {
                        blockers: (blockersResponse?.data || blockersResponse || []).length,
                        store: storeResponse.status === 'fulfilled' ? 'OK' : 'Brak',
                        stats: statsResponse.status === 'fulfilled' ? 'OK' : 'Brak',
                        highImpact: highImpactResponse.status === 'fulfilled' ? 'OK' : 'Brak'
                    });
                } catch (optionalErr) {
                    console.warn(`⚠️ Niektóre opcjonalne dane sklepu ${storeId} nie zostały pobrane:`, optionalErr);
                }

            } catch (err) {
                console.error(`❌ Błąd pobierania blokerów sklepu ${storeId}:`, err);
                setError(err.message || 'Błąd pobierania danych sklepu');
            } finally {
                setIsLoading(false);
            }
        };

        fetchStoreData();
    }, [storeId]);

    const refreshStoreData = () => {
        if (storeId) {
            setStoreData(null);
            setStoreBlockers([]);
            setStoreStats(null);
            setStoreHighImpact([]);
            // Uruchom ponownie fetchowanie
            const fetchStoreData = async () => {
                setIsLoading(true);
                setError(null);

                try {
                    console.log(`🔄 Odświeżanie danych dla sklepu ${storeId}...`);
                    const blockersResponse = await api.getStoreBlockers(storeId);
                    console.log(`📦 Odświeżone blokery dla sklepu ${storeId}:`, blockersResponse);
                    
                    setStoreBlockers(blockersResponse?.data || blockersResponse || []);

                } catch (err) {
                    console.error(`❌ Błąd odświeżania danych sklepu ${storeId}:`, err);
                    setError(err.message || 'Błąd odświeżania danych sklepu');
                } finally {
                    setIsLoading(false);
                }
            };

            fetchStoreData();
        }
    };

    return {
        storeData,
        storeBlockers,
        storeStats,
        storeHighImpact,
        isLoading,
        error,
        refreshStoreData,
        hasData: !!(storeBlockers && storeBlockers.length > 0) // Głównie zależy od blokerów
    };
};