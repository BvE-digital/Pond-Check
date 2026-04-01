import { Router } from 'express';
import { getDb } from '../db/init.js';

const router = Router();

router.post('/', (req, res) => {
  const db = getDb();
  const { checklist_id, checklist_name, pond_id, data, status, claude_response } = req.body;

  const stmt = db.prepare(`
    INSERT INTO submissions (checklist_id, checklist_name, pond_id, data, status, claude_response)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    checklist_id,
    checklist_name,
    pond_id,
    JSON.stringify(data),
    status || 'pending',
    claude_response || null
  );

  const row = db.prepare('SELECT * FROM submissions WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ ...row, data: JSON.parse(row.data) });
});

router.get('/', (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM submissions ORDER BY submitted_at DESC LIMIT 50').all();
  res.json(rows.map(row => ({ ...row, data: JSON.parse(row.data) })));
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM submissions WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json({ ...row, data: JSON.parse(row.data) });
});

export { router as submissionsRoute };
