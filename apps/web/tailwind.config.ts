import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#161616",
        cream: "#f7f1e8",
        sand: "#dcc9a3",
        ember: "#c45c2d",
        forest: "#20453a"
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["Segoe UI", "sans-serif"]
      },
      boxShadow: {
        card: "0 20px 50px rgba(22, 22, 22, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
