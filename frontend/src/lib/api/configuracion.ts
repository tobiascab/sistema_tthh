import { apiClient, get, post } from "./client";

export const configuracionApi = {
    getValor: async (clave: string) => {
        return get<string>(`/configuraciones/${clave}`);
    },

    setValor: async (clave: string, valor: string) => {
        return post<{}>('/configuraciones/' + clave, { valor });
    },

    getSystemStatus: async () => {
        return get<{ maintenanceMode: boolean }>('/configuraciones/status');
    },

    setMaintenanceMode: async (activo: boolean) => {
        return post<{}>('/configuraciones/maintenance-mode', { activo });
    }
};
