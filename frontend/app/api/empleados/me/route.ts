import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("authorization");

        const response = await fetch(`${BACKEND_URL}/api/v1/empleados/me`, {
            headers: {
                "Authorization": token || "",
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error fetching current employee:", error);
        return NextResponse.json(
            { error: "Error al obtener datos del empleado" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const token = request.headers.get("authorization");
        const body = await request.json();

        const response = await fetch(`${BACKEND_URL}/api/v1/empleados/me`, {
            method: "PATCH",
            headers: {
                "Authorization": token || "",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error updating employee:", error);
        return NextResponse.json(
            { error: "Error al actualizar datos del empleado" },
            { status: 500 }
        );
    }
}
