import React from 'react';

export const LandingPage: React.FC = () => {
    return (
        <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-black text-primary mb-2 line-height-1">
                PROJECT VITAL
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 font-medium mb-4 uppercase tracking-widest">
                Invest in Yourself
            </p>
            <div className="w-4rem h-2px bg-primary mx-auto mb-6"></div>
            <p className="text-gray-500 max-w-30rem mx-auto line-height-3">
                Sign in to start tracking your personal health vitals and take control of your well-being.
            </p>
        </div>
    );
};
