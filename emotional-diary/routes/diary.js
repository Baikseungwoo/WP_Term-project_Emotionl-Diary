const express = require('express');
const router = express.Router();
const { getDBConnection } = require('../models/db');
const { analyzeDiary } = require('../services/openai');

router.post('/diary', async (req, res) => {
  const { userId, date, content } = req.body;

  if (!userId || !date || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // contract with OpenAI API to analyze diary content
    const { keywords, emotion } = await analyzeDiary(content);

    // DB saving
    const db = await getDBConnection();
    await db.run(
      `INSERT INTO diary (userId, emotion, keyword1, keyword2, keyword3, date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, emotion, keywords[0], keywords[1], keywords[2], date]
    );

    res.status(201).json({ success: true, emotion, keywords });
    await db.close();
  } catch (err) {
    console.error('❌ Error in saving diary:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/diary', async (req, res) => {
    const userId = req.query.userId;
  
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId in query' });
    }
  
    try {
      const db = await getDBConnection();
  
      const result = await db.all(
        `SELECT diaryId, emotion, keyword1, keyword2, keyword3, date
         FROM diary
         WHERE userId = ?
         ORDER BY date DESC`,
        [userId]
      );
  
      res.json(result);
      await db.close();
    } catch (err) {
      console.error('❌ Error in listing diaries:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;
