import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { JournalEntryType, Metric, JournalEntry, MeasurementType } from '../types';
import { metricService } from '../services/metricService';

interface JournalFormProps {
    onSuccess: (entry: JournalEntry) => void;
}

export const JournalForm: React.FC<JournalFormProps> = ({ onSuccess }) => {
    const [entryType, setEntryType] = useState<JournalEntryType>(JournalEntryType.METRIC);
    const [entryDate, setEntryDate] = useState<Date>(new Date());

    // Cascading selection
    const [measurementTypes, setMeasurementTypes] = useState<MeasurementType[]>([]);
    const [selectedMeasurementType, setSelectedMeasurementType] = useState<MeasurementType | null>(null);
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);

    const [value, setValue] = useState<number | null>(null);
    const [notes, setNotes] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [fetchingCategories, setFetchingCategories] = useState(false);
    const [fetchingMetrics, setFetchingMetrics] = useState(false);

    // Initial load of categories
    useEffect(() => {
        if (entryType === JournalEntryType.METRIC) {
            setFetchingCategories(true);
            metricService.getMeasurementTypes()
                .then(setMeasurementTypes)
                .catch(err => console.error('Failed to fetch categories', err))
                .finally(() => setFetchingCategories(false));
        }
    }, [entryType]);

    // Load metrics when category changes
    useEffect(() => {
        if (selectedMeasurementType) {
            setFetchingMetrics(true);
            metricService.getMetricsByType(selectedMeasurementType.id)
                .then(setMetrics)
                .catch(err => console.error('Failed to fetch metrics', err))
                .finally(() => setFetchingMetrics(false));
            setSelectedMetric(null); // Reset child selection
        } else {
            setMetrics([]);
            setSelectedMetric(null);
        }
    }, [selectedMeasurementType]);

    const entryTypeOptions = [
        { label: 'Metric', value: JournalEntryType.METRIC },
        { label: 'Meal', value: JournalEntryType.MEAL },
        { label: 'Note', value: JournalEntryType.NOTE }
    ];

    const handleSubmit = async () => {
        setLoading(true);
        try {
            onSuccess({
                id: Math.random(), // Temporary
                entryType,
                entryDate: entryDate.toISOString(),
                value: value || undefined,
                notes: notes || undefined,
                metric: selectedMetric || undefined,
                isActive: true,
                userId: ''
            } as JournalEntry);

            // Reset form fields
            setValue(null);
            setNotes('');
        } catch (error) {
            console.error('Failed to create entry', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title="Add New Entry" className="shadow-2 border-round-xl mb-4">
            <div className="flex flex-column gap-4">
                <div className="field flex flex-column gap-2">
                    <label className="font-bold">Entry Type</label>
                    <Dropdown
                        value={entryType}
                        options={entryTypeOptions}
                        onChange={(e) => setEntryType(e.value)}
                        className="w-full"
                    />
                </div>

                <div className="field flex flex-column gap-2">
                    <label className="font-bold">Date & Time</label>
                    <Calendar
                        value={entryDate}
                        onChange={(e) => setEntryDate(e.value as Date)}
                        showTime
                        hourFormat="24"
                        className="w-full"
                        maxDate={new Date()}
                    />
                </div>

                {entryType === JournalEntryType.METRIC && (
                    <>
                        <div className="field flex flex-column gap-2">
                            <label className="font-bold">Measurement Category</label>
                            <Dropdown
                                value={selectedMeasurementType}
                                options={measurementTypes}
                                optionLabel="name"
                                loading={fetchingCategories}
                                onChange={(e) => setSelectedMeasurementType(e.value)}
                                placeholder="Select a Category (e.g. Weight)"
                                className="w-full"
                            />
                        </div>

                        {selectedMeasurementType && (
                            <div className="field flex flex-column gap-2">
                                <label className="font-bold">Specific Metric</label>
                                <Dropdown
                                    value={selectedMetric}
                                    options={metrics}
                                    optionLabel="name"
                                    loading={fetchingMetrics}
                                    onChange={(e) => setSelectedMetric(e.value)}
                                    placeholder="Select a Metric (e.g. Blood Ketone)"
                                    className="w-full"
                                    disabled={!selectedMeasurementType}
                                />
                            </div>
                        )}

                        {selectedMetric && (
                            <div className="field flex flex-column gap-2">
                                <label className="font-bold">Value ({selectedMetric.baseUnit})</label>
                                <InputNumber
                                    value={value}
                                    onValueChange={(e) => setValue(e.value as number | null)}
                                    mode="decimal"
                                    minFractionDigits={0}
                                    maxFractionDigits={2}
                                    className="w-full"
                                />
                            </div>
                        )}
                    </>
                )}

                <div className="field flex flex-column gap-2">
                    <label className="font-bold">Notes</label>
                    <InputTextarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        autoResize
                        className="w-full"
                    />
                </div>

                <div className="flex justify-content-end mt-2">
                    <Button
                        label="Save Entry"
                        icon={loading ? "pi pi-spin pi-spinner" : "pi pi-check"}
                        onClick={handleSubmit}
                        disabled={loading || (entryType === JournalEntryType.METRIC && (!selectedMetric || value === null))}
                        className="p-button-primary border-round-xl px-4"
                    />
                </div>
            </div>
        </Card>
    );
};
