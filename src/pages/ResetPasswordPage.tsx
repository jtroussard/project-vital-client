import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Card } from 'primereact/card';
import { supabase } from '../services/supabaseClient';

export const ResetPasswordPage: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Supabase password reset links automatically sign the user in with a recovery session.
        // We just need to check if we have a valid session to allow the password update.
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                setError('Invalid or expired reset link. Please request a new one.');
            }
        });
    }, []);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
            setTimeout(() => navigate('/home'), 3000);
        }
    };

    return (
        <div className="flex justify-content-center align-items-center py-8">
            <Card title="Reset Your Password" subTitle="Enter your new password below" className="w-full md:w-30rem shadow-2 border-round-xl">
                {success ? (
                    <div className="flex flex-column align-items-center gap-4 py-4 text-center">
                        <i className="pi pi-check-circle text-6xl text-green-500"></i>
                        <div>
                            <h3 className="text-xl font-bold text-900 mb-2">Password Updated!</h3>
                            <p className="text-600">Your password has been changed successfully. Redirecting you to the home page...</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleReset} className="flex flex-column gap-4">
                        {error && <Message severity="error" text={error} className="w-full" />}

                        <div className="flex flex-column gap-2 text-left">
                            <label htmlFor="password">New Password</label>
                            <Password
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                toggleMask
                                required
                                className="w-full"
                                inputClassName="w-full"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex flex-column gap-2 text-left">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <Password
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                feedback={false}
                                toggleMask
                                required
                                className="w-full"
                                inputClassName="w-full"
                                placeholder="••••••••"
                            />
                        </div>

                        <Button
                            type="submit"
                            label="Update Password"
                            loading={loading}
                            className="mt-2 w-full p-button-primary border-round-xl"
                        />
                    </form>
                )}
            </Card>
        </div>
    );
};
