"use client";

import { Bell, Search, User, LogOut, ChevronDown, Settings } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/features/auth/context/auth-context";
import { NotificationsButton } from "@/src/components/notifications-button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function Topbar() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 shadow-sm">
            {/* Search */}
            <div className="flex-1 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Buscar empleados, documentos..."
                        className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
                {/* Notifications - Using new component */}
                <NotificationsButton />

                {/* User Menu */}
                <div className="flex items-center gap-3 pl-4 border-l border-neutral-200">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-3 hover:bg-neutral-50 rounded-lg p-2 transition-colors">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-neutral-800">
                                        {user?.nombre || user?.username || "Usuario"}
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                        {user?.roles?.[0] || "Colaborador"}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-md">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <ChevronDown className="w-4 h-4 text-neutral-400" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="gap-2 cursor-pointer"
                                onClick={() => router.push('/colaborador/perfil')}
                            >
                                <User className="w-4 h-4" />
                                Mi Perfil
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                                <Settings className="w-4 h-4" />
                                Configuración
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" />
                                Cerrar Sesión
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
