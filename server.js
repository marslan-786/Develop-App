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
    user: process.env.EMAIL_USER, // .env میں EMAIL_USER=your@gmail.com
    pass: process.env.EMAIL_PASS  // .env میں EMAIL_PASS=app_password
  }
});

// ✅ Root → login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// ✅ 1. Check Email
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

// ✅ 2. Signup (Create User + Send OTP)
app.post("/api/signup", async (req, res) => {
  try {
    const { email, first_name, last_name, username, dob, profile_pic } = req.body;

    // User create
    const result = await pool.query(
      "INSERT INTO users (email, first_name, last_name, username, dob, profile_pic) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [email, first_name, last_name, username, dob, profile_pic]
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

// ✅ 3. Login (Verify OTP)
app.post("/auth/login", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email=$1 AND otp=$2", [email, otp]);

    if (result.rows.length > 0) {
      // Clear OTP after success
      await pool.query("UPDATE users SET otp=NULL WHERE email=$1", [email]);

      res.json({ success: true, message: "Login successful", user: result.rows[0] });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or OTP" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Chat page
app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "chat.html"));
});

export default app;
