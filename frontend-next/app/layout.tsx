import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/src/components/providers";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "Sistema de Gestión de Talento Humano - Cooperativa Reducto",
    description: "Sistema integral de gestión de recursos humanos para Cooperativa Reducto",
    keywords: ["RRHH", "Talento Humano", "Cooperativa Reducto", "Gestión de Personal"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" suppressHydrationWarning>
            <body className={`${inter.variable} font-sans antialiased`}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
