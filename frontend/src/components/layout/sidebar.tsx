"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/src/features/auth/context/auth-context";
import {
    LayoutDashboard,
    Users,
    UserCog,
    FileText,
    BarChart3,
    ClipboardList,
    Settings,
    Shield,
    DollarSign,
    BadgeDollarSign,
    ChevronLeft,
    ChevronRight,
    Menu,
    Calendar,
    CheckCircle2,
    Stethoscope
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { useModulePermissions } from "@/src/hooks/use-module-permissions";

const menuItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: ["TTHH", "GERENCIA", "AUDITORIA", "COLABORADOR"],
        module: "DASHBOARD"
    },
    {
        title: "Empleados",
        href: "/tthh/empleados",
        icon: Users,
        roles: ["TTHH", "GERENCIA", "AUDITORIA"],
        module: "ADMIN_EMPLEADOS"
    },
    {
        title: "Legajos",
        href: "/tthh/legajos",
        icon: FileText,
        roles: ["TTHH", "GERENCIA", "AUDITORIA"],
        module: "ADMIN_EMPLEADOS" // Linked to employees module
    },
    {
        title: "Centro Médico (C.M.R)",
        href: "/admin/cmr",
        icon: Stethoscope,
        roles: ["TTHH", "GERENCIA", "ADMIN_CMR"],
        module: "CMR"
    },
    {
        title: "Gestión de Nómina",
        href: "/tthh/nominas",
        icon: DollarSign,
        roles: ["TTHH", "GERENCIA"],
        module: "ADMIN_NOMINA"
    },
    {
        title: "Gestión de Comisiones",
        href: "/admin/comisiones",
        icon: BadgeDollarSign,
        roles: ["TTHH", "GERENCIA"],
        module: "ADMIN_NOMINA" // Or a specific ADMIN_COMISIONES if we had it, but ADMIN_NOMINA works for now
    },
    {
        title: "Marcaciones",
        href: "/admin/marcaciones",
        icon: Calendar,
        roles: ["TTHH", "GERENCIA", "AUDITORIA"],
        module: "MARCACIONES"
    },
    {
        title: "Centro de Solicitudes",
        href: "/colaborador/solicitudes",
        icon: ClipboardList,
        roles: ["TTHH", "GERENCIA", "AUDITORIA", "COLABORADOR"],
        module: "SOLICITUDES"
    },
    {
        title: "Recibos de Salario",
        href: "/colaborador/recibos",
        icon: FileText,
        roles: ["TTHH", "GERENCIA", "COLABORADOR", "ASESOR_DE_CREDITO", "JUDICIAL", "RECUPERADOR_DE_CREDITO"],
        module: "RECIBOS_SALARIO"
    },
    {
        title: "Recibos de Comisión",
        href: "/colaborador/comisiones",
        icon: BadgeDollarSign,
        roles: ["TTHH", "GERENCIA", "COLABORADOR", "ASESOR_DE_CREDITO", "JUDICIAL", "RECUPERADOR_DE_CREDITO"],
        module: "COMISIONES"
    },
    {
        title: "Reportes",
        href: "/reportes",
        icon: BarChart3,
        roles: ["TTHH", "GERENCIA", "AUDITORIA"],
        module: "ADMIN_REPORTES"
    },
    {
        title: "Auditoría",
        href: "/auditoria",
        icon: Shield,
        roles: ["TTHH", "GERENCIA", "AUDITORIA"],
        module: "ADMIN_REPORTES" // Using reportes for audit for now
    },
    {
        title: "Gestión de Roles",
        href: "/admin/roles",
        icon: Shield,
        roles: ["TTHH"],
        module: "ADMIN_ROLES"
    },
    {
        title: "Configuración",
        href: "/admin",
        icon: Settings,
        roles: ["TTHH", "GERENCIA"],
        module: "ADMIN_ROLES"
    },
    {
        title: "Usuarios y Roles",
        href: "/tthh/usuarios",
        icon: UserCog,
        roles: ["TTHH"],
        module: "ADMIN_ROLES"
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user, hasAnyRole } = useAuth();
    const { tieneAcceso, isLoading: loadingPermissions } = useModulePermissions();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const getUserInitials = () => {
        if (!user) return "U";
        return user.nombre ? user.nombre.substring(0, 1).toUpperCase() : user.username.substring(0, 2).toUpperCase();
    };

    const sidebarVariants = {
        expanded: { width: 288 },
        collapsed: { width: 80 },
    };

    const mobileSidebarVariants = {
        open: { x: 0 },
        closed: { x: "-100%" },
    };

    // Close mobile sidebar when route changes
    const closeMobileSidebar = () => {
        setIsMobileOpen(false);
    };

    return (
        <>
            {/* Mobile Hamburger Button - Fixed */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 bg-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
                <Menu className="w-6 h-6 text-emerald-600" />
            </motion.button>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeMobileSidebar}
                        className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar - Desktop always visible, Mobile drawer */}
            <motion.aside
                initial={false}
                animate={{
                    x: isMobileOpen ? 0 : "-100%"
                }}
                transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 200,
                }}
                className={cn(
                    // Mobile: drawer from left (hidden by default)
                    "fixed md:sticky top-0 left-0 h-screen z-50 md:z-10",
                    // Desktop: always visible, no transform
                    "md:!translate-x-0"
                )}
                style={{
                    width: isCollapsed ? 80 : 288,
                }}
            >
                <TooltipProvider delayDuration={0}>
                    <motion.div
                        variants={sidebarVariants}
                        animate={isCollapsed ? "collapsed" : "expanded"}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                        }}
                        className={cn(
                            "h-full flex flex-col bg-white border-r border-neutral-200 shadow-lg relative overflow-hidden",
                            // Mobile full width, desktop follows state
                            "w-72 md:w-auto"
                        )}
                    >
                        {/* Logo Section */}
                        <div className={cn(
                            "h-24 flex items-center relative z-10 transition-all duration-300",
                            isCollapsed ? "px-4 justify-center" : "px-8"
                        )}>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center overflow-hidden shadow-sm border border-green-100 p-1.5 flex-shrink-0">
                                    <Image
                                        src="/logo.png"
                                        alt="Cooperativa Reducto"
                                        width={40}
                                        height={40}
                                        className="object-contain"
                                    />
                                </div>
                                <AnimatePresence>
                                    {!isCollapsed && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <h2 className="font-bold text-lg text-neutral-800 tracking-tight leading-none">Reducto</h2>
                                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">Cooperativa</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Collapse Toggle Button */}
                        <div className={cn(
                            "px-4 pb-4 transition-all duration-300",
                            isCollapsed ? "px-3" : "px-4"
                        )}>
                            {/* Close button for mobile */}
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="md:hidden w-10 h-10 mx-auto flex items-center justify-center rounded-xl bg-neutral-100 hover:bg-emerald-100 border border-neutral-200 hover:border-emerald-300 transition-all duration-200 group mb-2"
                            >
                                <ChevronLeft className="w-5 h-5 text-neutral-500 group-hover:text-emerald-600 transition-colors" />
                            </button>

                            {/* Collapse toggle for desktop */}
                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="hidden md:flex w-10 h-10 mx-auto items-center justify-center rounded-xl bg-neutral-100 hover:bg-emerald-100 border border-neutral-200 hover:border-emerald-300 transition-all duration-200 group"
                                title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
                            >
                                <Menu className="w-5 h-5 text-neutral-500 group-hover:text-emerald-600 transition-colors" />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className={cn(
                            "flex-1 py-6 space-y-1.5 overflow-y-auto scrollbar-none relative z-10 transition-all duration-300",
                            isCollapsed ? "px-2" : "px-4"
                        )}>
                            <AnimatePresence>
                                {!isCollapsed && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="px-4 text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4"
                                    >
                                        Menú Principal
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            {menuItems.map((item) => {
                                // Filter items based on module permissions (priority) or user roles (fallback)
                                const hasModuleAccess = item.module ? tieneAcceso(item.module) : false;
                                const hasRoleAccess = item.roles && hasAnyRole(item.roles);

                                // If it's a module item, follow module access (with Admin bypass inside tieneAcceso)
                                // If it's not a module item, follow role access
                                const isPowerUser = hasAnyRole(['TTHH', 'GERENCIA', 'ADMIN']);
                                const canSee = isPowerUser || (item.module ? hasModuleAccess : hasRoleAccess);

                                if (!user || !canSee) {
                                    return null;
                                }

                                const Icon = item.icon;
                                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

                                const linkContent = (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={closeMobileSidebar}
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
                                            "flex items-center rounded-xl text-sm font-medium transition-all duration-300 relative z-10",
                                            isCollapsed ? "justify-center px-2 py-3.5" : "gap-4 px-4 py-3.5",
                                            isActive
                                                ? "text-emerald-900 font-bold"
                                                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                                        )}>
                                            <Icon className={cn(
                                                "w-5 h-5 flex-shrink-0 transition-transform duration-300",
                                                isActive ? "text-emerald-600 scale-110" : "text-neutral-400 group-hover:text-emerald-600"
                                            )} />

                                            <AnimatePresence>
                                                {!isCollapsed && (
                                                    <motion.span
                                                        initial={{ opacity: 0, width: 0 }}
                                                        animate={{ opacity: 1, width: "auto" }}
                                                        exit={{ opacity: 0, width: 0 }}
                                                        className="truncate whitespace-nowrap"
                                                    >
                                                        {item.title}
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>

                                            {isActive && !isCollapsed && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute right-3 w-1.5 h-1.5 rounded-full bg-emerald-500"
                                                />
                                            )}
                                        </div>
                                    </Link>
                                );

                                // Wrap with tooltip when collapsed
                                if (isCollapsed) {
                                    return (
                                        <Tooltip key={item.href}>
                                            <TooltipTrigger asChild>
                                                {linkContent}
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="font-medium">
                                                {item.title}
                                            </TooltipContent>
                                        </Tooltip>
                                    );
                                }

                                return linkContent;
                            })}
                        </nav>

                        {/* User Profile Snippet */}
                        <div className={cn(
                            "m-4 transition-all duration-300",
                            isCollapsed ? "p-1" : "p-4"
                        )}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className={cn(
                                        "rounded-2xl bg-neutral-50 border border-neutral-100 hover:shadow-md transition-all duration-300 cursor-pointer group",
                                        "flex items-center",
                                        isCollapsed ? "p-2 justify-center" : "p-3 gap-3"
                                    )}>
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 p-0.5 shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
                                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-emerald-700 font-bold text-sm">
                                                {getUserInitials()}
                                            </div>
                                        </div>
                                        <AnimatePresence>
                                            {!isCollapsed && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -10 }}
                                                    className="flex-1 min-w-0"
                                                >
                                                    <p className="text-sm font-bold text-neutral-800 truncate group-hover:text-emerald-700 transition-colors">
                                                        {user?.username || 'Usuario'}
                                                    </p>
                                                    <p className="text-xs text-neutral-500 truncate">
                                                        {user?.roles?.[0] || 'Colaborador'}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </TooltipTrigger>
                                {isCollapsed && (
                                    <TooltipContent side="right" className="font-medium">
                                        <p>{user?.username || 'Usuario'}</p>
                                        <p className="text-xs text-neutral-500">{user?.roles?.[0] || 'Colaborador'}</p>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </div>
                    </motion.div>
                </TooltipProvider>
            </motion.aside>
        </>
    );
}

