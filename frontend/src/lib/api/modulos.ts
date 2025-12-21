import { get, post, put, del } from './client';
import { Modulo, ModuloFormData } from '@/src/types/modulo';

const MODULOS_URL = '/modulos';

export const modulosApi = {
    // CRUD básico
    listarTodos: () => get<Modulo[]>(`${MODULOS_URL}/todos`),

    listarActivos: () => get<Modulo[]>(MODULOS_URL),

    obtenerPorId: (id: number) => get<Modulo>(`${MODULOS_URL}/${id}`),

    crear: (data: ModuloFormData) => post<Modulo>(MODULOS_URL, data),

    actualizar: (id: number, data: ModuloFormData) =>
        put<Modulo>(`${MODULOS_URL}/${id}`, data),

    // Gestión de permisos por empleado
    listarModulosEmpleado: (empleadoId: number) =>
        get<Modulo[]>(`${MODULOS_URL}/empleado/${empleadoId}`),

    asignarModulos: (empleadoId: number, moduloIds: number[]) =>
        post(`${MODULOS_URL}/empleado/${empleadoId}/asignar`, moduloIds),

    sincronizarModulos: (empleadoId: number, moduloIds: number[]) =>
        put(`${MODULOS_URL}/empleado/${empleadoId}/sincronizar`, moduloIds),

    quitarModulo: (empleadoId: number, moduloId: number) =>
        del(`${MODULOS_URL}/empleado/${empleadoId}/modulo/${moduloId}`),

    verificarAcceso: (empleadoId: number, codigoModulo: string) =>
        get<{ tieneAcceso: boolean }>(`${MODULOS_URL}/empleado/${empleadoId}/tiene-acceso/${codigoModulo}`),
};
