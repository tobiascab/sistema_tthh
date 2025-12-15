"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import { reportesApi } from "@/src/lib/api/reportes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";

export function AusentismoChart() {
    const [range, setRange] = useState("30"); // days

    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaFin.getDate() - parseInt(range));

    const { data: ausentismo } = useQuery({
        queryKey: ["reportes-ausentismo", range],
        queryFn: () => reportesApi.getAusentismo(fechaInicio, fechaFin)
    });

    if (!ausentismo) return <div>Cargando...</div>;

    const data = Object.entries(ausentismo.porTipo).map(([name, value]) => ({ name, value }));

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Reporte de Ausentismo</CardTitle>
                        <CardDescription>
                            Total de ausencias: {ausentismo.totalAusencias}
                        </CardDescription>
                    </div>
                    <Select value={range} onValueChange={setRange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Periodo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7">Últimos 7 días</SelectItem>
                            <SelectItem value="30">Últimos 30 días</SelectItem>
                            <SelectItem value="90">Últimos 3 meses</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#ea580c" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
