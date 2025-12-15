// Documento types based on DocumentoDTO.java

export interface Documento {
    id: number;
    empleadoId: number;

    // Datos del empleado (solo lectura)
    empleadoNombre?: string;
    empleadoNumeroDocumento?: string;

    nombre: string;
    descripcion?: string;
    categoria: string;
    tipo?: string;

    // Archivo
    rutaArchivo?: string;
    nombreArchivo?: string;
    extension?: string;
    mimeType?: string;
    tamanioBytes?: number;

    // Versiones
    version?: number;
    documentoPadreId?: number;

    // Estado y fechas
    estado?: DocumentoEstado;
    fechaEmision?: string;
    fechaVencimiento?: string;

    // Aprobación
    requiereAprobacion?: boolean;
    estaAprobado?: boolean;
    aprobadoPor?: string;
    fechaAprobacion?: string;
    comentarioAprobacion?: string;

    // Alertas
    alertaEnviada?: boolean;
    diasAlertaVencimiento?: number;

    // Metadata adicional
    entidadEmisora?: string;
    numeroDocumento?: string;
    esObligatorio?: boolean;
    esConfidencial?: boolean;
    uploadedBy?: string;
    observaciones?: string;

    // Campos calculados
    createdAt?: string;
    updatedAt?: string;
    estaVencido?: boolean;
    tamanioFormateado?: string;
    diasParaVencer?: number;
    urlDescarga?: string;
}

export type DocumentoEstado =
    | 'ACTIVO'
    | 'PENDIENTE_APROBACION'
    | 'APROBADO'
    | 'RECHAZADO'
    | 'VENCIDO'
    | 'ARCHIVADO';

export type DocumentoCategoria =
    | 'IDENTIFICACION'
    | 'CONTRATO'
    | 'CERTIFICACION'
    | 'FORMACION'
    | 'EVALUACION'
    | 'DISCIPLINARIO'
    | 'BENEFICIOS'
    | 'SALUD'
    | 'OTROS';

export interface DocumentoFormData {
    empleadoId: number;
    nombre: string;
    descripcion?: string;
    categoria: string;
    tipo?: string;
    fechaEmision?: string;
    fechaVencimiento?: string;
    requiereAprobacion?: boolean;
    entidadEmisora?: string;
    numeroDocumento?: string;
    esObligatorio?: boolean;
    esConfidencial?: boolean;
    diasAlertaVencimiento?: number;
    observaciones?: string;
}

export interface DocumentoUploadRequest {
    file: File;
    metadata: DocumentoFormData;
}

export interface DocumentoStats {
    total: number;
    porCategoria: Record<string, number>;
    vencidos: number;
    proximosAVencer: number;
    pendientesAprobacion: number;
}

export interface ReporteLegajo {
    empleadoId: number;
    empleadoNombre: string;
    totalDocumentos: number;
    documentosPorCategoria: Record<string, number>;
    documentosObligatoriosFaltantes: string[];
    documentosVencidos: number;
    documentosProximosAVencer: number;
    completitudLegajo: number;
}

export const CATEGORIAS_DOCUMENTO: { value: DocumentoCategoria; label: string }[] = [
    { value: 'IDENTIFICACION', label: 'Documentos de Identificación' },
    { value: 'CONTRATO', label: 'Contratos y Anexos' },
    { value: 'CERTIFICACION', label: 'Certificaciones' },
    { value: 'FORMACION', label: 'Formación y Capacitación' },
    { value: 'EVALUACION', label: 'Evaluaciones de Desempeño' },
    { value: 'DISCIPLINARIO', label: 'Acciones Disciplinarias' },
    { value: 'BENEFICIOS', label: 'Beneficios y Compensaciones' },
    { value: 'SALUD', label: 'Exámenes Médicos' },
    { value: 'OTROS', label: 'Otros Documentos' },
];

export const ESTADOS_DOCUMENTO: { value: DocumentoEstado; label: string; color: string }[] = [
    { value: 'ACTIVO', label: 'Activo', color: 'bg-green-100 text-green-800' },
    { value: 'PENDIENTE_APROBACION', label: 'Pendiente Aprobación', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'APROBADO', label: 'Aprobado', color: 'bg-blue-100 text-blue-800' },
    { value: 'RECHAZADO', label: 'Rechazado', color: 'bg-red-100 text-red-800' },
    { value: 'VENCIDO', label: 'Vencido', color: 'bg-orange-100 text-orange-800' },
    { value: 'ARCHIVADO', label: 'Archivado', color: 'bg-gray-100 text-gray-800' },
];
