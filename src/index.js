const express = require('express');
const app = express();
require('dotenv').config();

const todosRouter = require('./routes/todos');

app.use(express.json());

// Health check - Render ve ödev için zorunlu
app.get('/health', async (req, res) => {
  const pool = require('./db/pool');
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});

app.use('/todos', todosRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;