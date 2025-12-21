"use client";

import { useQuery } from "@tanstack/react-query";
import { modulosApi } from "@/src/lib/api/modulos";
import { useCurrentUser } from "@/src/hooks/use-current-user";
import { Modulo } from "@/src/types/modulo";

export function useModulePermissions() {
    const { empleadoId, isAdmin, roles } = useCurrentUser();

    const { data: modulos, isLoading } = useQuery({
        queryKey: ['modulos-permisos', empleadoId],
        queryFn: async () => {
            console.log(`[useModulePermissions] Fetching for empleadoId: ${empleadoId}`);
            const result = (empleadoId && empleadoId > 0) ? await modulosApi.listarModulosEmpleado(empleadoId) : [];
            console.log(`[useModulePermissions] API Response:`, result);
            return result;
        },
        enabled: !!empleadoId && empleadoId > 0,
        staleTime: 0,
    });

    console.log(`[useModulePermissions] State:`, {
        empleadoId,
        isAdmin,
        roles,
        modulosCount: modulos?.length,
        modulosCodigos: modulos?.map((m: any) => m.codigo)
    });


    const tieneAcceso = (codigoModulo: string): boolean => {
        // Bypass for Admins and Management to avoid lockout
        const isPowerUser = isAdmin || roles.some(r => ['GERENCIA', 'ADMIN', 'TTHH'].includes(r));
        if (isPowerUser) return true;

        // Módulos que son default por sistema (fallback frontend)
        const defaults = ['DASHBOARD', 'PERFIL', 'SOLICITUDES', 'AUSENCIAS', 'RECIBOS_SALARIO', 'MARCACIONES', 'DOCUMENTOS'];
        if (defaults.includes(codigoModulo)) return true;

        if (!modulos) return false;
        return modulos.some((m: Modulo) => m.codigo === codigoModulo);
    };

    const tieneAlguno = (codigos: string[]): boolean => {
        // Bypass for Admins
        if (isAdmin) return true;

        if (!modulos) return false;
        return codigos.some(codigo => tieneAcceso(codigo));
    };

    return {
        modulos,
        isLoading,
        tieneAcceso,
        tieneAlguno,
        isAdmin
    };
}
