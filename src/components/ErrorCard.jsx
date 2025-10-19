import React from 'react';
import { Box, Typography, Button, Paper, Stack, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ErrorOutline, Refresh } from '@mui/icons-material';

export default function ErrorCard({ 
    title = "Błąd połączenia", 
    message = 'Nie udało się połączyć z serwerem. Spróbuj ponownie za chwilę.', 
    icon: IconComponent = ErrorOutline,
    onRetry,
    type = 'error',
    supportText = 'Sprawdź czy serwer Python FastAPI działa na: http://localhost:8000'
}) {
    const theme = useTheme();

    const palette = theme.palette[type] || theme.palette.error;
    const accent = palette.main;
    const accentSoft = palette.light || palette.main;
    const softBg = alpha(accent, 0.08);
    const softBorder = alpha(accent, 0.16);

    return (
        <Box
            sx={{
                width: '100%',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'background.default',
                py: { xs: 6, md: 10 },
                px: 2,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    maxWidth: 440,
                    px: { xs: 4, sm: 6 },
                    py: { xs: 5, sm: 6 },
                    textAlign: 'center',
                    border: `1px solid ${softBorder}`,
                    backgroundImage: 'none',
                }}
            >
                <Stack spacing={3} alignItems="center">
                    <Box
                        sx={{
                            width: 88,
                            height: 88,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: `linear-gradient(135deg, ${alpha(accentSoft, 0.25)}, ${alpha(accent, 0.45)})`,
                            boxShadow: `0 12px 24px ${alpha(accent, 0.16)}`,
                        }}
                    >
                        <IconComponent sx={{ fontSize: 40, color: theme.palette.getContrastText(accent) }} />
                    </Box>

                    <Box>
                        <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                            {title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {message}
                        </Typography>
                    </Box>

                    {onRetry && (
                        <Button
                            variant="contained"
                            startIcon={<Refresh />}
                            onClick={onRetry}
                            sx={{
                                alignSelf: 'stretch',
                                py: 1.4,
                                fontWeight: 700,
                                backgroundColor: accent,
                                '&:hover': {
                                    backgroundColor: accent,
                                    filter: 'brightness(1.05)',
                                },
                            }}
                        >
                            Spróbuj ponownie
                        </Button>
                    )}

                    {supportText && (
                        <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.7 }}>
                            {supportText}
                        </Typography>
                    )}
                </Stack>
            </Paper>
        </Box>
    );
}