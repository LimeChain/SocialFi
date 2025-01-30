module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#512DA8",
        secondary: "#f8f8f8",
        text: {
          primary: "#333",
          secondary: "#666",
        },
        dark: {
          primary: "#7B4DFF",
          secondary: "#1F1F1F",
          surface: "#121212",
          text: {
            primary: "#FFFFFF",
            secondary: "#AAAAAA",
          },
        },
      },
    },
  },
  plugins: [],
};
