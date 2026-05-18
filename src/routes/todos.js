/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Alle Todos abrufen
 *     responses:
 *       200:
 *         description: Todo-Liste
 *   post:
 *     summary: Neues Todo erstellen
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 * /todos/{id}:
 *   put:
 *     summary: Todo aktualisieren
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               done:
 *                 type: boolean
 *   delete:
 *     summary: Todo löschen
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// GET /todos - hepsini getir
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /todos - yeni ekle
router.post('/', async (req, res) => {
  const { title } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO todos (title, done) VALUES ($1, false) RETURNING *',
      [title]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /todos/:id - güncelle
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, done } = req.body;
  try {
    const result = await pool.query(
      'UPDATE todos SET title=$1, done=$2 WHERE id=$3 RETURNING *',
      [title, done, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /todos/:id - sil
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM todos WHERE id=$1', [id]);
    res.json({ message: 'Silindi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;