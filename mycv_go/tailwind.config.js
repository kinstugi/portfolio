/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'custom-black': '#1a1a1a', // The deep off-black in the header
        'custom-dark': '#4b5563',  // The grey used for body text
        'custom-light': '#ffffff',
        'custom-blue-light': '#eff6ff', // The light blue circles behind icons
      },
    },
  },
  plugins: [],
}
