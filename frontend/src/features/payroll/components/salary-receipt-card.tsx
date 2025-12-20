import { ReciboSalario, MESES, ESTADOS_RECIBO } from "@/src/types/payroll";
import { Download, FileText, ChevronRight, CalendarCheck } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";

interface SalaryReceiptCardProps {
    recibo: ReciboSalario;
    onDownload: (id: number, periodo: string) => void;
    isDownloading?: boolean;
    showEmployeeName?: boolean;
}

export function SalaryReceiptCard({
    recibo,
    onDownload,
    isDownloading = false,
    showEmployeeName = false
}: SalaryReceiptCardProps) {

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-PY", {
            style: "currency",
            currency: "PYG",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const periodLabel = `${MESES.find(m => m.value === recibo.mes)?.label || recibo.mes} ${recibo.anio}`;
    const downloadLabel = `${recibo.mes}_${recibo.anio}`;

    return (
        <div
            onClick={() => !isDownloading && onDownload(recibo.id, downloadLabel)}
            className="group relative bg-white rounded-2xl border border-neutral-200 transition-all duration-300 hover:shadow-xl hover:border-emerald-200/50 hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col h-full"
        >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none">
                <FileText className="w-32 h-32 transform rotate-12" />
            </div>

            {/* Header Section */}
            <div className="p-5 border-b border-neutral-50 bg-neutral-50/30">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
                            {isDownloading ? (
                                <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <FileText className="w-5 h-5" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-neutral-800 text-lg leading-tight group-hover:text-emerald-700 transition-colors">
                                {periodLabel}
                            </h3>
                            <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                                <CalendarCheck className="w-3 h-3" />
                                {new Date(recibo.fechaPago).toLocaleDateString("es-PY", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                    <Badge className={cn(
                        "font-medium shadow-none", // Remove default shadow
                        ESTADOS_RECIBO[recibo.estado]?.color || "bg-gray-100 border-gray-200"
                    )}>
                        {ESTADOS_RECIBO[recibo.estado]?.label || recibo.estado}
                    </Badge>
                </div>

                {showEmployeeName && recibo.empleadoNombre && (
                    <div className="mt-2 text-sm font-medium text-neutral-600 bg-white/50 px-3 py-1.5 rounded-lg border border-neutral-100 inline-block">
                        {recibo.empleadoNombre}
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-5 flex-1 flex flex-col justify-end space-y-4">

                {/* Financial Details */}
                <div className="space-y-2.5">
                    <div className="flex justify-between text-sm group-hover:scale-[1.01] transition-transform origin-left">
                        <span className="text-neutral-500 font-medium">Salario Bruto</span>
                        <span className="text-neutral-900 font-semibold">{formatCurrency(recibo.salarioBruto)}</span>
                    </div>

                    {recibo.bonificaciones > 0 && (
                        <div className="flex justify-between text-sm group-hover:scale-[1.01] transition-transform origin-left delay-75">
                            <span className="text-emerald-600 font-medium flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Bonificaciones
                            </span>
                            <span className="text-emerald-700 font-semibold">+ {formatCurrency(recibo.bonificaciones)}</span>
                        </div>
                    )}

                    <div className="flex justify-between text-sm group-hover:scale-[1.01] transition-transform origin-left delay-100">
                        <span className="text-red-500 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            Total Descuentos
                        </span>
                        <span className="text-red-600 font-semibold">
                            - {formatCurrency(
                                (recibo.descuentosIps || 0) +
                                (recibo.descuentosJubilacion || 0) +
                                (recibo.otrosDescuentos || 0)
                            )}
                        </span>
                    </div>
                </div>

                {/* Divider Line */}
                <div className="h-px w-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200" />

                {/* Net Total */}
                <div className="flex justify-between items-end pt-1">
                    <div>
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-0.5">
                            Neto a Cobrar
                        </span>
                    </div>
                    <span className="text-xl font-black text-emerald-700 leading-none">
                        {formatCurrency(recibo.salarioNeto)}
                    </span>
                </div>

                {/* CTA Overlay on Hover */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-emerald-50/90 to-transparent flex justify-center">
                    <Button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 font-bold rounded-xl w-full"
                        size="sm"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        {isDownloading ? "Generando PDF..." : "Descargar Recibo"}
                    </Button>
                </div>
            </div>

            {/* Corner Fold Effect (CSS only visual) */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-neutral-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-bl-[40px]" />
        </div>
    );
}
