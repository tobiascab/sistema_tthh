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
        mes?: number;
        sucursal?: string;
    }): Promise<PageResponse<ReciboSalario>> => {
        const queryParams = new URLSearchParams();
        if (params?.page !== undefined) queryParams.append('page', params.page.toString());
        if (params?.size !== undefined) queryParams.append('size', params.size.toString());
        if (params?.sort) queryParams.append('sort', params.sort);
        if (params?.empleadoId) queryParams.append('empleadoId', params.empleadoId.toString());
        if (params?.anio) queryParams.append('anio', params.anio.toString());
        if (params?.mes) queryParams.append('mes', params.mes.toString());
        if (params?.sucursal && params.sucursal !== "Todas las sucursales") queryParams.append('sucursal', params.sucursal);

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
        const url = `${PAYROLL_URL}/${id}/pdf`;
        return get<Blob>(url, { responseType: 'blob' });
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

    /**
     * Obtener resumen del dashboard de nómina
     */
    getDashboardSummary: async (): Promise<import('@/src/types/payroll').PayrollDashboard> => {
        return get<import('@/src/types/payroll').PayrollDashboard>(`${PAYROLL_URL}/summary`);
    },

    /**
     * Generar nómina para un periodo
     */
    generar: async (anio: number, mes: number): Promise<void> => {
        return post<void>(`${PAYROLL_URL}/generar?anio=${anio}&mes=${mes}`, {});
    },

    /**
     * Cerrar/Aprobar nómina para un periodo
     */
    cerrar: async (anio: number, mes: number): Promise<void> => {
        return post<void>(`${PAYROLL_URL}/cerrar?anio=${anio}&mes=${mes}`, {});
    },

    /**
     * Exportar planilla bancaria en Excel
     */
    exportPlanilla: async (anio: number, mes: number): Promise<Blob> => {
        const url = `${PAYROLL_URL}/exportar-planilla?anio=${anio}&mes=${mes}`;
        return get<Blob>(url, { responseType: 'blob' });
    },

    /**
     * Exportar reporte de salarios a Excel
     */
    exportExcel: async (params: any): Promise<Blob> => {
        const queryParams = new URLSearchParams();
        if (params?.anio) queryParams.append('anio', params.anio.toString());
        if (params?.mes && params.mes !== 'all') queryParams.append('mes', params.mes.toString());
        if (params?.sucursal && params.sucursal !== "Todas las sucursales") queryParams.append('sucursal', params.sucursal);
        if (params?.colaboradorId && params.colaboradorId !== 'all') queryParams.append('empleadoId', params.colaboradorId);

        const url = `${PAYROLL_URL}/exportar-excel?${queryParams.toString()}`;
        return get<Blob>(url, { responseType: 'blob' });
    },

    /**
     * Exportar reporte de salarios a PDF
     */
    exportPdf: async (params: any): Promise<Blob> => {
        const queryParams = new URLSearchParams();
        if (params?.anio) queryParams.append('anio', params.anio.toString());
        if (params?.mes && params.mes !== 'all') queryParams.append('mes', params.mes.toString());
        if (params?.sucursal && params.sucursal !== "Todas las sucursales") queryParams.append('sucursal', params.sucursal);
        if (params?.colaboradorId && params.colaboradorId !== 'all') queryParams.append('empleadoId', params.colaboradorId);

        const url = `${PAYROLL_URL}/exportar-pdf?${queryParams.toString()}`;
        return get<Blob>(url, { responseType: 'blob' });
    },
};
