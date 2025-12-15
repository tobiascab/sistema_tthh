import { get } from './client';
import { Auditoria } from '@/src/types/auditoria';

const BASE_URL = '/auditoria';

export const auditoriaApi = {
    getAll: async (page = 0, size = 20) => {
        return get<{ content: Auditoria[]; totalPages: number; totalElements: number }>(BASE_URL, {
            params: { page, size, sort: 'createdAt,desc' }
        });
    }
};
