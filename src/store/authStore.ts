import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { User } from '../types';

// API base URL - update this to match your backend
const API_URL = process.env.NEXT_PUBLIC_BACKEND;

interface AuthState {
    token: string | null;
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
    signup: (email: string, password: string, rememberMe: boolean, name?: string) => Promise<boolean>;
    loginRegisterWithGoogle: (idToken: string) => Promise<boolean>; 
    logout: () => void;
    isAuthenticated: () => boolean;
    clearError: () => void;
    updateUser: (user: User) => void;
    getProfile: () => Promise<User | null>;
    setToken: (token: string) => void; 
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            isLoading: false,
            error: null,
            isAuthenticated: () => !!get().token,

            setToken: (token: string) => {
                set({ token });
            },
            
            login: async (email: string, password: string, rememberMe: boolean = false) => {
                try {
                    set({ isLoading: true, error: null });

                    const response = await fetch(`${API_URL}/api/auth/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password, rememberMe }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Login failed');
                    }

                    const data = await response.json();

                    set({
                        token: data.token,
                        user: data.user,
                        isLoading: false,
                    });

                    return true;
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Login failed';
                    set({
                        isLoading: false,
                        error: errorMessage
                    });
                    return false;
                }
            },

            signup: async (email: string, password: string, rememberMe: boolean = false, name?: string) => {
                try {
                    set({ isLoading: true, error: null });

                    const response = await fetch(`${API_URL}/api/auth/register`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password, name, rememberMe }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Registration failed');
                    }

                    const data = await response.json();

                    set({
                        token: data.token,
                        user: data.user,
                        isLoading: false,
                    });

                    return true;
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Registration failed';
                    set({
                        isLoading: false,
                        error: errorMessage
                    });
                    return false;
                }
            },

            loginRegisterWithGoogle: async (idToken: string): Promise<boolean> => {
            try {
                set({ isLoading: true, error: null });

                const response = await fetch(`${API_URL}/api/auth/google/callback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idToken }),
                });

                if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Google login failed');
                }

                const data = await response.json();

                set({
                token: data.token,
                user: data.user,
                isLoading: false,
                });

                return true;
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Google login failed';
                set({
                isLoading: false,
                error: errorMessage,
                });
                return false;
            }
            },

            logout: () => {
                set({
                    token: null,
                    user: null,
                    error: null,
                });
            },

            clearError: () => {
                set({ error: null });
            },

            // New method to update user profile data
            updateUser: (user: User) => {
                set({ user });
            },

            // New method to fetch user profile
            getProfile: async () => {
                try {
                    set({ isLoading: true, error: null });
                    
                    // Get token from state
                    const token = get().token;
                    if (!token) {
                        set({ isLoading: false });
                        return null;
                    }
                    
                    const response = await fetch(`${API_URL}/api/profile`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        // Handle expired token
                        if (response.status === 401) {
                            // Logout and clear data
                            set({
                                token: null,
                                user: null,
                                isLoading: false,
                                error: 'Your session has expired. Please log in again.'
                            });
                            return null;
                        }
                        
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Failed to fetch profile');
                    }

                    const data = await response.json();
                    set({
                        user: data.user,
                        isLoading: false,
                    });

                    return data.user;
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
                    set({
                        isLoading: false,
                        error: errorMessage
                    });
                    return null;
                }
            },
        }),
        {
            name: 'auth-storage', // name of the item in localStorage
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);