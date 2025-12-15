"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Loader2, Lock, User, AlertCircle, Eye, EyeOff, ArrowRight, ShieldCheck, Users } from "lucide-react";
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

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    // Determine colors based on tab
    const activeColor = activeTab === 'admin' ? 'emerald' : 'blue';

    return (
        <div className="w-full max-w-sm mx-auto">
            {/* Role Selector Tabs - Minimalist Style */}
            <div className="flex p-1 bg-neutral-100 rounded-full mb-8 relative">
                <div
                    className={cn(
                        "absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm transition-all duration-300 ease-spring",
                        activeTab === 'admin' ? "left-1" : "left-[calc(50%+4px)]"
                    )}
                />
                <button
                    onClick={() => handleTabChange('admin')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-full relative z-10 transition-colors duration-300",
                        activeTab === 'admin' ? "text-emerald-700" : "text-neutral-500 hover:text-neutral-700"
                    )}
                >
                    <ShieldCheck className="w-4 h-4" />
                    Admin
                </button>
                <button
                    onClick={() => handleTabChange('colaborador')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-full relative z-10 transition-colors duration-300",
                        activeTab === 'colaborador' ? "text-blue-700" : "text-neutral-500 hover:text-neutral-700"
                    )}
                >
                    <Users className="w-4 h-4" />
                    Colaborador
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <motion.div variants={itemVariants} className="space-y-1">
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 z-10">
                            <User className="w-5 h-5" />
                        </div>
                        <Input
                            id="username"
                            type="text"
                            placeholder={activeTab === 'admin' ? "Usuario o Email" : "Usuario"}
                            {...register("username")}
                            onFocus={() => setFocusedField('username')}
                            onBlur={() => setFocusedField(null)}
                            className={cn(
                                "h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all duration-300 rounded-full pl-12 shadow-inner",
                                focusedField === 'username' && `ring-2 ring-${activeColor}-200 border-${activeColor}-500`,
                                errors.username && "border-destructive focus:border-destructive ring-destructive/20"
                            )}
                        />
                    </div>
                    <AnimatePresence>
                        {errors.username && (
                            <motion.p
                                initial={{ opacity: 0, y: -10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -10, height: 0 }}
                                className="text-xs text-destructive flex items-center gap-1 pl-4"
                            >
                                <AlertCircle className="w-3 h-3" />
                                {errors.username.message}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-1">
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 z-10">
                            <Lock className="w-5 h-5" />
                        </div>
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña"
                            {...register("password")}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            className={cn(
                                "h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all duration-300 rounded-full pl-12 pr-12 shadow-inner",
                                focusedField === 'password' && `ring-2 ring-${activeColor}-200 border-${activeColor}-500`,
                                errors.password && "border-destructive focus:border-destructive ring-destructive/20"
                            )}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    <AnimatePresence>
                        {errors.password && (
                            <motion.p
                                initial={{ opacity: 0, y: -10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -10, height: 0 }}
                                className="text-xs text-destructive flex items-center gap-1 pl-4"
                            >
                                <AlertCircle className="w-3 h-3" />
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
                            className="p-3 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-2 text-red-600 text-sm"
                        >
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Button
                        type="submit"
                        className={cn(
                            "w-full h-12 text-white font-semibold text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300 uppercase tracking-wide",
                            activeTab === 'admin'
                                ? "bg-emerald-500 hover:bg-emerald-600"
                                : "bg-blue-500 hover:bg-blue-600"
                        )}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-2"
                            >
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Iniciando...</span>
                            </motion.div>
                        ) : (
                            <span>Ingresar</span>
                        )}
                    </Button>
                </motion.div>

                <div className="text-center">
                    <p className="text-xs text-neutral-400">
                        ¿Problemas? Contacte a soporte
                    </p>
                </div>
            </form>
        </div>
    );
}
