import { motion } from "framer-motion";

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-800">{title}</h1>
                    {description && (
                        <p className="text-sm text-neutral-600 mt-1">{description}</p>
                    )}
                </div>
                {action && <div>{action}</div>}
            </div>
        </motion.div>
    );
}
