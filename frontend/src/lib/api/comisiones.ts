import { get } from './client';
import { ReciboComision } from '@/src/types/comision';
import { PageResponse, PaginationParams } from '@/src/types/api';

const COMISIONES_URL = '/comisiones';

export const comisionesApi = {
    /**
     * Listar recibos de comisión con filtros
     */
    getAll: async (params?: PaginationParams & {
        empleadoId?: number;
        anio?: number;
        mes?: number;
        sucursal?: string;
    }): Promise<PageResponse<ReciboComision>> => {
        const queryParams = new URLSearchParams();
        if (params?.page !== undefined) queryParams.append('page', params.page.toString());
        if (params?.size !== undefined) queryParams.append('size', params.size.toString());
        if (params?.sort) queryParams.append('sort', params.sort);
        if (params?.empleadoId) queryParams.append('empleadoId', params.empleadoId.toString());
        if (params?.anio) queryParams.append('anio', params.anio.toString());
        if (params?.mes) queryParams.append('mes', params.mes.toString());
        if (params?.sucursal && params.sucursal !== "Todas las sucursales") queryParams.append('sucursal', params.sucursal);

        const url = `${COMISIONES_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return get<PageResponse<ReciboComision>>(url);
    },

    /**
     * Obtener comisión por ID
     */
    getById: async (id: number): Promise<ReciboComision> => {
        return get<ReciboComision>(`${COMISIONES_URL}/${id}`);
    },

    /**
     * Descargar PDF de la comisión
     */
    downloadPdf: async (id: number): Promise<Blob> => {
        const url = `${COMISIONES_URL}/${id}/pdf`;
        return get<Blob>(url, { responseType: 'blob' });
    },

    /**
     * Exportar reporte de comisiones a Excel
     */
    exportExcel: async (params: any): Promise<Blob> => {
        const queryParams = new URLSearchParams();
        if (params?.anio) queryParams.append('anio', params.anio.toString());
        if (params?.mes && params.mes !== 'all') queryParams.append('mes', params.mes.toString());
        if (params?.sucursal && params.sucursal !== "Todas las sucursales") queryParams.append('sucursal', params.sucursal);
        if (params?.colaboradorId && params.colaboradorId !== 'all') queryParams.append('empleadoId', params.colaboradorId);

        const url = `${COMISIONES_URL}/exportar-excel?${queryParams.toString()}`;
        return get<Blob>(url, { responseType: 'blob' });
    },

    /**
     * Exportar reporte de comisiones a PDF
     */
    exportPdf: async (params: any): Promise<Blob> => {
        const queryParams = new URLSearchParams();
        if (params?.anio) queryParams.append('anio', params.anio.toString());
        if (params?.mes && params.mes !== 'all') queryParams.append('mes', params.mes.toString());
        if (params?.sucursal && params.sucursal !== "Todas las sucursales") queryParams.append('sucursal', params.sucursal);
        if (params?.colaboradorId && params.colaboradorId !== 'all') queryParams.append('empleadoId', params.colaboradorId);

        const url = `${COMISIONES_URL}/exportar-pdf?${queryParams.toString()}`;
        return get<Blob>(url, { responseType: 'blob' });
    },
};
