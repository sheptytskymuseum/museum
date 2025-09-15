"use client";
import { useEffect } from "react";
import useAuthStore from "../../store/auth_store";

const AuthProvider = ({ children }) => {
    const initializeAuth = useAuthStore((state) => state.initializeAuth);

    useEffect(() => {
        // Initialize Firebase auth state listener
        const unsubscribe = initializeAuth();

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [initializeAuth]);

    return children;
};

export default AuthProvider;
