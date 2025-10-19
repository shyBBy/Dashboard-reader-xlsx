// src/components/MainKPICard.jsx
import React, { useMemo } from 'react';
import { Box, Typography, Paper, Avatar, useTheme } from '@mui/material';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

const TrendIcon = ({ direction, color }) => {
  if (direction === 'down') {
    return <ArrowDownwardRoundedIcon sx={{ fontSize: 18, color }} />;
  }
  if (direction === 'flat') {
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
  const accentMain = useMemo(
    () => theme.vars.palette[accentKey]?.main || theme.vars.palette.primary.main,
    [accentKey, theme.vars.palette],
  );

  const sparklineData = useMemo(() => {
    if (Array.isArray(chartData) && chartData.length > 0) {
      return chartData;
    }
    return [12, 18, 14, 22, 19, 24, 20];
  }, [chartData]);

  const iconBg = `rgba(var(--mui-palette-${type}-mainChannel, var(--mui-palette-primary-mainChannel)) / 0.12)`;
  const iconColor = `rgb(var(--mui-palette-${type}-mainChannel, var(--mui-palette-primary-mainChannel)))`;

  const trendColorKey = trend?.color || (trend?.direction === 'down' ? 'error' : 'success');
  const trendColor = `rgb(var(--mui-palette-${trendColorKey}-mainChannel, var(--mui-palette-success-mainChannel)))`;

  const borderColor = isLight
    ? 'rgba(var(--mui-palette-grey-300Channel) / 0.35)'
    : 'rgba(var(--mui-palette-common-whiteChannel) / 0.18)';

  return (
    <Paper
      elevation={0}
      variant="outlined"
      onClick={onClick}
      sx={{
        flex: '1 1 280px',
        minWidth: 260,
        maxWidth: 360,
        position: 'relative',
        p: { xs: 2.75, md: 3 },
        borderRadius: 16,
        backgroundColor: theme.vars.palette.background.paper,
        border: `1px solid ${borderColor}`,
        boxShadow: isLight ? theme.customShadows.card : '0 22px 45px rgba(2, 6, 23, 0.55)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.24s ease, box-shadow 0.24s ease',
        '&::after': {
          transform: 'translateY(-4px)',
          boxShadow: isLight ? theme.customShadows.z16 : '0 30px 70px rgba(2, 6, 23, 0.7)',
          inset: 0,
          borderRadius: 16,
          pointerEvents: 'none',
          background: isLight
            ? 'linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 55%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 55%)',
        },
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: hoverShadow,
        },
        '& > *': {
          position: 'relative',
          zIndex: 1,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
            {title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: subtitle ? 1 : 0 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {value}
            </Typography>

            {icon && (
              <Avatar
                variant="rounded"
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  bgcolor: iconBg,
                  color: iconColor,
                  fontSize: 24,
                }}
              >
                {icon}
              </Avatar>
            )}
          </Box>

          {subtitle && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: trend ? 1 : 0 }}>
              {subtitle}
            </Typography>
          )}

          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <TrendIcon direction={trend.direction} color={trendColor} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: trendColor }}>
                {trend.value}
              </Typography>
              {trend.label && (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {trend.label}
                </Typography>
              )}
            </Box>
          )}
        </Box>

        {sparklineData?.length ? (
          <Box sx={{ width: 80, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <SparkLineChart
              data={sparklineData}
              width={80}
              height={56}
              colors={[accentMain]}
              curve="natural"
              showTooltip={false}
              area
              sx={{ '--Charts-gridDisplay': 'none', '--Charts-tooltip-background': theme.vars.palette.background.paper }}
            />
          </Box>
        ) : null}
      </Box>
    </Paper>
  );
}
