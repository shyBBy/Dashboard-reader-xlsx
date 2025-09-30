import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Typography, Box, Paper, Button } from '@mui/material';
import { UploadFile } from '@mui/icons-material';

const UploadView = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                <UploadFile sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" gutterBottom>
                    Wgraj plik Excel
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Przeciągnij i upuść plik Excel lub kliknij aby wybrać
                </Typography>
                <Button variant="contained" color="primary" size="large">
                    Wybierz plik
                </Button>
            </Paper>
        </Box>
    );
};

export const UploadPage = () => {
    return (
        <MainLayout>
            <UploadView />
        </MainLayout>
    );
};