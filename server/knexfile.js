import dotenv from 'dotenv';
dotenv.config();

export default {
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL, 
    ssl: { rejectUnauthorized: false }, // Ensures SSL works correctly
  },
  migrations: {
    directory: './migrations', // Ensure this points to the correct directory
  },
  seeds: {
    directory: './seeds', // Optional: if you have seed files
  },
};
