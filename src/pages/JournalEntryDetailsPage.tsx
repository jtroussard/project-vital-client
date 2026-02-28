import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Skeleton } from 'primereact/skeleton';
import { JournalBatch, JournalEntryType } from '../types';
import { journalService } from '../services/journalService';
import { format } from 'date-fns';

export const JournalEntryDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [batch, setBatch] = useState<JournalBatch | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBatch = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await journalService.getBatch(parseInt(id));
                setBatch(data);
            } catch (err) {
                console.error('Failed to fetch batch details', err);
                setError('Could not load entry details. It may have been deleted.');
            } finally {
                setLoading(false);
            }
        };

        fetchBatch();
    }, [id]);

    const typeTemplate = (type: JournalEntryType) => {
        let severity: "success" | "info" | "warning" | "danger" | "secondary" | null | undefined = 'info';
        switch (type) {
            case JournalEntryType.METRIC: severity = 'info'; break;
            case JournalEntryType.MEAL: severity = 'warning'; break;
            case JournalEntryType.NOTE: severity = 'secondary'; break;
        }
        return <Tag value={type} severity={severity} rounded />;
    };

    if (loading) {
        return (
            <div className="flex flex-column gap-4 py-4 max-w-3xl mx-auto">
                <Skeleton width="150px" height="2rem" />
                <Card className="shadow-2">
                    <Skeleton width="100%" height="4rem" className="mb-4" />
                    <Skeleton width="60%" height="1.5rem" className="mb-2" />
                    <Skeleton width="40%" height="1.5rem" />
                </Card>
                <div className="grid">
                    {[1, 2].map(i => (
                        <div key={i} className="col-12 md:col-6">
                            <Card className="shadow-1">
                                <Skeleton width="80%" height="1.5rem" className="mb-3" />
                                <Skeleton width="100%" height="3rem" />
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error || !batch) {
        return (
            <div className="flex flex-column align-items-center justify-content-center py-8 gap-4">
                <i className="pi pi-exclamation-circle text-6xl text-red-500"></i>
                <h2 className="text-2xl font-bold">{error || 'Entry not found'}</h2>
                <Button label="Back to Journal" icon="pi pi-arrow-left" onClick={() => navigate('/journal')} className="p-button-text" />
            </div>
        );
    }

    return (
        <div className="flex flex-column gap-6 py-4 max-w-4xl mx-auto">
            {/* Navigation Header */}
            <div className="flex align-items-center gap-3">
                <Button
                    icon="pi pi-arrow-left"
                    className="p-button-rounded p-button-text p-button-lg text-gray-700 hover:surface-100"
                    onClick={() => navigate('/journal')}
                    tooltip="Back to Journal"
                />
                <div className="flex flex-column">
                    <h1 className="text-3xl font-black text-gray-900 m-0">Entry Details</h1>
                    <span className="text-gray-500 font-medium">Batch #{batch.id}</span>
                </div>
            </div>

            {/* Batch Overview Card */}
            <Card className="shadow-2 border-round-xl overflow-hidden border-top-3 border-primary">
                <div className="flex flex-column md:flex-row justify-content-between md:align-items-center gap-3 mb-4">
                    <div className="flex flex-column">
                        <span className="text-sm font-bold text-500 uppercase tracking-wider mb-1">Date Recorded</span>
                        <div className="flex align-items-baseline gap-2">
                            <span className="text-2xl font-bold text-800">
                                {format(new Date(batch.entryDate), 'MMMM dd, yyyy')}
                            </span>
                            <span className="text-xl font-medium text-600">
                                at {format(new Date(batch.entryDate), 'HH:mm')}
                            </span>
                        </div>
                    </div>
                </div>

                {batch.notes && (
                    <div className="bg-gray-50 p-4 border-round-xl border-1 border-100 italic text-gray-700 line-height-3">
                        <span className="block text-xs font-bold text-400 uppercase not-italic mb-2">General Notes</span>
                        "{batch.notes}"
                    </div>
                )}
            </Card>

            {/* Metric Entries Grid */}
            <div className="flex flex-column gap-3">
                <h2 className="text-xl font-bold text-gray-800 m-0">Captured Metrics</h2>
                <div className="grid">
                    {batch.entries.map((entry) => (
                        <div key={entry.id} className="col-12 md:col-6 lg:col-4">
                            <Card className="shadow-1 border-round-xl h-full flex flex-column transition-all hover:shadow-2">
                                <div className="flex justify-content-between align-items-start mb-3">
                                    <div className="flex flex-column">
                                        <span className="text-xs font-bold text-500 uppercase tracking-wider mb-1">Metric</span>
                                        <span className="text-lg font-bold text-gray-900">{entry.metricName}</span>
                                    </div>
                                    {typeTemplate(entry.entryType)}
                                </div>

                                <div className="flex align-items-baseline gap-2 mt-auto">
                                    <span className="text-3xl font-black text-primary">
                                        {entry.displayValue}
                                    </span>
                                    <span className="text-sm font-bold text-500">
                                        {entry.displayUnit}
                                    </span>
                                </div>

                                {entry.notes && (
                                    <div className="mt-3 pt-3 border-top-1 border-100 text-sm text-gray-600">
                                        <i className="pi pi-info-circle mr-2 text-xs"></i>
                                        {entry.notes}
                                    </div>
                                )}
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
