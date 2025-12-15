export interface Asistencia {
    id: number;
    empleadoId: number;
    empleadoNombre?: string;
    fecha: string;
    tipo: 'PRESENTE' | 'AUSENTE' | 'TARDANZA' | 'PERMISO' | 'VACACIONES' | 'LICENCIA';
    horaEntrada?: string;
    horaSalida?: string;
    minutosRetraso?: number;
    observaciones?: string;
    justificado: boolean;
    documentoJustificacion?: string;
    createdAt?: string;
}

export interface AsistenciaStats {
    tardanzas: number;
    ausencias: number;
}
