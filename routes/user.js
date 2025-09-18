const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'database.json');

function loadDb() {
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch(e) { return { users: [] }; }
}

// GET /user?email=...
router.get('/', (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ message: 'email query required' });
  const db = loadDb();
  const user = db.users.find(u => u.email === email);
  if (!user) return res.status(404).json({ message: 'User not found' });
  // do not return sensitive info (none here) — return profile fields
  const out = {
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    dob: user.dob,
    profile_pic: user.profile_pic || ''
  };
  res.json({ user: out });
});

module.exports = router;
