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

export enum UnitSystem {
    METRIC = 'METRIC',
    IMPERIAL = 'IMPERIAL'
}

export enum QuantityCategory {
    MASS = 'MASS',
    LENGTH = 'LENGTH',
    TEMPERATURE = 'TEMPERATURE',
    SCALAR = 'SCALAR'
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
    quantityCategory: QuantityCategory;
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

export interface JournalEntryResponse {
    id: number;
    userId: string;
    batchId: number;       // Parent batch identifier
    metricId: number;
    metricName: string;
    entryType: JournalEntryType;
    value: number;         // RAW value stored in DB (always metric)
    displayValue: number;  // CONVERTED value for the current user's preference
    displayUnit: string;   // Unit string for display (e.g., "kg", "lb", "mmol/L")
    notes: string;
    entryDate: string;     // ISO OffsetDateTime
    meal?: Meal;           // Meal object if entryType is MEAL
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface JournalBatch {
    id: number;
    userId: string;
    entryDate: string;
    notes?: string;
    entries: JournalEntryResponse[];
}

export interface UserSettings {
    userId: string;
    preferredUnitSystem: UnitSystem;
    defaultJournalMetricIds: number[];
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
export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    numberOfElements: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export type TimeRange = '3D' | '1W' | '2W' | '1M' | '1Q' | '6M' | '1Y' | 'ALL';
