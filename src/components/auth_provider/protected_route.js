"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../../hooks/useAuth";
import styles from "./protected_route.module.css";

/**
 * Higher-order component that protects routes requiring authentication
 * Redirects unauthenticated users to the login page
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Перевірка доступу...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className={styles.loadingContainer}>
                <p>Перенаправлення на сторінку входу...</p>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
