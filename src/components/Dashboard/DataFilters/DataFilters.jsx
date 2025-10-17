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
    const [gospodarz, setGospodarz] = useState(selectedFilters.gospodarz || 'all');
    const [lider, setLider] = useState(selectedFilters.lider || 'all');
    const [lw, setLw] = useState(selectedFilters.lw || 'all');
    const [blocker, setBlocker] = useState(selectedFilters.blocker || 'all');
    const [wplyw, setWplyw] = useState(selectedFilters.wplyw || 'all');
    const [rekomendacja, setRekomendacja] = useState(selectedFilters.rekomendacja || 'all');

    // Automatyczne wykrywanie unikalnych wartości z danych
    const uniqueValues = useMemo(() => {
        if (!data || data.length === 0) return {};

        // Sortowanie numeryczne dla StoreId
        const storeIds = [...new Set(data.map(row => row.StoreId).filter(Boolean))]
            .sort((a, b) => Number(a) - Number(b));
        
        const gospodarze = [...new Set(data.map(row => row.Gospodarz_Sklepu).filter(Boolean))].sort();
        const liderzy = [...new Set(data.map(row => row.Lider).filter(Boolean))].sort();
        const lws = [...new Set(data.map(row => row.LW).filter(Boolean))].sort();
        const blockers = [...new Set(data.map(row => row.BlockerName).filter(Boolean))].sort();
        const wplywy = [...new Set(data.map(row => row.Wplyw).filter(Boolean))].sort();
        const rekomendacje = [...new Set(data.map(row => row.Rekomendacja_dzialania).filter(Boolean))].sort();

        return {
            storeIds,
            gospodarze,
            liderzy,
            lws,
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
            gospodarz: gospodarz,
            lider: lider,
            lw: lw,
            blocker: blocker,
            wplyw: wplyw,
            rekomendacja: rekomendacja
        };
        onFiltersChange(filters);
    }, [searchTerm, storeId, gospodarz, lider, lw, blocker, wplyw, rekomendacja, onFiltersChange]);

    const clearFilters = () => {
        setSearchTerm('');
        setStoreId('all');
        setGospodarz('all');
        setLider('all');
        setLw('all');
        setBlocker('all');
        setWplyw('all');
        setRekomendacja('all');
    };

    const activeFiltersCount = Object.values({
        search: searchTerm,
        storeId: storeId !== 'all' ? storeId : null,
        gospodarz: gospodarz !== 'all' ? gospodarz : null,
        lider: lider !== 'all' ? lider : null,
        lw: lw !== 'all' ? lw : null,
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

                {/* Filter sklepów (StoreId) - z możliwością wyszukiwania */}
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                        <InputLabel>Filtr sklepów</InputLabel>
                        <Select
                            value={storeId}
                            onChange={(e) => setStoreId(e.target.value)}
                            label="Filtr sklepów"
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 300,
                                    },
                                },
                            }}
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

                {/* Filter Gospodarza Sklepu */}
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                        <InputLabel>Gospodarz Sklepu</InputLabel>
                        <Select
                            value={gospodarz}
                            onChange={(e) => setGospodarz(e.target.value)}
                            label="Gospodarz Sklepu"
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 300,
                                    },
                                },
                            }}
                        >
                            <MenuItem value="all">Wszyscy gospodarze</MenuItem>
                            {uniqueValues.gospodarze?.map(g => (
                                <MenuItem key={g} value={g}>
                                    {g}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Filter Lidera */}
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                        <InputLabel>Lider</InputLabel>
                        <Select
                            value={lider}
                            onChange={(e) => setLider(e.target.value)}
                            label="Lider"
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 300,
                                    },
                                },
                            }}
                        >
                            <MenuItem value="all">Wszyscy liderzy</MenuItem>
                            {uniqueValues.liderzy?.map(l => (
                                <MenuItem key={l} value={l}>
                                    {l}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Filter LW */}
                <Grid item xs={12} sm={6} md={2}>
                    <FormControl fullWidth>
                        <InputLabel>LW</InputLabel>
                        <Select
                            value={lw}
                            onChange={(e) => setLw(e.target.value)}
                            label="LW"
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 300,
                                    },
                                },
                            }}
                        >
                            <MenuItem value="all">Wszystkie LW</MenuItem>
                            {uniqueValues.lws?.map(lw_val => (
                                <MenuItem key={lw_val} value={lw_val}>
                                    {lw_val}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Filter wpływu */}
                <Grid item xs={12} sm={6} md={2}>
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
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 300,
                                    },
                                },
                            }}
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
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 300,
                                    },
                                },
                            }}
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

                {/* Informacja o interakcji ze StoreId */}
                <Grid item xs={12}>
                    <Box sx={{ p: 2, backgroundColor: 'info.light', borderRadius: 1, mb: 1 }}>
                        <Typography variant="body2" color="info.dark">
                            💡 <strong>Wskazówka:</strong> Aby sprawdzić konkretny sklep, możesz kliknąć na <strong>StoreId</strong> w tabeli.
                        </Typography>
                    </Box>
                </Grid>

                {/* Informacja o liczbie rekordów */}
                <Grid item xs={12}>
                    <Box sx={{ p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Dostępnych rekordów:</strong> {data?.length || 0}
                            {activeFiltersCount > 0 && filteredCount !== undefined && (
                                <span> • <strong>Po filtrach:</strong> {filteredCount}</span>
                            )}
                            {activeFiltersCount > 0 && (
                                <span> • <strong>Aktywnych filtrów:</strong> {activeFiltersCount}</span>
                            )}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            </Box>
        </Paper>
    );
};