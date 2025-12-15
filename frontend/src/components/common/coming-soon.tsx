"use client";

import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Construction, Clock, Rocket } from "lucide-react";
import { motion } from "framer-motion";

interface ComingSoonProps {
    title: string;
    description: string;
    icon?: React.ElementType;
    features?: string[];
}

export function ComingSoon({
    title,
    description,
    icon: Icon = Rocket,
    features = []
}: ComingSoonProps) {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-green-50 p-6 rounded-full mb-6"
            >
                <Icon className="w-16 h-16 text-green-600" />
            </motion.div>

            <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-neutral-800 mb-3"
            >
                {title}
            </motion.h1>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="max-w-md mx-auto"
            >
                <p className="text-neutral-600 mb-6 text-lg">
                    {description}
                </p>

                <div className="bg-white border border-neutral-200 rounded-xl p-6 mb-8 shadow-sm">
                    <div className="flex items-center justify-center gap-2 mb-4 text-sm font-medium text-green-700 bg-green-50 py-1 px-3 rounded-full w-fit mx-auto">
                        <Construction className="w-4 h-4" />
                        En Desarrollo
                    </div>
                    <p className="text-sm text-neutral-500 mb-4">
                        Estamos trabajando duro para traerte estas funcionalidades:
                    </p>
                    <ul className="text-left space-y-2">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-center text-sm text-neutral-700">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex gap-4 justify-center">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver
                    </Button>
                    <Button
                        onClick={() => router.push('/dashboard')}
                        className="bg-green-600 hover:bg-green-700 gap-2"
                    >
                        Ir al Dashboard
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
