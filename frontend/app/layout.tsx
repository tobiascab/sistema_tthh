import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/src/components/providers";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-poppins",
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
            <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
