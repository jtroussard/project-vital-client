import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { StatsTile } from '../components/StatsTile';
import { Calendar, FileText, Target, Plus, List } from 'lucide-react';
import { Button } from 'primereact/button';
import { profileService } from '../services/profileService';
import { journalService } from '../services/journalService';
import { UserProfile, JournalEntryResponse } from '../types';

export const HomePage: React.FC = () => {
    const { user } = useAuthStore();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [entries, setEntries] = useState<JournalEntryResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileData, entriesData] = await Promise.all([
                    profileService.getMyProfile(),
                    journalService.getEntries()
                ]);
                setProfile(profileData);
                setEntries(entriesData);
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Calculate visits (unique full days)
    const uniqueDates = new Set(
        entries.map(e => {
            try {
                return new Date(e.entryDate).toDateString();
            } catch (err) {
                return '';
            }
        }).filter(d => d !== '')
    );
    const visitCount = uniqueDates.size;

    return (
        <div className="flex flex-col gap-8 py-4">
            {/* Welcome Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-gray-900 m-0 leading-tight">
                    Welcome Back, {profile?.displayName || user?.email?.split('@')[0]}
                </h1>
                <p className="text-gray-500 font-medium">
                    Here's a snapshot of your progress today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsTile
                    title="Visits"
                    value={visitCount}
                    icon={Calendar}
                    subtitle="Unique days logged"
                    loading={loading}
                />
                <StatsTile
                    title="Total Entries"
                    value={entries.length}
                    icon={FileText}
                    subtitle="All-time snapshots"
                    loading={loading}
                    colorClass="text-green-600"
                />
                <StatsTile
                    title="Profile Strength"
                    value={undefined} // Placeholder
                    icon={Target}
                    subtitle="Upcoming feature"
                    loading={loading}
                    disabled={true}
                />
            </div>

            {/* Quick Actions */}
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
                <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">
                    Quick Actions
                </h3>
                <div className="flex flex-wrap gap-4">
                    <Button
                        label="Add Entry"
                        icon={<Plus size={18} className="mr-2" />}
                        className="p-button-primary rounded-xl px-6 py-3 shadow-md font-bold"
                        onClick={() => alert('Add Entry coming soon!')}
                    />
                    <Button
                        label="View History"
                        icon={<List size={18} className="mr-2" />}
                        className="p-button-outlined bg-white rounded-xl px-6 py-3 shadow-sm font-bold"
                        onClick={() => alert('Journal History coming soon!')}
                    />
                </div>
            </div>
        </div>
    );
};
