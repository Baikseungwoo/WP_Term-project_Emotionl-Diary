const express = require('express');
const router = express.Router();
const { getDBConnection } = require('../models/db');

router.get('/admin/diary', async (req, res) => {
    try {
      const db = await getDBConnection();
      const result = await db.all('SELECT * FROM diary ORDER BY date DESC');
      await db.close();
      res.json(result);
    } catch (err) {
      console.error("❌ Failed to load diary list:", err);
      res.status(500).json({ error: 'Failed to load diary list' });
    }
  });

  router.get('/admin/users', async (req, res) => {
    try {
      const db = await getDBConnection();
      const result = await db.all('SELECT * FROM users ORDER BY userId ASC');
      await db.close();
      res.json(result);
    } catch (err) {
      console.error("❌ Failed to load user list:", err);
      res.status(500).json({ error: 'Failed to load user list' });
    }
  });
  
  module.exports = router;
  