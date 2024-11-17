import express from 'express';
import User from '../models/user.model.js';

const router = express.Router();

import { validateJSONToken, isValidPassword } from '../utils/auth.js';

router.post('/user/profile', async (req, res) => {
    const {id}  = req.body;
    console.log(req.body);
    
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User profile', user});
    } catch (error) {
        res.status(500).send({ message: 'Error in fetching user profile.' });
    }  

});

router.put('/user/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { email, firstName, lastName, phoneNumber, password } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    if(!validateJSONToken(token)) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Check if password is provided and is valid
      const isMatch = await isValidPassword(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid password', user });
      
      // Update fields if provided
      if (email) user.email = email;
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (phoneNumber) user.phoneNumber = phoneNumber;

      // Save the updated user data
      await user.save();
      res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
      res.status(500).send({ message: 'Error in updating user.' });
    }
});

router.delete('/user/delete/:id', async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    if(!validateJSONToken(token)) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Check if password is provided and is valid
      const isMatch = await isValidPassword(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

      // Delete the user from the database
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).send({ message: 'Error in deleting user.' });
    }
});

export default router;