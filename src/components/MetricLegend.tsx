import React from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Tag } from 'primereact/tag';

export interface LegendItem {
    id: number;
    name: string;
    unit: string;
    color: string;
    selected: boolean;
}

interface MetricLegendProps {
    items: LegendItem[];
    onToggle: (id: number) => void;
}

export const MetricLegend: React.FC<MetricLegendProps> = ({ items, onToggle }) => {
    return (
        <div className="flex flex-column gap-3 p-3 bg-gray-50 border-round-xl border-1 border-100 h-full">
            <h4 className="text-sm font-bold text-600 uppercase tracking-wider m-0 mb-2">
                Metrics
            </h4>
            <div className="flex flex-column gap-2 overflow-y-auto" style={{ maxHeight: '300px' }}>
                {items.length === 0 ? (
                    <span className="text-sm text-gray-400 italic">No data recorded yet</span>
                ) : (
                    items.map(item => (
                        <div
                            key={item.id}
                            className="flex align-items-center justify-content-between p-2 hover:bg-white border-round-lg transition-colors cursor-pointer"
                            onClick={() => onToggle(item.id)}
                        >
                            <div className="flex align-items-center gap-3">
                                <Checkbox
                                    checked={item.selected}
                                    onChange={() => onToggle(item.id)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <div
                                    className="w-1rem h-1rem border-round-sm shadow-sm"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-sm font-semibold text-700 whitespace-nowrap overflow-hidden text-overflow-ellipsis flex-1">
                                    {item.name}
                                </span>
                            </div>
                            <Tag value={item.unit} className="bg-gray-200 text-gray-600 font-bold border-none text-xs ml-2 flex-shrink-0" />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
