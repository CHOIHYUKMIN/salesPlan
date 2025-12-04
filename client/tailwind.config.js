/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0052CC',
                    light: '#E3F2FD',
                    dark: '#172B4D',
                },
                success: '#36B37E',
                warning: '#FFAB00',
                danger: '#FF5630',
                info: '#00B8D9',
            },
        },
    },
    plugins: [],
}
