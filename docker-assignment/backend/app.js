const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: 5432,
});

// Retry DB connection
async function connectWithRetry() {
  let retries = 5;

  while (retries) {
    try {
      await pool.query("SELECT 1");
      console.log("✅ Connected to PostgreSQL");

      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name TEXT
        );
      `);

      console.log("✅ Table ready");
      break;

    } catch (err) {
      console.log("❌ DB not ready, retrying...");
      retries--;
      await new Promise(res => setTimeout(res, 3000));
    }
  }

  if (!retries) {
    console.error("❌ Could not connect to DB");
  }
}

connectWithRetry();


// Health endpoint
app.get("/health", (req, res) => {
  res.send("OK");
});


// Insert user
app.post("/users", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    await pool.query("INSERT INTO users(name) VALUES($1)", [name]);

    res.json({ message: "User added successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});


// Fetch users
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});


// Start server
app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});