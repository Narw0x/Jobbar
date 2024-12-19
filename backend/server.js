import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
const app = express();
const port = 4000;

import {connectDB} from "./config/db.js";

dotenv.config();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', // Allow only your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true // Include cookies if needed
}));

const __dirname = path.resolve();
app.use('/public', express.static(path.join(__dirname, 'public')));

// Import routes
import userRoutes from "./routes/user.js";
import companyRoutes from "./routes/company.js";
import profileRoutes from "./routes/profile.js";
import Autocomplete from './routes/autocomplete.js';

app.setMaxListeners(20);

// Setup all the routes
app.use('/api', userRoutes);
app.use('/api', companyRoutes);
app.use('/api', profileRoutes);
app.use('/api', Autocomplete);





app.listen(port, () => {
  connectDB();
  console.log(`Server running on http://localhost:${port}`);
});

// BKGVK2jsHYsaPHJ9
// martin_synak
// mongodb+srv://martin_synak:BKGVK2jsHYsaPHJ9@cluster0.kyph2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0