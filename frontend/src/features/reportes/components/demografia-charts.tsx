"use client";

import { useQuery } from "@tanstack/react-query";
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { reportesApi } from "@/src/lib/api/reportes";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

const COLORS = ['#16a34a', '#2563eb', '#db2777', '#ea580c', '#8b5cf6'];

export function DemografiaCharts() {
    const { data: demografia } = useQuery({
        queryKey: ["reportes-demografia"],
        queryFn: () => reportesApi.getDemografia()
    });

    if (!demografia) return <div>Cargando...</div>;

    const dataGenero = Object.entries(demografia.porGenero).map(([name, value]) => ({ name, value }));
    const dataEdad = Object.entries(demografia.porEdad).map(([name, value]) => ({ name, value }));
    const dataSucursal = Object.entries(demografia.porSucursal).map(([name, value]) => ({ name, value }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Distribución por Género</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={dataGenero}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {dataGenero.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Rango de Edades</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dataEdad}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Colaboradores por Sucursal</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dataSucursal} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={100} style={{ fontSize: '12px' }} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#16a34a" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
