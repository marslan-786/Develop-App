import express from "express";
import pkg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

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

// ✅ Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ✅ Root → login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// ✅ Login API → check email
app.post("/api/check-email", async (req, res) => {
  try {
    const { email } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.json({ success: false, message: "Email not found" });
    }
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Signup API → create account + send OTP
app.post("/api/signup", async (req, res) => {
  try {
    const { email, first_name, last_name, username, dob } = req.body;

    // User create (⚠️ password remove کر دیا گیا ہے)
    const result = await pool.query(
      "INSERT INTO users (email, first_name, last_name, username, dob) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [email, first_name, last_name, username, dob || null]
    );

    // OTP generate
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Save OTP in DB
    await pool.query("UPDATE users SET otp=$1 WHERE email=$2", [otp, email]);

    // Send OTP via Gmail
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`
    });

    res.json({ success: true, message: "Signup successful — OTP sent!" });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: "Signup failed" });
  }
});

// ✅ Chat page
app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "chat.html"));
});

export default app;
