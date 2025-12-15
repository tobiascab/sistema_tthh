import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function POST(request: NextRequest) {
    try {
        const token = request.headers.get("authorization");
        const body = await request.json();

        // Get client info
        const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
        const userAgent = request.headers.get("user-agent") || "unknown";

        // Add client info to audit log
        const auditData = {
            ...body,
            ipAddress,
            userAgent,
        };

        const response = await fetch(`${BACKEND_URL}/api/v1/auditoria`, {
            method: "POST",
            headers: {
                "Authorization": token || "",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(auditData),
        });

        if (!response.ok) {
            throw new Error("Failed to create audit log");
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error creating audit log:", error);
        return NextResponse.json(
            { error: "Error al crear registro de auditoría" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("authorization");
        const searchParams = request.nextUrl.searchParams;

        const response = await fetch(`${BACKEND_URL}/api/v1/auditoria?${searchParams}`, {
            headers: {
                "Authorization": token || "",
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error fetching audit logs:", error);
        return NextResponse.json(
            { error: "Error al obtener registros de auditoría" },
            { status: 500 }
        );
    }
}
