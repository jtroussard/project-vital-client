import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { supabase } from './services/supabaseClient';
import { MainLayout } from './layouts/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { ProgressSpinner } from 'primereact/progressspinner';

const App: React.FC = () => {
    const { isAuthenticated, loading, setSession } = useAuthStore();

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

    if (loading) {
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
                    {/* Catch-all */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </MainLayout>
        </BrowserRouter>
    );
};

export default App;
