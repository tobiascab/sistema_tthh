export interface Modulo {
    id: number;
    codigo: string;
    nombre: string;
    descripcion?: string;
    icono?: string;
    rutaMenu?: string;
    orden: number;
    activo: boolean;
    esDefault: boolean;
    moduloPadreId?: number;
    moduloPadreNombre?: string;
}

export interface ModuloFormData {
    codigo: string;
    nombre: string;
    descripcion?: string;
    icono?: string;
    rutaMenu?: string;
    orden: number;
    activo?: boolean;
    moduloPadreId?: number;
}
