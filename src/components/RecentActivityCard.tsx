import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { JournalHistory } from './JournalHistory';
import { JournalBatch } from '../types';
import { journalService } from '../services/journalService';

interface RecentActivityCardProps {
    refreshTrigger?: number; // Used to signal a full refresh from page 0
}

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({
    refreshTrigger = 0
}) => {
    const [batches, setBatches] = useState<JournalBatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    const fetchBatches = async (pageNum: number, append: boolean = false) => {
        if (!append) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            // Using size 8 as requested
            const data = await journalService.getBatches(pageNum, 8);

            if (append) {
                setBatches(prev => [...prev, ...data.content]);
            } else {
                setBatches(data.content);
            }

            setHasMore(!data.last);
            setPage(pageNum);
        } catch (error) {
            console.error('Failed to fetch journal batches', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Initial load and forced refreshes
    useEffect(() => {
        fetchBatches(0, false);
    }, [refreshTrigger]);

    const handleDelete = async (id: number) => {
        try {
            // The service deleteEntry currently deletes the whole batch if id is batchId
            await journalService.deleteEntry(id);
            setBatches(prev => prev.filter(b => b.id !== id));
        } catch (error) {
            console.error('Failed to delete batch', error);
        }
    };

    const loadMore = () => {
        if (!loadingMore && hasMore) {
            fetchBatches(page + 1, true);
        }
    };

    return (
        <Card title="Recent Activity" className="shadow-2 border-round-xl h-full flex flex-column">
            <div className="flex flex-column gap-3">
                <JournalHistory
                    batches={batches}
                    loading={loading && batches.length === 0} // Only show full loading spinner for initial load
                    onDelete={handleDelete}
                />

                {hasMore && (
                    <div className="flex justify-content-center pt-2">
                        <Button
                            icon={loadingMore ? "pi pi-spin pi-spinner" : "pi pi-chevron-down"}
                            className="p-button-rounded p-button-text p-button-secondary p-button-sm"
                            onClick={loadMore}
                            disabled={loadingMore}
                            tooltip="Load more entries"
                        />
                    </div>
                )}
            </div>
        </Card>
    );
};
