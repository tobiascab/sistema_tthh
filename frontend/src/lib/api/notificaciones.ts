import apiClient from "./client";

export interface Notificacion {
    id: number;
    titulo: string;
    mensaje: string;
    leido: boolean;
    tipo: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
    createdAt: string;
}

export const notificacionesApi = {
    getMisNotificaciones: async (usuarioId: number) => {
        const response = await apiClient.get<Notificacion[]>('/notificaciones/mis', { params: { usuarioId } });
        return response.data;
    },
    marcarLeida: async (id: number) => {
        await apiClient.post(`/notificaciones/leer/${id}`);
    },
    countNoLeidas: async (usuarioId: number) => {
        const response = await apiClient.get<number>('/notificaciones/no-leidas/count', { params: { usuarioId } });
        return response.data;
    }
};
