export interface ReciboComision {
    id: number;
    empleadoId: number;
    empleadoNombre: string;
    anio: number;
    mes: number;
    fechaPago: string;
    montoComision: number;
    produccionMensual: number;
    metaAlcanzadaPorcentaje: number;
    pdfUrl?: string;
    estado: 'BORRADOR' | 'GENERADO' | 'ENVIADO' | 'DESCARGADO';
    observaciones?: string;
}

export const ESTADOS_COMISION = {
    BORRADOR: { label: 'Borrador', color: 'bg-amber-100 text-amber-800' },
    GENERADO: { label: 'Generado', color: 'bg-blue-100 text-blue-800' },
    ENVIADO: { label: 'Enviado', color: 'bg-green-100 text-green-800' },
    DESCARGADO: { label: 'Descargado', color: 'bg-purple-100 text-purple-800' },
};
