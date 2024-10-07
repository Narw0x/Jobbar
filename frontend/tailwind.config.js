/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          custom_gray: "#555555",
          custom_red: "#A40015",
          custom_bg_gray: "#F5F5F5",
        },
      },
    },
    plugins: [],
  }