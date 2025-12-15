import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("authorization");
        const searchParams = request.nextUrl.searchParams;

        const response = await fetch(`${BACKEND_URL}/api/v1/ausencias?${searchParams}`, {
            headers: {
                "Authorization": token || "",
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error fetching ausencias:", error);
        return NextResponse.json(
            { error: "Error al obtener ausencias" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = request.headers.get("authorization");
        const body = await request.json();

        const response = await fetch(`${BACKEND_URL}/api/v1/ausencias`, {
            method: "POST",
            headers: {
                "Authorization": token || "",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error creating ausencia:", error);
        return NextResponse.json(
            { error: "Error al crear ausencia" },
            { status: 500 }
        );
    }
}
