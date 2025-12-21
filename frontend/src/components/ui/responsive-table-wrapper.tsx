import { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

interface ResponsiveTableWrapperProps {
    children: ReactNode;
    className?: string;
}

/**
 * Wrapper que hace que las tablas sean responsive:
 * - Desktop: tabla normal
 * - Mobile: scroll horizontal con sombras laterales
 */
export function ResponsiveTableWrapper({ children, className }: ResponsiveTableWrapperProps) {
    return (
        <div className={cn("relative w-full", className)}>
            {/* Shadow indicators for scroll */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 md:hidden" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 md:hidden" />

            {/* Scrollable container */}
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                <div className="inline-block min-w-full align-middle">
                    {children}
                </div>
            </div>
        </div>
    );
}
