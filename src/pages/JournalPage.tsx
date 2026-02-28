import React, { useState, useEffect, useRef } from 'react';
import { JournalForm } from '../components/JournalForm';
import { RecentActivityCard } from '../components/RecentActivityCard';
import { journalService } from '../services/journalService';
import { JournalEntryResponse, JournalBatch } from '../types';
import { Toast } from 'primereact/toast';

export const JournalPage: React.FC = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const toast = useRef<Toast>(null);

    const handleSuccess = () => {
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Entry saved!' });
        setRefreshTrigger(prev => prev + 1); // Signal history card to refresh
    };

    return (
        <div className="flex flex-column gap-6 py-4">
            <Toast ref={toast} />

            <div className="flex flex-column gap-1">
                <h1 className="text-3xl font-black text-gray-900 m-0 leading-tight">
                    Health Journal
                </h1>
                <p className="text-gray-500 font-medium">
                    Log your daily metrics, meals, and thoughts to track your progress.
                </p>
            </div>

            <div className="grid align-items-start">
                <div className="col-12 lg:col-8">
                    <JournalForm onSuccess={handleSuccess} />
                </div>
                <div className="col-12 lg:col-4">
                    <RecentActivityCard refreshTrigger={refreshTrigger} />
                </div>
            </div>
        </div>
    );
};
