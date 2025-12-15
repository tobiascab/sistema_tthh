import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Cooperativa Reducto Brand Colors
                primary: {
                    DEFAULT: "#7FD855",
                    50: "#F0FBE8",
                    100: "#E1F7D1",
                    200: "#C3EFA3",
                    300: "#A5E775",
                    400: "#87DF47",
                    500: "#7FD855",
                    600: "#65AC44",
                    700: "#4B8133",
                    800: "#325622",
                    900: "#192B11",
                },
                secondary: {
                    DEFAULT: "#5CB85C",
                    50: "#EDF7ED",
                    100: "#DBEFDB",
                    200: "#B7DFB7",
                    300: "#93CF93",
                    400: "#6FBF6F",
                    500: "#5CB85C",
                    600: "#4A934A",
                    700: "#376E37",
                    800: "#254925",
                    900: "#122412",
                },
                accent: {
                    DEFAULT: "#FFD700",
                    50: "#FFFEF0",
                    100: "#FFFCE0",
                    200: "#FFF9C2",
                    300: "#FFF6A3",
                    400: "#FFF385",
                    500: "#FFD700",
                    600: "#CCAC00",
                    700: "#998100",
                    800: "#665600",
                    900: "#332B00",
                },
                neutral: {
                    50: "#F8F9FA",
                    100: "#E9ECEF",
                    200: "#DEE2E6",
                    300: "#CED4DA",
                    400: "#ADB5BD",
                    500: "#6C757D",
                    600: "#495057",
                    700: "#343A40",
                    800: "#212529",
                    900: "#000000",
                },
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    "1": "hsl(var(--chart-1))",
                    "2": "hsl(var(--chart-2))",
                    "3": "hsl(var(--chart-3))",
                    "4": "hsl(var(--chart-4))",
                    "5": "hsl(var(--chart-5))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: ["var(--font-inter)", "system-ui", "sans-serif"],
                poppins: ["var(--font-poppins)", "system-ui", "sans-serif"],
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};

export default config;
