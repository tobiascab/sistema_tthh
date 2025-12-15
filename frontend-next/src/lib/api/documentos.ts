import { get, post, put, del, patch } from './client';
import {
    Documento,
    DocumentoFormData,
    DocumentoStats,
    ReporteLegajo
} from '@/src/types/documento';
import { PageResponse, PaginationParams } from '@/src/types/api';

const DOCUMENTOS_URL = '/documentos';

export const documentosApi = {
    // ========================================
    // UPLOAD Y DESCARGA
    // ========================================

    /**
     * Subir un documento con su archivo y metadata
     */
    subir: async (file: File, metadata: DocumentoFormData): Promise<Documento> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('metadata', JSON.stringify(metadata));

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${DOCUMENTOS_URL}/subir`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al subir el documento');
        }

        return response.json();
    },

    /**
     * Descargar un documento por su ID
     */
    descargar: async (id: number): Promise<Blob> => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${DOCUMENTOS_URL}/${id}/descargar`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Error al descargar el documento');
        }

        return response.blob();
    },

    /**
     * Obtener URL de descarga directa
     */
    getUrlDescarga: (id: number): string => {
        return `${process.env.NEXT_PUBLIC_API_URL}${DOCUMENTOS_URL}/${id}/descargar`;
    },

    // ========================================
    // CRUD DE METADATA
    // ========================================

    /**
     * Obtener documento por ID
     */
    getById: async (id: number): Promise<Documento> => {
        return get<Documento>(`${DOCUMENTOS_URL}/${id}`);
    },

    /**
     * Listar todos los documentos con paginación
     */
    getAll: async (params?: PaginationParams): Promise<PageResponse<Documento>> => {
        const queryParams = new URLSearchParams();
        if (params?.page !== undefined) queryParams.append('page', params.page.toString());
        if (params?.size !== undefined) queryParams.append('size', params.size.toString());
        if (params?.sort) queryParams.append('sort', params.sort);

        const url = `${DOCUMENTOS_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return get<PageResponse<Documento>>(url);
    },

    /**
     * Actualizar metadata de un documento
     */
    actualizarMetadata: async (id: number, data: Partial<DocumentoFormData>): Promise<Documento> => {
        return put<Documento>(`${DOCUMENTOS_URL}/${id}`, data);
    },

    /**
     * Eliminar un documento
     */
    eliminar: async (id: number): Promise<void> => {
        return del<void>(`${DOCUMENTOS_URL}/${id}`);
    },

    // ========================================
    // BÚSQUEDAS POR EMPLEADO
    // ========================================

    /**
     * Listar documentos de un empleado
     */
    listarPorEmpleado: async (empleadoId: number): Promise<Documento[]> => {
        return get<Documento[]>(`${DOCUMENTOS_URL}/empleado/${empleadoId}`);
    },

    /**
     * Listar documentos de un empleado con paginación
     */
    listarPorEmpleadoPaginado: async (
        empleadoId: number,
        params?: PaginationParams
    ): Promise<PageResponse<Documento>> => {
        const queryParams = new URLSearchParams();
        if (params?.page !== undefined) queryParams.append('page', params.page.toString());
        if (params?.size !== undefined) queryParams.append('size', params.size.toString());
        if (params?.sort) queryParams.append('sort', params.sort);

        const url = `${DOCUMENTOS_URL}/empleado/${empleadoId}/paginado${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return get<PageResponse<Documento>>(url);
    },

    /**
     * Listar documentos de un empleado por categoría
     */
    listarPorEmpleadoYCategoria: async (empleadoId: number, categoria: string): Promise<Documento[]> => {
        return get<Documento[]>(`${DOCUMENTOS_URL}/empleado/${empleadoId}/categoria/${categoria}`);
    },

    /**
     * Listar documentos agrupados por categoría
     */
    listarAgrupadosPorCategoria: async (empleadoId: number): Promise<Record<string, Documento[]>> => {
        return get<Record<string, Documento[]>>(`${DOCUMENTOS_URL}/empleado/${empleadoId}/agrupados`);
    },

    /**
     * Contar documentos de un empleado
     */
    contarPorEmpleado: async (empleadoId: number): Promise<{ total: number }> => {
        return get<{ total: number }>(`${DOCUMENTOS_URL}/empleado/${empleadoId}/count`);
    },

    // ========================================
    // BÚSQUEDAS POR CATEGORÍA Y ESTADO
    // ========================================

    /**
     * Listar por categoría
     */
    listarPorCategoria: async (categoria: string): Promise<Documento[]> => {
        return get<Documento[]>(`${DOCUMENTOS_URL}/categoria/${categoria}`);
    },

    /**
     * Listar por estado con paginación
     */
    listarPorEstado: async (estado: string, params?: PaginationParams): Promise<PageResponse<Documento>> => {
        const queryParams = new URLSearchParams();
        if (params?.page !== undefined) queryParams.append('page', params.page.toString());
        if (params?.size !== undefined) queryParams.append('size', params.size.toString());
        if (params?.sort) queryParams.append('sort', params.sort);

        const url = `${DOCUMENTOS_URL}/estado/${estado}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return get<PageResponse<Documento>>(url);
    },

    // ========================================
    // BÚSQUEDA AVANZADA
    // ========================================

    /**
     * Buscar con filtros
     */
    buscar: async (params: {
        empleadoId?: number;
        categoria?: string;
        estado?: string;
        search?: string;
    } & PaginationParams): Promise<PageResponse<Documento>> => {
        const queryParams = new URLSearchParams();
        if (params.empleadoId) queryParams.append('empleadoId', params.empleadoId.toString());
        if (params.categoria) queryParams.append('categoria', params.categoria);
        if (params.estado) queryParams.append('estado', params.estado);
        if (params.search) queryParams.append('search', params.search);
        if (params.page !== undefined) queryParams.append('page', params.page.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        if (params.sort) queryParams.append('sort', params.sort);

        return get<PageResponse<Documento>>(`${DOCUMENTOS_URL}/buscar?${queryParams.toString()}`);
    },

    // ========================================
    // VERSIONES
    // ========================================

    /**
     * Crear nueva versión de un documento
     */
    crearNuevaVersion: async (id: number, file: File): Promise<Documento> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${DOCUMENTOS_URL}/${id}/nueva-version`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al crear nueva versión');
        }

        return response.json();
    },

    /**
     * Obtener versiones de un documento
     */
    obtenerVersiones: async (id: number): Promise<Documento[]> => {
        return get<Documento[]>(`${DOCUMENTOS_URL}/${id}/versiones`);
    },

    // ========================================
    // APROBACIÓN
    // ========================================

    /**
     * Listar documentos pendientes de aprobación
     */
    listarPendientesAprobacion: async (): Promise<Documento[]> => {
        return get<Documento[]>(`${DOCUMENTOS_URL}/pendientes-aprobacion`);
    },

    /**
     * Aprobar documento
     */
    aprobar: async (id: number, aprobadoPor: string, comentario?: string): Promise<Documento> => {
        const params = new URLSearchParams();
        params.append('aprobadoPor', aprobadoPor);
        if (comentario) params.append('comentario', comentario);

        return patch<Documento>(`${DOCUMENTOS_URL}/${id}/aprobar?${params.toString()}`, {});
    },

    /**
     * Rechazar documento
     */
    rechazar: async (id: number, comentario: string): Promise<Documento> => {
        const params = new URLSearchParams();
        params.append('comentario', comentario);

        return patch<Documento>(`${DOCUMENTOS_URL}/${id}/rechazar?${params.toString()}`, {});
    },

    // ========================================
    // VENCIMIENTOS Y ALERTAS
    // ========================================

    /**
     * Listar documentos vencidos
     */
    listarVencidos: async (): Promise<Documento[]> => {
        return get<Documento[]>(`${DOCUMENTOS_URL}/vencidos`);
    },

    /**
     * Listar documentos próximos a vencer
     */
    listarProximosAVencer: async (dias: number = 30): Promise<Documento[]> => {
        return get<Documento[]>(`${DOCUMENTOS_URL}/proximos-a-vencer?dias=${dias}`);
    },

    /**
     * Enviar alertas de vencimiento (manual trigger)
     */
    enviarAlertasVencimiento: async (): Promise<void> => {
        return post<void>(`${DOCUMENTOS_URL}/enviar-alertas`, {});
    },

    // ========================================
    // DOCUMENTOS OBLIGATORIOS Y REPORTES
    // ========================================

    /**
     * Listar documentos obligatorios faltantes de un empleado
     */
    listarFaltantes: async (empleadoId: number): Promise<string[]> => {
        return get<string[]>(`${DOCUMENTOS_URL}/empleado/${empleadoId}/faltantes`);
    },

    /**
     * Obtener reporte de legajo de un empleado
     */
    obtenerReporteLegajo: async (empleadoId: number): Promise<ReporteLegajo> => {
        return get<ReporteLegajo>(`${DOCUMENTOS_URL}/empleado/${empleadoId}/reporte-legajo`);
    },

    // ========================================
    // ESTADÍSTICAS
    // ========================================

    /**
     * Obtener estadísticas generales
     */
    obtenerEstadisticas: async (): Promise<DocumentoStats> => {
        return get<DocumentoStats>(`${DOCUMENTOS_URL}/estadisticas`);
    },

    /**
     * Contar documentos por categoría
     */
    contarPorCategoria: async (): Promise<Record<string, number>> => {
        return get<Record<string, number>>(`${DOCUMENTOS_URL}/estadisticas/por-categoria`);
    },
};
