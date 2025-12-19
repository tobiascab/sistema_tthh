import { get } from './client';

const REPORTES_URL = '/reportes';

export interface DashboardAdmin {
    colaboradoresActivos: number;
    colaboradoresInactivos: number;
    solicitudesPendientes: number;
    certificacionesPorVencer: number;
    nominaMensualEstimada: number;
    nominaMensualPagada?: number;
    horasFormacionMes?: number;
    horasFormacionAnio?: number;
    cumpleaniosMesActual?: number;
    proximosCumpleanios?: Array<{
        empleadoId: number;
        nombreCompleto: string;
        cargo: string;
        sucursal: string;
        dia: number;
        mes: number;
        fotoUrl?: string;
    }>;
    colaboradoresPorDepartamento: Record<string, number>;
    colaboradoresPorCargo?: Record<string, number>;
    solicitudesPorEstado: Record<string, number>;
    solicitudesPorTipo?: Record<string, number>;
    nominaUltimos6Meses?: Array<{
        mes: string;
        anio: number;
        valor: number;
        cantidad: number;
    }>;
    ultimasSolicitudes?: Array<{
        id: number;
        titulo: string;
        tipo: string;
        estado: string;
        prioridad: string;
        empleadoNombre: string;
        fechaCreacion: string;
    }>;
    alertas: Array<{
        codigo: string;
        mensaje: string;
        prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
        accionUrl?: string;
        entidad?: string;
    }>;
}

// Alias for compatibility
export type DashboardAdminDTO = DashboardAdmin;

export interface ReporteDemografia {
    porEdad: Record<string, number>;
    porGenero: Record<string, number>;
    porSucursal: Record<string, number>;
}

export interface ReporteAusentismo {
    fechaInicio: string;
    fechaFin: string;
    totalAusencias: number;
    porTipo: Record<string, number>;
}

export const reportesApi = {
    getDashboardAdmin: async () => {
        return get<DashboardAdmin>(`${REPORTES_URL}/dashboard-admin`);
    },

    getDemografia: async () => {
        return get<ReporteDemografia>(`${REPORTES_URL}/demografia`);
    },

    getAusentismo: async (inicio: Date, fin: Date) => {
        const params = new URLSearchParams({
            fechaInicio: inicio.toISOString().split('T')[0],
            fechaFin: fin.toISOString().split('T')[0]
        });
        return get<ReporteAusentismo>(`${REPORTES_URL}/ausentismo?${params.toString()}`);
    },

    getCumpleaniosStats: async () => {
        return get<{ porMes: Record<number, number>, totalActivos: number, esteMes: number }>('/cumpleanios/estadisticas');
    }
};
