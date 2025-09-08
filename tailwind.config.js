export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#6C2E8C",
        accent: "#E91E8A",
        info: "#29ABE2",
        success: "#8DC63F",
        warn: "#F7931E",
        ink: "#333333",
        canvas: "#F5F5F5",
      },
      borderRadius: {
        '2xl': '1rem',
      }
    }
  },
  plugins: []
}
