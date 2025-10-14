/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"], // add custom font
        cursive: ['"Dancing Script"', "cursive"], // example if you want another
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
