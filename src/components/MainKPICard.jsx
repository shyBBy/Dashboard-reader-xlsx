// src/components/MainKPICard.jsx
import React, { useMemo } from 'react';
import { Box, Typography, Paper, Avatar, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
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

  const borderColor = isLight
    ? alpha(theme.palette.grey[200], 0.8)
    : alpha(theme.palette.common.white, 0.12);

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
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${borderColor}`,
        boxShadow: isLight ? '0 12px 24px rgba(15, 23, 42, 0.08)' : '0 18px 30px rgba(2, 6, 23, 0.55)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: isLight ? '0 18px 32px rgba(15, 23, 42, 0.1)' : '0 24px 40px rgba(2, 6, 23, 0.7)',
        },
      }}
    >
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
    </Paper>
  );
}
