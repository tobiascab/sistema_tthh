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

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/cumpleanios/importar-excel`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        const data = await response.json();
        return {
            success: data.status === 'success',
            procesados: (data.actualizados || 0) + (data.errores || 0),
            actualizados: data.actualizados,
            errores: data.errores,
            listaErrores: data.detalles,
            error: data.message
        };
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
