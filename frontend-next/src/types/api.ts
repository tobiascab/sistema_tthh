// Common types used across the application

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface ApiError {
    message: string;
    status: number;
    timestamp: string;
    path: string;
}

export interface PaginationParams {
    page?: number;
    size?: number;
    sort?: string;
}
