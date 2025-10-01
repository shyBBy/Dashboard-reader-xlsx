import React from 'react';
import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    Grid, 
    Button,
    Stack,
    Container,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Fab,
    Tooltip,
    useTheme
} from '@mui/material';
import { 
    ThumbUp, 
    Balance, 
    RemoveRedEye,
    TrendingUp,
    Assessment,
    Upload,
    Dashboard,
    Circle,
    ExpandMore,
    Analytics,
    Speed,
    AutoAwesome
} from '@mui/icons-material';
import { Link } from 'react-router';

const CategoryCard = ({ title, description, icon: Icon, color, items, weight }) => {
    const theme = useTheme();
    
    return (
        <Card 
            elevation={8}
            sx={{ 
                height: '100%',
                background: `linear-gradient(145deg, ${color}15 0%, ${color}25 100%)`,
                border: `2px solid ${color}40`,
                borderRadius: 3,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'visible',
                '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: `0 20px 40px ${color}30`,
                    border: `2px solid ${color}60`
                }
            }}
        >
            {/* Badge z wagą */}
            <Chip
                label={`Waga: ${weight}`}
                size="small"
                sx={{
                    position: 'absolute',
                    top: -10,
                    right: 16,
                    bgcolor: color,
                    color: 'white',
                    fontWeight: 'bold',
                    zIndex: 1
                }}
            />
            
            <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                        sx={{
                            bgcolor: color,
                            width: 56,
                            height: 56,
                            mr: 2,
                            boxShadow: `0 8px 20px ${color}40`
                        }}
                    >
                        <Icon sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight="bold" color={color}>
                            {title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {description}
                        </Typography>
                    </Box>
                </Box>
                
                <Accordion 
                    elevation={0}
                    sx={{ 
                        bgcolor: 'transparent',
                        '&:before': { display: 'none' }
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMore sx={{ color }} />}
                        sx={{ px: 0, minHeight: 'auto' }}
                    >
                        <Typography variant="body2" fontWeight="medium" color={color}>
                            Zobacz szczegóły ({items.length} elementów)
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 0, pt: 0 }}>
                        <List dense>
                            {items.map((item, index) => (
                                <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                                    <ListItemIcon sx={{ minWidth: 24 }}>
                                        <Circle sx={{ fontSize: 8, color }} />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={item}
                                        primaryTypographyProps={{
                                            variant: 'body2',
                                            color: 'text.secondary'
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </AccordionDetails>
                </Accordion>
            </CardContent>
        </Card>
    );
};

const SystemFlowStep = ({ number, title, description, icon: Icon }) => {
    const theme = useTheme();
    
    return (
        <Card 
            elevation={4}
            sx={{ 
                p: 3, 
                textAlign: 'center',
                position: 'relative',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                background: `linear-gradient(145deg, ${theme.palette.primary.main}08 0%, ${theme.palette.primary.main}15 100%)`,
                border: `1px solid ${theme.palette.primary.main}20`,
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 24px ${theme.palette.primary.main}20`
                }
            }}
        >
            <Avatar
                sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 48,
                    height: 48,
                    mx: 'auto',
                    mb: 2,
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                }}
            >
                {number}
            </Avatar>
            
            {Icon && (
                <Box sx={{ mb: 1 }}>
                    <Icon sx={{ fontSize: 32, color: 'primary.main' }} />
                </Box>
            )}
            
            <Typography variant="h6" gutterBottom fontWeight="medium">
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {description}
            </Typography>
        </Card>
    );
};

export const EmptyDashboardView = () => {
    const theme = useTheme();
    
    const categories = [
        {
            title: "WYSOKI WPŁYW",
            description: "Maksymalny priorytet działań",
            weight: "1.0",
            color: theme.palette.success.main,
            icon: ThumbUp,
            items: [
                "StoreVolume - brak miejsca w widełkach drogerii",
                "Box - ograniczenia przez maks boksy", 
                "PCP - wysyłka ograniczona przez linie PCP",
                "Możemy bezpośrednio wpłynąć! Parametry systemowe pod naszą kontrolą"
            ]
        },
        {
            title: "NISKI WPŁYW", 
            description: "Wymagają decyzji biznesowych",
            weight: "0.3",
            color: theme.palette.warning.main,
            icon: Balance,
            items: [
                "Blockade - blokada SAS Manager",
                "LineOfShame - nadmierne wyjścia", 
                "maxStock - limity parametru maxstock",
                "Ograniczone możliwości wpływu - Wymagają decyzji wyższego szczebla"
            ]
        },
        {
            title: "ZEROWY WPŁYW",
            description: "Monitorowanie i eskalacja", 
            weight: "0.0",
            color: theme.palette.text.secondary,
            icon: RemoveRedEye,
            items: [
                "WhsStock - brak towaru w magazynie",
                "MK - brak miejsca komisji",
                "DelistedBlockade - produkty wycofane", 
                "NewsBlockade - blokada nowości",
                "BiotadaInline - pozostałe blokady",
                "Regi - regulacje prawne",
                "WHSLines - linie magazynowe",
                "ArealQuantity - ograniczenia obszarowe (sztuki)",
                "WHSQuantity - ograniczenia magazynowe",
                "RGapSolution - rozwiązania gap'ów", 
                "ArealLines - ograniczenia na obszarach (linie)",
                "Brak możliwości bezpośredniego wpływu - Monitorowanie i eskalacja problemów"
            ]
        }
    ];

    const systemSteps = [
        {
            number: 1,
            title: "Klasyfikacja Blokerów",
            description: "Każdy powód blokera otrzymuje kategorię wpływu: WYSOKI / NISKI / ZEROWY",
            icon: Assessment
        },
        {
            number: 2, 
            title: "Obliczenie Wagi Problemu",
            description: "Kombinacja: częstość występowania × możliwość wpływu × udział w sklepie",
            icon: Speed
        },
        {
            number: 3,
            title: "Priorytetyzacja", 
            description: "Ranking problemów - najpierw te z najwyższą wagą i możliwością działania",
            icon: TrendingUp
        },
        {
            number: 4,
            title: "Generowanie Rekomendacji",
            description: "Konkretne, actionable kroki dla TOP 3 problemów w każdym sklepie",
            icon: AutoAwesome
        }
    ];

    return (
        <Container maxWidth="xl" sx={{ py: 6 }}>
            {/* Hero Section */}
            <Box sx={{ 
                textAlign: 'center', 
                mb: 8,
                background: `linear-gradient(145deg, ${theme.palette.primary.main}08 0%, ${theme.palette.primary.main}15 100%)`,
                borderRadius: 4,
                p: 6,
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Box sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
                    opacity: 0.5
                }} />
                
                <Avatar
                    sx={{
                        bgcolor: 'primary.main',
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 3,
                        boxShadow: `0 20px 40px ${theme.palette.primary.main}40`
                    }}
                >
                    <Dashboard sx={{ fontSize: 60 }} />
                </Avatar>
                
                <Typography variant="h2" component="h1" gutterBottom fontWeight="bold" color="primary.main">
                    Dashboard Analiz Blokerów
                </Typography>
                <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
                    Zaawansowany system analizy i rekomendacji dla problemów magazynowych
                </Typography>
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                    <Button
                        component={Link}
                        to="/upload"
                        variant="contained"
                        size="large"
                        startIcon={<Upload />}
                        sx={{ 
                            px: 6, 
                            py: 2,
                            fontSize: '1.1rem',
                            borderRadius: 3,
                            boxShadow: `0 8px 20px ${theme.palette.primary.main}40`,
                            '&:hover': {
                                boxShadow: `0 12px 24px ${theme.palette.primary.main}50`
                            }
                        }}
                    >
                        Wgraj dane Excel
                    </Button>
                    <Button
                        variant="outlined"
                        size="large"
                        startIcon={<Analytics />}
                        sx={{ px: 4, py: 2, fontSize: '1.1rem', borderRadius: 3 }}
                    >
                        Zobacz demo
                    </Button>
                </Stack>
            </Box>

            {/* Kategorie Wpływu */}
            <Box sx={{ mb: 10 }}>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Chip 
                        icon={<Assessment />}
                        label="Kategorie Wpływu"
                        size="medium"
                        color="primary"
                        sx={{ mb: 2, px: 2, py: 1 }}
                    />
                    <Typography variant="h3" gutterBottom fontWeight="bold">
                        Kategorie Wpływu na Blokery
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                        System klasyfikuje wszystkie blokery według naszej możliwości wpływu na rozwiązanie problemu
                    </Typography>
                </Box>
                
                <Grid container spacing={4}>
                    {categories.map((category, index) => (
                        <Grid item xs={12} lg={4} key={index}>
                            <CategoryCard {...category} />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Koncepcja Systemu */}
            <Box sx={{ mb: 8 }}>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Chip 
                        icon={<AutoAwesome />}
                        label="Koncepcja"
                        size="medium"
                        color="secondary"
                        sx={{ mb: 2, px: 2, py: 1 }}
                    />
                    <Typography variant="h3" gutterBottom fontWeight="bold">
                        Koncepcja Systemu
                    </Typography>
                </Box>
                
                <Card 
                    elevation={4}
                    sx={{ 
                        textAlign: 'center', 
                        mb: 6,
                        p: 4,
                        background: `linear-gradient(145deg, ${theme.palette.error.main}08 0%, ${theme.palette.error.main}15 100%)`,
                        border: `2px solid ${theme.palette.error.main}20`,
                        borderRadius: 3
                    }}
                >
                    <Avatar sx={{ bgcolor: 'error.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                        🎯
                    </Avatar>
                    <Typography variant="h4" gutterBottom fontWeight="bold" color="error.main">
                        Cel: Fokus na problemy NA KTÓRE MAMY WPŁYW
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Priorytetyzujemy działania, które przyniosą największe rezultaty
                    </Typography>
                </Card>

                <Grid container spacing={4}>
                    {systemSteps.map((step, index) => (
                        <Grid item xs={12} sm={6} lg={3} key={index}>
                            <SystemFlowStep {...step} />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Call to Action */}
            <Card 
                elevation={8}
                sx={{ 
                    textAlign: 'center',
                    p: 6,
                    borderRadius: 4,
                    background: `linear-gradient(145deg, ${theme.palette.primary.main}05 0%, ${theme.palette.secondary.main}05 100%)`,
                    border: `2px dashed ${theme.palette.primary.main}30`,
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <Avatar
                    sx={{
                        bgcolor: 'primary.main',
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 3,
                        boxShadow: `0 12px 24px ${theme.palette.primary.main}40`
                    }}
                >
                    <Assessment sx={{ fontSize: 40 }} />
                </Avatar>
                
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Rozpocznij analizę
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
                    Wgraj plik Excel z danymi blokerów, aby zobaczyć szczegółowe analizy, 
                    wskaźniki KPI i rekomendacje działań.
                </Typography>
                
                <Button
                    component={Link}
                    to="/upload"
                    variant="contained"
                    size="large"
                    startIcon={<Upload />}
                    sx={{ 
                        px: 6, 
                        py: 2,
                        fontSize: '1.2rem',
                        borderRadius: 3,
                        boxShadow: `0 8px 20px ${theme.palette.primary.main}40`,
                        '&:hover': {
                            boxShadow: `0 12px 24px ${theme.palette.primary.main}50`
                        }
                    }}
                >
                    Przejdź do uploadu
                </Button>
            </Card>

            {/* Floating Action Button */}
            <Tooltip title="Szybki upload" placement="left">
                <Fab
                    component={Link}
                    to="/upload"
                    color="primary"
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        boxShadow: `0 8px 20px ${theme.palette.primary.main}40`,
                        '&:hover': {
                            boxShadow: `0 12px 24px ${theme.palette.primary.main}50`
                        }
                    }}
                >
                    <Upload />
                </Fab>
            </Tooltip>
        </Container>
    );
};