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

export const LoginModal: React.FC<LoginModalProps> = ({ visible, onHide }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { setSession } = useAuthStore();

    const handleLogin = async (e: React.FormEvent) => {
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
            onHide();
        }
    };

    return (
        <Dialog
            header="Login to Project Vital"
            visible={visible}
            onHide={onHide}
            className="w-full md:w-30rem"
            draggable={false}
            resizable={false}
        >
            <form onSubmit={handleLogin} className="flex flex-column gap-4 py-3">
                {error && <Message severity="error" text={error} className="w-full" />}

                <div className="flex flex-column gap-2">
                    <label htmlFor="email">Email</label>
                    <InputText
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                    />
                </div>

                <div className="flex flex-column gap-2">
                    <label htmlFor="password">Password</label>
                    <Password
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        feedback={false}
                        toggleMask
                        placeholder="••••••••"
                        required
                        className="w-full"
                        inputClassName="w-full"
                    />
                </div>

                <Button
                    type="submit"
                    label="Sign In"
                    loading={loading}
                    className="mt-2 w-full"
                />

                <div className="text-center text-sm text-gray-500 mt-2">
                    Don't have an account? Contact admin for access.
                </div>
            </form>
        </Dialog>
    );
};
