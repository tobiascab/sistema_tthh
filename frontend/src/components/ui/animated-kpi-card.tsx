"use client";

import { motion, animate } from "framer-motion";
import { useEffect, useState, ReactNode, ComponentType, SVGProps } from "react";

// Type for Lucide icons
type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;

interface AnimatedKPICardProps {
    title: string;
    value: number;
    suffix?: string;
    prefix?: string;
    icon: IconComponent;
    trend?: {
        value: number;
        isPositive: boolean;
        label?: string;
    };
    colorScheme: 'green' | 'blue' | 'orange' | 'red' | 'purple' | 'yellow';
    description?: string;
    onClick?: () => void;
}

const colorSchemes = {
    green: {
        gradient: 'from-green-500 to-emerald-600',
        bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
        border: 'border-green-200',
        text: 'text-green-700',
        iconBg: 'bg-green-500',
        trendUp: 'text-green-600',
        trendDown: 'text-red-500'
    },
    blue: {
        gradient: 'from-blue-500 to-indigo-600',
        bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        iconBg: 'bg-blue-500',
        trendUp: 'text-green-600',
        trendDown: 'text-red-500'
    },
    orange: {
        gradient: 'from-orange-500 to-amber-600',
        bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
        border: 'border-orange-200',
        text: 'text-orange-700',
        iconBg: 'bg-orange-500',
        trendUp: 'text-green-600',
        trendDown: 'text-red-500'
    },
    red: {
        gradient: 'from-red-500 to-rose-600',
        bg: 'bg-gradient-to-br from-red-50 to-rose-50',
        border: 'border-red-200',
        text: 'text-red-700',
        iconBg: 'bg-red-500',
        trendUp: 'text-green-600',
        trendDown: 'text-red-500'
    },
    purple: {
        gradient: 'from-purple-500 to-violet-600',
        bg: 'bg-gradient-to-br from-purple-50 to-violet-50',
        border: 'border-purple-200',
        text: 'text-purple-700',
        iconBg: 'bg-purple-500',
        trendUp: 'text-green-600',
        trendDown: 'text-red-500'
    },
    yellow: {
        gradient: 'from-yellow-500 to-amber-500',
        bg: 'bg-gradient-to-br from-yellow-50 to-amber-50',
        border: 'border-yellow-200',
        text: 'text-yellow-700',
        iconBg: 'bg-yellow-500',
        trendUp: 'text-green-600',
        trendDown: 'text-red-500'
    }
};

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const controls = animate(0, value, {
            duration: 1.5,
            ease: "easeOut",
            onUpdate: (latest) => {
                setDisplayValue(Math.round(latest));
            }
        });

        return () => controls.stop();
    }, [value]);

    return (
        <span>
            {prefix}{displayValue.toLocaleString()}{suffix}
        </span>
    );
}

export function AnimatedKPICard({
    title,
    value,
    suffix = '',
    prefix = '',
    icon: Icon,
    trend,
    colorScheme,
    description,
    onClick
}: AnimatedKPICardProps) {
    const colors = colorSchemes[colorScheme];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.3 }}
            onClick={onClick}
            className={`relative ${colors.bg} rounded-2xl p-6 border ${colors.border} shadow-sm hover:shadow-lg transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} overflow-hidden`}
        >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <Icon className="w-full h-full" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className={`p-3 ${colors.iconBg} rounded-xl shadow-lg`}
                    >
                        <Icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <span className={`text-sm font-medium ${colors.text}`}>{title}</span>
                </div>

                <div className="space-y-2">
                    <p className="text-3xl font-bold text-neutral-800">
                        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
                    </p>

                    {description && (
                        <p className="text-sm text-neutral-600">{description}</p>
                    )}

                    {trend && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-1"
                        >
                            <span className={`text-sm font-medium ${trend.isPositive ? colors.trendUp : colors.trendDown}`}>
                                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                            </span>
                            {trend.label && (
                                <span className="text-xs text-neutral-500">{trend.label}</span>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Shimmer effect on hover */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                whileHover={{ translateX: '200%' }}
                transition={{ duration: 0.6 }}
            />
        </motion.div>
    );
}

interface KPIGridProps {
    children: ReactNode;
    columns?: 2 | 3 | 4;
}

export function KPIGrid({ children, columns = 4 }: KPIGridProps) {
    const gridCols = {
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-2 lg:grid-cols-4'
    };

    return (
        <div className={`grid grid-cols-1 ${gridCols[columns]} gap-4`}>
            {children}
        </div>
    );
}
