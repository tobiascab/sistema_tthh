import { get, post, put, del } from './client';
import { Empleado, EmpleadoFormData } from '@/src/types/empleado';
import { PageResponse, PaginationParams } from '@/src/types/api';

const EMPLEADOS_URL = '/empleados';

export const empleadosApi = {
    // Get all empleados with pagination
    getAll: async (params?: PaginationParams & { search?: string; departamento?: string; estado?: string }) => {
        const queryParams = new URLSearchParams();
        if (params?.page !== undefined) queryParams.append('page', params.page.toString());
        if (params?.size !== undefined) queryParams.append('size', params.size.toString());
        if (params?.sort) queryParams.append('sort', params.sort);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.departamento) queryParams.append('departamento', params.departamento);
        if (params?.estado) queryParams.append('estado', params.estado);

        const url = `${EMPLEADOS_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return get<PageResponse<Empleado>>(url);
    },

    // Get empleado by ID
    getById: async (id: number) => {
        return get<Empleado>(`${EMPLEADOS_URL}/${id}`);
    },

    // Create new empleado
    create: async (data: EmpleadoFormData) => {
        return post<Empleado>(EMPLEADOS_URL, data);
    },

    // Update empleado
    update: async (id: number, data: EmpleadoFormData) => {
        return put<Empleado>(`${EMPLEADOS_URL}/${id}`, data);
    },

    // Delete empleado
    delete: async (id: number) => {
        return del<void>(`${EMPLEADOS_URL}/${id}`);
    },

    // Search empleados
    search: async (query: string, params?: PaginationParams) => {
        const queryParams = new URLSearchParams();
        queryParams.append('q', query);
        if (params?.page !== undefined) queryParams.append('page', params.page.toString());
        if (params?.size !== undefined) queryParams.append('size', params.size.toString());

        return get<PageResponse<Empleado>>(`${EMPLEADOS_URL}/search?${queryParams.toString()}`);
    },

    // Get empleados by departamento
    getByDepartamento: async (departamento: string, params?: PaginationParams) => {
        const queryParams = new URLSearchParams();
        if (params?.page !== undefined) queryParams.append('page', params.page.toString());
        if (params?.size !== undefined) queryParams.append('size', params.size.toString());

        return get<PageResponse<Empleado>>(`${EMPLEADOS_URL}/departamento/${departamento}?${queryParams.toString()}`);
    },

    // Cambiar estado
    cambiarEstado: async (id: number, estado: string, motivo?: string) => {
        const queryParams = new URLSearchParams();
        queryParams.append('estado', estado);
        if (motivo) queryParams.append('motivo', motivo);
        return put<Empleado>(`${EMPLEADOS_URL}/${id}/estado?${queryParams.toString()}`, {});
    },

    // Activar empleado
    activar: async (id: number) => {
        return put<Empleado>(`${EMPLEADOS_URL}/${id}/activar`, {});
    },

    // Inactivar empleado
    inactivar: async (id: number, motivo: string) => {
        const queryParams = new URLSearchParams();
        queryParams.append('motivo', motivo);
        return put<Empleado>(`${EMPLEADOS_URL}/${id}/inactivar?${queryParams.toString()}`, {});
    },

    // Suspender empleado
    suspender: async (id: number, motivo: string, fechaFin: string) => {
        const queryParams = new URLSearchParams();
        queryParams.append('motivo', motivo);
        queryParams.append('fechaFin', fechaFin);
        return put<Empleado>(`${EMPLEADOS_URL}/${id}/suspender?${queryParams.toString()}`, {});
    },

    // Cumpleaños del mes
    getCumpleaniosDelMes: async () => {
        return get<Empleado[]>(`${EMPLEADOS_URL}/cumpleanios`);
    },

    // Aniversarios del mes
    getAniversariosDelMes: async () => {
        return get<Empleado[]>(`${EMPLEADOS_URL}/aniversarios`);
    },

    // Contratos próximos a vencer
    getContratosProximosAVencer: async (dias: number = 30) => {
        return get<Empleado[]>(`${EMPLEADOS_URL}/contratos-vencimiento?dias=${dias}`);
    },

    // Calcular vacaciones
    calcularVacaciones: async (id: number) => {
        return get<{ diasDisponibles: number; diasUsados: number; diasAcumulados: number }>(`${EMPLEADOS_URL}/${id}/vacaciones`);
    },

    // Upload foto
    uploadFoto: async (id: number, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return post<Empleado>(`${EMPLEADOS_URL}/${id}/foto`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};
