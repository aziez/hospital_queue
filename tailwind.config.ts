import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
            // Hospital-specific color palette
            colors: {
              // Main brand colors
              primary: {
                50: "#e6f7ff",
                100: "#bae7ff",
                200: "#91d5ff",
                300: "#69c0ff",
                400: "#40a9ff",
                500: "#1890ff",
                600: "#096dd9",
                700: "#0050b3",
                800: "#003a8c",
                900: "#002766",
              },
              // Secondary colors for accents
              secondary: {
                50: "#f0f5ff",
                100: "#d6e4ff",
                200: "#adc6ff",
                300: "#85a5ff",
                400: "#597ef7",
                500: "#2f54eb",
                600: "#1d39c4",
                700: "#10239e",
                800: "#061178",
                900: "#030852",
              },
              // Success colors for completed status
              success: {
                50: "#f6ffed",
                100: "#d9f7be",
                200: "#b7eb8f",
                300: "#95de64",
                400: "#73d13d",
                500: "#52c41a",
                600: "#389e0d",
                700: "#237804",
                800: "#135200",
                900: "#092b00",
              },
              // Warning colors for processing status
              warning: {
                50: "#fffbe6",
                100: "#fff1b8",
                200: "#ffe58f",
                300: "#ffd666",
                400: "#ffc53d",
                500: "#faad14",
                600: "#d48806",
                700: "#ad6800",
                800: "#874d00",
                900: "#613400",
              },
              // Error colors for alerts and errors
              error: {
                50: "#fff1f0",
                100: "#ffccc7",
                200: "#ffa39e",
                300: "#ff7875",
                400: "#ff4d4f",
                500: "#f5222d",
                600: "#cf1322",
                700: "#a8071a",
                800: "#820014",
                900: "#5c0011",
              },
            },
            // Additional spacing for layout
            spacing: {
              '72': '18rem',
              '80': '20rem',
              '96': '24rem',
              '128': '32rem',
            },
            // Box shadow variations
            boxShadow: {
              'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            // Rounded corners
            borderRadius: {
              'xl': '1rem',
              '2xl': '1.5rem',
              '3xl': '2rem',
            },
            // Animation durations
            animation: {
              'fast-pulse': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            // Screen sizes for responsive design
            screens: {
              'xs': '475px',
              // Keep default Tailwind breakpoints
              'sm': '640px',
              'md': '768px',
              'lg': '1024px',
              'xl': '1280px',
              '2xl': '1536px',
              // Add hospital display specific size
              'display': '1920px',
            },
    },
  },
  plugins: [],
} satisfies Config;
