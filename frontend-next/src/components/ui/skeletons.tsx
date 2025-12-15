export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
    return (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            {/* Header */}
            <div className="border-b border-neutral-200 p-4">
                <div className="flex gap-4">
                    {Array.from({ length: columns }).map((_, i) => (
                        <div key={i} className="flex-1">
                            <div className="h-4 bg-neutral-200 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-neutral-200">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div key={rowIndex} className="p-4">
                        <div className="flex gap-4">
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <div key={colIndex} className="flex-1">
                                    <div className="h-4 bg-neutral-100 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="animate-pulse space-y-4">
                <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-neutral-200 rounded-lg" />
                    <div className="w-20 h-4 bg-neutral-200 rounded" />
                </div>
                <div className="space-y-2">
                    <div className="w-32 h-6 bg-neutral-200 rounded" />
                    <div className="w-24 h-4 bg-neutral-200 rounded" />
                </div>
            </div>
        </div>
    );
}

export function ListSkeleton({ items = 3 }: { items?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: items }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-neutral-200 p-4">
                    <div className="animate-pulse flex items-center gap-4">
                        <div className="w-10 h-10 bg-neutral-200 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-neutral-200 rounded w-3/4" />
                            <div className="h-3 bg-neutral-100 rounded w-1/2" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
