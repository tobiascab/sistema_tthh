import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("authorization");

        const response = await fetch(`${BACKEND_URL}/api/v1/reportes/dashboard-admin`, {
            headers: {
                "Authorization": token || "",
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error fetching admin dashboard:", error);
        return NextResponse.json(
            { error: "Error al obtener dashboard administrativo" },
            { status: 500 }
        );
    }
}
