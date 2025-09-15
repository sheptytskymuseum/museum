"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import styles from "./login.module.css";
import PageWrapper from "@/components/page_wrapper/page_wrapper";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, loading, error, clearError, isAuthenticated } = useAuth();
    const router = useRouter();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push("/events");
        }
    }, [isAuthenticated, router]);

    // Clear error when component unmounts or inputs change
    useEffect(() => {
        if (error) {
            clearError();
        }
    }, [email, password, clearError]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            return;
        }

        setIsSubmitting(true);

        const result = await login(email.trim(), password);

        if (result.success) {
            router.push("/events");
        }

        setIsSubmitting(false);
    };

    if (loading) {
        return (
            <div>
                <div className={styles.loadingSpinner}>
                    <div className={styles.spinner}></div>
                    <p>Завантаження...</p>
                </div>
            </div>
        );
    }

    return (
        <PageWrapper>
            <h1>Вхід для адміністратора</h1>
            <p className={styles.subtitle}>
                Введіть свої облікові дані для доступу до панелі адміністратора
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
                {error && <div className={styles.errorMessage}>{error}</div>}

                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>
                        Електронна пошта
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                        placeholder="admin@example.com"
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.label}>
                        Пароль
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                        placeholder="Введіть пароль"
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting || !email.trim() || !password.trim()}
                >
                    {isSubmitting ? "Вхід..." : "Увійти"}
                </button>
            </form>
        </PageWrapper>
    );
};

export default LoginPage;
