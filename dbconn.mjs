import { createPool } from 'mariadb';
import dotenv from "dotenv";
dotenv.config();

export default createPool({
    socketPath: process.env.SOCKETPATH,
    user: process.env.DB_USER,
    database: process.env.DATABASE,
    password: process.env.DB_PASSWORD,
    connectionLimit: 5
});

