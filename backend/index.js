import express from 'express';
import dotenv from 'dotenv';
const app = express();
const port = 4000;

import {connectDB} from "./config/db.js";

dotenv.config();
app.use(express.json());

// Import routes
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");

// Setup all the routes
app.use("/api/login", loginRouter);
app.use("/api/register", registerRouter);



app.listen(port, () => {
  connectDB();
  console.log(`Server running on http://localhost:${port}`);
});

// BKGVK2jsHYsaPHJ9
// martin_synak
// mongodb+srv://martin_synak:BKGVK2jsHYsaPHJ9@cluster0.kyph2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0