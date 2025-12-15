"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Loader2, Lock, User, AlertCircle, Sparkles, Eye, EyeOff, ArrowRight, ShieldCheck, Users } from "lucide-react";
import { useAuth } from "@/src/features/auth/context/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";

const loginSchema = z.object({
    username: z.string().min(1, "El usuario es requerido"),
    password: z.string().min(1, "La contraseña es requerida"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'admin' | 'colaborador'>('admin');

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: 'admin.tthh',
            password: 'password' // Default password for dev
        }
    });

    const handleTabChange = (tab: 'admin' | 'colaborador') => {
        setActiveTab(tab);
        if (tab === 'admin') {
            setValue('username', 'admin.tthh');
            setValue('password', 'password');
        } else {
            setValue('username', 'colaborador.test');
            setValue('password', 'password');
        }
    };

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            await login(data.username, data.password);
        } catch (err) {
            setError("Error al iniciar sesión. Verifique sus credenciales.");
        } finally {
            setIsLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 md:p-10 border border-neutral-200/50 w-full relative overflow-hidden"
        >
            {/* Decorative corner elements */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${activeTab === 'admin' ? 'from-green-100/50' : 'from-blue-100/50'} to-transparent rounded-bl-full transition-colors duration-500`} />
            <div className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${activeTab === 'admin' ? 'from-green-100/30' : 'from-blue-100/30'} to-transparent rounded-tr-full transition-colors duration-500`} />

            <div className="relative z-10">
                <motion.div variants={itemVariants} className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                        className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${activeTab === 'admin' ? 'from-green-500 via-green-600 to-green-700' : 'from-blue-500 via-blue-600 to-blue-700'} rounded-2xl mb-4 shadow-xl relative overflow-hidden group cursor-pointer transition-colors duration-500`}
                    >
                        <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Lock className="w-8 h-8 text-white relative z-10" />
                        </motion.div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <motion.div
                            className="absolute inset-0 bg-white/20"
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-bold text-neutral-800 mb-2"
                    >
                        ¡Bienvenido!
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-neutral-600"
                    >
                        Seleccione su perfil para ingresar
                    </motion.p>
                </motion.div>

                {/* Role Selector Tabs */}
                <div className="flex p-1 bg-neutral-100 rounded-xl mb-6 relative">
                    <div
                        className={cn(
                            "absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-spring",
                            activeTab === 'admin' ? "left-1" : "left-[calc(50%+4px)]"
                        )}
                    />
                    <button
                        onClick={() => handleTabChange('admin')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg relative z-10 transition-colors duration-300",
                            activeTab === 'admin' ? "text-green-700" : "text-neutral-500 hover:text-neutral-700"
                        )}
                    >
                        <ShieldCheck className="w-4 h-4" />
                        Administrador
                    </button>
                    <button
                        onClick={() => handleTabChange('colaborador')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg relative z-10 transition-colors duration-300",
                            activeTab === 'colaborador' ? "text-blue-700" : "text-neutral-500 hover:text-neutral-700"
                        )}
                    >
                        <Users className="w-4 h-4" />
                        Colaborador
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <motion.div
                        variants={itemVariants}
                        className="space-y-2"
                    >
                        <Label htmlFor="username" className="text-neutral-700 font-medium flex items-center gap-2">
                            <motion.div
                                animate={{
                                    color: focusedField === 'username'
                                        ? (activeTab === 'admin' ? '#22c55e' : '#3b82f6')
                                        : '#737373'
                                }}
                            >
                                <User className="w-4 h-4" />
                            </motion.div>
                            Usuario
                        </Label>
                        <div className="relative group">
                            <motion.div
                                animate={{
                                    boxShadow: focusedField === 'username'
                                        ? `0 0 0 4px ${activeTab === 'admin' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`
                                        : '0 0 0 0px rgba(0,0,0,0)'
                                }}
                                className="rounded-xl"
                            >
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder={activeTab === 'admin' ? "admin.tthh" : "colaborador.test"}
                                    {...register("username")}
                                    onFocus={() => setFocusedField('username')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`h-12 bg-neutral-50/50 border-neutral-200 focus:border-${activeTab === 'admin' ? 'green' : 'blue'}-500 focus:ring-${activeTab === 'admin' ? 'green' : 'blue'}-500/20 transition-all duration-300 rounded-xl pl-4 ${errors.username ? "border-destructive focus:border-destructive" : ""
                                        }`}
                                />
                            </motion.div>
                            <motion.div
                                className={`absolute inset-0 rounded-xl bg-gradient-to-r ${activeTab === 'admin' ? 'from-green-500/5' : 'from-blue-500/5'} to-transparent pointer-events-none`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: focusedField === 'username' ? 1 : 0 }}
                            />
                        </div>
                        <AnimatePresence>
                            {errors.username && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    exit={{ opacity: 0, y: -10, height: 0 }}
                                    className="text-sm text-destructive flex items-center gap-1"
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.username.message}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="space-y-2"
                    >
                        <Label htmlFor="password" className="text-neutral-700 font-medium flex items-center gap-2">
                            <motion.div
                                animate={{
                                    color: focusedField === 'password'
                                        ? (activeTab === 'admin' ? '#22c55e' : '#3b82f6')
                                        : '#737373'
                                }}
                            >
                                <Lock className="w-4 h-4" />
                            </motion.div>
                            Contraseña
                        </Label>
                        <div className="relative group">
                            <motion.div
                                animate={{
                                    boxShadow: focusedField === 'password'
                                        ? `0 0 0 4px ${activeTab === 'admin' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`
                                        : '0 0 0 0px rgba(0,0,0,0)'
                                }}
                                className="rounded-xl"
                            >
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    {...register("password")}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`h-12 bg-neutral-50/50 border-neutral-200 focus:border-${activeTab === 'admin' ? 'green' : 'blue'}-500 focus:ring-${activeTab === 'admin' ? 'green' : 'blue'}-500/20 transition-all duration-300 rounded-xl pl-4 pr-12 ${errors.password ? "border-destructive focus:border-destructive" : ""
                                        }`}
                                />
                            </motion.div>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-${activeTab === 'admin' ? 'green' : 'blue'}-600 transition-colors p-1`}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </motion.div>
                            </button>
                            <motion.div
                                className={`absolute inset-0 rounded-xl bg-gradient-to-r ${activeTab === 'admin' ? 'from-green-500/5' : 'from-blue-500/5'} to-transparent pointer-events-none`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: focusedField === 'password' ? 1 : 0 }}
                            />
                        </div>
                        <AnimatePresence>
                            {errors.password && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    exit={{ opacity: 0, y: -10, height: 0 }}
                                    className="text-sm text-destructive flex items-center gap-1"
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.password.message}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3"
                            >
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                                </motion.div>
                                <div className="flex-1">
                                    <p className="text-sm text-destructive font-medium">{error}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div
                        variants={itemVariants}
                    >
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                type="submit"
                                className={`w-full h-14 bg-gradient-to-r ${activeTab === 'admin' ? 'from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800' : 'from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800'} text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group`}
                                disabled={isLoading}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0"
                                    initial={{ x: "-100%" }}
                                    animate={{ x: isLoading ? "-100%" : "100%" }}
                                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                                />

                                {isLoading ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Iniciando sesión...</span>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        className="flex items-center gap-2"
                                        whileHover={{ gap: "12px" }}
                                    >
                                        <Sparkles className="h-5 w-5" />
                                        <span>Ingresar como {activeTab === 'admin' ? 'Administrador' : 'Colaborador'}</span>
                                        <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </motion.div>
                                )}
                            </Button>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="text-center pt-6 border-t border-neutral-200/50"
                    >
                        <motion.p
                            className="text-xs text-neutral-500 flex items-center justify-center gap-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            <span className="text-lg">💡</span>
                            Modo desarrollo: cualquier contraseña funciona
                        </motion.p>
                    </motion.div>
                </form>
            </div>
        </motion.div>
    );
}
