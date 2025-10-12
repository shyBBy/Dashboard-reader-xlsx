/**
 * Konfiguracja API dla Dashboard Reader XLSX
 * Ustawienia połączenia z Python FastAPI backend
 */

// Automatyczne wykrywanie środowiska
const isDevelopment = import.meta.env.DEV;

// Konfiguracja dla różnych środowisk
const config = {
    // Lokalne API (Python FastAPI)
    API_URL: isDevelopment 
        ? 'http://localhost:8000' // Dev - lokalne API Python (bez /api prefix)
        : 'http://192.168.1.100:8000', // Production - IP w sieci lokalnej
    
    // Timeouts
    REQUEST_TIMEOUT: 30000, // 30 sekund
    
    // Retry settings
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 sekunda
    
    // Pagination
    DEFAULT_PAGE_SIZE: 100,
    MAX_PAGE_SIZE: 1000,
    
    // Headers
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    
    // Debug mode
    DEBUG: isDevelopment,
};

export { config };