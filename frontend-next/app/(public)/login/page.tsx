"use client";

import { LoginForm } from "@/src/features/auth/components/login-form";
import { motion } from "framer-motion";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50 relative overflow-hidden p-4">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-green-200/40 to-green-300/30 rounded-full blur-3xl"
                />
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                    className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-green-300/40 to-emerald-200/30 rounded-full blur-3xl"
                />
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-green-100/20 to-emerald-100/20 rounded-full blur-3xl"
                />

                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 100 }}
                        animate={{
                            opacity: [0, 0.6, 0],
                            y: [-20, -100, -180],
                            x: [0, (i % 2 === 0 ? 20 : -20), 0]
                        }}
                        transition={{
                            duration: 4,
                            delay: i * 0.8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute w-3 h-3 bg-green-400/40 rounded-full"
                        style={{
                            left: `${15 + i * 15}%`,
                            bottom: '10%'
                        }}
                    />
                ))}
            </div>

            <div className="w-full max-w-lg relative z-10">
                {/* Logo and Title */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-8"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 20,
                            delay: 0.2
                        }}
                        className="inline-flex items-center justify-center mb-6"
                    >
                        {/* Logo Container with glow effect */}
                        <div className="relative">
                            {/* Outer glow ring */}
                            <motion.div
                                animate={{
                                    boxShadow: [
                                        "0 0 20px rgba(34, 197, 94, 0.3)",
                                        "0 0 40px rgba(34, 197, 94, 0.5)",
                                        "0 0 20px rgba(34, 197, 94, 0.3)"
                                    ]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute inset-0 rounded-full"
                            />

                            {/* Logo */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="relative w-52 h-52 rounded-full overflow-hidden shadow-2xl bg-white p-2 border-4 border-green-100 flex items-center justify-center"
                            >
                                <img
                                    src="/coop_reducto.png"
                                    alt="Cooperativa Reducto"
                                    className="w-full h-full object-contain"
                                />
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-green-700 to-emerald-800 bg-clip-text text-transparent mb-3"
                    >
                        Cooperativa Reducto
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200/50"
                    >
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <p className="text-neutral-600 font-medium text-base">
                            Sistema de Gestión de Talento Humano
                        </p>
                    </motion.div>
                </motion.div>

                {/* Login Form */}
                <LoginForm />

                {/* Footer */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-center text-sm text-neutral-500 mt-8"
                >
                    © {new Date().getFullYear()} Cooperativa Reducto. Todos los derechos reservados.
                </motion.p>
            </div>
        </div>
    );
}
