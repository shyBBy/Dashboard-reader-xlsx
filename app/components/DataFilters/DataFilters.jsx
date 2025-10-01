import React, { useState, useMemo, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Stack,
    Chip,
    Grid,
    Toolbar
} from '@mui/material';
import { Search, FilterList, Clear } from '@mui/icons-material';

export const DataFilters = ({ data, onFiltersChange, selectedFilters = {}, filteredCount }) => {
    const [searchTerm, setSearchTerm] = useState(selectedFilters.search || '');
    const [storeId, setStoreId] = useState(selectedFilters.storeId || 'all');
    const [blocker, setBlocker] = useState(selectedFilters.blocker || 'all');
    const [wplyw, setWplyw] = useState(selectedFilters.wplyw || 'all');
    const [rekomendacja, setRekomendacja] = useState(selectedFilters.rekomendacja || 'all');

    // Automatyczne wykrywanie unikalnych wartości z danych
    const uniqueValues = useMemo(() => {
        if (!data || data.length === 0) return {};

        const storeIds = [...new Set(data.map(row => row.StoreId).filter(Boolean))].sort();
        const blockers = [...new Set(data.map(row => row.BlockerName).filter(Boolean))].sort();
        const wplywy = [...new Set(data.map(row => row.Wplyw).filter(Boolean))].sort();
        const rekomendacje = [...new Set(data.map(row => row.Rekomendacja_dzialania).filter(Boolean))].sort();

        return {
            storeIds,
            blockers,
            wplywy,
            rekomendacje
        };
    }, [data]);

    // Real-time filtering - automatyczne wywołanie filtrów przy każdej zmianie
    useEffect(() => {
        const filters = {
            search: searchTerm.trim(),
            storeId: storeId,
            blocker: blocker,
            wplyw: wplyw,
            rekomendacja: rekomendacja
        };
        onFiltersChange(filters);
    }, [searchTerm, storeId, blocker, wplyw, rekomendacja, onFiltersChange]);

    const clearFilters = () => {
        setSearchTerm('');
        setStoreId('all');
        setBlocker('all');
        setWplyw('all');
        setRekomendacja('all');
    };

    const activeFiltersCount = Object.values({
        search: searchTerm,
        storeId: storeId !== 'all' ? storeId : null,
        blocker: blocker !== 'all' ? blocker : null,
        wplyw: wplyw !== 'all' ? wplyw : null,
        rekomendacja: rekomendacja !== 'all' ? rekomendacja : null
    }).filter(Boolean).length;

    return (
        <Paper elevation={2} sx={{ mb: 3 }}>
            {/* Toolbar w stylu Twojej starej aplikacji */}
            <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FilterList sx={{ color: 'primary.main' }} />
                    <Typography variant="h6">
                        Kontrolki tabeli
                    </Typography>
                    {activeFiltersCount > 0 && (
                        <Chip 
                            label={`${activeFiltersCount} aktywnych filtrów`}
                            size="small"
                            color="primary"
                        />
                    )}
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button 
                        variant="outlined" 
                        onClick={clearFilters}
                        startIcon={<Clear />}
                        disabled={activeFiltersCount === 0}
                        size="small"
                    >
                        Wyczyść
                    </Button>
                </Box>
            </Toolbar>

            <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    {/* Szybkie wyszukiwanie - podobne do Twojej starej app */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Szybkie wyszukiwanie"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                            placeholder="Wyszukaj w tabeli..."
                            size="small"
                        />
                    </Grid>

                {/* Filter sklepów (StoreId) */}
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                        <InputLabel>Filtr sklepów</InputLabel>
                        <Select
                            value={storeId}
                            onChange={(e) => setStoreId(e.target.value)}
                            label="Filtr sklepów"
                        >
                            <MenuItem value="all">Wszystkie sklepy</MenuItem>
                            {uniqueValues.storeIds?.map(id => (
                                <MenuItem key={id} value={id}>
                                    Sklep {id}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Filter wpływu */}
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                        <InputLabel>Filtr wagi</InputLabel>
                        <Select
                            value={wplyw}
                            onChange={(e) => setWplyw(e.target.value)}
                            label="Filtr wagi"
                        >
                            <MenuItem value="all">Wszystkie wagi</MenuItem>
                            {uniqueValues.wplywy?.map(w => (
                                <MenuItem key={w} value={w}>
                                    {w}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Filter blockerów */}
                <Grid item xs={12} sm={6} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Filtr blockerów</InputLabel>
                        <Select
                            value={blocker}
                            onChange={(e) => setBlocker(e.target.value)}
                            label="Filtr blockerów"
                        >
                            <MenuItem value="all">Wszystkie blockery</MenuItem>
                            {uniqueValues.blockers?.map(b => (
                                <MenuItem key={b} value={b}>
                                    {b}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Filter rekomendacji */}
                <Grid item xs={12} sm={6} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Filtr rekomendacji</InputLabel>
                        <Select
                            value={rekomendacja}
                            onChange={(e) => setRekomendacja(e.target.value)}
                            label="Filtr rekomendacji"
                        >
                            <MenuItem value="all">Wszystkie rekomendacje</MenuItem>
                            {uniqueValues.rekomendacje?.map(r => (
                                <MenuItem key={r} value={r}>
                                    {r}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Informacja o liczbie rekordów */}
                <Grid item xs={12}>
                    <Box sx={{ p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Dostępnych rekordów:</strong> {data?.length || 0}
                            {activeFiltersCount > 0 && filteredCount !== undefined && (
                                <span> • <strong>Po filtrach:</strong> {filteredCount}</span>
                            )}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            </Box>
        </Paper>
    );
};