import React from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { Dashboard } from '../../components/Dashboard/Dashboard';

export const DashboardPage = () => {
    return (
        <MainLayout>
            <Dashboard />
        </MainLayout>
    );
};