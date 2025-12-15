"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { empleadosApi } from "@/src/lib/api/empleados";
import { useToast } from "@/src/hooks/use-toast";
import { cn } from "@/src/lib/utils";

interface AvatarUploadProps {
    empleadoId: number;
    currentFotoUrl?: string;
    nombre: string;
    className?: string;
}

export function AvatarUpload({
    empleadoId,
    currentFotoUrl,
    nombre,
    className,
}: AvatarUploadProps) {
    const [isHovered, setIsHovered] = useState(false);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const uploadMutation = useMutation({
        mutationFn: (file: File) => empleadosApi.uploadFoto(empleadoId, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["empleado", empleadoId] });
            toast({
                title: "Foto actualizada",
                description: "La foto de perfil se ha actualizado correctamente.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "No se pudo actualizar la foto de perfil.",
                variant: "destructive",
            });
        },
    });

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                uploadMutation.mutate(acceptedFiles[0]);
            }
        },
        accept: {
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
        },
        maxFiles: 1,
        disabled: uploadMutation.isPending,
    });

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    };

    return (
        <div
            {...getRootProps()}
            className={cn(
                "relative group cursor-pointer rounded-full",
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <input {...getInputProps()} />

            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarImage src={currentFotoUrl} alt={nombre} className="object-cover" />
                <AvatarFallback className="text-xl font-bold bg-green-100 text-green-700 border-2 border-green-200">
                    {getInitials(nombre)}
                </AvatarFallback>
            </Avatar>

            <div
                className={cn(
                    "absolute inset-0 bg-black/40 rounded-full flex items-center justify-center transition-opacity duration-200",
                    isHovered || uploadMutation.isPending ? "opacity-100" : "opacity-0"
                )}
            >
                {uploadMutation.isPending ? (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                ) : (
                    <Camera className="w-8 h-8 text-white" />
                )}
            </div>

            {uploadMutation.isPending && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                    Subiendo...
                </div>
            )}
        </div>
    );
}
