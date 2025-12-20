"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { Empleado, EmpleadoFormData } from "@/src/types/empleado";
import { Loader2 } from "lucide-react";
import { DateStringInput } from "@/src/components/ui/date-input";
import { SUCURSALES } from "@/src/constants/sucursales";

const empleadoSchema = z.object({
    nombres: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    apellidos: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    numeroDocumento: z.string().min(5, "El documento debe tener al menos 5 caracteres"),
    numeroSocio: z.string().optional(),
    tipoDocumento: z.string().min(1, "Seleccione un tipo de documento"),
    email: z.string().email("Email inválido"),
    telefono: z.string().optional(),
    fechaNacimiento: z.string().min(1, "La fecha de nacimiento es requerida"),
    genero: z.string().optional(),
    estadoCivil: z.string().optional(),
    direccion: z.string().optional(),
    departamento: z.string().optional(),
    cargo: z.string().optional(),
    sucursal: z.string().optional(),
    fechaIngreso: z.string().min(1, "La fecha de ingreso es requerida"),
    tipoContrato: z.string().optional(),
    salarioBase: z.number().optional(),
    horarioEntrada: z.string().optional(),
    estado: z.enum(["ACTIVO", "INACTIVO", "SUSPENDIDO"]),
});

interface EmpleadoFormProps {
    empleado?: Empleado;
    onSubmit: (data: EmpleadoFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export function EmpleadoForm({ empleado, onSubmit, onCancel, isLoading }: EmpleadoFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<EmpleadoFormData>({
        resolver: zodResolver(empleadoSchema),
        defaultValues: empleado
            ? {
                ...empleado,
                salarioBase: empleado.salarioBase || undefined,
            }
            : {
                estado: "ACTIVO",
                tipoDocumento: "DNI",
            },
    });

    const tipoDocumento = watch("tipoDocumento");
    const estado = watch("estado");

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Información Personal */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-800">Información Personal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="nombres">Nombres *</Label>
                        <Input
                            id="nombres"
                            {...register("nombres")}
                            placeholder="Juan Carlos"
                            className={errors.nombres ? "border-destructive" : ""}
                        />
                        {errors.nombres && (
                            <p className="text-sm text-destructive">{errors.nombres.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="apellidos">Apellidos *</Label>
                        <Input
                            id="apellidos"
                            {...register("apellidos")}
                            placeholder="Pérez García"
                            className={errors.apellidos ? "border-destructive" : ""}
                        />
                        {errors.apellidos && (
                            <p className="text-sm text-destructive">{errors.apellidos.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tipoDocumento">Tipo de Documento *</Label>
                        <Select
                            value={tipoDocumento}
                            onValueChange={(value) => setValue("tipoDocumento", value)}
                        >
                            <SelectTrigger className={errors.tipoDocumento ? "border-destructive" : ""}>
                                <SelectValue placeholder="Seleccione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DNI">DNI</SelectItem>
                                <SelectItem value="CE">Carnet de Extranjería</SelectItem>
                                <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.tipoDocumento && (
                            <p className="text-sm text-destructive">{errors.tipoDocumento.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="numeroDocumento">Número de Documento *</Label>
                        <Input
                            id="numeroDocumento"
                            {...register("numeroDocumento")}
                            placeholder="12345678"
                            className={errors.numeroDocumento ? "border-destructive" : ""}
                        />
                        {errors.numeroDocumento && (
                            <p className="text-sm text-destructive">{errors.numeroDocumento.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="numeroSocio">Número de Socio</Label>
                        <Input
                            id="numeroSocio"
                            {...register("numeroSocio")}
                            placeholder="SOC-001"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            {...register("email")}
                            placeholder="juan.perez@ejemplo.com"
                            className={errors.email ? "border-destructive" : ""}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                            id="telefono"
                            {...register("telefono")}
                            placeholder="+51 999 999 999"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
                        <DateStringInput
                            id="fechaNacimiento"
                            value={watch("fechaNacimiento") || ""}
                            onChange={(val) => setValue("fechaNacimiento", val)}
                            placeholder="DD/MM/AA"
                            className={errors.fechaNacimiento ? "[&>input]:border-destructive" : ""}
                        />
                        {errors.fechaNacimiento && (
                            <p className="text-sm text-destructive">{errors.fechaNacimiento.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="genero">Género</Label>
                        <Select
                            value={watch("genero") || ""}
                            onValueChange={(value) => setValue("genero", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MASCULINO">Masculino</SelectItem>
                                <SelectItem value="FEMENINO">Femenino</SelectItem>
                                <SelectItem value="OTRO">Otro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="estadoCivil">Estado Civil</Label>
                        <Select
                            value={watch("estadoCivil") || ""}
                            onValueChange={(value) => setValue("estadoCivil", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SOLTERO">Soltero/a</SelectItem>
                                <SelectItem value="CASADO">Casado/a</SelectItem>
                                <SelectItem value="DIVORCIADO">Divorciado/a</SelectItem>
                                <SelectItem value="VIUDO">Viudo/a</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="direccion">Dirección</Label>
                        <Input
                            id="direccion"
                            {...register("direccion")}
                            placeholder="Av. Principal 123, Lima"
                        />
                    </div>
                </div>
            </div>

            {/* Información Laboral */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-800">Información Laboral</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="departamento">Departamento</Label>
                        <Select
                            value={watch("departamento") || ""}
                            onValueChange={(value) => setValue("departamento", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="TTHH">Talento Humano</SelectItem>
                                <SelectItem value="FINANZAS">Finanzas</SelectItem>
                                <SelectItem value="OPERACIONES">Operaciones</SelectItem>
                                <SelectItem value="SISTEMAS">Sistemas</SelectItem>
                                <SelectItem value="COMERCIAL">Comercial</SelectItem>
                                <SelectItem value="GERENCIA">Gerencia</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cargo">Cargo</Label>
                        <Input
                            id="cargo"
                            {...register("cargo")}
                            placeholder="Analista de TTHH"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sucursal">Sucursal</Label>
                        <Select
                            value={watch("sucursal") || ""}
                            onValueChange={(value) => setValue("sucursal", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione" />
                            </SelectTrigger>
                            <SelectContent>
                                {SUCURSALES.map((sucursal) => (
                                    <SelectItem key={sucursal} value={sucursal}>
                                        {sucursal}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fechaIngreso">Fecha de Ingreso *</Label>
                        <DateStringInput
                            id="fechaIngreso"
                            value={watch("fechaIngreso") || ""}
                            onChange={(val) => setValue("fechaIngreso", val)}
                            placeholder="DD/MM/AA"
                            className={errors.fechaIngreso ? "[&>input]:border-destructive" : ""}
                        />
                        {errors.fechaIngreso && (
                            <p className="text-sm text-destructive">{errors.fechaIngreso.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tipoContrato">Tipo de Contrato</Label>
                        <Select
                            value={watch("tipoContrato") || ""}
                            onValueChange={(value) => setValue("tipoContrato", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="INDEFINIDO">Indefinido</SelectItem>
                                <SelectItem value="PLAZO_FIJO">Plazo Fijo</SelectItem>
                                <SelectItem value="TEMPORAL">Temporal</SelectItem>
                                <SelectItem value="PRACTICAS">Prácticas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="salarioBase">Salario Base</Label>
                        <Input
                            id="salarioBase"
                            type="number"
                            step="0.01"
                            {...register("salarioBase", { valueAsNumber: true })}
                            placeholder="0.00"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="horarioEntrada">Horario de Entrada</Label>
                        <Input
                            id="horarioEntrada"
                            type="time"
                            {...register("horarioEntrada")}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="estado">Estado *</Label>
                        <Select
                            value={estado}
                            onValueChange={(value) => setValue("estado", value as any)}
                        >
                            <SelectTrigger className={errors.estado ? "border-destructive" : ""}>
                                <SelectValue placeholder="Seleccione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ACTIVO">Activo</SelectItem>
                                <SelectItem value="INACTIVO">Inactivo</SelectItem>
                                <SelectItem value="SUSPENDIDO">Suspendido</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.estado && (
                            <p className="text-sm text-destructive">{errors.estado.message}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {empleado ? "Actualizar" : "Crear"} Empleado
                </Button>
            </div>
        </form>
    );
}
