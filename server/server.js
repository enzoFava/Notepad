import express from "express";
import pg from "pg";
import "dotenv/config.js";
import cors from "cors";

const port = process.env.PORT || 5000;
const app = express();
const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

db.connect(function (err) {
  err
    ? console.log("Error connecting database: " + err)
    : console.log("Database connected!");
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    origin: "https://notepad-client.vercel.app/", // Allow requests from React app
    credentials: true
  }));

// API FETCH notes FROM db
app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM notes");
    if (result.rows.length > 0) {
      const notes = result.rows;
      res.json(notes);
    } else {
      res.status(404).send("No data found");
    }
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).send("Error fetching data");
  }
});

// API INSERT notes INTO db
app.post("/add", async (req, res) => {
    const { note } = req.body
    try {
        const result = await db.query("INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *", [note.title, note.content]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error adding note ", error);
        res.status(500).send("Error adding note");
    }
});

app.post("/delete", async (req, res) => {
  const { id } = req.body;
  try {
    const result = await db.query("DELETE FROM notes WHERE id = $1 RETURNING *", [id]);
    console.log(result.rows[0]);
    res.status(200).json(result.rows[0]);
  } catch (error){
    console.error("Error deleting note ", error);
    res.status(500).send("Error deleting note");
  }
})

app.listen(port, () => 
  console.log(`Server running on port: ${port}, http://localhost:${port}`)
);
