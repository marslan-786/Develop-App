import express from "express";
import sql from "../db.js";

const router = express.Router();

// Temporary OTP store (in-memory)
const otpStore = {};

// Step 1: Login
router.post("/login", async (req, res) => {
  const { email } = req.body;

  // Check if user exists
  const rows = await sql`SELECT * FROM users WHERE email = ${email}`;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  if (rows.length > 0) {
    return res.json({ status: "otp_sent", message: `OTP sent to ${email}`, otp }); 
  } else {
    return res.json({ status: "signup_required", message: "Please complete signup." });
  }
});

// Step 2: Signup
router.post("/signup", async (req, res) => {
  const { email, first_name, last_name, username, dob, profile_pic } = req.body;

  const exists = await sql`SELECT * FROM users WHERE email = ${email}`;
  if (exists.length > 0) {
    return res.status(400).json({ error: "User already exists" });
  }

  await sql`
    INSERT INTO users (email, first_name, last_name, username, dob, profile_pic)
    VALUES (${email}, ${first_name}, ${last_name}, ${username}, ${dob}, ${profile_pic})
  `;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  return res.json({ status: "otp_sent", message: `OTP sent to ${email}`, otp });
});

// Step 3: Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!otpStore[email] || otpStore[email] !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  delete otpStore[email];
  return res.json({ status: "success", message: "Logged in successfully" });
});

export default router;
