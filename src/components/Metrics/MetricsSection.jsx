import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Avatar, Stack, Chip } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';

const densityTokens = {
    comfortable: {
        padding: { xs: 2.5, md: 3 },
        gap: 2.3,
        metaGap: 1.2,
        minHeight: 176,
    },
    compact: {
        padding: { xs: 2, md: 2.25 },
        gap: 1.7,
        metaGap: 1,
        minHeight: 156,
    },
};

const getPaletteByIntent = (intent, theme) => {
    const palette = theme.palette;
    switch (intent) {
        case 'primary':
            return palette.primary;
        case 'secondary':
            return palette.secondary;
        case 'success':
            return palette.success;
        case 'warning':
            return palette.warning;
        case 'error':
            return palette.error;
        case 'info':
            return palette.info;
        case 'neutral':
        default:
            return {
                main: palette.text.primary,
                light: palette.grey[200],
                dark: palette.grey[700],
            };
    }
};

const TrendIcon = ({ direction, color }) => {
    if (direction === 'down') {
        return <ArrowDownwardRoundedIcon sx={{ fontSize: 18, color }} />;
    }
    if (direction === 'up') {
        return <ArrowUpwardRoundedIcon sx={{ fontSize: 18, color }} />;
    }
    return <RemoveRoundedIcon sx={{ fontSize: 18, color }} />;
};

const MetricCard = ({ item, density, minHeight }) => {
    const theme = useTheme();
    const spacing = densityTokens[density] ?? densityTokens.comfortable;

    const {
        id,
        overline,
        title,
        value,
        helperText,
        meta,
        icon,
        intent = 'neutral',
        trend,
        chips,
        sparkline,
        footnote,
        onClick,
    } = item;

    const palette = getPaletteByIntent(intent, theme);
    const cardKey = id || title;
    return (
        <Paper
            key={cardKey}
            elevation={0}
            variant="outlined"
            onClick={onClick}
            sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.gap,
                minHeight: minHeight || spacing.minHeight,
                p: spacing.padding,
                borderRadius: '14px',
                backgroundColor: theme.vars?.palette?.background?.paper || theme.palette.background.paper,
                border: `1px solid ${alpha(theme.palette.divider, 0.35)}`,
                boxShadow: theme.palette.mode === 'light'
                    ? '0 10px 22px rgba(15, 23, 42, 0.06)'
                    : '0 14px 28px rgba(2, 6, 23, 0.5)',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'transform 0.16s ease, box-shadow 0.16s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.palette.mode === 'light'
                        ? '0 16px 28px rgba(15, 23, 42, 0.08)'
                        : '0 18px 34px rgba(2, 6, 23, 0.62)',
                },
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    {overline && (
                        <Typography
                            variant="caption"
                            sx={{
                                display: 'block',
                                color: 'text.secondary',
                                letterSpacing: 0.6,
                                textTransform: 'uppercase',
                                mb: 0.75,
                            }}
                        >
                            {overline}
                        </Typography>
                    )}
                    {title && (
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                            {title}
                        </Typography>
                    )}
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.1 }}>
                        {value}
                    </Typography>
                    {helperText && (
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.75 }}>
                            {helperText}
                        </Typography>
                    )}
                </Box>

                {icon && (
                    <Avatar
                        variant="rounded"
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            backgroundColor: alpha(palette.main, 0.12),
                            color: palette.main,
                            fontSize: 22,
                        }}
                    >
                        {icon}
                    </Avatar>
                )}
            </Box>

            {meta?.length ? (
                <Stack spacing={spacing.metaGap} sx={{ pt: 0.5 }}>
                    {meta.map((entry) => (
                        <Box
                            key={`${cardKey}-${entry.label}`}
                            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}
                        >
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {entry.label}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                {entry.value}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            ) : null}

            {chips?.length ? (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {chips.map((chip) => (
                        <Chip
                            key={`${cardKey}-${chip.label}`}
                            size="small"
                            color={chip.color || 'default'}
                            variant={chip.variant || 'filled'}
                            label={chip.label}
                        />
                    ))}
                </Stack>
            ) : null}

            {trend ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
                    <TrendIcon direction={trend.direction} color={trend.color || palette.main} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: trend.color || palette.main }}>
                        {trend.prefix ? `${trend.prefix}` : ''}{trend.value}{trend.suffix || ''}
                    </Typography>
                    {trend.label && (
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {trend.label}
                        </Typography>
                    )}
                </Box>
            ) : null}

            {footnote && (
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    {footnote}
                </Typography>
            )}
        </Paper>
    );
};

const MetricsSection = ({
    title,
    subtitle,
    description,
    actions,
    items = [],
    density = 'comfortable',
    minCardWidth = 248,
    columns,
    sx,
}) => {
    const theme = useTheme();
    const spacing = densityTokens[density] ?? densityTokens.comfortable;
    const gridColumns = columns
        ? columns
        : {
            xs: '1fr',
            sm: `repeat(auto-fit, minmax(${minCardWidth}px, 1fr))`,
        };

    return (
        <Box sx={{ width: '100%', ...sx }}>
            {(title || subtitle || actions || description) && (
                <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {title && (
                                <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
                                    {title}
                                </Typography>
                            )}
                            {subtitle && (
                                <Typography variant="subtitle1" color="text.secondary">
                                    {subtitle}
                                </Typography>
                            )}
                        </Box>
                        {actions ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {actions}
                            </Box>
                        ) : null}
                    </Box>
                    {description && (
                        <Typography variant="body2" color="text.secondary">
                            {description}
                        </Typography>
                    )}
                </Box>
            )}

            <Box
                sx={{
                    display: 'grid',
                    gap: { xs: spacing.gap + 0.5, md: spacing.gap + 1 },
                    gridTemplateColumns: gridColumns,
                }}
            >
                {items.map((item) => (
                    <MetricCard key={item.id || item.title} item={item} density={density} minHeight={item.minHeight} />
                ))}
            </Box>
        </Box>
    );
};

MetricsSection.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    description: PropTypes.string,
    actions: PropTypes.node,
    items: PropTypes.arrayOf(PropTypes.object),
    density: PropTypes.oneOf(['comfortable', 'compact']),
    minCardWidth: PropTypes.number,
    columns: PropTypes.object,
    sx: PropTypes.object,
};

export default MetricsSection;
