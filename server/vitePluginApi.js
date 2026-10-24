import express from 'express';
import { initDb } from './db.js';
import { campaignRouter } from './routes.js';

export function vitePluginCampaignApi() {
  return {
    name: 'vite-plugin-campaign-api',
    config() {
      return {
        server: {
          watch: {
            ignored: ['**/data/**', '**/*.json', '**/.git/**']
          }
        }
      };
    },
    async configureServer(server) {
      await initDb();
      const apiApp = express();
      apiApp.use(express.json());
      apiApp.use('/api/campaign', campaignRouter);

      server.middlewares.use((req, res, next) => {
        if (req.url.startsWith('/api/campaign')) {
          apiApp(req, res, next);
        } else {
          next();
        }
      });
    },
    async configurePreviewServer(server) {
      await initDb();
      const apiApp = express();
      apiApp.use(express.json());
      apiApp.use('/api/campaign', campaignRouter);

      server.middlewares.use((req, res, next) => {
        if (req.url.startsWith('/api/campaign')) {
          apiApp(req, res, next);
        } else {
          next();
        }
      });
    }
  };
}
