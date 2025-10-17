// src/theme.js

import { createTheme } from '@mui/material/styles';
import '@fontsource/public-sans';

// Główna funkcja generująca theme na podstawie palety (light/dark)
export function getTheme(palette) {
  return createTheme({
    palette: {
      ...palette,
    },
    typography: {
      fontFamily: 'Public Sans, sans-serif',
      fontWeightRegular: 400,
      fontWeightMedium: 600,
      fontWeightBold: 700,
      h1: { fontWeight: 700, fontSize: '2.5rem' },
      h2: { fontWeight: 700, fontSize: '2rem' },
      h3: { fontWeight: 600, fontSize: '1.75rem' },
      h4: { fontWeight: 600, fontSize: '1.5rem' },
      h5: { fontWeight: 600, fontSize: '1.25rem' },
      h6: { fontWeight: 600, fontSize: '1rem' },
      subtitle1: { fontSize: '0.875rem', color: palette.text?.secondary },
      subtitle2: { fontSize: '0.8125rem', color: palette.text?.secondary, fontWeight: 600 },
      body1: { fontSize: '0.875rem', color: palette.text?.primary },
      body2: { fontSize: '0.8125rem', color: palette.text?.secondary },
      button: { fontWeight: 600, textTransform: 'none' },
      caption: { fontSize: '0.75rem', color: palette.text?.secondary },
      overline: { fontSize: '0.75rem', letterSpacing: 1.1, textTransform: 'uppercase' },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      'none',
      '0px 2px 1px -1px rgba(145,158,171,0.20),0px 1px 1px 0px rgba(145,158,171,0.14),0px 1px 3px 0px rgba(145,158,171,0.12)',
      '0px 3px 3px -2px rgba(145,158,171,0.20),0px 3px 4px 0px rgba(145,158,171,0.14),0px 1px 8px 0px rgba(145,158,171,0.12)',
      '0px 8px 16px 0 rgba(145,158,171,0.16)',
    ],
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: 12,
            boxShadow: '0 0 2px 0 rgba(145,158,171,0.20), 0 12px 24px -4px rgba(145,158,171,0.12)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 8px 16px 0 rgba(145,158,171,0.16)',
            },
          },
          containedPrimary: {
            boxShadow: '0 8px 16px 0 rgba(0,167,111,0.24)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0 0 2px 0 rgba(145,158,171,0.20), 0 12px 24px -4px rgba(145,158,171,0.12)',
          },
        },
      },
    },
  });
}
