"use client";

import { useQuery } from "@tanstack/react-query";
import { auditoriaApi } from "@/src/lib/api/auditoria";
import { RoleGuard } from "@/src/features/auth/components/role-guard";
import {
    Shield,
    PlusCircle,
    Pencil,
    Trash2,
    Eye,
    LogIn,
    LogOut,
    User,
    Clock,
    Search,
    Loader2
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Input } from "@/src/components/ui/input";
import { useState } from "react";
import { Badge } from "@/src/components/ui/badge";

const THEME = {
    card: "bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300",
    iconBg: "bg-emerald-50 text-emerald-600",
};

const getActionIcon = (action: string) => {
    switch (action) {
        case "CREATE": return <PlusCircle className="w-5 h-5 text-green-600" />;
        case "UPDATE": return <Pencil className="w-5 h-5 text-amber-600" />;
        case "DELETE": return <Trash2 className="w-5 h-5 text-red-600" />;
        case "READ": return <Eye className="w-5 h-5 text-blue-600" />;
        case "LOGIN": return <LogIn className="w-5 h-5 text-indigo-600" />;
        case "LOGOUT": return <LogOut className="w-5 h-5 text-neutral-500" />;
        default: return <Shield className="w-5 h-5 text-neutral-400" />;
    }
};

const getActionColor = (action: string) => {
    switch (action) {
        case "CREATE": return "bg-green-50 text-green-700 border-green-100";
        case "UPDATE": return "bg-amber-50 text-amber-700 border-amber-100";
        case "DELETE": return "bg-red-50 text-red-700 border-red-100";
        case "LOGIN": return "bg-indigo-50 text-indigo-700 border-indigo-100";
        default: return "bg-neutral-50 text-neutral-700 border-neutral-100";
    }
};

export default function AuditoriaPage() {
    const [search, setSearch] = useState("");

    // Obtener data (paginada, simple page 0 para MVP)
    const { data, isLoading } = useQuery({
        queryKey: ["auditoria"],
        queryFn: () => auditoriaApi.getAll(0, 50),
    });

    // Filtro cliente simple
    const filteredLogs = data?.content?.filter(log =>
        log.usuario.toLowerCase().includes(search.toLowerCase()) ||
        log.entidad.toLowerCase().includes(search.toLowerCase()) ||
        log.accion.toLowerCase().includes(search.toLowerCase())
    ) || [];

    return (
        <RoleGuard allowedRoles={["TTHH", "GERENCIA", "AUDITORIA"]}>
            <div className="space-y-8 pb-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
                    <div>
                        <h1 className="text-4xl font-black text-neutral-900 tracking-tight flex items-center gap-3">
                            <span className="p-2 bg-neutral-900 rounded-xl text-white shadow-lg shadow-neutral-900/20">
                                <Shield className="w-8 h-8" />
                            </span>
                            Registro de Auditoría
                        </h1>
                        <p className="text-neutral-500 mt-2 text-lg">
                            Monitoreo de actividad y seguridad del sistema.
                        </p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                        <Input
                            placeholder="Buscar usuario, entidad o acción..."
                            className="pl-12 h-12 rounded-xl border-neutral-200 bg-white shadow-sm focus:ring-emerald-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {isLoading && (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
                    </div>
                )}

                {!isLoading && filteredLogs.length === 0 && (
                    <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
                        <Shield className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-neutral-900">Sin registros</h3>
                        <p className="text-neutral-500 mt-2">No se encontraron eventos de auditoría.</p>
                    </div>
                )}

                {/* Timeline Styles Logs */}
                <div className="space-y-4">
                    {filteredLogs.map((log) => (
                        <div key={log.id} className={`${THEME.card} flex flex-col md:flex-row gap-6 items-start md:items-center group`}>
                            {/* Icon & Time */}
                            <div className="flex items-center gap-4 min-w-[200px]">
                                <div className={`p-3 rounded-xl bg-neutral-50 group-hover:scale-110 transition-transform duration-300`}>
                                    {getActionIcon(log.accion)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-neutral-900">
                                        {format(new Date(log.createdAt), "dd MMM yyyy", { locale: es })}
                                    </p>
                                    <p className="text-xs text-neutral-500 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {format(new Date(log.createdAt), "HH:mm:ss")}
                                    </p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Badge variant="outline" className={`${getActionColor(log.accion)} font-bold`}>
                                        {log.accion}
                                    </Badge>
                                    <span className="text-sm font-medium text-neutral-400">en</span>
                                    <Badge variant="secondary" className="bg-neutral-100 text-neutral-800 font-medium">
                                        {log.entidad} #{log.entidadId}
                                    </Badge>
                                </div>
                                <p className="text-neutral-600 text-sm">
                                    {log.detalles || "Sin detalles adicionales."}
                                </p>
                            </div>

                            {/* User */}
                            <div className="flex items-center gap-3 pl-0 md:pl-6 md:border-l border-neutral-100 min-w-[200px]">
                                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
                                    <User className="w-4 h-4" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-bold text-neutral-900 truncate">
                                        {log.usuario}
                                    </p>
                                    <p className="text-xs text-neutral-500 truncate">
                                        {log.ipAddress || "IP Desconocida"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </RoleGuard>
    );
}
