import React from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { DashboardNew } from '../../components/Dashboard/DashboardNew';

export const DashboardPage = () => {
    return (
        <MainLayout>
            <DashboardNew />
        </MainLayout>
    );
};