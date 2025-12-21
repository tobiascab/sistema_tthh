"use client";

import { AuthGuard } from "@/src/features/auth/components/auth-guard";
import { Sidebar } from "@/src/components/layout/sidebar";
import { Topbar } from "@/src/components/layout/topbar";
import { useEffect, useState } from "react";
import { configuracionApi } from "@/src/lib/api/configuracion";
import { useAuth } from "@/src/features/auth/context/auth-context";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, hasRole, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [isCheckingMaintenance, setIsCheckingMaintenance] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            // Si aún está cargando el usuario, esperamos
            if (authLoading) return;

            try {
                // Obtenemos estado del sistema
                const status = await configuracionApi.getSystemStatus();

                // Si hay mantenimiento y el usuario NO es admin/gerencia
                if (status.maintenanceMode) {
                    const isAdmin = hasRole('TTHH') || hasRole('GERENCIA');

                    if (!isAdmin) {
                        router.replace('/mantenimiento');
                        return;
                    }
                }
            } catch (error) {
                // Ignorar errores silenciosamente (ej: backend no disponible aún)
                // El sistema continuará funcionando normalmente
                console.debug('Could not check maintenance status:', error);
            } finally {
                setIsCheckingMaintenance(false);
            }
        };

        checkStatus();
    }, [router, authLoading, hasRole]); // Dependencias para re-verificar si cambia usuario

    if (authLoading || isCheckingMaintenance) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-[#f8fafc] dark:bg-neutral-900">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600 dark:text-emerald-400" />
            </div>
        );
    }

    return (
        <AuthGuard>
            <div className="flex h-screen overflow-hidden bg-[#f8fafc] dark:bg-neutral-900">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    {/* Background blob for Premium Emerald effect (very subtle green) */}
                    <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-emerald-100/40 dark:bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-multiply opacity-50" />

                    {/* Topbar */}
                    <div className="relative z-10">
                        <Topbar />
                    </div>

                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                        <div className="max-w-7xl mx-auto w-full">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}
