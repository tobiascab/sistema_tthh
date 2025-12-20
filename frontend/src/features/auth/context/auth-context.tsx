"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    username: string;
    email: string;
    nombre: string;
    apellido: string;
    roles: string[];
    empleadoId?: number;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    hasRole: (role: string) => boolean;
    hasAnyRole: (roles: string[]) => boolean;
    refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const KEYCLOAK_URL = process.env.NEXT_PUBLIC_KEYCLOAK_URL || "http://localhost:8081";
const KEYCLOAK_REALM = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "cooperativa-reducto";
const KEYCLOAK_CLIENT_ID = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "tthh-frontend";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Parse JWT token to extract user info
    const parseJwt = (token: string): any => {
        try {
            // Handle mock tokens
            if (token.startsWith('mock.')) {
                const parts = token.split('.');
                if (parts.length === 3) {
                    return JSON.parse(atob(parts[1]));
                }
            }

            // Handle real JWT tokens
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("Error parsing JWT:", error);
            return null;
        }
    };

    // Extract user from token
    const extractUserFromToken = (token: string): User | null => {
        const payload = parseJwt(token);
        if (!payload) return null;

        // Support both Keycloak format (realm_access.roles) and local JWT format (roles directly)
        const roles = payload.roles || payload.realm_access?.roles || ['COLABORADOR'];

        return {
            id: payload.sub || payload.userId,
            username: payload.preferred_username || payload.sub,
            email: payload.email || "",
            nombre: payload.given_name || "",
            apellido: payload.family_name || "",
            roles: roles,
            empleadoId: payload.empleadoId || payload.userId,
        };
    };

    // Check if user is authenticated on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("access_token");

            if (token) {
                const userData = extractUserFromToken(token);
                if (userData) {
                    setUser(userData);

                    // Set cookie for middleware
                    document.cookie = `access_token=${token}; path=/; max-age=3600; SameSite=Lax`;
                } else {
                    // Invalid token
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                }
            }

            setIsLoading(false);
        };

        checkAuth();
    }, []);

    // Login with real backend authentication
    const login = async (username: string, password: string) => {
        setIsLoading(true);

        try {
            // Call real backend authentication endpoint
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Credenciales inválidas');
            }

            const data = await response.json();

            // Store the real JWT token
            localStorage.setItem('access_token', data.token);
            localStorage.setItem('refresh_token', data.token); // Use same token for now

            // Store empleadoId for easy access
            if (data.user?.empleadoId) {
                localStorage.setItem('empleadoId', String(data.user.empleadoId));
            }

            // Set cookie for middleware
            document.cookie = `access_token=${data.token}; path=/; max-age=${data.expiresIn || 28800}; SameSite=Lax`;

            // Map backend response to User object
            const userData: User = {
                id: String(data.user.id),
                username: data.user.username,
                email: data.user.email || '',
                nombre: data.user.nombres || '',
                apellido: data.user.apellidos || '',
                roles: data.user.roles || ['COLABORADOR'],
                empleadoId: data.user.empleadoId,
            };

            setUser(userData);

            console.log('✅ Login exitoso para:', userData.username);

            // Redirect to dashboard
            window.location.href = '/dashboard';
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Logout
    const logout = async () => {
        const token = localStorage.getItem("access_token");

        // Clear tokens
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("empleadoId");
        document.cookie = "access_token=; path=/; max-age=0";

        setUser(null);
        router.push("/login");
    };

    // Refresh token (simplified - for now just logout if token expires)
    const refreshToken = async () => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            throw new Error("No token available");
        }

        // For now, just logout if refresh is called (token expired)
        // In the future, implement proper refresh endpoint
        console.warn('Token refresh not implemented, logging out');
        await logout();
    };

    // Check if user has specific role
    const hasRole = (role: string): boolean => {
        return user?.roles?.includes(`ROLE_${role}`) || user?.roles?.includes(role) || false;
    };

    // Check if user has any of the specified roles
    const hasAnyRole = (roles: string[]): boolean => {
        return roles.some((role) => hasRole(role));
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        hasRole,
        hasAnyRole,
        refreshToken,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
