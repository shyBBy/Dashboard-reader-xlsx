// src/components/MainKPICard.jsx
import React, { useMemo } from 'react';
import { Box, Typography, Paper, Avatar, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { keyframes } from '@mui/system';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

const TrendIcon = ({ direction, color }) => {
  if (direction === 'down') {
    return <ArrowDownwardRoundedIcon sx={{ fontSize: 18, color }} />;
  }
  if (direction === 'flat' || direction === 'neutral') {
    return <RemoveRoundedIcon sx={{ fontSize: 18, color }} />;
  }
  return <ArrowUpwardRoundedIcon sx={{ fontSize: 18, color }} />;
};

const glowPulse = keyframes({
  '0%': {
    transform: 'scale(0.7) rotate(0deg)',
    opacity: 0.18,
  },
  '50%': {
    transform: 'scale(1.05) rotate(6deg)',
    opacity: 0.45,
  },
  '100%': {
    transform: 'scale(0.7) rotate(0deg)',
    opacity: 0.18,
  },
});

const gradientShift = keyframes({
  '0%': { backgroundPosition: '0% 50%' },
  '50%': { backgroundPosition: '100% 50%' },
  '100%': { backgroundPosition: '0% 50%' },
});

export default function MainKPICard({
  title,
  value,
  subtitle,
  trend,
  chartData,
  chartColor,
  icon,
  type = 'primary',
  onClick,
}) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const accentKey = chartColor || type;
  const accentMain = useMemo(() => (
    theme.palette?.[accentKey]?.main || theme.palette.primary.main
  ), [accentKey, theme]);

  const sparklineData = useMemo(() => {
    if (Array.isArray(chartData) && chartData.length > 0) {
      return chartData;
    }
    return [12, 18, 14, 22, 19, 24, 20];
  }, [chartData]);

  const iconColorBase = theme.palette?.[type]?.main || theme.palette.primary.main;
  const iconBg = alpha(iconColorBase, 0.12);
  const accentDark = theme.palette?.[accentKey]?.dark || accentMain;
  const accentLight = theme.palette?.[accentKey]?.light || accentMain;
  const accentBorderGradient = `linear-gradient(135deg, ${alpha(accentLight, 0.45)} 0%, ${alpha(accentDark, 0.9)} 100%)`;
  const cardBackground = theme.palette.background.paper;

  const resolveTrendDirection = () => {
    if (!trend) return 'neutral';
    return trend.direction || trend.status || 'neutral';
  };

  const trendDirection = resolveTrendDirection();
  const trendColorBase = trend?.color
    ? theme.palette?.[trend.color]?.main
    : trendDirection === 'down'
      ? theme.palette.error.main
      : trendDirection === 'up'
        ? theme.palette.success.main
        : theme.palette.text.secondary;

  const gradientFromPalette = (paletteKey) => {
    const palette = theme.palette?.[paletteKey];
    if (palette?.light && palette?.main) {
      return `linear-gradient(135deg, ${alpha(palette.light, 0.65)} 0%, ${alpha(palette.main, 0.9)} 100%)`;
    }
    return `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.6)} 0%, ${alpha(theme.palette.primary.main, 0.85)} 100%)`;
  };

  const accentGradient = gradientFromPalette(type);

  return (
    <Paper
      elevation={0}
      variant="outlined"
      onClick={onClick}
      sx={{
        flex: '1 1 240px',
        minWidth: 240,
        p: { xs: 2.25, md: 2.75 },
        borderRadius: 12,
        background: `linear-gradient(${cardBackground}, ${cardBackground}) padding-box, ${accentBorderGradient} border-box`,
        border: '1px solid transparent',
        boxShadow: isLight ? '0 12px 24px rgba(15, 23, 42, 0.08)' : '0 18px 30px rgba(2, 6, 23, 0.55)',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:before': {
          content: '""',
          position: 'absolute',
          inset: '-38%',
          borderRadius: '50%',
          background: accentGradient,
          backgroundSize: '200% 200%',
          filter: 'blur(48px)',
          opacity: 0,
          transform: 'scale(0.6)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
          animation: `${glowPulse} 7.2s ease-in-out infinite, ${gradientShift} 18s ease-in-out infinite`,
          animationPlayState: 'paused',
          zIndex: 0,
        },
        '&:after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background: accentGradient,
          backgroundSize: '160% 160%',
          opacity: 0,
          transform: 'scale(0.92)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
          animation: `${gradientShift} 12s ease-in-out infinite`,
          animationPlayState: 'paused',
          zIndex: 0,
        },
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: isLight ? '0 22px 36px rgba(15, 23, 42, 0.14)' : '0 30px 48px rgba(8, 11, 20, 0.85)',
          '&:before': {
            opacity: 0.55,
            transform: 'scale(1)',
            animationPlayState: 'running',
          },
          '&:after': {
            opacity: 1,
            transform: 'scale(1)',
            animationPlayState: 'running',
          },
          '& .kpi-card-content': {
            filter: 'brightness(1.06)',
          }
        },
        '&:focus-visible': {
          outline: `2px solid ${accentMain}`,
          outlineOffset: 4,
          '&:before': {
            opacity: 0.55,
            transform: 'scale(1)',
            animationPlayState: 'running',
          },
          '&:after': {
            opacity: 1,
            transform: 'scale(1)',
            animationPlayState: 'running',
          },
          '& .kpi-card-content': {
            filter: 'brightness(1.06)',
          }
        },
        '& > *': {
          position: 'relative',
          zIndex: 1,
        },
      }}
    >
      <Box className="kpi-card-content" sx={{ transition: 'filter 0.3s ease' }}>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', letterSpacing: 0.2 }}>
          {title}
        </Typography>

        <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5, color: 'text.primary' }}>
          {value}
        </Typography>

        {subtitle && (
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}

        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2.5, mt: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
            {icon && (
              <Avatar
                variant="rounded"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  bgcolor: iconBg,
                  color: iconColorBase,
                  fontSize: 22,
                  boxShadow: theme.palette.mode === 'dark'
                    ? `0 8px 18px ${alpha(iconColorBase, 0.35)}`
                    : `0 8px 16px ${alpha(iconColorBase, 0.25)}`
                }}
              >
                {icon}
              </Avatar>
            )}

            {trend && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <TrendIcon direction={trendDirection} color={trendColorBase} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: trendColorBase }}>
                    {`${trendDirection === 'down' ? '-' : trendDirection === 'up' ? '+' : ''}${trend.value}${trend.suffix || ''}`}
                  </Typography>
                </Box>
                {trend.label && (
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {trend.label}
                  </Typography>
                )}
              </Box>
            )}
          </Box>

          {sparklineData?.length ? (
            <Box sx={{ width: 96, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <SparkLineChart
                data={sparklineData}
                width={96}
                height={56}
                colors={[accentMain]}
                curve="natural"
                showTooltip={false}
                area
                sx={{ '--Charts-gridDisplay': 'none', '--Charts-tooltip-background': theme.palette.background.paper }}
              />
            </Box>
          ) : null}
        </Box>
      </Box>
    </Paper>
  );
}
