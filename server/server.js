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

function authenticateToken(req, res, next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401).json({message : "No token found"})
  }

  jwt.verify(token, "jwt-secret", (err, user) => {
    if (err) {
      return res.sendStatus(403).json({message:"Invalid token"})
    }
    req.user = user;
    next();
  });
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
    const result = await db.query('SELECT * FROM users WHERE "email" = $1', [email.toLowerCase()]);
    if (result.rows.length > 0) {
      const user = result.rows[0]
      return res.status(400).json({ message: "Email already registered.", user: user});
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const response = await db.query('INSERT INTO users ("email", "firstName", "lastName", "password") VALUES ($1, $2, $3, $4) RETURNING *', [email.toLowerCase(), firstName, lastName, passwordHash]);
    const user = response.rows[0]
    const token = jwt.sign({ id: user.id, email: user.email}, "jwt-secret", {expiresIn: "1h"});

    res.status(201).json({message: "user registered", token, user});
    // Here i should login and authenticate the new user
    
  } catch (error) {
    console.error("Error fetching data ////register////", error);
    res.status(500).json({message: `Error: ${error.message}`});
  }
});

// API Login user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE "email" = $1', [email.toLowerCase()]);
    if (result.rows.length === 0) {
      res.status(404).json({message: "User not found"});
    }
      
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({message: "Invalid password."});
    }

    const token = jwt.sign({ id: user.id, email: user.email }, "jwt-secret", { expiresIn: "1h" });
    res.json({message: "Login successful", token, user: user});
    
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).json({message: `Error: ${error.message}`});
  }
});


// API FETCH notes FROM db
app.get("/", authenticateToken ,async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM notes WHERE user_id = $1", [req.user.id]);
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

// API GETUSER
app.get('/user', authenticateToken, async(req, res) => {
  try {
    if (req.user) {
      const result = await db.query("SELECT * FROM users WHERE id = $1", [req.user.id]);
      const user = result.rows[0]
      return res.status(200).json(user);
    }
    return res.status(404).json({message:"Not logged in"});
  } catch (error) {
    console.error("Error fetching user", error);
    res.status(500).send("Error fetching user");
  }
});

// API INSERT notes INTO db
app.post("/add", authenticateToken, async (req, res) => {
    const { note } = req.body
    try {
      if (note.title != "" && note.content != ""){
        const result = await db.query("INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING *", [note.title, note.content, req.user.id]);
        res.status(200).json(result.rows[0]);
      }
    } catch (error) {
        console.error("Error adding note ", error);
        res.status(500).send("Error adding note");
    }
});

// API DELETE notes FROM db
app.post("/delete", authenticateToken, async (req, res) => {
  const { id } = req.body;
  try {
    const result = await db.query("DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *", [id, req.user.id]);
    res.status(200).json(result.rows[0]);
  } catch (error){
    console.error("Error deleting note ", error);
    res.status(500).send("Error deleting note");
  }
})

app.listen(port, () => 
  console.log(`Server running on port: ${port}, http://localhost:${port}`)
);
