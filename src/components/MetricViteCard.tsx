import React, { useState, useMemo } from 'react';
import { Card } from 'primereact/card';
import { JournalEntryResponse, TimeRange } from '../types';
import { MetricLegend, LegendItem } from './MetricLegend';
import { MetricChart } from './MetricChart';
import { TimeRangeSelector } from './TimeRangeSelector';
import { format, subDays, isAfter, startOfDay, parseISO } from 'date-fns';

interface MetricViteCardProps {
    entries: JournalEntryResponse[];
    loading: boolean;
}

const LINE_COLORS = [
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#8B5CF6', // violet-500
    '#EC4899', // pink-500
    '#06B6D4', // cyan-500
    '#F97316', // orange-500
];

export const MetricViteCard: React.FC<MetricViteCardProps> = ({ entries, loading }) => {
    const [selectedTypeIds, setSelectedTypeIds] = useState<Set<number>>(new Set());
    const [timeRange, setTimeRange] = useState<TimeRange>('1W');

    // 1. Identify all unique measurement types from entries
    const legendItems = useMemo(() => {
        const typesMap = new Map<number, { name: string; unit: string }>();
        entries.forEach(e => {
            if (e.metricId) {
                // In the current schema, metricId is the specific metric, 
                // but the user wants to group by measurement type or just unique metrics.
                // Let's group by metricName/metricId for clarity.
                typesMap.set(e.metricId, { name: e.metricName, unit: e.displayUnit });
            }
        });

        return Array.from(typesMap.entries()).map(([id, info], index) => ({
            id,
            name: info.name,
            unit: info.unit,
            color: LINE_COLORS[index % LINE_COLORS.length],
            selected: selectedTypeIds.has(id)
        }));
    }, [entries, selectedTypeIds]);

    const handleToggle = (id: number) => {
        setSelectedTypeIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    // 2. Process data for Chart.js
    const chartData = useMemo(() => {
        if (selectedTypeIds.size === 0) return null;

        // Filter entries by selected metrics and time range
        const now = new Date();
        let cutOffDate: Date | null = null;
        switch (timeRange) {
            case '3D': cutOffDate = subDays(now, 3); break;
            case '1W': cutOffDate = subDays(now, 7); break;
            case '2W': cutOffDate = subDays(now, 14); break;
            case '1M': cutOffDate = subDays(now, 30); break;
            case '1Q': cutOffDate = subDays(now, 90); break;
            case '6M': cutOffDate = subDays(now, 180); break;
            case '1Y': cutOffDate = subDays(now, 365); break;
            default: cutOffDate = null;
        }

        const filteredEntries = entries.filter(e => {
            const isSelected = selectedTypeIds.has(e.metricId);
            const entryDate = parseISO(e.entryDate);
            const isInRange = cutOffDate ? isAfter(entryDate, startOfDay(cutOffDate)) : true;
            return isSelected && isInRange;
        });

        // Group by date and metric
        const dateMap = new Map<string, Map<number, number[]>>();
        filteredEntries.forEach(e => {
            const dateStr = format(parseISO(e.entryDate), 'yyyy-MM-dd');
            if (!dateMap.has(dateStr)) dateMap.set(dateStr, new Map());
            const metricData = dateMap.get(dateStr)!;
            if (!metricData.has(e.metricId)) metricData.set(e.metricId, []);
            metricData.get(e.metricId)!.push(e.displayValue);
        });

        // Sort dates
        const sortedDates = Array.from(dateMap.keys()).sort();

        // Prepare datasets
        const datasets = Array.from(selectedTypeIds).map(metricId => {
            const legendItem = legendItems.find(item => item.id === metricId);
            const data = sortedDates.map(date => {
                const dayMetrics = dateMap.get(date);
                const values = dayMetrics?.get(metricId);
                if (!values) return null;
                // Average values for the day if multiple exist
                return values.reduce((a, b) => a + b, 0) / values.length;
            });

            return {
                label: legendItem?.name || 'Unknown',
                data,
                fill: false,
                borderColor: legendItem?.color || '#000',
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                backgroundColor: legendItem?.color || '#000',
            };
        });

        return {
            labels: sortedDates.map(d => format(parseISO(d), 'MMM dd')),
            datasets
        };
    }, [entries, selectedTypeIds, timeRange, legendItems]);

    const chartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                display: false // We use our custom legend
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1F2937',
                bodyColor: '#4B5563',
                borderColor: '#E5E7EB',
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true,
                callbacks: {
                    label: function (context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            const item = legendItems.find(i => i.name === context.dataset.label);
                            label += context.parsed.y.toFixed(1) + ' ' + (item?.unit || '');
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#9CA3AF',
                    font: {
                        size: 11,
                        weight: '600'
                    }
                }
            },
            y: {
                grid: {
                    color: '#F3F4F6'
                },
                ticks: {
                    color: '#9CA3AF',
                    font: {
                        size: 11,
                        weight: '600'
                    }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
    };

    return (
        <Card className="shadow-2 border-round-xl mt-4 p-0 overflow-hidden border-none bg-white">
            <div className="flex flex-column h-full">
                {/* Header */}
                <div className="flex align-items-center justify-content-between p-4 border-bottom-1 border-50 bg-white">
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-chart-line text-primary text-xl"></i>
                        <h2 className="text-xl font-bold text-900 m-0">Metric Trends</h2>
                    </div>
                    <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
                </div>

                {/* Body */}
                <div className="grid m-0 flex-1">
                    <div className="col-12 lg:col-4 xl:col-3 p-4 border-right-1 border-50 bg-gray-50/30">
                        <MetricLegend items={legendItems} onToggle={handleToggle} />
                    </div>
                    <div className="col-12 lg:col-8 xl:col-9 p-4">
                        <MetricChart data={chartData} options={chartOptions} loading={loading} />
                    </div>
                </div>
            </div>
        </Card>
    );
};
