import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log(`Mode: ${command}`); 

  if (command === 'build') {
    return {
      plugins: [react()],
      base: '/Scatterbrain/', 
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            secure: false,
            target: 'https://abanm.pythonanywhere.com/', // Production backend
          },
        },
      },
    };
  } else {
    return {
      plugins: [react()],
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            secure: false,
            target: 'http://localhost:5000/', // Local development backend
          },
        },
      },
    };
  }
});
