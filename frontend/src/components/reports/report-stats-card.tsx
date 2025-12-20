"use client";

import { motion } from "framer-motion";

interface ReportStatsCardProps {
    totalMonto: number;
    cantidadRecibos: number;
    labelMonto?: string;
    labelCantidad?: string;
}

export function ReportStatsCard({
    totalMonto,
    cantidadRecibos,
    labelMonto = "TOTAL NÓMINA VISIBLE",
    labelCantidad = "RECIBOS LISTADOS"
}: ReportStatsCardProps) {

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-PY", {
            style: "currency",
            currency: "PYG",
            maximumFractionDigits: 0,
        }).format(amount).replace("PYG", "Gs.");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-950 rounded-2xl p-6 shadow-2xl border border-neutral-800"
        >
            <div className="flex flex-col md:flex-row md:items-center gap-12">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">
                        {labelMonto}
                    </p>
                    <div className="text-3xl font-black text-emerald-400 tracking-tight">
                        {formatCurrency(totalMonto)}
                    </div>
                </div>

                <div className="hidden md:block w-px h-12 bg-neutral-800" />

                <div className="space-y-1">
                    <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">
                        {labelCantidad}
                    </p>
                    <div className="text-3xl font-black text-white tracking-tight">
                        {cantidadRecibos}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
