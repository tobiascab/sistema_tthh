export interface Auditoria {
    id: number;
    usuario: string;
    accion: "CREATE" | "UPDATE" | "DELETE" | "READ" | "LOGIN" | "LOGOUT";
    entidad: string;
    entidadId: number;
    detalles: string;
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
}
