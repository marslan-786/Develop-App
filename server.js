import express from "express";
import pkg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Database connection (Neon)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Temporary OTP store (in-memory)
const otpStore = {};

// ✅ Root → login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// ✅ Chat page
app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "chat.html"));
});


// ==================== AUTH ROUTES ====================

// Step 1: Login (check email)
app.post("/auth/login", async (req, res) => {
  try {
    const { email } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;

    if (result.rows.length > 0) {
      res.json({ status: "otp_sent", message: `OTP sent to ${email}`, otp });
    } else {
      res.json({ status: "signup_required", message: "Please complete signup." });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Step 2: Signup
app.post("/auth/signup", async (req, res) => {
  try {
    const { email, first_name, last_name, username, dob, profile_pic } = req.body;

    const exists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    await pool.query(
      "INSERT INTO users (email, first_name, last_name, username, dob, profile_pic) VALUES ($1,$2,$3,$4,$5,$6)",
      [email, first_name, last_name, username, dob, profile_pic]
    );

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;

    res.json({ status: "otp_sent", message: `OTP sent to ${email}`, otp });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Step 3: Verify OTP
app.post("/auth/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!otpStore[email] || otpStore[email] !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  delete otpStore[email];
  res.json({ status: "success", message: "Logged in successfully" });
});

// Step 4: Get user by email (for profile fetching)
app.get("/user", async (req, res) => {
  try {
    const { email } = req.query;
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length > 0) {
      res.json({ user: result.rows[0] });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("User fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ==================== START SERVER ====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

export default app;
