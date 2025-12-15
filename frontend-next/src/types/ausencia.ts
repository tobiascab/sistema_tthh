export interface Ausencia {
    id: number;
    empleadoId: number;
    empleadoNombre?: string;
    tipo: 'VACACIONES' | 'PERMISO' | 'LICENCIA_MEDICA' | 'MATERNIDAD' | 'PATERNIDAD' | 'DUELO' | 'OTRO';
    fechaInicio: string;
    fechaFin: string;
    diasSolicitados: number;
    observaciones?: string; // Alineado con backend (era observacion)
    estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'CANCELADA';
    documentoAdjuntoUrl?: string;
    aprobadoPor?: string;
    fechaAprobacion?: string;
}

export interface AusenciaFormData {
    empleadoId: number;
    tipo: 'VACACIONES' | 'PERMISO' | 'LICENCIA_MEDICA' | 'MATERNIDAD' | 'PATERNIDAD' | 'DUELO' | 'OTRO';
    fechaInicio: string; // Puede ser Date si el form lo maneja así, pero string para JSON es seguro
    fechaFin: string;
    observacion?: string;
    documentoAdjunto?: File;
}

export interface SaldoVacaciones {
    empleadoId: number;
    diasDisponibles: number;
    diasTomados: number;
    periodoActual: string;
}
