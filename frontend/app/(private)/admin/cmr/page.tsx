import { CMRDashboard } from "@/src/features/cmr/components/cmr-dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Centro Médico (C.M.R) | Sistema TTHH",
    description: "Gestión especializada del personal del Centro Médico Reducto",
};

export default function CMRPage() {
    return (
        <div className="container mx-auto py-8">
            <CMRDashboard />
        </div>
    );
}
