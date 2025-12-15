import { AuthGuard } from "@/src/features/auth/components/auth-guard";
import { Sidebar } from "@/src/components/layout/sidebar";
import { Topbar } from "@/src/components/layout/topbar";

export default function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    {/* Background blob for Premium Emerald effect (very subtle green) */}
                    <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-emerald-100/40 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-multiply opacity-50" />

                    {/* Topbar */}
                    <div className="relative z-10">
                        <Topbar />
                    </div>

                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto p-8 relative z-10 scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent">
                        <div className="max-w-7xl mx-auto w-full">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}
