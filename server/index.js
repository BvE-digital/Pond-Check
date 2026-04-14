import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { validateRoute } from './routes/validate.js';
import { submissionsRoute } from './routes/submissions.js';
import { initDb } from './db/init.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors());
app.use(express.json());

initDb();

app.use('/api/validate', validateRoute);
app.use('/api/submissions', submissionsRoute);

// Health check for Railway
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Serve built frontend
const distPath = join(__dirname, '..', 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
} else {
  console.error('ERROR: dist/ not found — frontend was not built.');
  app.get('*', (req, res) => {
    res.status(503).send('Frontend not built. Run npm run build.');
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`PondCheck API running on port ${PORT}`);
});
