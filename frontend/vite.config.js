import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log(`Mode: ${command}`); 

  if (command === 'build') {
    return {
      plugins: [react()],
      base: '/Scatterbrain/'
    };
  } else {
    return {
      plugins: [react()]
    };
  }
});
