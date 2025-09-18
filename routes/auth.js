const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const DB_FILE = path.join(__dirname, '..', 'database.json');
let otpStore = {};

// DB helpers
function loadDb() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) {
    return { users: [] };
  }
}
function saveDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Nodemailer transporter
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;

let transporter = null;
if (GMAIL_USER && GMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_PASS }
  });
} else {
  console.warn('⚠️ GMAIL_USER / GMAIL_PASS not set. Emails will not be sent.');
}

// send OTP email
async function sendOtpMail(to, otp) {
  if (!transporter) {
    console.log(`DEV: OTP for ${to} is ${otp}`);
    if (process.env.DEV_RETURN_OTP === 'true') return true;
    throw new Error('SMTP not configured');
  }
  const html = `<div style="font-family:Arial,sans-serif">
    <h2>Develop App — Your OTP</h2>
    <p>Your OTP code is: <b>${otp}</b></p>
    <p>If you did not request this, ignore.</p>
  </div>`;
  const info = await transporter.sendMail({
    from: GMAIL_USER,
    to,
    subject: 'Develop App — Your OTP code',
    html
  });
  console.log('Email sent:', info.messageId || info.response || info);
  return true;
}

// POST /auth/login
// - existing user -> send OTP
// - new user -> return signup_required
router.post('/login', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'email required' });

  const db = loadDb();
  const user = db.users.find(u => u.email === email);

  // generate OTP and store
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  try {
    await sendOtpMail(email, otp);
    return res.json({ status: 'otp_sent', message: `OTP sent to ${email}` });
  } catch (err) {
    console.error('Email send failed:', err.message || err);
    if (process.env.DEV_RETURN_OTP === 'true') {
      return res.json({ status: user ? 'otp_sent' : 'signup_required', message: 'dev-otp', otp });
    }
    // If no SMTP and user doesn't exist -> ask signup
    if (!user) return res.json({ status: 'signup_required', message: 'Signup required' });
    return res.status(500).json({ message: 'Failed to send OTP (check SMTP settings).' });
  }
});

// POST /auth/signup
router.post('/signup', async (req, res) => {
  const { email, first_name, last_name, username, dob, profile_pic } = req.body;
  if (!email || !first_name || !last_name || !username || !dob) {
    return res.status(400).json({ message: 'missing signup fields' });
  }

  const db = loadDb();
  if (db.users.some(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  if (db.users.some(u => u.username === username)) {
    return res.status(400).json({ message: 'Username already taken' });
  }

  const newUser = {
    id: Date.now(),
    email,
    first_name,
    last_name,
    username,
    dob,
    profile_pic: profile_pic || '' // base64 dataURL or empty
  };
  db.users.push(newUser);
  saveDb(db);

  // send OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;
  try {
    await sendOtpMail(email, otp);
    return res.json({ status: 'otp_sent', message: `Signup OK. OTP sent to ${email}` });
  } catch (err) {
    console.error('Email send failed after signup:', err.message || err);
    if (process.env.DEV_RETURN_OTP === 'true') {
      return res.json({ status: 'otp_sent', message: 'dev-otp', otp });
    }
    return res.status(500).json({ message: 'Failed to send OTP after signup.' });
  }
});

// POST /auth/verify-otp
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'email and otp required' });

  if (!otpStore[email] || otpStore[email] !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  delete otpStore[email];
  return res.json({ status: 'success', message: 'Logged in' });
});

module.exports = router;
