import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { JournalEntry, JournalEntryType } from '../types';
import { format } from 'date-fns';

interface JournalHistoryProps {
    entries: JournalEntry[];
    loading: boolean;
    onDelete: (id: number) => void;
}

export const JournalHistory: React.FC<JournalHistoryProps> = ({ entries, loading, onDelete }) => {

    const typeTemplate = (rowData: JournalEntry) => {
        let severity: "success" | "info" | "warning" | "danger" | "secondary" | null | undefined = 'info';
        switch (rowData.entryType) {
            case JournalEntryType.METRIC: severity = 'info'; break;
            case JournalEntryType.MEAL: severity = 'warning'; break;
            case JournalEntryType.NOTE: severity = 'secondary'; break;
        }
        return <Tag value={rowData.entryType} severity={severity} rounded />;
    };

    const dateTemplate = (rowData: JournalEntry) => {
        return format(new Date(rowData.entryDate), 'MMM dd, yyyy HH:mm');
    };

    const contentTemplate = (rowData: JournalEntry) => {
        if (rowData.entryType === JournalEntryType.METRIC) {
            return (
                <div className="flex flex-column">
                    <div className="flex align-items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">{rowData.metric?.measurementType?.name}:</span>
                        <span className="font-bold">{rowData.metric?.name}</span>
                    </div>
                    <span className="text-xl font-bold text-primary">{rowData.value} <small className="text-sm font-normal text-gray-600">{rowData.metric?.baseUnit}</small></span>
                    {rowData.notes && <span className="text-sm text-gray-500 mt-1 italic">"{rowData.notes}"</span>}
                </div>
            );
        }
        return <span className="text-sm text-gray-500">{rowData.notes}</span>;
    };

    const actionTemplate = (rowData: JournalEntry) => {
        return (
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger p-button-text"
                onClick={() => onDelete(rowData.id)}
            />
        );
    };

    return (
        <div className="shadow-2 border-round-xl overflow-hidden bg-white">
            <DataTable
                value={entries}
                loading={loading}
                paginator
                rows={10}
                emptyMessage="No entries found. Start journaling!"
                className="p-datatable-sm"
            >
                <Column field="entryDate" header="Date" body={dateTemplate} sortable style={{ minWidth: '10rem' }} />
                <Column field="entryType" header="Type" body={typeTemplate} style={{ width: '8rem' }} />
                <Column header="Details" body={contentTemplate} />
                <Column body={actionTemplate} style={{ width: '4rem' }} />
            </DataTable>
        </div>
    );
};
