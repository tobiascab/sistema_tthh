"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export function CallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const code = searchParams.get("code");
        const state = searchParams.get("state");

        if (code) {
            // TODO: Exchange code for token with Keycloak
            // For now, simulate token exchange
            setTimeout(() => {
                localStorage.setItem("auth_token", "mock_token");
                router.push("/");
            }, 1000);
        } else {
            router.push("/login");
        }
    }, [searchParams, router]);

    return (
        <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-neutral-600">Procesando autenticación...</p>
        </div>
    );
}
