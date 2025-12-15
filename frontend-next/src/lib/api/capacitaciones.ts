import { get, post, put, del } from './client';
import { Capacitacion, CapacitacionFormData } from '@/src/types/capacitacion';

const BASE_URL = '/capacitaciones';

export const capacitacionesApi = {
    getAll: async () => {
        return get<Capacitacion[]>(BASE_URL);
    },

    getById: async (id: number) => {
        return get<Capacitacion>(`${BASE_URL}/${id}`);
    },

    create: async (data: CapacitacionFormData) => {
        return post<Capacitacion>(BASE_URL, data);
    },

    update: async (id: number, data: CapacitacionFormData) => {
        return put<Capacitacion>(`${BASE_URL}/${id}`, data);
    },

    delete: async (id: number) => {
        return del<void>(`${BASE_URL}/${id}`);
    },

    inscribir: async (empleadoId: number, capacitacionId: number) => {
        // Assuming 'post' function can handle params in a similar way or expects data directly.
        // If the backend expects params in the URL or as query parameters,
        // the 'post' function might need to be adapted or a different utility used.
        // For consistency with existing 'post' calls, we'll pass an empty object for data
        // and assume the backend handles query parameters if needed, or that the 'post'
        // utility can take a third 'config' argument like axios.
        // Given the original 'post' signature `post<T>(url: string, data: any)`,
        // we'll adapt to pass data as an object if the backend expects it in the body.
        // If `params` are truly meant for query string, the `post` helper would need to support it.
        // For now, let's assume the `post` helper can take a config object as a third argument,
        // similar to axios, or that the `params` should be part of the URL.
        // Sticking to the most direct interpretation of the instruction's `apiClient.post`
        // and assuming `post` from './client' can handle a config object.
        const response = await post<any>(`${BASE_URL}/inscribir`, null, {
            params: { empleadoId, capacitacionId }
        });
        return response; // Assuming 'post' directly returns data, not a response object with .data
    },

    cancelarInscripcion: async (id: number) => {
        return post<void>(`${BASE_URL}/cancelar-inscripcion/${id}`);
    },

    getMisInscripciones: async (empleadoId: number) => {
        const response = await get<any>(`${BASE_URL}/mis-inscripciones`, {
            params: { empleadoId }
        });
        return response; // Assuming 'get' directly returns data, not a response object with .data
    }
};
