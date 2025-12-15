"use client";

import { LoginForm } from "@/src/features/auth/components/login-form";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Floating particles component
const FloatingParticles = () => {
    const [particles, setParticles] = useState<Array<{
        id: number;
        size: number;
        x: number;
        y: number;
        duration: number;
        delay: number;
        xMove: number;
    }>>([]);

    useEffect(() => {
        // Generate particles only on client side to avoid hydration mismatch
        const generatedParticles = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            size: Math.random() * 4 + 2,
            x: Math.random() * 100,
            y: Math.random() * 100,
            duration: Math.random() * 10 + 15,
            delay: Math.random() * 5,
            xMove: Math.random() * 20 - 10,
        }));
        setParticles(generatedParticles);
    }, []);

    if (particles.length === 0) {
        return null;
    }

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-white/30"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, particle.xMove, 0],
                        opacity: [0, 0.8, 0],
                        scale: [0, 1, 0],
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
};

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#E8F5E9] relative overflow-hidden p-4">

            {/* Background Decorative Circles - Animated */}
            <motion.div
                className="absolute top-0 left-0 w-64 h-64 bg-emerald-200/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
            />
            <motion.div
                className="absolute top-1/4 right-1/4 w-32 h-32 bg-yellow-100/40 rounded-full blur-xl"
                animate={{
                    y: [0, -20, 0],
                    scale: [1, 1.15, 1],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Main Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-6xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[680px] z-10"
            >

                {/* Left Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-20 flex flex-col justify-center relative">
                    <div className="mb-10 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className="text-emerald-600/70 font-semibold tracking-[0.2em] text-xs uppercase mb-3 block">
                                Bienvenido a
                            </span>
                            <h1 className="text-4xl md:text-5xl font-poppins font-extrabold bg-gradient-to-r from-emerald-800 via-emerald-900 to-emerald-800 bg-clip-text text-transparent mt-2 mb-3 leading-tight tracking-tight">
                                Cooperativa Reducto
                            </h1>
                            <p className="text-neutral-500 text-sm font-medium tracking-wide">
                                Sistema de Gestión de Talento Humano
                            </p>
                        </motion.div>
                    </div>

                    <LoginForm />

                    <div className="mt-8 flex justify-center gap-4">
                        {/* Social placeholders were requested to be removed, so this is empty or could have copyright */}
                        <p className="text-xs text-neutral-300 mt-4 absolute bottom-6">
                            © {new Date().getFullYear()} TTHH System
                        </p>
                    </div>
                </div>

                {/* Right Side - Visual / Branding */}
                <div className="hidden md:flex w-1/2 relative items-center justify-center overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <motion.img
                            src="/login-background.jpg"
                            alt="Background"
                            className="w-full h-full object-cover"
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </div>

                    {/* Animated Green Overlay */}
                    <motion.div
                        className="absolute inset-0 z-5"
                        animate={{
                            background: [
                                "rgba(52, 211, 153, 0.50)",
                                "rgba(16, 185, 129, 0.55)",
                                "rgba(52, 211, 153, 0.50)",
                            ],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />

                    {/* Floating Particles */}
                    <FloatingParticles />

                    {/* Visual Overlay Pattern */}
                    <div className="absolute inset-0 opacity-10 z-10">
                        <div className="absolute inset-0 bg-[linear-gradient(30deg,#ffffff12_1px,transparent_1px)] bg-[length:20px_20px]" />
                        <motion.div
                            className="absolute inset-0"
                            animate={{
                                background: [
                                    "linear-gradient(to top, rgba(6, 78, 59, 0.3), transparent)",
                                    "linear-gradient(to top, rgba(6, 78, 59, 0.4), transparent)",
                                    "linear-gradient(to top, rgba(6, 78, 59, 0.3), transparent)",
                                ],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="relative z-20 flex flex-col items-center text-center p-8"
                    >
                        {/* Logo in circle - Animated */}
                        <motion.div
                            className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-lg mb-8 p-4"
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            animate={{
                                boxShadow: [
                                    "0 10px 30px rgba(0,0,0,0.1)",
                                    "0 15px 40px rgba(52, 211, 153, 0.3)",
                                    "0 10px 30px rgba(0,0,0,0.1)",
                                ],
                            }}
                            transition={{
                                boxShadow: {
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                },
                            }}
                        >
                            <img
                                src="/coop_reducto.png"
                                alt="Logo"
                                className="w-full h-full object-contain"
                            />
                        </motion.div>

                        <motion.h2
                            className="text-white text-3xl font-bold tracking-wider mb-4"
                            animate={{
                                textShadow: [
                                    "0 0 20px rgba(255,255,255,0.5)",
                                    "0 0 30px rgba(255,255,255,0.8)",
                                    "0 0 20px rgba(255,255,255,0.5)",
                                ],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            COOPERATIVA REDUCTO
                        </motion.h2>
                        <p className="text-emerald-100/80 max-w-xs text-sm leading-relaxed">
                            Compromiso, confianza y crecimiento compartido. Gestionando nuestro activo más valioso.
                        </p>
                    </motion.div>

                    {/* Decorative Shapes on Right Panel - Animated */}
                    <motion.div
                        className="absolute -top-24 -right-24 w-64 h-64 border-[30px] border-emerald-500/30 rounded-full z-10"
                        animate={{
                            rotate: [0, 360],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            rotate: {
                                duration: 30,
                                repeat: Infinity,
                                ease: "linear",
                            },
                            scale: {
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut",
                            },
                        }}
                    />
                    <motion.div
                        className="absolute -bottom-32 -left-12 w-80 h-80 bg-emerald-500/20 rounded-full blur-2xl z-10"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                            duration: 12,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </div>

            </motion.div>
        </div>
    );
}
