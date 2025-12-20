export const SUCURSALES = [
    "CASA CENTRAL",
    "CIUDAD DEL ESTE",
    "SUCURSAL 5",
    "SAN LORENZO CENTRO",
    "HERNANDARIAS",
    "VILLARRICA",
    "CENTRO MEDICO REDUCTO"
] as const;

export type Sucursal = typeof SUCURSALES[number];
