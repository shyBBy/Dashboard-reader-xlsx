import React, { useState, useCallback } from 'react';
import { 
    Box, 
    Paper, 
    Typography, 
    Button, 
    LinearProgress,
    Alert,
    Chip,
    Stack
} from '@mui/material';
import { UploadFile, CheckCircle, Error } from '@mui/icons-material';
import * as XLSX from 'xlsx';

export const ExcelUploader = ({ onDataLoaded, onError }) => {
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [fileInfo, setFileInfo] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);

    const processFile = useCallback(async (file) => {
        setUploading(true);
        setUploadStatus(null);
        
        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Pobierz pierwszy arkusz
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            
            // Konwertuj na JSON z automatycznym wykrywaniem nagłówków
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
                header: 1,
                defval: ''
            });
            
            if (jsonData.length === 0) {
                throw new Error('Plik jest pusty');
            }
            
            // Pierwszy wiersz to nagłówki
            const headers = jsonData[0];
            const rows = jsonData.slice(1);
            
            // Konwertuj do obiektów
            const formattedData = rows.map(row => {
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header] = row[index] || '';
                });
                return obj;
            });
            
            const processedData = {
                headers,
                data: formattedData,
                totalRows: rows.length,
                fileName: file.name,
                sheetName
            };
            
            setFileInfo({
                name: file.name,
                size: file.size,
                rows: rows.length,
                columns: headers.length
            });
            
            setUploadStatus({ type: 'success', message: 'Plik został pomyślnie wczytany' });
            onDataLoaded?.(processedData);
            
        } catch (error) {
            console.error('Błąd podczas przetwarzania pliku:', error);
            setUploadStatus({ 
                type: 'error', 
                message: `Błąd podczas przetwarzania pliku: ${error.message}` 
            });
            onError?.(error);
        } finally {
            setUploading(false);
        }
    }, [onDataLoaded, onError]);

    const handleFileSelect = useCallback((event) => {
        const file = event.target.files[0];
        if (file) {
            processFile(file);
        }
    }, [processFile]);

    const handleDrop = useCallback((event) => {
        event.preventDefault();
        setDragOver(false);
        
        const file = event.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    }, [processFile]);

    const handleDragOver = useCallback((event) => {
        event.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback((event) => {
        event.preventDefault();
        setDragOver(false);
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <Paper 
                elevation={dragOver ? 4 : 1}
                sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    border: `2px dashed ${dragOver ? 'primary.main' : 'divider'}`,
                    backgroundColor: dragOver ? 'action.hover' : 'background.paper',
                    transition: 'all 0.2s ease',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    borderRadius: 2
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => !uploading && document.getElementById('file-input').click()}
            >
                <input
                    id="file-input"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    disabled={uploading}
                />
                
                {uploading ? (
                    <>
                        <LinearProgress sx={{ mb: 2 }} />
                        <Typography variant="h6">
                            Przetwarzanie pliku...
                        </Typography>
                    </>
                ) : (
                    <>
                        <UploadFile sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                            Wgraj plik Excel (XLSX)
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Przeciągnij plik lub kliknij aby wybrać
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            size="large"
                            disabled={uploading}
                        >
                            Wybierz plik
                        </Button>
                    </>
                )}
            </Paper>

            {uploadStatus && (
                <Alert 
                    severity={uploadStatus.type} 
                    sx={{ mt: 2 }}
                    icon={uploadStatus.type === 'success' ? <CheckCircle /> : <Error />}
                >
                    {uploadStatus.message}
                </Alert>
            )}

            {fileInfo && (
                <Paper elevation={1} sx={{ p: 2, mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Informacje o pliku:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip label={fileInfo.name} variant="outlined" />
                        <Chip label={`${fileInfo.rows} wierszy`} variant="outlined" />
                        <Chip label={`${fileInfo.columns} kolumn`} variant="outlined" />
                        <Chip label={`${(fileInfo.size / 1024).toFixed(1)} KB`} variant="outlined" />
                    </Stack>
                </Paper>
            )}
        </Box>
    );
};