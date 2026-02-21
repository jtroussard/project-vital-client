import React from 'react';
import { useAuthStore } from '../store/useAuthStore';

export const HomePage: React.FC = () => {
    const { user } = useAuthStore();

    return (
        <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <div className="text-xl text-primary font-medium mb-4">
                {user?.email}
            </div>
            <div className="p-4 bg-blue-50 border-round text-blue-800 text-sm">
                You are now successfully authenticated with Project Vital.
                Your health data dashboard will appear here soon.
            </div>
        </div>
    );
};
