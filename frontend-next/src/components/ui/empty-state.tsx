import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 px-4"
        >
            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                <Icon className="w-10 h-10 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">{title}</h3>
            <p className="text-sm text-neutral-600 text-center max-w-md mb-6">{description}</p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
                >
                    {action.label}
                </button>
            )}
        </motion.div>
    );
}
