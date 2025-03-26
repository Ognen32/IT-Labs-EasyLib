import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from './routes/bookRoutes.js';
import { connectDB } from "./database/dbConnect.js";
import bodyParser from 'body-parser';

dotenv.config({ path: './config/config.env' });

const app = express();

app.use(cors()); // For cross origin requests
app.use(express.json()); // For parsing incoming json requests
app.use(cookieParser()); // For parsing cookies incoming json requests
app.use(express.urlencoded({ extended: true })); // For parsing url encoded data
app.use(bodyParser.urlencoded({ extended: false }))

// Defining routes and giving them a path to connect to the routes
app.use('/api/v1/user', authRoutes);
app.use('/api', bookRoutes);

app.use(errorMiddleware);

connectDB();

export default app;