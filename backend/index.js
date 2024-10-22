import express from 'express';
import dotenv from 'dotenv';
const app = express();
const port = 4000;

import {connectDB} from "./config/db.js";

dotenv.config();
app.use(express.json());

// Import routes
import loginRouter from './routes/login.js';
import registerRouter from './routes/register.js';
import editRouter from './routes/edit.js';
import deleteRouter from './routes/delete.js';


// Setup all the routes
app.use("/api/login", loginRouter);
app.use("/api/register", registerRouter);
app.use("/api/edit", editRouter);
app.use("/api/delete", deleteRouter);




app.listen(port, () => {
  connectDB();
  console.log(`Server running on http://localhost:${port}`);
});

// BKGVK2jsHYsaPHJ9
// martin_synak
// mongodb+srv://martin_synak:BKGVK2jsHYsaPHJ9@cluster0.kyph2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0