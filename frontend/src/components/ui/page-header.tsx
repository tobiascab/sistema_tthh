import { motion } from "framer-motion";

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
    icon?: React.ReactNode;
}

export function PageHeader({ title, description, action, icon }: PageHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {icon && (
                        <div className="p-3 bg-white border border-neutral-100 rounded-2xl shadow-sm text-neutral-600">
                            {icon}
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-black text-neutral-800 tracking-tight">{title}</h1>
                        {description && (
                            <p className="text-neutral-500 mt-1">{description}</p>
                        )}
                    </div>
                </div>
                {action && <div>{action}</div>}
            </div>
        </motion.div>
    );
}
