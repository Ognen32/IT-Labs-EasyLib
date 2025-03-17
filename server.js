import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js"
import errorMiddleware from "./middlewares/error.js"

import "dotenv/config"; 


const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', authRoutes);

app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});