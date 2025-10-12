import React, { useState } from 'react';
import { 
    Box, 
    Button, 
    Typography, 
    Card, 
    CardContent, 
    Alert,
    Chip,
    Grid
} from '@mui/material';
import { 
    CheckCircle, 
    Error, 
    Refresh,
    DataObject,
    Store as StoreIcon
} from '@mui/icons-material';
import { useApiData } from '../../context/ApiDataContext';
import Api from '../../api/api';

/**
 * Komponent do testowania i debugowania API połączenia
 * Pokazuje status API, dane, i pozwala na ręczne operacje
 */
export const ApiTestPanel = () => {
    const { 
        isApiConnected, 
        isLoading, 
        error, 
        blockers, 
        stores, 
        stats, 
        lastUpdated,
        refreshData,
        checkApiConnection 
    } = useApiData();

    const [testResults, setTestResults] = useState({});
    const [testing, setTesting] = useState(false);

    // Test wszystkich endpointów
    const runApiTests = async () => {
        setTesting(true);
        const results = {};

        const endpoints = [
            { name: 'Health Check', method: 'healthCheck' },
            { name: 'All Blockers', method: 'getAllBlockers' },
            { name: 'All Stores', method: 'getAllStores' },
            { name: 'Blocker Stats', method: 'getBlockerStats' },
            { name: 'Search Blockers', method: 'searchBlockers', args: ['volume'] },
            { name: 'Search Stores', method: 'searchStores', args: ['Antoni'] },
        ];

        for (const endpoint of endpoints) {
            try {
                const startTime = Date.now();
                const response = await Api[endpoint.method](...(endpoint.args || []));
                const endTime = Date.now();
                
                results[endpoint.name] = {
                    success: response.success || false,
                    responseTime: endTime - startTime,
                    dataLength: Array.isArray(response.data) ? response.data.length : 'N/A',
                    message: response.message || 'OK'
                };
            } catch (error) {
                results[endpoint.name] = {
                    success: false,
                    error: error.message,
                    responseTime: 0
                };
            }
        }

        setTestResults(results);
        setTesting(false);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <DataObject />
                API Test Panel
            </Typography>

            {/* Status Overview */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Połączenie API
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                {isApiConnected ? (
                                    <Chip icon={<CheckCircle />} label="Połączono" color="success" />
                                ) : (
                                    <Chip icon={<Error />} label="Rozłączono" color="error" />
                                )}
                                {isLoading && (
                                    <Chip label="Ładowanie..." color="info" />
                                )}
                            </Box>
                            {error && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {error}
                                </Alert>
                            )}
                            <Box sx={{ mt: 2 }}>
                                <Button 
                                    variant="outlined" 
                                    onClick={checkApiConnection}
                                    startIcon={<CheckCircle />}
                                    sx={{ mr: 1 }}
                                >
                                    Test Połączenia
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    onClick={refreshData}
                                    startIcon={<Refresh />}
                                    disabled={isLoading}
                                >
                                    Odśwież Dane
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Dane w pamięci
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Chip 
                                    icon={<DataObject />} 
                                    label={`Blokery: ${blockers.length}`} 
                                    color={blockers.length > 0 ? 'success' : 'default'}
                                />
                                <Chip 
                                    icon={<StoreIcon />} 
                                    label={`Sklepy: ${stores.length}`} 
                                    color={stores.length > 0 ? 'success' : 'default'}
                                />
                                <Chip 
                                    label={`Statystyki: ${stats ? 'Załadowane' : 'Brak'}`} 
                                    color={stats ? 'success' : 'default'}
                                />
                                {lastUpdated && (
                                    <Typography variant="caption" color="text.secondary">
                                        Ostatnia aktualizacja: {lastUpdated.toLocaleString()}
                                    </Typography>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* API Tests */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Test wszystkich endpointów
                    </Typography>
                    <Button 
                        variant="contained" 
                        onClick={runApiTests}
                        disabled={testing}
                        sx={{ mb: 3 }}
                    >
                        {testing ? 'Testowanie...' : 'Uruchom testy API'}
                    </Button>

                    {Object.keys(testResults).length > 0 && (
                        <Box>
                            {Object.entries(testResults).map(([name, result]) => (
                                <Box key={name} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                        <Typography variant="subtitle1">{name}</Typography>
                                        <Chip 
                                            icon={result.success ? <CheckCircle /> : <Error />}
                                            label={result.success ? 'OK' : 'BŁĄD'} 
                                            color={result.success ? 'success' : 'error'}
                                            size="small"
                                        />
                                        {result.responseTime !== undefined && (
                                            <Chip 
                                                label={`${result.responseTime}ms`} 
                                                size="small" 
                                                variant="outlined"
                                            />
                                        )}
                                    </Box>
                                    {result.dataLength !== undefined && (
                                        <Typography variant="body2" color="text.secondary">
                                            Dane: {result.dataLength} rekordów
                                        </Typography>
                                    )}
                                    {result.error && (
                                        <Typography variant="body2" color="error">
                                            Błąd: {result.error}
                                        </Typography>
                                    )}
                                    {result.message && result.message !== 'OK' && (
                                        <Typography variant="body2" color="text.secondary">
                                            {result.message}
                                        </Typography>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default ApiTestPanel;