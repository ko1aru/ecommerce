'use client';
import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";

interface User {
    username: string;
    email: string;
    profilePicUrl: string;
    role: string;
}
interface AuthContextType {
    token: string | null;
    user: User | null;
    setToken: (token: string | null) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if(savedToken) {
            setToken(savedToken);
            fetchUser(savedToken);
        }
    }, []);

    const fetchUser = async (jwt?: string) => {
        try {
            const res = await api.get("/auth/me", {
                headers: { Authorization: `Bearer ${jwt || token}` }
            });
            setUser(res.data);
        } catch (err) {
            console.error("Failed to fetch user info", err);
            setUser(null);
        }
    };

    const handleSetToken = (newToken: string | null) => {
        setToken(newToken);
        if(newToken) {
            localStorage.setItem("token", newToken);
            fetchUser(newToken);
        } else {
            localStorage.removeItem("token");
            setUser(null);
        }
    }

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ token, setToken: handleSetToken, user, logout }} >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error("useAuth must be used inside AuthProvider")
    }
    return context;
};