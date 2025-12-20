export interface ReciboSalario {
    id: number;
    empleadoId: number;
    empleadoNombre?: string;
    anio: number;
    mes: number;
    fechaPago: string;
    salarioBruto: number;
    descuentosIps: number;
    descuentosJubilacion: number;
    otrosDescuentos: number;
    bonificaciones: number;
    salarioNeto: number;
    pdfUrl?: string;
    estado: 'BORRADOR' | 'GENERADO' | 'ENVIADO' | 'DESCARGADO' | 'CERRADO';
    observaciones?: string;
}

export interface PayrollRun {
    id?: number;
    mes: number;
    anio: number;
    totalEmpleados: number;
    totalNeto: number;
    estado: string;
    fechaGeneracion: string;
}

export interface PayrollDashboard {
    totalPagadoAnio: number;
    ultimoMontoNeto: number;
    ultimoConteoEmpleados: number;
    mesUltimaNomina?: number;
    anioUltimaNomina?: number;
    historial: PayrollRun[];
}

export interface ReciboSalarioFormData {
    empleadoId: number;
    anio: number;
    mes: number;
    fechaPago: string;
    salarioBruto: number;
    descuentosIps?: number;
    descuentosJubilacion?: number;
    otrosDescuentos?: number;
    bonificaciones?: number;
    salarioNeto: number;
    observaciones?: string;
}

export const MESES = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
];

export const ESTADOS_RECIBO = {
    BORRADOR: { label: 'Borrador', color: 'bg-amber-100 text-amber-800' },
    GENERADO: { label: 'Generado', color: 'bg-blue-100 text-blue-800' },
    ENVIADO: { label: 'Enviado', color: 'bg-green-100 text-green-800' },
    DESCARGADO: { label: 'Descargado', color: 'bg-purple-100 text-purple-800' },
    CERRADO: { label: 'Cerrado', color: 'bg-neutral-100 text-neutral-800' },
};
