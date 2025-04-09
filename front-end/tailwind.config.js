/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        Roboto:['Roboto'],
        Rubik:['Rubik', 'sans serif'],
        Montserrat:["Montserrat", 'sans-serif'],
        ArchivoBlack:["Archivo Black", "sans-serif"]
      },
    },
  },
  plugins: [],
}

