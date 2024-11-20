import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1B365D",
        secondary: "#335082",
        tertiary: "#254170",
        navy: {
          400: "#335082",
          500: "#254170",
          600: "#1B365D",
          700: "#152A4A",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [nextui(), require("tailwind-scrollbar")({ nocompatible: true })],
};
