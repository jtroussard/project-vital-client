import { create } from 'zustand'
import { Session, User } from '@supabase/supabase-js'

interface AuthState {
    user: User | null;
    session: Session | null;
    isAuthenticated: boolean;
    loading: boolean;
    setSession: (session: Session | null) => void;
    clearSession: () => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    isAuthenticated: false,
    loading: true,
    setSession: (session) => set({
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session,
        loading: false
    }),
    clearSession: () => set({
        session: null,
        user: null,
        isAuthenticated: false,
        loading: false
    }),
    setLoading: (loading) => set({ loading })
}))
