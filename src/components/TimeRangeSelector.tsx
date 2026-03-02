import React from 'react';
import { SelectButton } from 'primereact/selectbutton';

export type TimeRange = '3D' | '1W' | '2W' | '1M' | '1Q' | '6M' | '1Y' | 'ALL';

interface TimeRangeSelectorProps {
    value: TimeRange;
    onChange: (value: TimeRange) => void;
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ value, onChange }) => {
    const options = [
        { label: '3D', value: '3D' },
        { label: '1W', value: '1W' },
        { label: '2W', value: '2W' },
        { label: '1M', value: '1M' },
        { label: '1Q', value: '1Q' },
        { label: '6M', value: '6M' },
        { label: '1Y', value: '1Y' },
        { label: 'All', value: 'ALL' }
    ];

    return (
        <div className="flex align-items-center gap-2">
            <span className="text-xs font-bold text-500 uppercase">Range:</span>
            <SelectButton
                value={value}
                options={options}
                onChange={(e) => e.value && onChange(e.value)}
                className="p-button-sm custom-select-button"
            />
            <style>
                {`
                    .custom-select-button .p-button {
                        padding: 0.4rem 0.6rem;
                        font-size: 0.75rem;
                        font-weight: 700;
                        border-radius: 8px;
                    }
                `}
            </style>
        </div>
    );
};
