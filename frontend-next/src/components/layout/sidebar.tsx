"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/src/features/auth/context/auth-context";
import {
    LayoutDashboard,
    Users,
    UserCog,
    Calendar,
    FileText,
    BarChart3,
    ClipboardList,
    Settings,
    GraduationCap,
    Shield,
    CheckCircle2,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion } from "framer-motion";

const menuItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: ["TTHH", "GERENCIA", "AUDITORIA", "COLABORADOR"],
    },
    {
        title: "Empleados",
        href: "/tthh/empleados",
        icon: Users,
        roles: ["TTHH", "GERENCIA", "AUDITORIA"],
    },
    {
        title: "Legajos",
        href: "/tthh/legajos",
        icon: FileText,
        roles: ["TTHH", "GERENCIA", "AUDITORIA"],
    },
    {
        title: "Centro de Solicitudes",
        href: "/colaborador/solicitudes",
        icon: ClipboardList,
        roles: ["TTHH", "GERENCIA", "AUDITORIA", "COLABORADOR"],
    },
    {
        title: "Recibos de Salario",
        href: "/colaborador/recibos",
        icon: FileText,
        roles: ["TTHH", "GERENCIA", "COLABORADOR"],
    },
    {
        title: "Campus Virtual",
        href: "/tthh/capacitaciones",
        icon: GraduationCap,
        roles: ["TTHH", "GERENCIA", "AUDITORIA", "COLABORADOR"],
    },
    {
        title: "Reportes",
        href: "/reportes",
        icon: BarChart3,
        roles: ["TTHH", "GERENCIA", "AUDITORIA"],
    },
    {
        title: "Auditoría",
        href: "/auditoria",
        icon: Shield,
        roles: ["TTHH", "GERENCIA", "AUDITORIA"],
    },
    {
        title: "Configuración",
        href: "/admin",
        icon: Settings,
        roles: ["TTHH", "GERENCIA"],
    },
    {
        title: "Usuarios y Roles",
        href: "/tthh/usuarios",
        icon: UserCog,
        roles: ["TTHH"],
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user, hasAnyRole } = useAuth();

    const getUserInitials = () => {
        if (!user) return "U";
        return user.nombre ? user.nombre.substring(0, 1).toUpperCase() : user.username.substring(0, 2).toUpperCase();
    };

    return (
        <aside className="w-72 bg-white flex flex-col shadow-xl z-20 overflow-hidden relative border-r border-neutral-100">
            {/* Logo Section */}
            <div className="h-24 flex items-center px-8 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center overflow-hidden shadow-sm border border-green-100 p-1.5">
                        <Image
                            src="/logo.png"
                            alt="Cooperativa Reducto"
                            width={40}
                            height={40}
                            className="object-contain"
                        />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg text-neutral-800 tracking-tight leading-none">Reducto</h2>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">Cooperativa</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-none relative z-10">
                <p className="px-4 text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">Menú Principal</p>

                {menuItems.map((item) => {
                    // Filter items based on user roles
                    if (!user || (item.roles && !hasAnyRole(item.roles))) {
                        return null;
                    }

                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="block group relative"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabSidebar"
                                    className="absolute inset-0 bg-emerald-50 rounded-xl"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                            )}

                            <div className={cn(
                                "flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 relative z-10",
                                isActive
                                    ? "text-emerald-900 font-bold"
                                    : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                            )}>
                                <Icon className={cn(
                                    "w-5 h-5 flex-shrink-0 transition-transform duration-300",
                                    isActive ? "text-emerald-600 scale-110" : "text-neutral-400 group-hover:text-emerald-600"
                                )} />
                                <span className="truncate">{item.title}</span>

                                {isActive && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute right-3 w-1.5 h-1.5 rounded-full bg-emerald-500"
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile Snippet */}
            <div className="p-4 m-4">
                <div className="rounded-2xl bg-neutral-50 border border-neutral-100 p-3 hover:shadow-md transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 p-0.5 shadow-sm group-hover:scale-105 transition-transform">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-emerald-700 font-bold text-sm">
                                {getUserInitials()}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-neutral-800 truncate group-hover:text-emerald-700 transition-colors">
                                {user?.username || 'Usuario'}
                            </p>
                            <p className="text-xs text-neutral-500 truncate">
                                {user?.roles?.[0] || 'Colaborador'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
