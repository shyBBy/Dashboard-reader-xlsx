import React from 'react';
import { Paper } from '@mui/material';

export default function SurfaceCard({ children, sx = {}, ...paperProps }) {
    return (
        <Paper
            elevation={0}
            {...paperProps}
            sx={{
                width: '100%',
                borderRadius: (theme) => theme.shape.borderRadius * 2,
                padding: { xs: 3, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 2.5, md: 3 },
                ...sx,
            }}
        >
            {children}
        </Paper>
    );
}
