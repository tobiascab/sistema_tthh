import { RoleGuard } from "@/src/features/auth/components/role-guard";

export default function TTHHPage() {
    return (
        <RoleGuard allowedRoles={["TTHH", "GERENCIA", "AUDITORIA"]}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-800">
                        Gestión de Talento Humano
                    </h1>
                    <p className="text-neutral-600 mt-1">
                        Panel de administración de recursos humanos
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Quick access cards will be added here */}
                    <div className="p-6 bg-white rounded-lg border border-neutral-200">
                        <h3 className="font-semibold text-lg mb-2">Legajos</h3>
                        <p className="text-sm text-neutral-600">Gestión de expedientes de empleados</p>
                    </div>

                    <div className="p-6 bg-white rounded-lg border border-neutral-200">
                        <h3 className="font-semibold text-lg mb-2">Permisos y Vacaciones</h3>
                        <p className="text-sm text-neutral-600">Administración de ausencias</p>
                    </div>

                    <div className="p-6 bg-white rounded-lg border border-neutral-200">
                        <h3 className="font-semibold text-lg mb-2">Reportes</h3>
                        <p className="text-sm text-neutral-600">Informes y estadísticas</p>
                    </div>
                </div>
            </div>
        </RoleGuard>
    );
}
