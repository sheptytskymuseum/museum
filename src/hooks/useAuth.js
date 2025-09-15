import useAuthStore from "../store/auth_store";

/**
 * Custom hook that provides authentication state and actions
 * This is a convenience wrapper around the Zustand auth store
 */
export const useAuth = () => {
    const {
        user,
        loading,
        error,
        login,
        logout,
        clearError,
        isAuthenticated,
        isAdmin,
    } = useAuthStore();

    return {
        // State
        user,
        loading,
        error,

        // Computed state
        isAuthenticated: isAuthenticated(),
        isAdmin: isAdmin(),

        // Actions
        login,
        logout,
        clearError,
    };
};

export default useAuth;
