import React from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import SingleStoreView from '../../views/SingleStoreView';

export default function SingleStorePage() {
    return (
        <MainLayout>
            <SingleStoreView />
        </MainLayout>
    );
}