import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("authorization");
        const searchParams = request.nextUrl.searchParams;
        const month = searchParams.get("mes");
        const year = searchParams.get("anio");

        console.log(`Fetching Excel from: ${BACKEND_URL}/api/v1/payroll/exportar-planilla?${searchParams}`);

        const response = await fetch(`${BACKEND_URL}/api/v1/payroll/exportar-planilla?${searchParams}`, {
            headers: {
                "Authorization": token || "",
            },
        });

        if (!response.ok) {
            console.error(`Backend returned ${response.status}: ${response.statusText}`);
            throw new Error(`Failed to fetch Excel: ${response.status}`);
        }

        const blob = await response.blob();

        return new NextResponse(blob, {
            status: 200,
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename="planilla_bancaria_${month}_${year}.xlsx"`,
            },
        });
    } catch (error) {
        console.error("Error fetching Excel:", error);
        return NextResponse.json(
            { error: "Error al obtener planilla bancaria" },
            { status: 500 }
        );
    }
}
