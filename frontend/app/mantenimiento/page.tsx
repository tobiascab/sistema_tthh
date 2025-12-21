"use client";

import { motion } from "framer-motion";
import { Clock, Info, ShieldCheck } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";

export default function MantenimientoPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100"
            >
                {/* Header Gradient */}
                <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl transform translate-x-12 -translate-y-12"></div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/30 shadow-lg p-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/logo.png" alt="Logo Cooperativa" className="w-full h-full object-contain filter drop-shadow-md" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tight mb-2">Mantenimiento Programado</h1>
                        <p className="text-emerald-50 font-medium text-sm">
                            Estamos mejorando el sistema para ti
                        </p>
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 space-y-6">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3">
                        <Info className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-bold text-emerald-800 text-sm">¿Qué está pasando?</h3>
                            <p className="text-emerald-700 text-sm mt-1 leading-relaxed">
                                El sistema se encuentra en modo mantenimiento para realizar actualizaciones críticas. El acceso está restringido temporalmente.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-neutral-600 text-sm">
                            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                                <ShieldCheck className="w-4 h-4 text-neutral-500" />
                            </div>
                            <p>Tus datos están seguros y resguardados.</p>
                        </div>
                        <div className="flex items-center gap-3 text-neutral-600 text-sm">
                            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                                <Clock className="w-4 h-4 text-neutral-500" />
                            </div>
                            <p>Estimamos volver en breve.</p>
                        </div>
                    </div>

                    <div className="border-t border-neutral-100 pt-6">
                        <p className="text-center text-xs text-neutral-400 mb-4">
                            Si eres administrador, puedes intentar acceder
                        </p>
                        <Button
                            className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold h-12 rounded-xl shadow-lg shadow-neutral-200"
                            onClick={() => router.push('/login')}
                        >
                            Soy Administrador
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
