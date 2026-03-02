import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { supabase } from '../services/supabaseClient';
import { useAuthStore } from '../store/useAuthStore';

interface LoginModalProps {
    visible: boolean;
    onHide: () => void;
}

type AuthView = 'SIGN_IN' | 'SIGN_UP' | 'FORGOT_PASSWORD' | 'SUCCESS';

export const LoginModal: React.FC<LoginModalProps> = ({ visible, onHide }) => {
    const [view, setView] = useState<AuthView>('SIGN_IN');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const { setSession } = useAuthStore();

    const resetFields = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError(null);
        setSuccessMessage('');
    };

    const handleHide = () => {
        resetFields();
        setView('SIGN_IN');
        onHide();
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSession(data.session);
            setLoading(false);
            handleHide();
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/home`,
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccessMessage('Registration successful! Please check your email to verify your account.');
            setView('SUCCESS');
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccessMessage('Password reset link sent! Please check your email.');
            setView('SUCCESS');
            setLoading(false);
        }
    };

    const renderHeader = () => {
        switch (view) {
            case 'SIGN_UP': return 'Create Your Account';
            case 'FORGOT_PASSWORD': return 'Reset Your Password';
            case 'SUCCESS': return 'Success';
            default: return 'Login to Project Vital';
        }
    };

    return (
        <Dialog
            header={renderHeader()}
            visible={visible}
            onHide={handleHide}
            className="w-full md:w-30rem"
            draggable={false}
            resizable={false}
        >
            {view === 'SUCCESS' ? (
                <div className="flex flex-column align-items-center gap-4 py-4 text-center">
                    <i className="pi pi-check-circle text-6xl text-green-500"></i>
                    <p className="text-900 font-medium">{successMessage}</p>
                    <Button label="Back to Login" onClick={() => setView('SIGN_IN')} className="p-button-text font-bold" />
                </div>
            ) : (
                <div className="p-fluid py-3">
                    {error && <Message severity="error" text={error} className="w-full mb-4" />}

                    {view === 'SIGN_IN' && (
                        <form onSubmit={handleSignIn} className="flex flex-column gap-3">
                            <div className="flex flex-column gap-1">
                                <label htmlFor="login_email" className="font-semibold text-sm text-700">Email Address</label>
                                <InputText
                                    id="login_email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div className="flex flex-column gap-1">
                                <label htmlFor="login_password" className="font-semibold text-sm text-700">Password</label>
                                <Password
                                    id="login_password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    feedback={false}
                                    toggleMask
                                    placeholder="••••••••"
                                    required
                                    style={{ width: '100%' }}
                                    inputStyle={{ width: '100%' }}
                                />
                                <div className="flex justify-content-end">
                                    <Button
                                        label="Forgot Password?"
                                        type="button"
                                        onClick={() => setView('FORGOT_PASSWORD')}
                                        className="p-0 p-button-link text-xs font-bold w-auto"
                                    />
                                </div>
                            </div>
                            <Button type="submit" label="Sign In to Dashboard" loading={loading} className="mt-2 p-button-primary border-round-xl py-3 font-bold shadow-2" />
                            <div className="text-center text-sm text-gray-500 mt-2">
                                Don't have an account? <Button label="Sign Up" type="button" onClick={() => setView('SIGN_UP')} className="p-0 p-button-link text-sm font-bold" />
                            </div>
                        </form>
                    )}

                    {view === 'SIGN_UP' && (
                        <form onSubmit={handleSignUp} className="flex flex-column gap-3">
                            <div className="flex flex-column gap-1">
                                <label htmlFor="reg_email" className="font-semibold text-sm text-700">Email Address</label>
                                <InputText id="reg_email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required style={{ width: '100%' }} />
                            </div>
                            <div className="flex flex-column gap-1">
                                <label htmlFor="reg_password" className="font-semibold text-sm text-700">Choose Password</label>
                                <Password id="reg_password" value={password} onChange={(e) => setPassword(e.target.value)} toggleMask placeholder="••••••••" required style={{ width: '100%' }} inputStyle={{ width: '100%' }} />
                            </div>
                            <div className="flex flex-column gap-1">
                                <label htmlFor="confirm_password" className="font-semibold text-sm text-700">Confirm Password</label>
                                <Password id="confirm_password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} feedback={false} toggleMask placeholder="••••••••" required style={{ width: '100%' }} inputStyle={{ width: '100%' }} />
                            </div>
                            <Button type="submit" label="Create New Account" loading={loading} className="mt-2 p-button-success border-round-xl py-3 font-bold shadow-2" />
                            <div className="text-center text-sm text-gray-500 mt-2">
                                Already have an account? <Button label="Sign In" type="button" onClick={() => setView('SIGN_IN')} className="p-0 p-button-link text-sm font-bold" />
                            </div>
                        </form>
                    )}

                    {view === 'FORGOT_PASSWORD' && (
                        <form onSubmit={handleForgotPassword} className="flex flex-column gap-3">
                            <p className="text-sm text-gray-600 m-0">Enter your email and we'll send you a link to reset your password.</p>
                            <div className="flex flex-column gap-1">
                                <label htmlFor="reset_email" className="font-semibold text-sm text-700">Email Address</label>
                                <InputText id="reset_email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required style={{ width: '100%' }} />
                            </div>
                            <Button type="submit" label="Send Reset Link" loading={loading} className="mt-2 p-button-primary border-round-xl py-3 font-bold shadow-2" />
                            <div className="text-center text-sm text-gray-500 mt-2">
                                Back to <Button label="Sign In" type="button" onClick={() => setView('SIGN_IN')} className="p-0 p-button-link text-sm font-bold" />
                            </div>
                        </form>
                    )}
                </div>
            )}
        </Dialog>
    );
};
