import Link from "next/link";
import { Clock } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function SessionExpiredPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
            <div className="max-w-md w-full p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-6">
                    <Clock className="w-10 h-10 text-accent-700" />
                </div>

                <h1 className="text-2xl font-bold text-neutral-800 mb-4">
                    Sesión Expirada
                </h1>

                <p className="text-neutral-600 mb-8">
                    Su sesión ha expirado por inactividad.
                    Por favor, inicie sesión nuevamente para continuar.
                </p>

                <Link href="/login">
                    <Button className="w-full bg-primary hover:bg-primary-600">
                        Iniciar Sesión
                    </Button>
                </Link>

                <p className="text-sm text-neutral-500 mt-8">
                    Por seguridad, las sesiones expiran después de un período de inactividad.
                </p>
            </div>
        </div>
    );
}
