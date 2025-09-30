import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

export const App = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Przekierowanie na dashboard jako domyślną stronę
        navigate('/dashboard');
    }, [navigate]);

    return null;
};