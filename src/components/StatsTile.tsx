import React from 'react';
import { Card } from 'primereact/card';
import { LucideIcon } from 'lucide-react';

interface StatsTileProps {
    title: string;
    value: string | number | undefined;
    icon: LucideIcon;
    subtitle?: string;
    loading?: boolean;
    disabled?: boolean;
    colorClass?: string;
}

export const StatsTile: React.FC<StatsTileProps> = ({
    title,
    value,
    icon: Icon,
    subtitle,
    loading,
    disabled,
    colorClass = 'text-blue-600'
}) => {
    const isEmpty = value === undefined || value === null || (typeof value === 'number' && isNaN(value));
    const isActuallyDisabled = disabled || isEmpty;

    return (
        <Card className={`h-full border-round-xl shadow-2 transition-all transition-duration-200 hover:shadow-4 ${isActuallyDisabled ? 'opacity-60 grayscale' : ''}`}>
            <div className="flex flex-column gap-3">
                <div className="flex align-items-center justify-content-between">
                    <span className="text-500 font-medium uppercase tracking-wider text-xs">
                        {title}
                    </span>
                    <div className={`p-2 border-round-lg ${isActuallyDisabled ? 'bg-gray-100' : 'bg-blue-50'}`}>
                        <Icon
                            size={20}
                            className={isActuallyDisabled ? 'text-400' : colorClass}
                        />
                    </div>
                </div>

                <div className="flex flex-column gap-1">
                    {loading ? (
                        <div className="h-2rem w-full bg-gray-100 border-round animate-pulse"></div>
                    ) : (
                        <span className={`text-2xl font-bold ${isActuallyDisabled ? 'text-400' : 'text-900'}`}>
                            {isActuallyDisabled ? '--' : value}
                        </span>
                    )}
                    {subtitle && (
                        <span className="text-400 text-xs">
                            {subtitle}
                        </span>
                    )}
                </div>
            </div>
        </Card>
    );
};
