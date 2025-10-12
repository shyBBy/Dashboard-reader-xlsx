import React from 'react';
import { 
    Box, 
    Typography, 
    Card, 
    CardContent, 
    Grid,
    Chip,
    useTheme 
} from '@mui/material';
import { 
    Palette,
    Brightness4,
    Brightness7,
    ColorLens
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../context/ThemeContext';

/**
 * Komponent demonstracyjny dla theme systemu
 * Pokazuje kolory, typografię i style w aktualnym trybie
 */
export const ThemeShowcase = () => {
    const theme = useTheme();
    const { isDarkMode } = useCustomTheme();

    const colorPairs = [
        { name: 'Primary', color: theme.palette.primary.main, text: theme.palette.primary.contrastText },
        { name: 'Secondary', color: theme.palette.secondary.main, text: theme.palette.secondary.contrastText },
        { name: 'Success', color: theme.palette.success.main, text: theme.palette.success.contrastText },
        { name: 'Warning', color: theme.palette.warning.main, text: theme.palette.warning.contrastText },
        { name: 'Error', color: theme.palette.error.main, text: theme.palette.error.contrastText },
        { name: 'Info', color: theme.palette.info.main, text: theme.palette.info.contrastText },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
                    <ColorLens sx={{ fontSize: 32, color: 'primary.main' }} />
                    <Typography 
                        variant="h4" 
                        sx={{
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 800,
                        }}
                    >
                        Theme Showcase
                    </Typography>
                </Box>
                
                <Chip 
                    icon={isDarkMode ? <Brightness4 /> : <Brightness7 />}
                    label={`Aktualny tryb: ${isDarkMode ? 'Ciemny' : 'Jasny'}`}
                    color="primary"
                    variant="outlined"
                />
            </Box>

            <Grid container spacing={3}>
                {/* Paleta kolorów */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Palette />
                                Paleta kolorów
                            </Typography>
                            
                            <Grid container spacing={2}>
                                {colorPairs.map((item) => (
                                    <Grid item xs={6} sm={4} key={item.name}>
                                        <Box
                                            sx={{
                                                backgroundColor: item.color,
                                                color: item.text,
                                                p: 2,
                                                borderRadius: 2,
                                                textAlign: 'center',
                                                minHeight: 80,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                boxShadow: `0 4px 12px ${item.color}30`,
                                            }}
                                        >
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                {item.name}
                                            </Typography>
                                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                                {item.color}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Typografia */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Typografia
                            </Typography>
                            
                            <Box sx={{ '& > *': { mb: 1 } }}>
                                <Typography variant="h1">Heading 1</Typography>
                                <Typography variant="h2">Heading 2</Typography>
                                <Typography variant="h3">Heading 3</Typography>
                                <Typography variant="h4">Heading 4</Typography>
                                <Typography variant="h5">Heading 5</Typography>
                                <Typography variant="h6">Heading 6</Typography>
                                <Typography variant="body1">Body 1 - Lorem ipsum dolor sit amet consectetur.</Typography>
                                <Typography variant="body2">Body 2 - Mniejszy tekst dla opisów.</Typography>
                                <Typography variant="caption">Caption - Bardzo mały tekst</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Glass morphism */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Glass Morphism Effect
                            </Typography>
                            
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Box
                                    sx={{
                                        backgroundColor: theme.palette.glass?.background || 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(20px)',
                                        border: `1px solid ${theme.palette.glass?.border || 'rgba(255, 255, 255, 0.2)'}`,
                                        borderRadius: 3,
                                        p: 3,
                                        minWidth: 200,
                                        textAlign: 'center',
                                    }}
                                >
                                    <Typography variant="h6" color="primary">
                                        Glass Card
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Efekt szkła z blur
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
                                        backdropFilter: 'blur(10px)',
                                        border: `1px solid ${theme.palette.primary.main}30`,
                                        borderRadius: 3,
                                        p: 3,
                                        minWidth: 200,
                                        textAlign: 'center',
                                    }}
                                >
                                    <Typography variant="h6" color="primary">
                                        Gradient Glass
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Z gradientem
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ThemeShowcase;