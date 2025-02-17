import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createRequire } from "module";

// Import Tailwind CSS and Autoprefixer
const require = createRequire(import.meta.url);
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  build: {
    lib: {
      entry: "./src/components/Booking/BookingWidgetExternalEmbed.jsx",
      name: "ExternalBookingWidget",
      fileName: (format) => `external-booking-widget.${format}.js`,
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  define: {
    "process.env": {},
  },
});
