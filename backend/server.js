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
  origin: '*', // Allow only your frontend origin https://jobbar.scriptbase.eu
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
import jobRoutes from './routes/job.js';
import adminRoutes from './routes/admin.js';
import reportRoutes from './routes/report.js';

app.setMaxListeners(30);

// Setup all the routes
app.use('/api', userRoutes);
app.use('/api', companyRoutes);
app.use('/api', profileRoutes);
app.use('/api', Autocomplete);
app.use('/api', jobRoutes);
app.use('/api', reportRoutes);
app.use('/api/admin', adminRoutes);


app.listen(port, () => {
  connectDB();
  console.log(`Server running on http://localhost:${port}`);
});
