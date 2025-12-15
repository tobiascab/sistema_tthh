import { get, post, patch, del } from './client';
import { Ausencia, AusenciaFormData, SaldoVacaciones } from '@/src/types/ausencia';
import { PageResponse, PaginationParams } from '@/src/types/api';

const AUSENCIAS_URL = '/ausencias';

export const ausenciasApi = {
    // Get all ausencias with pagination and filters
    getAll: async (params?: PaginationParams & {
        estado?: string;
        tipo?: string;
        empleadoId?: number;
        fechaInicio?: string;
        fechaFin?: string;
    }) => {
        const queryParams = new URLSearchParams();
        if (params?.page !== undefined) queryParams.append('page', params.page.toString());
        if (params?.size !== undefined) queryParams.append('size', params.size.toString());
        if (params?.sort) queryParams.append('sort', params.sort);
        if (params?.estado) queryParams.append('estado', params.estado);
        if (params?.tipo) queryParams.append('tipo', params.tipo);
        if (params?.empleadoId) queryParams.append('empleadoId', params.empleadoId.toString());
        if (params?.fechaInicio) queryParams.append('fechaInicio', params.fechaInicio);
        if (params?.fechaFin) queryParams.append('fechaFin', params.fechaFin);

        const url = `${AUSENCIAS_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return get<PageResponse<Ausencia>>(url);
    },

    // Get ausencia by ID
    getById: async (id: number) => {
        return get<Ausencia>(`${AUSENCIAS_URL}/${id}`);
    },

    // Create new ausencia
    create: async (data: AusenciaFormData) => {
        return post<Ausencia>(AUSENCIAS_URL, data);
    },

    // Update ausencia
    update: async (id: number, data: Partial<AusenciaFormData>) => {
        return patch<Ausencia>(`${AUSENCIAS_URL}/${id}`, data);
    },

    // Approve ausencia
    approve: async (id: number) => {
        return patch<Ausencia>(`${AUSENCIAS_URL}/${id}/aprobar`, {});
    },

    // Reject ausencia
    reject: async (id: number, motivo?: string) => {
        const queryParams = new URLSearchParams();
        if (motivo) queryParams.append('motivo', motivo);
        return patch<Ausencia>(`${AUSENCIAS_URL}/${id}/rechazar?${queryParams.toString()}`, {});
    },

    // Delete/Cancel ausencia
    delete: async (id: number) => {
        return del<void>(`${AUSENCIAS_URL}/${id}`);
    },

    // Get saldo de vacaciones
    getSaldoVacaciones: async (empleadoId: number) => {
        return get<SaldoVacaciones>(`${AUSENCIAS_URL}/saldo/${empleadoId}`);
    }
};
