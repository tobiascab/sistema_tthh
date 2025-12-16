import { post } from './client';

const IMPORT_URL = '/import';

export interface ImportResult {
    success: boolean;
    procesados?: number;
    actualizados?: number;
    errores?: number;
    listaActualizados?: string[];
    listaErrores?: string[];
    error?: string;
}

export const importApi = {
    importarCumpleanios: async (file: File): Promise<ImportResult> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}${IMPORT_URL}/cumpleanios`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        return response.json();
    },

    importarEmpleados: async (file: File): Promise<ImportResult> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}${IMPORT_URL}/empleados`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        return response.json();
    }
};
