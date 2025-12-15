import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const token = request.headers.get("authorization");

        console.log(`Fetching PDF from: ${BACKEND_URL}/api/payroll/${id}/pdf`);

        const response = await fetch(`${BACKEND_URL}/api/payroll/${id}/pdf`, {
            headers: {
                "Authorization": token || "",
            },
        });

        if (!response.ok) {
            console.error(`Backend returned ${response.status}: ${response.statusText}`);
            throw new Error(`Failed to fetch PDF: ${response.status}`);
        }

        const blob = await response.blob();

        return new NextResponse(blob, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="recibo_${id}.pdf"`,
            },
        });
    } catch (error) {
        console.error("Error fetching PDF:", error);
        return NextResponse.json(
            { error: "Error al obtener PDF" },
            { status: 500 }
        );
    }
}
