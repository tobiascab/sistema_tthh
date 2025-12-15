export interface Capacitacion {
    id: number;
    nombreCapacitacion: string;
    descripcion: string;
    categoria: "TECNICA" | "HABILIDADES_BLANDAS" | "SEGURIDAD" | "OTROS";
    modalidad: "PRESENCIAL" | "VIRTUAL" | "HIBRIDO";
    duracionHoras: number;
    cupoMaximo: number;
    cupoDisponible: number;
    fechaInicio: string;
    fechaFin?: string;
    instructor: string;
    ubicacion?: string;
    estado: "PLANIFICADA" | "ACTIVA" | "COMPLETADA" | "CANCELADA";
    objetivos?: string;
    requisitos?: string;
    materialUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CapacitacionFormData {
    nombreCapacitacion: string;
    descripcion: string;
    categoria: string;
    modalidad: string;
    duracionHoras: number;
    cupoMaximo: number;
    fechaInicio: Date; // Formulario usa Date
    fechaFin?: Date;
    instructor: string;
    ubicacion?: string;
    objetivos?: string;
    requisitos?: string;
}
