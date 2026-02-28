import React, { useEffect, useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { profileService } from '../services/profileService';
import { useSettingsStore } from '../store/useSettingsStore';
import { UserProfile, UnitSystem } from '../types';

export const ProfilePage: React.FC = () => {
    const { settings, updateUnitSystem } = useSettingsStore();
    const [profile, setProfile] = useState<Partial<UserProfile>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await profileService.getMyProfile();
                setProfile(data);
            } catch (error) {
                console.error('Failed to fetch profile', error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load profile' });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const updatePromises: Promise<any>[] = [profileService.updateProfile(profile)];

            if (settings?.preferredUnitSystem) {
                updatePromises.push(updateUnitSystem(settings.preferredUnitSystem));
            }

            const [updatedProfile] = await Promise.all(updatePromises);
            setProfile(updatedProfile);

            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Profile and settings updated' });
        } catch (error) {
            console.error('Failed to update profile or settings', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Update failed' });
        } finally {
            setSaving(false);
        }
    };

    const unitSystemOptions = [
        { label: 'Metric (kg, mmol/L)', value: UnitSystem.METRIC },
        { label: 'Imperial (lb, mg/dL)', value: UnitSystem.IMPERIAL }
    ];

    if (loading) {
        return (
            <div className="flex align-items-center justify-content-center py-8">
                <i className="pi pi-spin pi-spinner text-4xl text-primary"></i>
            </div>
        );
    }

    return (
        <div className="max-w-30rem mx-auto py-4">
            <Toast ref={toast} />
            <div className="flex align-items-center gap-3 mb-6">
                <Button
                    icon="pi pi-arrow-left"
                    className="p-button-text p-button-rounded p-button-plain"
                    onClick={() => window.history.back()}
                />
                <h1 className="text-3xl font-black text-900 m-0">User Profile</h1>
            </div>

            <Card className="shadow-2 border-round-xl">
                <div className="flex flex-column gap-6">
                    {/* Basic Info Group */}
                    <div className="flex flex-column gap-4">
                        <h3 className="text-sm font-bold text-primary uppercase tracking-widest m-0">Basic Information</h3>

                        <div className="field flex flex-column gap-2">
                            <label htmlFor="displayName" className="font-medium text-700">Display Name</label>
                            <InputText
                                id="displayName"
                                value={profile.displayName || ''}
                                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                                placeholder="How should we call you?"
                            />
                        </div>

                        <div className="grid">
                            <div className="col-12 md:col-6 field flex flex-column gap-2">
                                <label htmlFor="firstName" className="font-medium text-700">First Name</label>
                                <InputText
                                    id="firstName"
                                    value={profile.firstName || ''}
                                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                />
                            </div>
                            <div className="col-12 md:col-6 field flex flex-column gap-2">
                                <label htmlFor="lastName" className="font-medium text-700">Last Name</label>
                                <InputText
                                    id="lastName"
                                    value={profile.lastName || ''}
                                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Measurement Preferences Group */}
                    <div className="flex flex-column gap-4">
                        <h3 className="text-sm font-bold text-primary uppercase tracking-widest m-0">Measurement Preferences</h3>

                        <div className="field flex flex-column gap-2">
                            <label htmlFor="unitSystem" className="font-medium text-700">Preferred Unit System</label>
                            <Dropdown
                                id="unitSystem"
                                value={settings?.preferredUnitSystem}
                                options={unitSystemOptions}
                                onChange={(e) => {
                                    if (settings) {
                                        useSettingsStore.setState({ settings: { ...settings, preferredUnitSystem: e.value } });
                                    }
                                }}
                                placeholder="Select Unit System"
                            />
                            <small className="text-gray-500">Choosing Imperial will convert mass metrics like Weight to pounds.</small>
                        </div>
                    </div>

                    <div className="flex justify-content-end gap-3 mt-4">
                        <Button
                            label="Cancel"
                            className="p-button-text p-button-secondary font-bold"
                            onClick={() => window.history.back()}
                        />
                        <Button
                            label="Save Changes"
                            icon={saving ? "pi pi-spin pi-spinner" : "pi pi-check"}
                            className="p-button-primary border-round-xl px-6 font-bold shadow-2 shadow-hover"
                            onClick={handleSave}
                            disabled={saving}
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
};
