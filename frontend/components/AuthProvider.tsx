'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    nome: string;
    perfil: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, token: null, logout: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    const loadAuth = () => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('usuario');
        if (storedToken && storedUser) {
            setToken(storedToken);
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Failed to parse user', e);
            }
        } else {
            setToken(null);
            setUser(null);
        }
    };

    useEffect(() => {
        loadAuth();
        window.addEventListener('localStorageChange', loadAuth);
        return () => window.removeEventListener('localStorageChange', loadAuth);
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        loadAuth();
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
