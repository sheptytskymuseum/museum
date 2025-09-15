import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";

const useAuthStore = create(
    subscribeWithSelector((set, get) => ({
        // State
        user: null,
        loading: true,
        error: null,

        // Actions
        login: async (email, password) => {
            set({ loading: true, error: null });
            try {
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                const user = userCredential.user;

                set({
                    user: {
                        uid: user.uid,
                        email: user.email,
                        isAdmin: true, // Since there's only one admin user
                    },
                    loading: false,
                    error: null,
                });

                return { success: true };
            } catch (error) {
                let errorMessage =
                    "Login failed. Please check your credentials.";

                switch (error.code) {
                    case "auth/user-not-found":
                        errorMessage =
                            "No account found with this email address.";
                        break;
                    case "auth/wrong-password":
                        errorMessage = "Incorrect password.";
                        break;
                    case "auth/invalid-email":
                        errorMessage = "Invalid email address.";
                        break;
                    case "auth/too-many-requests":
                        errorMessage =
                            "Too many failed attempts. Please try again later.";
                        break;
                    default:
                        errorMessage = error.message || errorMessage;
                }

                set({
                    user: null,
                    loading: false,
                    error: errorMessage,
                });

                return { success: false, error: errorMessage };
            }
        },

        logout: async () => {
            set({ loading: true, error: null });
            try {
                await signOut(auth);
                set({
                    user: null,
                    loading: false,
                    error: null,
                });
                return { success: true };
            } catch (error) {
                set({
                    loading: false,
                    error: "Failed to logout. Please try again.",
                });
                return {
                    success: false,
                    error: "Failed to logout. Please try again.",
                };
            }
        },

        clearError: () => set({ error: null }),

        // Initialize auth state listener
        initializeAuth: () => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                    set({
                        user: {
                            uid: user.uid,
                            email: user.email,
                            isAdmin: true,
                        },
                        loading: false,
                        error: null,
                    });
                } else {
                    set({
                        user: null,
                        loading: false,
                        error: null,
                    });
                }
            });

            return unsubscribe;
        },

        // Computed getters
        isAuthenticated: () => {
            const { user } = get();
            return !!user;
        },

        isAdmin: () => {
            const { user } = get();
            return user?.isAdmin || false;
        },
    }))
);

export default useAuthStore;
