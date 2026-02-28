import { Metric, QuantityCategory, UnitSystem } from '../types';

const UNIT_MAP: Partial<Record<QuantityCategory, Record<UnitSystem, string>>> = {
    [QuantityCategory.MASS]: {
        [UnitSystem.METRIC]: 'kg',
        [UnitSystem.IMPERIAL]: 'lb'
    },
    [QuantityCategory.LENGTH]: {
        [UnitSystem.METRIC]: 'cm',
        [UnitSystem.IMPERIAL]: 'in'
    },
    [QuantityCategory.TEMPERATURE]: {
        [UnitSystem.METRIC]: '°C',
        [UnitSystem.IMPERIAL]: '°F'
    }
};

export const getDisplayUnit = (metric: Metric, unitSystem: UnitSystem): string => {
    let category = metric.quantityCategory;

    // Robust Inference: If backend is missing category, infer it from baseUnit
    if (!category) {
        if (metric.baseUnit === 'kg' || metric.name.toLowerCase().includes('weight')) {
            category = QuantityCategory.MASS;
        } else if (metric.baseUnit === 'cm') {
            category = QuantityCategory.LENGTH;
        } else if (metric.baseUnit === '°C') {
            category = QuantityCategory.TEMPERATURE;
        }
    }

    console.log('[unitUtils] Resolved category:', {
        original: metric.quantityCategory,
        resolved: category,
        unitSystem
    });

    if (category === QuantityCategory.SCALAR) {
        return metric.baseUnit;
    }

    const categoryMap = UNIT_MAP[category as QuantityCategory];
    if (categoryMap) {
        const result = categoryMap[unitSystem];
        console.log('[unitUtils] Success! Mapped to:', result);
        return result;
    }

    console.warn(`[unitUtils] Final fallback to baseUnit for ${metric.name}: ${metric.baseUnit}`);
    return metric.baseUnit;
};

export const getUnitLabel = (metric: Metric | null, unitSystem: UnitSystem | undefined): string => {
    if (!metric) return '';
    const system = unitSystem || UnitSystem.METRIC;
    return getDisplayUnit(metric, system);
};
