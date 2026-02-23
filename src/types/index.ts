export enum JournalEntryType {
    METRIC = 'METRIC',
    MEAL = 'MEAL',
    NOTE = 'NOTE'
}

export enum MetricDataType {
    NUMERIC = 'NUMERIC',
    TEXT = 'TEXT',
    BOOLEAN = 'BOOLEAN'
}

export interface MeasurementType {
    id: number;
    name: string;
}

export interface Metric {
    id: number;
    name: string;
    baseUnit: string;
    dataType: MetricDataType;
    measurementType?: MeasurementType;
}

export interface Meal {
    id: number;
    name: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
}

export interface JournalEntry {
    id: number;
    userId: string;
    entryType: JournalEntryType;
    entryDate: string;
    value?: number;
    notes?: string;
    isActive: boolean;
    metric?: Metric;
    meal?: Meal;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserProfile {
    id: number;
    userId: string;
    email: string;
    displayName?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    gender?: string;
    status?: string;
    address?: {
        street1?: string;
        street2?: string;
        city?: string;
        stateProvince?: string;
        postalCode?: string;
        country?: string;
    };
    phoneNumber?: {
        countryCode?: string;
        areaCode?: string;
        number?: string;
        extension?: string;
    };
    createdAt?: string;
    updatedAt?: string;
}
