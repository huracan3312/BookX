import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createRequire } from 'module'

// Importar Tailwind CSS y Autoprefixer
const require = createRequire(import.meta.url)
const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer')

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },
})
