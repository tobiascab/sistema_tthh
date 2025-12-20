import apiClient from "./client";

export interface FraseDelDia {
    id?: number;
    texto: string;
    autor: string;
    activa?: boolean;
    orden?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface FraseHoy {
    texto: string;
    autor: string;
}

export const frasesApi = {
    /**
     * Obtiene la frase del día actual
     */
    getHoy: async (): Promise<FraseHoy> => {
        const response = await apiClient.get("/frases-del-dia/hoy");
        return response.data;
    },

    /**
     * Obtiene todas las frases (solo admin)
     */
    getAll: async (): Promise<FraseDelDia[]> => {
        const response = await apiClient.get("/frases-del-dia");
        return response.data;
    },

    /**
     * Crea una nueva frase (solo admin)
     */
    create: async (frase: Partial<FraseDelDia>): Promise<FraseDelDia> => {
        const response = await apiClient.post("/frases-del-dia", frase);
        return response.data;
    },

    /**
     * Actualiza una frase (solo admin)
     */
    update: async (id: number, frase: Partial<FraseDelDia>): Promise<FraseDelDia> => {
        const response = await apiClient.put(`/frases-del-dia/${id}`, frase);
        return response.data;
    },

    /**
     * Elimina una frase (solo admin)
     */
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/frases-del-dia/${id}`);
    },

    /**
     * Toggle activa/inactiva (solo admin)
     */
    toggle: async (id: number): Promise<FraseDelDia> => {
        const response = await apiClient.patch(`/frases-del-dia/${id}/toggle`);
        return response.data;
    }
};
