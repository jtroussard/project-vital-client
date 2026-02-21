import React from 'react';
import { Navbar } from '../components/Navbar';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 items-stretch">
            <Navbar />
            <main className="flex-1 flex flex-col items-center p-4 md:p-8 lg:p-12 w-full max-w-7xl mx-auto">
                <div className="w-full bg-white p-6 md:p-10 shadow-xl rounded-2xl border border-gray-100">
                    {children}
                </div>
            </main>
            <footer className="p-6 text-center text-gray-400 text-xs uppercase tracking-widest border-t border-gray-200 bg-white">
                &copy; {new Date().getFullYear()} Project Vital - Invest in Yourself
            </footer>
        </div>
    );
};
