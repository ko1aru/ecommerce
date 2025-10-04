'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { token, setToken } = useAuth();
    const [isChecking, setIsChecking] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        let storedToken = token;

        if(!storedToken) {
            storedToken = localStorage.getItem('token');
            if(storedToken) {
                setToken(storedToken);
            }
        }

        if(!storedToken) {
            router.push('/login');
        } else {
            setAuthorized(true);
        }

        setIsChecking(false);
    }, [token, setToken, router]);

    if (!authorized) return null;
    if(isChecking) return <p>Loading</p>

    return <>{children}</>
}