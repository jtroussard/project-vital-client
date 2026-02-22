import React from 'react';

export const LandingPage: React.FC = () => {
    return (
        <div className="text-center py-6 md:py-12 px-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-blue-600 mb-4 tracking-tighter leading-none">
                PROJECT VITAL
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-400 font-bold mb-8 uppercase tracking-[0.3em]">
                Invest in Yourself
            </p>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-10 rounded-full opacity-20"></div>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed font-medium">
                Sign in to start tracking your personal health vitals and take control of your well-being.
            </p>
        </div>
    );
};
