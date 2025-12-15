import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: "primary" | "secondary" | "accent" | "success" | "warning" | "danger";
    isLoading?: boolean;
}

const colorClasses = {
    primary: "from-primary-50 to-primary-100 border-primary-200 bg-primary-500",
    secondary: "from-secondary-50 to-secondary-100 border-secondary-200 bg-secondary-500",
    accent: "from-accent-50 to-accent-100 border-accent-200 bg-accent-500",
    success: "from-green-50 to-green-100 border-green-200 bg-green-500",
    warning: "from-orange-50 to-orange-100 border-orange-200 bg-orange-500",
    danger: "from-red-50 to-red-100 border-red-200 bg-red-500",
};

export function StatsCard({
    title,
    value,
    icon: Icon,
    trend,
    color = "primary",
    isLoading = false,
}: StatsCardProps) {
    if (isLoading) {
        return (
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <div className="animate-pulse space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-neutral-200 rounded-lg" />
                        <div className="w-20 h-4 bg-neutral-200 rounded" />
                    </div>
                    <div className="space-y-2">
                        <div className="w-24 h-8 bg-neutral-200 rounded" />
                        <div className="w-16 h-4 bg-neutral-200 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    const [gradientFrom, gradientTo, borderColor, iconBg] = colorClasses[color].split(" ");

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl border ${borderColor} p-6 transition-shadow`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${iconBg} rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                {trend && (
                    <span
                        className={`text-sm font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        {trend.isPositive ? "+" : ""}
                        {trend.value}%
                    </span>
                )}
            </div>
            <div className="space-y-1">
                <p className="text-3xl font-bold text-neutral-800">{value}</p>
                <p className="text-sm text-neutral-600">{title}</p>
            </div>
        </motion.div>
    );
}
