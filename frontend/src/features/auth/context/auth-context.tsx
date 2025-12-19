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

        return {
            id: payload.sub,
            username: payload.preferred_username || payload.sub,
            email: payload.email || "",
            nombre: payload.given_name || "",
            apellido: payload.family_name || "",
            roles: payload.realm_access?.roles || [],
            empleadoId: payload.empleadoId,
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

    // Login with Keycloak (or dev mode)
    const login = async (username: string, password: string) => {
        setIsLoading(true);

        try {
            // Check if dev mode is enabled (default to true for easy setup)
            const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE !== 'false';

            if (isDevMode) {
                // Development mode - authenticate against backend DB
                console.warn('🔧 DEV MODE: Authenticating against backend database');

                // Try to fetch user from backend by username
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
                let backendUser: any = null;

                try {
                    const response = await fetch(`${API_URL}/usuarios/username/${encodeURIComponent(username)}`);
                    if (response.ok) {
                        backendUser = await response.json();
                    }
                } catch (err) {
                    console.warn('Could not fetch user from backend:', err);
                }

                // If user found in DB, use their real data
                let mockUser: User & { empleadoId?: number };

                if (backendUser) {
                    console.log('✅ User found in database:', backendUser.username);
                    mockUser = {
                        id: String(backendUser.id),
                        username: backendUser.username,
                        email: backendUser.email || `${username}@coopreducto.com`,
                        nombre: backendUser.nombres || username.split('.')[0] || 'Usuario',
                        apellido: backendUser.apellidos || username.split('.')[1] || 'Test',
                        roles: backendUser.rolNombre ? [backendUser.rolNombre] : ['COLABORADOR'],
                        empleadoId: backendUser.empleadoId,
                    };
                } else {
                    // Fallback to simple mock (for admin testing)
                    console.warn('⚠️ User not found in DB, using mock roles');
                    mockUser = {
                        id: '1',
                        username,
                        email: `${username}@coopreducto.com`,
                        nombre: username.split('.')[0] || 'Usuario',
                        apellido: username.split('.')[1] || 'Test',
                        roles: username.includes('admin') ? ['TTHH'] :
                            username.includes('gerente') ? ['GERENCIA'] :
                                username.includes('auditor') ? ['AUDITORIA'] : ['COLABORADOR'],
                    };
                }

                const mockToken = btoa(JSON.stringify({
                    sub: mockUser.id,
                    preferred_username: mockUser.username,
                    email: mockUser.email,
                    given_name: mockUser.nombre,
                    family_name: mockUser.apellido,
                    realm_access: { roles: mockUser.roles },
                    empleadoId: mockUser.empleadoId,
                    exp: Math.floor(Date.now() / 1000) + 3600,
                }));

                localStorage.setItem('access_token', `mock.${mockToken}.mock`);
                localStorage.setItem('refresh_token', 'mock_refresh_token');
                // Also store empleadoId for easy access by components
                if (mockUser.empleadoId) {
                    localStorage.setItem('empleadoId', String(mockUser.empleadoId));
                }
                document.cookie = `access_token=mock.${mockToken}.mock; path=/; max-age=3600; SameSite=Lax`;

                setUser(mockUser);
                // Use location.href instead of router.push to ensure cookies are sent to server components
                window.location.href = '/dashboard';
                return;
            }

            // Production mode - use Keycloak
            const tokenEndpoint = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;

            const response = await fetch(tokenEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    client_id: KEYCLOAK_CLIENT_ID,
                    username,
                    password,
                    grant_type: "password",
                }),
            });

            if (!response.ok) {
                throw new Error("Credenciales inválidas");
            }

            const data = await response.json();

            // Store tokens
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);

            // Set cookie for middleware
            document.cookie = `access_token=${data.access_token}; path=/; max-age=${data.expires_in}; SameSite=Lax`;

            // Extract user info
            const userData = extractUserFromToken(data.access_token);
            setUser(userData);

            // Log audit event
            try {
                await fetch("/api/audit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${data.access_token}`,
                    },
                    body: JSON.stringify({
                        accion: "LOGIN",
                        entidad: "AUTH",
                        detalles: `Usuario ${username} inició sesión`,
                    }),
                });
            } catch (auditError) {
                console.warn('Audit log failed:', auditError);
            }

            router.push("/");
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

        if (token) {
            // Log audit event
            await fetch("/api/audit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    accion: "LOGOUT",
                    entidad: "AUTH",
                    detalles: `Usuario ${user?.username} cerró sesión`,
                }),
            });
        }

        // Clear tokens
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        document.cookie = "access_token=; path=/; max-age=0";

        setUser(null);
        router.push("/login");
    };

    // Refresh token
    const refreshToken = async () => {
        const refresh = localStorage.getItem("refresh_token");

        if (!refresh) {
            throw new Error("No refresh token available");
        }

        try {
            const tokenEndpoint = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;

            const response = await fetch(tokenEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    client_id: KEYCLOAK_CLIENT_ID,
                    refresh_token: refresh,
                    grant_type: "refresh_token",
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to refresh token");
            }

            const data = await response.json();

            // Update tokens
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);
            document.cookie = `access_token=${data.access_token}; path=/; max-age=${data.expires_in}; SameSite=Lax`;

            // Update user
            const userData = extractUserFromToken(data.access_token);
            setUser(userData);
        } catch (error) {
            console.error("Token refresh error:", error);
            // If refresh fails, logout
            await logout();
            throw error;
        }
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
