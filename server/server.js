import express from "express";
import pg from "pg";
import "dotenv/config.js";
import cors from "cors";

const port = process.env.PORT || 5000;
const app = express();
const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

db.connect(err => {
  if (err) {
    console.log("Error connecting to the database: " + err);
  } else {
    console.log("Database connected!");
  }
});

const corsOptions = {
  origin: [
    "https://notepad-client.vercel.app",
    "http://localhost:3000" // Add your local development origin
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// const corsOptions = {
//   origin: "https://notepad-client.vercel.app",
//   credentials: true,
//   optionsSuccessStatus: 200,
// };

// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions)); // Handle preflight requests

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
    res.status(500).send(`Error fetching data: ${error.message}`);
  }
});

// API INSERT notes INTO db
app.post("/add", async (req, res) => {
    const { note } = req.body
    try {
      if (note.title != "" && note.content != ""){
        const result = await db.query("INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *", [note.title, note.content]);
        res.status(200).json(result.rows[0]);
      }
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
