import React from 'react';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { JournalBatch, JournalEntryResponse, JournalEntryType } from '../types';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface JournalHistoryProps {
    batches: JournalBatch[];
    loading: boolean;
    onDelete: (id: number) => void;
}

export const JournalHistory: React.FC<JournalHistoryProps> = ({ batches, loading, onDelete }) => {
    const navigate = useNavigate();

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
            <div className="flex justify-content-center p-8">
                <i className="pi pi-spin pi-spinner text-4xl text-primary"></i>
            </div>
        );
    }

    if (batches.length === 0) {
        return (
            <Card className="text-center p-8 shadow-1 border-round-xl">
                <i className="pi pi-book text-4xl text-400 mb-3"></i>
                <p className="text-gray-500 m-0">No entries found. Start journaling!</p>
            </Card>
        );
    }

    return (
        <div className="flex flex-column gap-2">
            {batches.map((batch) => (
                <div
                    key={batch.id}
                    className="p-3 shadow-1 border-round-xl bg-white border-1 border-100 flex align-items-center justify-content-between hover:surface-100 transition-colors transition-duration-150 cursor-pointer"
                    onClick={() => navigate(`/journal/batch/${batch.id}`)}
                >
                    <div className="flex align-items-center gap-3">
                        <div className="flex flex-column gap-1">
                            <span className="text-xs font-bold text-500 uppercase">
                                {format(new Date(batch.entryDate), 'MMM dd')}
                            </span>
                            <span className="text-sm font-bold text-800">
                                {format(new Date(batch.entryDate), 'HH:mm')}
                            </span>
                        </div>
                        <div className="flex flex-column gap-1">
                            <span className="text-xs text-600">
                                {batch.entries.length} {batch.entries.length === 1 ? 'item' : 'items'}
                            </span>
                        </div>
                    </div>

                    <div className="flex align-items-center gap-3">
                        {typeTemplate(batch.entries[0]?.entryType || JournalEntryType.NOTE)}
                        <Button
                            icon="pi pi-trash"
                            className="p-button-rounded p-button-danger p-button-text p-button-sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(batch.id);
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};
