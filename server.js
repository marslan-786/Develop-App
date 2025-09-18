import express from "express";
import { Pool } from "pg";

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ✅ Login route
app.post("/login", async (req, res) => {
  try {
    const { email } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

export default app;
