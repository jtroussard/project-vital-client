import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { useSettingsStore } from './store/useSettingsStore';
import { supabase } from './services/supabaseClient';
import { MainLayout } from './layouts/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { JournalPage } from './pages/JournalPage';
import { JournalEntryDetailsPage } from './pages/JournalEntryDetailsPage';
import { ProgressSpinner } from 'primereact/progressspinner';

const App: React.FC = () => {
    const { isAuthenticated, loading: authLoading, setSession } = useAuthStore();
    const { fetchSettings, loading: settingsLoading } = useSettingsStore();

    useEffect(() => {
        if (isAuthenticated) {
            fetchSettings();
        }
    }, [isAuthenticated, fetchSettings]);

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, [setSession]);

    if (authLoading || (isAuthenticated && settingsLoading)) {
        return (
            <div className="flex align-items-center justify-content-center h-screen">
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <BrowserRouter>
            <MainLayout>
                <Routes>
                    <Route
                        path="/"
                        element={!isAuthenticated ? <LandingPage /> : <Navigate to="/home" />}
                    />
                    <Route
                        path="/home"
                        element={isAuthenticated ? <HomePage /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/profile"
                        element={isAuthenticated ? <ProfilePage /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/journal"
                        element={isAuthenticated ? <JournalPage /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/journal/batch/:id"
                        element={isAuthenticated ? <JournalEntryDetailsPage /> : <Navigate to="/" />}
                    />
                    {/* Catch-all */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </MainLayout>
        </BrowserRouter>
    );
};

export default App;
