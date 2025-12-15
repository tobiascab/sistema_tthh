import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.headers.get("authorization");
        const body = await request.json();
        const id = params.id;

        const response = await fetch(`${BACKEND_URL}/api/v1/solicitudes/${id}`, {
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
        console.error("Error updating solicitud:", error);
        return NextResponse.json(
            { error: "Error al actualizar solicitud" },
            { status: 500 }
        );
    }
}
