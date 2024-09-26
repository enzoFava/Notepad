import express from "express";
import pg from "pg";
import "dotenv/config.js";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

// API Register new user
app.post("/register", async (req, res) => {
  const {firstName, lastName, email, password} = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered."});
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db.query("INSERT INTO users (email, firstName, lastName, password) VALUES ($1, $2, $3, $4)", [email, firstName, lastName, passwordHash]);
    
    const token = jwt.sign({email}, "jwt-secret", {expiresIn: "1h"});

    res.status(201).json({message: "user registered", token});
    // Here i should login and authenticate the new user
    
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).json({message: `Error: ${error.message}`});
  }
});

// API Login user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      res.status(404).json({message: "User not found"});
    }
      
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({message: "Invalid password."});
    }

    const token = jwt.sign({ email: user.email }, "jwt-secret", { expiresIn: "1h" });
    res.json({message: "Login successful", token});
    
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).json({message: `Error: ${error.message}`});
  }
});


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

// API DELETE notes FROM db
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
