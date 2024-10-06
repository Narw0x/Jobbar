import express from 'express';
import dotenv from 'dotenv';
const app = express();
const port = 4000;

import {connectDB} from "./config/db.js";
import User from './models/user.model.js';
import Company from './models/company.model.js';

dotenv.config();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
}); 

app.post('/api/register/user', (req, res) => {
  const user = req.body;

  
  const newUser = new User(user);



  try {
    newUser.save();
    res.status(201).send(newUser);
  }catch{
    res.status(500).send({message: 'Error in registering user.'});
  }
});




app.post('/api/register/company', (req, res) => {
  const company = req.body;
  const newCompany = new Company(company);

  try {
    newCompany.save();
    res.status(201).send(newCompany);
  }catch{
    res.status(500).send({message: 'Error in registering company.'});
  }
});




app.listen(port, () => {
  connectDB();
  console.log(`Server running on http://localhost:${port}`);

  
});

// BKGVK2jsHYsaPHJ9
// martin_synak
// mongodb+srv://martin_synak:BKGVK2jsHYsaPHJ9@cluster0.kyph2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0