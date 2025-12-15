import apiClient from './client';

// Error handler helper
function handleApiError(error: any): Error {
    if (error.response?.data?.message) {
        return new Error(error.response.data.message);
    }
    return new Error(error.message || 'Error de conexión');
}

// Types
export interface Usuario {
    id: number;
    username: string;
    email: string;
    password?: string;
    nombres: string;
    apellidos: string;
    nombreCompleto: string;
    rolId: number | null;
    rolNombre: string;
    empleadoId: number | null;
    empleadoNombre: string;
    estado: 'ACTIVO' | 'INACTIVO' | 'BLOQUEADO' | 'PENDIENTE';
    ultimoAcceso: string | null;
    requiereCambioPassword: boolean;
    avatarUrl: string | null;
    createdAt: string;
}

export interface Rol {
    id: number;
    nombre: string;
    descripcion: string;
    permisos: string;
    activo: boolean;
    createdAt: string;
}

export interface CreateUsuarioData {
    username: string;
    email: string;
    password: string;
    nombres?: string;
    apellidos?: string;
    rolId?: number;
    empleadoId?: number;
}

export interface UpdateUsuarioData {
    email?: string;
    nombres?: string;
    apellidos?: string;
    rolId?: number;
    empleadoId?: number;
    avatarUrl?: string;
}

export interface UsuarioStats {
    activos: number;
    inactivos: number;
    bloqueados: number;
}

// Usuarios API
export const usuariosApi = {
    // CRUD
    getAll: async (): Promise<Usuario[]> => {
        try {
            const response = await apiClient.get('/usuarios');
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    getById: async (id: number): Promise<Usuario> => {
        try {
            const response = await apiClient.get(`/usuarios/${id}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    create: async (data: CreateUsuarioData): Promise<Usuario> => {
        try {
            const response = await apiClient.post('/usuarios', data);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    update: async (id: number, data: UpdateUsuarioData): Promise<Usuario> => {
        try {
            const response = await apiClient.put(`/usuarios/${id}`, data);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    delete: async (id: number): Promise<void> => {
        try {
            await apiClient.delete(`/usuarios/${id}`);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Estado
    activar: async (id: number): Promise<void> => {
        try {
            await apiClient.post(`/usuarios/${id}/activar`);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    desactivar: async (id: number): Promise<void> => {
        try {
            await apiClient.post(`/usuarios/${id}/desactivar`);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    bloquear: async (id: number): Promise<void> => {
        try {
            await apiClient.post(`/usuarios/${id}/bloquear`);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    desbloquear: async (id: number): Promise<void> => {
        try {
            await apiClient.post(`/usuarios/${id}/desbloquear`);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Contraseñas
    cambiarPassword: async (id: number, currentPassword: string, newPassword: string): Promise<void> => {
        try {
            await apiClient.post(`/usuarios/${id}/cambiar-password`, { currentPassword, newPassword });
        } catch (error) {
            throw handleApiError(error);
        }
    },

    resetearPassword: async (id: number): Promise<void> => {
        try {
            await apiClient.post(`/usuarios/${id}/resetear-password`);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Búsquedas
    buscar: async (query: string): Promise<Usuario[]> => {
        try {
            const response = await apiClient.get(`/usuarios/buscar?q=${encodeURIComponent(query)}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    getByRol: async (rolId: number): Promise<Usuario[]> => {
        try {
            const response = await apiClient.get(`/usuarios/rol/${rolId}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Stats
    getStats: async (): Promise<UsuarioStats> => {
        try {
            const response = await apiClient.get('/usuarios/stats');
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};

// Roles API
export const rolesApi = {
    getAll: async (): Promise<Rol[]> => {
        try {
            const response = await apiClient.get('/roles');
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    getActivos: async (): Promise<Rol[]> => {
        try {
            const response = await apiClient.get('/roles/activos');
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    getById: async (id: number): Promise<Rol> => {
        try {
            const response = await apiClient.get(`/roles/${id}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    create: async (data: Partial<Rol>): Promise<Rol> => {
        try {
            const response = await apiClient.post('/roles', data);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    update: async (id: number, data: Partial<Rol>): Promise<Rol> => {
        try {
            const response = await apiClient.put(`/roles/${id}`, data);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    delete: async (id: number): Promise<void> => {
        try {
            await apiClient.delete(`/roles/${id}`);
        } catch (error) {
            throw handleApiError(error);
        }
    },
};
