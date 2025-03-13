import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";
import { connectDB } from "./database/dbConnect.js";
import authRoutes from "./routes/authRoutes.js";
import fileUpload from "express-fileupload";

const app = express();

dotenv.config({ path: './config/config.env' });

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);

app.use('/api/v1/user', authRoutes);

connectDB();

app.use(errorMiddleware);

export default app;