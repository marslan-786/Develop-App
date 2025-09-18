const express = require('express');
const router = express.Router();

// sample placeholder routes
router.get('/status', (req, res) => {
  res.json({ status: 'ok', message: 'chat API placeholder' });
});

module.exports = router;
