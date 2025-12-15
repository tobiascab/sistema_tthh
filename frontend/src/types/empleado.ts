export interface Empleado {
    id: number;
    nombres: string;
    apellidos: string;
    numeroDocumento: string;
    numeroSocio?: string;
    tipoDocumento: string;
    email: string;
    telefono?: string;
    fechaNacimiento: string;
    genero?: string;
    estadoCivil?: string;
    direccion?: string;
    departamento?: string;
    area?: string;
    cargo?: string;
    sucursal?: string;
    fechaIngreso: string;
    tipoContrato?: string;
    salarioBase?: number;
    estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
    nombreCompleto?: string;
    fotoUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface EmpleadoFormData {
    nombres: string;
    apellidos: string;
    numeroDocumento: string;
    numeroSocio?: string;
    tipoDocumento: string;
    email: string;
    telefono?: string;
    fechaNacimiento: string;
    genero?: string;
    estadoCivil?: string;
    direccion?: string;
    departamento?: string;
    cargo?: string;
    sucursal?: string;
    fechaIngreso: string;
    tipoContrato?: string;
    salarioBase?: number;
    estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
}
