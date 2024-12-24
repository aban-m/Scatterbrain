import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const baseConfig = {
   envDir: './envs'
}

export default defineConfig(({ command, mode }) => {
  console.log(`Mode: ${command}`); 

  if (command === 'build') {
    return {
      ...baseConfig,
      plugins: [react()],
      base: '/Scatterbrain/'
    };
  } else {
    return {
      ...baseConfig,
      plugins: [react()]
    };
  }
});
