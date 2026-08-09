import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

import pkg from './package.json' with { type: 'json' };

// Migration depuis Webpack (voir l'historique de webpack.config.js).
//
// Choix « define » : le code applicatif continue de lire `process.env.*`
// (APP_MODE, API_URL, DEBUG, VERSION, NODE_ENV) comme du temps du DefinePlugin.
// On ne migre PAS vers import.meta.env pour ne toucher ni le code, ni les .env,
// ni les ARG du Dockerfile. Toute clé lue dans le navigateur DOIT être définie
// ici, sinon `process` est indéfini au runtime et l'app plante.
export default defineConfig(({ mode }) => {
  // loadEnv lit .env / .env.local / .env.[mode]. process.env (ENV Docker en
  // prod) l'emporte, comme dotenv+DefinePlugin le faisaient auparavant.
  const fileEnv = loadEnv(mode, process.cwd(), '');
  const env = { ...fileEnv, ...process.env };

  const nodeEnv = mode === 'production' ? 'production' : 'development';

  return {
    plugins: [react()],

    // Servait par CopyWebpackPlugin auparavant : favicons, manifest, badges/,
    // leagues/, logos — tous adressés à la racine (`/favicon.ico`, `/badges/…`).
    publicDir: 'src/public',

    build: {
      outDir: 'dist', // servi tel quel par nginx (nginx.conf inchangé)
    },

    server: {
      port: Number(env.APP_PORT) || 25090,
      host: true,
    },

    resolve: {
      // Alias @src, @pages, … lus depuis tsconfig.json (résolution native Vite 8,
      // remplace le plugin vite-tsconfig-paths).
      tsconfigPaths: true,

      // Reprend le dédoublonnage que webpack.config.js imposait par alias : une
      // seule instance de React/MUI/Emotion, indispensable quand on développe
      // contre une copie locale de sunny-ui (`npm run link:sunny`).
      dedupe: [
        'react',
        'react-dom',
        '@mui/material',
        '@mui/icons-material',
        '@emotion/react',
        '@emotion/styled',
        'react-router-dom',
        'react-i18next',
      ],
    },

    // Réplique exacte de l'ancien DefinePlugin.
    define: {
      'process.env.APP_MODE': JSON.stringify(env.APP_MODE),
      'process.env.API_URL': JSON.stringify(env.API_URL),
      'process.env.DEBUG': JSON.stringify(env.DEBUG ?? 'false'),
      'process.env.VERSION': JSON.stringify(pkg.version),
      'process.env.NODE_ENV': JSON.stringify(nodeEnv),
    },
  };
});
