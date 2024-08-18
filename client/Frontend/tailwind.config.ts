import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],  // Dark mode is now correctly set to "class"
  theme: {
    extend: {
      fontFamily: {
        Poppins: ["var(--font-Poppins)"],  // Fixed the variable syntax
        Josefin: ["var(--font-Josefin)"],  // Fixed the variable syntax and closed the bracket
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        "1000px": "1000px",
        "1200px": "1200px",
        "1300px": "1300px",
        "1400px": "1400px",
        "1500px": "1500px",
        "800px": "800px",
        "600px": "600px",
      },
    },
  },
  plugins: [],
};

export default config;
