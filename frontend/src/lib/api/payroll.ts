import { get, post } from './client';
import { ReciboSalario, ReciboSalarioFormData } from '@/src/types/payroll';
import { PageResponse, PaginationParams } from '@/src/types/api';

const PAYROLL_URL = '/payroll';

export const payrollApi = {
    /**
     * Listar recibos de salario con filtros
     */
    getAll: async (params?: PaginationParams & {
        empleadoId?: number;
        anio?: number;
    }): Promise<PageResponse<ReciboSalario>> => {
        const queryParams = new URLSearchParams();
        if (params?.page !== undefined) queryParams.append('page', params.page.toString());
        if (params?.size !== undefined) queryParams.append('size', params.size.toString());
        if (params?.sort) queryParams.append('sort', params.sort);
        if (params?.empleadoId) queryParams.append('empleadoId', params.empleadoId.toString());
        if (params?.anio) queryParams.append('anio', params.anio.toString());

        const url = `${PAYROLL_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return get<PageResponse<ReciboSalario>>(url);
    },

    /**
     * Obtener recibo por ID
     */
    getById: async (id: number): Promise<ReciboSalario> => {
        return get<ReciboSalario>(`${PAYROLL_URL}/${id}`);
    },

    /**
     * Crear nuevo recibo de salario
     */
    create: async (data: ReciboSalarioFormData): Promise<ReciboSalario> => {
        return post<ReciboSalario>(PAYROLL_URL, data);
    },

    /**
     * Descargar PDF del recibo
     */
    downloadPdf: async (id: number): Promise<Blob> => {
        // Using Next.js API proxy to avoid CORS issues
        const response = await fetch(`/api/payroll/${id}/pdf`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Error al descargar el recibo');
        }

        return response.blob();
    },

    /**
     * Enviar recibo por email
     */
    sendEmail: async (id: number): Promise<void> => {
        return post<void>(`${PAYROLL_URL}/${id}/send-email`, {});
    },

    /**
     * Obtener aguinaldo proyectado
     */
    getAguinaldo: async (): Promise<number> => {
        return get<number>(`${PAYROLL_URL}/aguinaldo`);
    },
};
