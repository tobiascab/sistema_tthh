// User and Authentication Types
export interface User {
    id: string;
    username: string;
    email: string;
    roles: Role[];
    nombre: string;
    apellido: string;
}

export type Role = "TTHH" | "GERENCIA" | "AUDITORIA" | "COLABORADOR";

export interface AuthToken {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
}

// Employee Types
export interface Empleado {
    id: number;
    numeroDocumento: string;
    nombres: string;
    apellidos: string;
    email?: string;
    telefono?: string;
    fechaNacimiento: string;
    fechaIngreso: string;
    cargo?: string;
    departamento?: string;
    estado: "ACTIVO" | "INACTIVO" | "SUSPENDIDO";
    direccion?: string;
    ciudad?: string;
    salario?: number;
}

// Absence Types
export interface Ausencia {
    id: number;
    empleadoId: number;
    empleadoNombre?: string;
    tipo: "PERMISO" | "LICENCIA_MEDICA" | "VACACIONES" | "SUSPENSION";
    fechaInicio: string;
    fechaFin: string;
    diasSolicitados: number;
    estado: "PENDIENTE" | "APROBADA" | "RECHAZADA" | "CANCELADA";
    motivo?: string;
    observaciones?: string;
    aprobadoPor?: string;
    documentoUrl?: string;
}

// API Response Types
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

// Form Types
export interface LoginFormData {
    username: string;
    password: string;
}

export interface EmpleadoFormData extends Omit<Empleado, "id"> { }

export interface AusenciaFormData extends Omit<Ausencia, "id" | "empleadoNombre"> { }
