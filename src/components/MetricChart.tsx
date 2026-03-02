import React from 'react';
import { Chart } from 'primereact/chart';

interface MetricChartProps {
    data: any;
    options: any;
    loading: boolean;
}

export const MetricChart: React.FC<MetricChartProps> = ({ data, options, loading }) => {
    if (loading) {
        return (
            <div className="flex align-items-center justify-content-center h-full min-h-20rem bg-gray-50 border-round-xl border-dashed border-2 border-200">
                <i className="pi pi-spin pi-spinner text-4xl text-300"></i>
            </div>
        );
    }

    if (!data || !data.datasets || data.datasets.length === 0) {
        return (
            <div className="flex flex-column align-items-center justify-content-center h-full min-h-20rem bg-gray-50 border-round-xl border-dashed border-2 border-200 gap-3">
                <i className="pi pi-chart-line text-4xl text-200"></i>
                <span className="text-gray-400 font-medium italic">Select one or more metrics to visualize</span>
            </div>
        );
    }

    return (
        <div className="h-full min-h-20rem bg-white p-3 border-round-xl border-1 border-100 shadow-sm relative">
            <Chart type="line" data={data} options={options} className="h-full" />
        </div>
    );
};
