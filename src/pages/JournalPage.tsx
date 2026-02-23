import React, { useState, useEffect, useRef } from 'react';
import { JournalForm } from '../components/JournalForm';
import { JournalHistory } from '../components/JournalHistory';
import { journalService } from '../services/journalService';
import { JournalEntry } from '../types';
import { Toast } from 'primereact/toast';

export const JournalPage: React.FC = () => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const toast = useRef<Toast>(null);

    const fetchEntries = async () => {
        setLoading(true);
        try {
            const data = await journalService.getEntries();
            // Sort by date descending
            data.sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime());
            setEntries(data);
        } catch (error) {
            console.error('Failed to fetch journal entries', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load journal history' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const handleSuccess = async (newEntry: JournalEntry) => {
        // Here we'd usually call the actual service. 
        // For now, I'll refresh the list to show the real data from backend
        // (assuming the form component will eventually call the service)

        // Actually, let's make the Page handle the service call for better control
        try {
            await journalService.createEntry(newEntry);
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Entry saved!' });
            fetchEntries(); // Refresh history
        } catch (error) {
            console.error('Failed to save entry', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to save entry' });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await journalService.deleteEntry(id);
            toast.current?.show({ severity: 'info', summary: 'Deleted', detail: 'Entry removed' });
            fetchEntries(); // Refresh history
        } catch (error) {
            console.error('Failed to delete entry', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete entry' });
        }
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

            <div className="grid">
                <div className="col-12 lg:col-4">
                    <JournalForm onSuccess={handleSuccess} />
                </div>
                <div className="col-12 lg:col-8">
                    <div className="flex flex-column gap-3">
                        <h2 className="text-xl font-bold text-gray-800 m-0">Journal History</h2>
                        <JournalHistory
                            entries={entries}
                            loading={loading}
                            onDelete={handleDelete}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
