export interface Solicitud {
    id: number;
    empleadoId: number;
    empleadoNombre?: string;
    tipo: 'VACACIONES' | 'PERMISO' | 'LICENCIA_MEDICA' | 'CONSTANCIA_LABORAL' | 'AUMENTO_SALARIO' | 'PERMISO_ESTUDIO' | string;
    titulo?: string;
    descripcion?: string;
    estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | string;
    prioridad?: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE' | string;
    datosAdicionales?: string; // JSON string for extra data
    respuesta?: string; // Response from approver
    aprobadoPor?: string;
    fechaAprobacion?: string;
    documentoUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface SolicitudFormData {
    tipo: 'VACACIONES' | 'PERMISO' | 'LICENCIA_MEDICA' | 'CONSTANCIA_LABORAL' | 'AUMENTO_SALARIO' | 'PERMISO_ESTUDIO';
    titulo?: string;
    descripcion?: string;
    fechaInicio?: string; // ISO format yyyy-MM-dd
    fechaFin?: string;    // ISO format yyyy-MM-dd
    prioridad?: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
    datosAdicionales?: string;
    documentoAdjunto?: File;
}
