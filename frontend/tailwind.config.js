/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#F3F4F6",
                surface: "#FFFFFF",
                primary: "#F97316", // Orange
                secondary: "#6B7280",
                success: "#10B981",
                warning: "#F59E0B",
                danger: "#EF4444",
                info: "#3B82F6",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
