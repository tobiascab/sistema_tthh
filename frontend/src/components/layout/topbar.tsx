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
        <header className="h-14 md:h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-3 md:px-6 shadow-sm sticky top-0 z-30">
            {/* Left: Spacer for mobile hamburger */}
            <div className="w-14 md:hidden" />

            {/* Search - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Buscar empleados, documentos..."
                        className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Mobile: Title in center */}
            <div className="flex-1 md:hidden text-center">
                <h1 className="text-sm font-bold text-neutral-800">Sistema TTHH</h1>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-1 md:gap-2">
                {/* Search icon for mobile - opens modal (future) */}
                <button className="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                    <Search className="w-5 h-5 text-neutral-500" />
                </button>

                {/* Notifications - Using new component */}
                <NotificationsButton />

                {/* User Menu */}
                <div className="flex items-center md:gap-3 md:pl-4 md:border-l border-neutral-200">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 md:gap-3 hover:bg-neutral-50 rounded-lg p-1.5 md:p-2 transition-colors">
                                {/* User info - Hidden on mobile */}
                                <div className="hidden md:block text-right">
                                    <p className="text-sm font-medium text-neutral-800">
                                        {user?.nombre || user?.username || "Usuario"}
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                        {user?.roles?.[0] || "Colaborador"}
                                    </p>
                                </div>
                                {/* Avatar - Always visible, larger touch target */}
                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-md">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                {/* Chevron - Hidden on mobile */}
                                <ChevronDown className="hidden md:block w-4 h-4 text-neutral-400" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div>
                                    <p className="font-medium">{user?.nombre || user?.username || "Usuario"}</p>
                                    <p className="text-xs text-neutral-500 font-normal">{user?.roles?.[0] || "Colaborador"}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="gap-2 cursor-pointer"
                                onClick={() => router.push('/colaborador/perfil')}
                            >
                                <User className="w-4 h-4" />
                                Mi Perfil
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="gap-2 cursor-pointer"
                                onClick={() => router.push('/admin')}
                            >
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
