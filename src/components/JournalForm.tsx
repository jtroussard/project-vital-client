import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { JournalEntryType, Metric, JournalEntryResponse, MeasurementType, JournalBatch } from '../types';
import { metricService } from '../services/metricService';
import { journalService } from '../services/journalService';
import { useSettingsStore } from '../store/useSettingsStore';
import { getUnitLabel } from '../utils/unitUtils';

// Interal Types
interface FormMetric {
    id: string;
    selectedType: MeasurementType | null;
    metrics: Metric[];
    selectedMetric: Metric | null;
    value: number | null;
}

interface MetricEntryRowProps {
    index: number;
    metricRow: FormMetric;
    measurementTypes: MeasurementType[];
    allMetrics: Metric[];
    usedMetricIds: number[];
    fetchingData: boolean;
    settings: any;
    onUpdate: (field: keyof FormMetric, value: any) => void;
    onRemove?: () => void;
}

const MetricEntryRow: React.FC<MetricEntryRowProps> = ({
    index,
    metricRow,
    measurementTypes,
    allMetrics,
    usedMetricIds,
    fetchingData,
    settings,
    onUpdate,
    onRemove
}) => {
    return (
        <div className="p-4 border-1 border-300 border-round-xl bg-gray-50 flex flex-column gap-3">
            <div className="flex justify-content-between align-items-center" style={{ minHeight: '2.5rem' }}>
                <span className="text-sm font-bold text-600 uppercase tracking-wider">
                    Metric #{index + 1}
                </span>
                {onRemove && (
                    <Button
                        icon="pi pi-trash"
                        className="p-button-rounded p-button-danger p-button-text p-button-sm"
                        onClick={onRemove}
                        tooltip="Remove this metric"
                    />
                )}
            </div>

            <div className="grid">
                <div className="col-12 md:col-6 field flex flex-column gap-2 p-1">
                    <label className="text-sm font-bold text-700">Category</label>
                    <Dropdown
                        value={metricRow.selectedType}
                        options={measurementTypes.filter(type => {
                            const isCurrentType = type.id === metricRow.selectedType?.id;
                            const hasAvailableMetrics = allMetrics.some(m =>
                                m.measurementType?.id === type.id && !usedMetricIds.includes(m.id)
                            );
                            return isCurrentType || hasAvailableMetrics;
                        })}
                        optionLabel="name"
                        onChange={(e) => onUpdate('selectedType', e.value)}
                        placeholder="Select Category"
                        loading={fetchingData}
                        className="w-full"
                    />
                </div>
                <div className="col-12 md:col-6 field flex flex-column gap-2 p-1">
                    <label className="text-sm font-bold text-700">Specific Metric</label>
                    <Dropdown
                        value={metricRow.selectedMetric}
                        options={metricRow.metrics.filter(m =>
                            m.id === metricRow.selectedMetric?.id || !usedMetricIds.includes(m.id)
                        )}
                        optionLabel="name"
                        onChange={(e) => onUpdate('selectedMetric', e.value)}
                        placeholder="Select Metric"
                        className="w-full"
                        disabled={!metricRow.selectedType}
                    />
                </div>
                {metricRow.selectedMetric && (
                    <div className="col-12 field flex flex-column gap-2 p-1 mt-2">
                        <label className="text-sm font-bold text-700">Value ({getUnitLabel(metricRow.selectedMetric, settings?.preferredUnitSystem)})</label>
                        <InputNumber
                            value={metricRow.value}
                            onValueChange={(e) => onUpdate('value', e.value)}
                            mode="decimal"
                            minFractionDigits={0}
                            maxFractionDigits={2}
                            className="w-full"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

interface JournalFormProps {
    onSuccess: (entry: JournalEntryResponse) => void;
}

export const JournalForm: React.FC<JournalFormProps> = ({ onSuccess }) => {
    const { settings } = useSettingsStore();
    const [entryType, setEntryType] = useState<JournalEntryType>(JournalEntryType.METRIC);
    const [entryDate, setEntryDate] = useState<Date>(new Date());
    const [generalNotes, setGeneralNotes] = useState<string>('');
    const [saveAsDefault, setSaveAsDefault] = useState(false);
    const [loading, setLoading] = useState(false);

    // Multi-metric state
    const [formMetrics, setFormMetrics] = useState<FormMetric[]>([{
        id: Math.random().toString(36).substr(2, 9),
        selectedType: null,
        metrics: [],
        selectedMetric: null,
        value: null
    }]);

    const [measurementTypes, setMeasurementTypes] = useState<MeasurementType[]>([]);
    const [allMetrics, setAllMetrics] = useState<Metric[]>([]);
    const [fetchingData, setFetchingData] = useState(false);

    // Initial load: Fetch everything once for smarter filtering
    useEffect(() => {
        const loadInitialData = async () => {
            setFetchingData(true);
            try {
                const [types, metrics] = await Promise.all([
                    metricService.getMeasurementTypes(),
                    metricService.getMetrics()
                ]);
                setMeasurementTypes(types);
                setAllMetrics(metrics);
            } catch (err) {
                console.error('Failed to fetch initial form data', err);
            } finally {
                setFetchingData(false);
            }
        };

        if (entryType === JournalEntryType.METRIC) {
            loadInitialData();
        }
    }, [entryType]);

    // Effect to populate default metrics from settings
    useEffect(() => {
        if (
            entryType === JournalEntryType.METRIC &&
            allMetrics.length > 0 &&
            settings?.defaultJournalMetricIds &&
            settings.defaultJournalMetricIds.length > 0 &&
            formMetrics.length === 1 &&
            formMetrics[0].selectedMetric === null
        ) {
            const defaults = settings.defaultJournalMetricIds
                .map(id => allMetrics.find(m => m.id === id))
                .filter((m): m is Metric => !!m);

            if (defaults.length > 0) {
                const initialFormMetrics = defaults.map(m => ({
                    id: Math.random().toString(36).substr(2, 9),
                    selectedType: m.measurementType || null,
                    metrics: allMetrics.filter(am => am.measurementType?.id === m.measurementType?.id),
                    selectedMetric: m,
                    value: null
                }));
                setFormMetrics(initialFormMetrics);
            }
        }
    }, [entryType, allMetrics, settings]);

    // Determine which metrics are available for a given row
    const getMetricsForCategory = (typeId: number) => {
        return allMetrics.filter(m => m.measurementType?.id === typeId);
    };

    const addMetricField = () => {
        setFormMetrics(prev => [...prev, {
            id: Math.random().toString(36).substr(2, 9),
            selectedType: null,
            metrics: [],
            selectedMetric: null,
            value: null
        }]);
    };

    const removeMetricField = (id: string) => {
        if (formMetrics.length > 1) {
            setFormMetrics(prev => prev.filter(m => m.id !== id));
        }
    };

    const updateMetricField = (index: number, field: keyof FormMetric, value: any) => {
        setFormMetrics(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };

            if (field === 'selectedType') {
                updated[index].selectedMetric = null;
                updated[index].value = null;
                const categoryMetrics = value ? getMetricsForCategory(value.id) : [];
                updated[index].metrics = categoryMetrics;

                // Auto-select if only one metric is available in this category
                // (Considering metrics already used in other rows)
                if (value) {
                    const currentUsedIds = updated
                        .filter((_, i) => i !== index)
                        .map(m => m.selectedMetric?.id)
                        .filter((id): id is number => id !== undefined);

                    const availableMetrics = categoryMetrics.filter(m => !currentUsedIds.includes(m.id));
                    if (availableMetrics.length === 1) {
                        console.log(`Auto-selecting metric: ${availableMetrics[0].name}`);
                        updated[index].selectedMetric = availableMetrics[0];
                    }
                }
            }
            return updated;
        });
    };

    const entryTypeOptions = [
        { label: 'Metric', value: JournalEntryType.METRIC },
        { label: 'Meal', value: JournalEntryType.MEAL },
        { label: 'Note', value: JournalEntryType.NOTE }
    ];

    const handleSubmit = async () => {
        const validMetrics = formMetrics.filter(m => m.selectedMetric && m.value !== null);
        if (entryType === JournalEntryType.METRIC && validMetrics.length === 0) return;

        setLoading(true);
        try {
            const batchPayload = {
                entryDate: entryDate.toISOString(),
                notes: generalNotes || undefined,
                entries: validMetrics.map(m => ({
                    metricId: m.selectedMetric!.id,
                    value: m.value!,
                    unit: getUnitLabel(m.selectedMetric!, settings?.preferredUnitSystem),
                    notes: '' // Individual notes per metric could be added later
                }))
            };

            const newBatch = await journalService.createBatch(batchPayload);

            // If "Save as default" is checked, update settings
            if (saveAsDefault && validMetrics.length > 0) {
                const { updateDefaultMetrics } = useSettingsStore.getState();
                const metricIds = validMetrics.map(m => m.selectedMetric!.id);
                await updateDefaultMetrics(metricIds);
            }

            // newBatch.entries[0] just to satisfy the legacy onSuccess return type for now
            // We will need to update JournalPage to handle Batches
            onSuccess(newBatch.entries[0]);

            // Reset form fields
            if (saveAsDefault && validMetrics.length > 0) {
                // Manually apply the new defaults immediately for a snappier UX
                const newDefaults = validMetrics.map(m => ({
                    id: Math.random().toString(36).substr(2, 9),
                    selectedType: m.selectedMetric!.measurementType || null,
                    metrics: allMetrics.filter(am => am.measurementType?.id === m.selectedMetric!.measurementType?.id),
                    selectedMetric: m.selectedMetric,
                    value: null
                }));
                setFormMetrics(newDefaults);
            } else if (settings?.defaultJournalMetricIds?.length) {
                // If we didn't save new defaults, try to reload existing ones
                const defaults = settings.defaultJournalMetricIds
                    .map(id => allMetrics.find(m => m.id === id))
                    .filter((m): m is Metric => !!m);

                if (defaults.length > 0) {
                    setFormMetrics(defaults.map(m => ({
                        id: Math.random().toString(36).substr(2, 9),
                        selectedType: m.measurementType || null,
                        metrics: allMetrics.filter(am => am.measurementType?.id === m.measurementType?.id),
                        selectedMetric: m,
                        value: null
                    })));
                } else {
                    setFormMetrics([{
                        id: Math.random().toString(36).substr(2, 9),
                        selectedType: null,
                        metrics: [],
                        selectedMetric: null,
                        value: null
                    }]);
                }
            } else {
                setFormMetrics([{
                    id: Math.random().toString(36).substr(2, 9),
                    selectedType: null,
                    metrics: [],
                    selectedMetric: null,
                    value: null
                }]);
            }

            setGeneralNotes('');
            setSaveAsDefault(false);
        } catch (error) {
            console.error('Failed to create entry batch', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate used IDs outside render for clarity and reuse
    const usedMetricIds = formMetrics
        .map(m => m.selectedMetric?.id)
        .filter((id): id is number => id !== undefined);

    return (
        <Card title="Add New Entry" className="shadow-2 border-round-xl mb-4 p-card-tight">
            <div className="flex flex-column gap-3">
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
                    <div className="flex flex-column gap-4">
                        {formMetrics.map((metricRow, index) => (
                            <MetricEntryRow
                                key={metricRow.id}
                                index={index}
                                metricRow={metricRow}
                                measurementTypes={measurementTypes}
                                allMetrics={allMetrics}
                                usedMetricIds={usedMetricIds}
                                fetchingData={fetchingData}
                                settings={settings}
                                onUpdate={(field, value) => updateMetricField(index, field, value)}
                                onRemove={index > 0 ? () => removeMetricField(metricRow.id) : undefined}
                            />
                        ))}

                        <Button
                            label="Add Metric"
                            icon="pi pi-plus"
                            className="p-button-outlined p-button-secondary w-full border-round-xl"
                            onClick={addMetricField}
                        />
                    </div>
                )}

                <div className="field flex flex-column gap-2">
                    <label className="font-bold">Notes</label>
                    <InputTextarea
                        value={generalNotes}
                        onChange={(e) => setGeneralNotes(e.target.value)}
                        rows={3}
                        autoResize
                        className="w-full"
                        placeholder="Add any notes about this entry here..."
                    />
                </div>

                {entryType === JournalEntryType.METRIC && (
                    <div className="field-checkbox flex align-items-center gap-2 mt-2">
                        <Checkbox
                            inputId="saveAsDefault"
                            checked={saveAsDefault}
                            onChange={e => setSaveAsDefault(e.checked || false)}
                        />
                        <label htmlFor="saveAsDefault" className="text-sm font-medium text-700">
                            Set current fields as default for future entries
                        </label>
                    </div>
                )}

                <div className="flex justify-content-end mt-2">
                    <Button
                        label="Save Journal Entry"
                        icon={loading ? "pi pi-spin pi-spinner" : "pi pi-check"}
                        onClick={handleSubmit}
                        disabled={loading || (entryType === JournalEntryType.METRIC && !formMetrics.every(m => m.selectedMetric && m.value !== null))}
                        className="p-button-primary border-round-xl px-4"
                    />
                </div>
            </div>
        </Card>
    );
};
