import { get, post, put } from './client';
import { Asistencia, AsistenciaStats } from '@/src/types/asistencia';
import { PageResponse, PaginationParams } from '@/src/types/api';

const ASISTENCIA_URL = '/asistencia';

export const asistenciaApi = {
    // Listar asistencia por empleado (paginado)
    getByEmpleado: async (empleadoId: number, params?: PaginationParams) => {
        const queryParams = new URLSearchParams();
        if (params?.page !== undefined) queryParams.append('page', params.page.toString());
        if (params?.size !== undefined) queryParams.append('size', params.size.toString());
        if (params?.sort) queryParams.append('sort', params.sort);

        return get<PageResponse<Asistencia>>(`${ASISTENCIA_URL}/empleado/${empleadoId}?${queryParams.toString()}`);
    },

    // Obtener estadísticas mensuales
    getStats: async (empleadoId: number, anio: number, mes: number) => {
        return get<AsistenciaStats>(`${ASISTENCIA_URL}/estadisticas/${empleadoId}?anio=${anio}&mes=${mes}`);
    },

    // Marcar reloj (entrada/salida automática)
    marcar: async (empleadoId: number) => {
        return post<Asistencia>(`${ASISTENCIA_URL}/marcar?empleadoId=${empleadoId}`);
    },

    // Registrar manual (admin)
    registrar: async (data: Partial<Asistencia>) => {
        return post<Asistencia>(ASISTENCIA_URL, data);
    },

    // Justificar
    justificar: async (id: number, motivo: string) => {
        return put<Asistencia>(`${ASISTENCIA_URL}/${id}/justificar?motivo=${encodeURIComponent(motivo)}`);
    }
};
