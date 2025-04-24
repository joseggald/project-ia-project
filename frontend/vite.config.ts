import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
  // Carga las variables de entorno
  const env = loadEnv(mode, process.cwd(), 'API_');

  console.log('Loaded environment variables:', env);

  return {
    plugins: [react()],
    define: {
      // Hace que las variables de entorno estén disponibles en tu código
      ...Object.keys(env).reduce((acc, key) => {
        acc[`import.meta.env.${key}`] = JSON.stringify(env[key]);
        return acc;
      }, {}),
    },
    // Puedes agregar más configuraciones aquí si es necesario
  };
});