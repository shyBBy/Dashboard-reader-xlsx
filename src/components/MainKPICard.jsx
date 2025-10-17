// src/components/MainKPICard.jsx
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

export default function MainKPICard({ title, value, subtitle, icon, type = 'primary', onClick }) {
  const theme = useTheme();
  const color = theme.palette[type]?.main || theme.palette.primary.main;
  const bgColor = theme.palette[type]?.light || `${theme.palette.primary.light}20`;

  return (
    <Box
      onClick={onClick}
      sx={{
        flex: '1 1 280px',
        minWidth: '280px',
        maxWidth: '320px',
        p: 3,
        borderRadius: 3,
        bgcolor: 'background.paper',
        boxShadow: '0 8px 16px rgba(145,158,171,0.08)',
        border: '1px solid rgba(145,158,171,0.12)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(145,158,171,0.16)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon && (
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: `${color}14`,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              mr: 2,
            }}
          >
            {icon}
          </Box>
        )}
        <Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {value}
          </Typography>
        </Box>
      </Box>

      {subtitle && (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
