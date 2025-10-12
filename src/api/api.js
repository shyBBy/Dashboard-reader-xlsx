import { config } from "../config/config.js";

class API {
    constructor() {
        this.baseUrl = config.API_URL;
    }

    // ==================== HEALTH CHECK ====================

    async healthCheck() {
        try {
            const response = await fetch(`${this.baseUrl}/`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Błąd sprawdzania statusu API:', error);
            throw error;
        }
    }

    // ==================== BLOCKERS ENDPOINTS ====================

    async getAllBlockers() {
        try {
            const response = await fetch(`${this.baseUrl}/api/blockers/`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Błąd pobierania wszystkich blokerów:', error);
            throw error;
        }
    }

    async getBlockerStats() {
        try {
            const response = await fetch(`${this.baseUrl}/api/blockers/stats`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Błąd pobierania statystyk blokerów:', error);
            throw error;
        }
    }

    async getStoreBlockers(storeId) {
        try {
            const response = await fetch(`${this.baseUrl}/api/blockers/store/${storeId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Błąd pobierania blokerów sklepu ${storeId}:`, error);
            throw error;
        }
    }

    async getHighImpactBlockers() {
        try {
            const response = await fetch(`${this.baseUrl}/api/blockers/high-impact`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Błąd pobierania blokerów wysokiego wpływu:', error);
            throw error;
        }
    }

    async searchBlockers(query) {
        try {
            const response = await fetch(`${this.baseUrl}/api/blockers/search?q=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Błąd wyszukiwania blokerów: ${query}`, error);
            throw error;
        }
    }

    async refreshData() {
        try {
            const response = await fetch(`${this.baseUrl}/api/blockers/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Błąd odświeżania danych:', error);
            throw error;
        }
    }

    // ==================== STORES ENDPOINTS ====================

    async getAllStores() {
        try {
            const response = await fetch(`${this.baseUrl}/api/stores/`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Błąd pobierania wszystkich sklepów:', error);
            throw error;
        }
    }

    async getStore(storeId) {
        try {
            const response = await fetch(`${this.baseUrl}/api/stores/${storeId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Błąd pobierania sklepu ${storeId}:`, error);
            throw error;
        }
    }

    async getStoreStats(storeId) {
        try {
            const response = await fetch(`${this.baseUrl}/api/stores/${storeId}/stats`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Błąd pobierania statystyk sklepu ${storeId}:`, error);
            throw error;
        }
    }

    async getStoreHighImpactBlockers(storeId) {
        try {
            const response = await fetch(`${this.baseUrl}/api/stores/${storeId}/high-impact`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Błąd pobierania blokerów wysokiego wpływu sklepu ${storeId}:`, error);
            throw error;
        }
    }

    async searchStores(query) {
        try {
            const response = await fetch(`${this.baseUrl}/api/stores/search/?q=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Błąd wyszukiwania sklepów: ${query}`, error);
            throw error;
        }
    }
}

// Eksportujemy singleton instance
export default new API();