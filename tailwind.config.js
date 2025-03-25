/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // Keep this, but it might not work as expected
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#3b82f6', // blue-500
            },
            animation: {
                'fade-in': 'fadeIn 0s ease-in-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': {opacity: '0', transform: 'translateY(-10px)'},
                    '100%': {opacity: '1', transform: 'translateY(0)'},
                },
            }
        },
    },
    plugins: [
        function ({ addVariant }) {
            addVariant('dark', 'body.dark &'); // Custom variant for when <body> has the dark class
        },
    ],
};
