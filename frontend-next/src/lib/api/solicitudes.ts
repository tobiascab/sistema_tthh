import { get, post, patch, del } from './client';
import { Solicitud, SolicitudFormData } from '@/src/types/solicitud';
import { PageResponse, PaginationParams } from '@/src/types/api';

const SOLICITUDES_URL = '/solicitudes';

export const solicitudesApi = {
    // Get all solicitudes with pagination and filters
    getAll: async (params?: PaginationParams & { estado?: string; tipo?: string; empleadoId?: number }) => {
        const queryParams = new URLSearchParams();
        if (params?.page !== undefined) queryParams.append('page', params.page.toString());
        if (params?.size !== undefined) queryParams.append('size', params.size.toString());
        if (params?.sort) queryParams.append('sort', params.sort);
        if (params?.estado) queryParams.append('estado', params.estado);
        if (params?.tipo) queryParams.append('tipo', params.tipo);
        if (params?.empleadoId) queryParams.append('empleadoId', params.empleadoId.toString());

        const url = `${SOLICITUDES_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return get<PageResponse<Solicitud>>(url);
    },

    // Get solicitud by ID
    getById: async (id: number) => {
        return get<Solicitud>(`${SOLICITUDES_URL}/${id}`);
    },

    // Create new solicitud
    create: async (data: SolicitudFormData) => {
        // Handle file upload if needed, for now sending JSON
        // In a real app with file upload, we would use FormData
        return post<Solicitud>(SOLICITUDES_URL, data);
    },

    // Approve solicitud
    approve: async (id: number, respuesta?: string) => {
        const queryParams = respuesta ? `?respuesta=${encodeURIComponent(respuesta)}` : '';
        return patch<Solicitud>(`${SOLICITUDES_URL}/${id}/aprobar${queryParams}`, {});
    },

    // Reject solicitud
    reject: async (id: number, respuesta?: string) => {
        const queryParams = respuesta ? `?respuesta=${encodeURIComponent(respuesta)}` : '';
        return patch<Solicitud>(`${SOLICITUDES_URL}/${id}/rechazar${queryParams}`, {});
    },

    // Cancel solicitud
    cancel: async (id: number) => {
        return del<void>(`${SOLICITUDES_URL}/${id}`);
    },
};
