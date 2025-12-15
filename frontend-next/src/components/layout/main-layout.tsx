"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    FileText,
    Calendar,
    GraduationCap,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Building2,
    Bell,
} from "lucide-react";
import { useAuth } from "@/src/contexts/auth-context";

interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
    roles?: string[];
    children?: NavItem[];
}

const navigation: NavItem[] = [
    {
        label: "Dashboard",
        href: "/colaborador",
        icon: LayoutDashboard,
        roles: ["COLABORADOR", "TTHH", "GERENCIA", "AUDITORIA"],
    },
    {
        label: "Mi Perfil",
        href: "/colaborador/perfil",
        icon: Users,
        roles: ["COLABORADOR"],
    },
    {
        label: "Recibos de Salario",
        href: "/colaborador/recibos",
        icon: FileText,
        roles: ["COLABORADOR"],
    },
    {
        label: "Mis Solicitudes",
        href: "/colaborador/solicitudes",
        icon: Calendar,
        roles: ["COLABORADOR"],
    },
    {
        label: "Mi Formación",
        href: "/colaborador/formacion",
        icon: GraduationCap,
        roles: ["COLABORADOR"],
    },
    {
        label: "Panel TTHH",
        href: "/admin",
        icon: BarChart3,
        roles: ["TTHH", "GERENCIA"],
    },
    {
        label: "Gestión de Personal",
        href: "/admin/empleados",
        icon: Users,
        roles: ["TTHH"],
    },
    {
        label: "Reportes",
        href: "/admin/reportes",
        icon: BarChart3,
        roles: ["TTHH", "GERENCIA", "AUDITORIA"],
    },
];

export function MainLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout, hasAnyRole } = useAuth();

    const filteredNavigation = navigation.filter((item) =>
        item.roles ? hasAnyRole(item.roles) : true
    );

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Sidebar Desktop */}
            <motion.aside
                initial={false}
                animate={{ width: sidebarOpen ? 280 : 80 }}
                className="fixed left-0 top-0 h-screen bg-white border-r border-neutral-200 z-40 hidden lg:block"
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-200">
                        <AnimatePresence mode="wait">
                            {sidebarOpen ? (
                                <motion.div
                                    key="logo-full"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-sm font-bold text-neutral-800">
                                            Cooperativa Reducto
                                        </h1>
                                        <p className="text-xs text-neutral-500">Sistema TTHH</p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="logo-mini"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center mx-auto"
                                >
                                    <Building2 className="w-5 h-5 text-white" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4 px-3">
                        <ul className="space-y-1">
                            {filteredNavigation.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;

                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                        ${isActive
                                                    ? "bg-primary-50 text-primary-700 font-medium"
                                                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                                                }
                      `}
                                        >
                                            <Icon className="w-5 h-5 flex-shrink-0" />
                                            <AnimatePresence mode="wait">
                                                {sidebarOpen && (
                                                    <motion.span
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -10 }}
                                                        className="text-sm"
                                                    >
                                                        {item.label}
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-neutral-200">
                        <button
                            onClick={logout}
                            className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-red-600 hover:bg-red-50 transition-colors
              `}
                        >
                            <LogOut className="w-5 h-5 flex-shrink-0" />
                            {sidebarOpen && <span className="text-sm">Cerrar Sesión</span>}
                        </button>
                    </div>
                </div>

                {/* Toggle Button */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="absolute -right-3 top-20 w-6 h-6 bg-white border border-neutral-200 rounded-full flex items-center justify-center hover:bg-neutral-50 transition-colors"
                >
                    <ChevronDown
                        className={`w-4 h-4 text-neutral-600 transition-transform ${sidebarOpen ? "rotate-90" : "-rotate-90"
                            }`}
                    />
                </button>
            </motion.aside>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            className="fixed left-0 top-0 h-screen w-280 bg-white z-50 lg:hidden"
                        >
                            {/* Same content as desktop sidebar */}
                            <div className="flex flex-col h-full">
                                <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                                            <Building2 className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h1 className="text-sm font-bold text-neutral-800">
                                                Cooperativa Reducto
                                            </h1>
                                            <p className="text-xs text-neutral-500">Sistema TTHH</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="p-2 hover:bg-neutral-100 rounded-lg"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <nav className="flex-1 overflow-y-auto py-4 px-3">
                                    <ul className="space-y-1">
                                        {filteredNavigation.map((item) => {
                                            const isActive = pathname === item.href;
                                            const Icon = item.icon;

                                            return (
                                                <li key={item.href}>
                                                    <Link
                                                        href={item.href}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className={`
                              flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                              ${isActive
                                                                ? "bg-primary-50 text-primary-700 font-medium"
                                                                : "text-neutral-600 hover:bg-neutral-50"
                                                            }
                            `}
                                                    >
                                                        <Icon className="w-5 h-5" />
                                                        <span className="text-sm">{item.label}</span>
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </nav>

                                <div className="p-4 border-t border-neutral-200">
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span className="text-sm">Cerrar Sesión</span>
                                    </button>
                                </div>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div
                className={`
          transition-all duration-300
          ${sidebarOpen ? "lg:ml-[280px]" : "lg:ml-[80px]"}
        `}
            >
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-neutral-200 sticky top-0 z-30">
                    <div className="h-full px-4 lg:px-6 flex items-center justify-between">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Search or Breadcrumb */}
                        <div className="flex-1 hidden lg:block">
                            <h2 className="text-lg font-semibold text-neutral-800">
                                {filteredNavigation.find((item) => item.href === pathname)
                                    ?.label || "Dashboard"}
                            </h2>
                        </div>

                        {/* User Info */}
                        <div className="flex items-center gap-4">
                            {/* Notifications */}
                            <button className="relative p-2 hover:bg-neutral-100 rounded-lg">
                                <Bell className="w-5 h-5 text-neutral-600" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                            </button>

                            {/* User Avatar */}
                            <div className="flex items-center gap-3">
                                <div className="hidden md:block text-right">
                                    <p className="text-sm font-medium text-neutral-800">
                                        {user?.nombre || "Usuario"}
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                        {user?.roles?.[0] || "Colaborador"}
                                    </p>
                                </div>
                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-semibold text-primary-700">
                                        {user?.nombre?.charAt(0) || "U"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
