import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { version } from './package.json'

const baseConfig = {
   envDir: './envs',
   define: {
     __APP_VERSION__: JSON.stringify(version), // Inject the version into the app
   }
}

export default defineConfig(({ command, mode }) => {
  console.log(`Mode: ${command}`)
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
