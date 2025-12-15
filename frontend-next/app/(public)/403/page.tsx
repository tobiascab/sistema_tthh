import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function AccessDeniedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
            <div className="max-w-md w-full p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-6">
                    <ShieldAlert className="w-10 h-10 text-destructive" />
                </div>

                <h1 className="text-4xl font-bold text-neutral-800 mb-4">
                    403
                </h1>

                <h2 className="text-2xl font-semibold text-neutral-700 mb-4">
                    Acceso Denegado
                </h2>

                <p className="text-neutral-600 mb-8">
                    No tiene los permisos necesarios para acceder a esta sección.
                    Por favor, contacte al administrador del sistema si cree que esto es un error.
                </p>

                <div className="space-y-3">
                    <Link href="/" className="block">
                        <Button className="w-full bg-primary hover:bg-primary-600">
                            Volver al Inicio
                        </Button>
                    </Link>

                    <Link href="/login" className="block">
                        <Button variant="outline" className="w-full">
                            Iniciar Sesión con Otra Cuenta
                        </Button>
                    </Link>
                </div>

                <p className="text-sm text-neutral-500 mt-8">
                    Si necesita acceso a esta sección, solicite los permisos correspondientes
                    al departamento de Talento Humano.
                </p>
            </div>
        </div>
    );
}
