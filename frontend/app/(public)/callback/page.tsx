import { Suspense } from "react";
import { CallbackHandler } from "@/src/features/auth/components/callback-handler";

export default function CallbackPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
            <Suspense fallback={<div>Procesando autenticación...</div>}>
                <CallbackHandler />
            </Suspense>
        </div>
    );
}
