const express = require("express");
const router = express.Router();

router.get("/session/user", (req, res) => {
  const userId = req.session?.userId;

  if (!userId) {
    return res.status(401).json({ error: "Not logged in" });
  }

  res.json({ userId: String(userId) });
});

module.exports = router;