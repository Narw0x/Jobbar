import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Blacklist from '../models/blackList.model.js';

import { NotAuthError } from './errors.js';

export function createJSONToken(email) {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });
}

export function validateJSONToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function isValidPassword(password, storedPassword) {
  return bcrypt.compare(password, storedPassword);
}


export async function checkAuth(req, res, next) {
  if (req.method === 'OPTIONS') {
    return next();
  }

  if (!req.headers.authorization) {
    console.log('NOT AUTH. AUTH HEADER MISSING.');
    console.log(req.headers);
    return next(new NotAuthError('Not authenticated.1'));
  }

  const authFragments = req.headers.authorization.split(' ');

  if (authFragments.length !== 2) {
    console.log('NOT AUTH. AUTH HEADER INVALID.');
    return next(new NotAuthError('Not authenticated.2'));
  }

  const authToken = authFragments[1];

  // Check if the token is blacklisted
  try {
    const isBlacklisted = await Blacklist.findOne({ token: authToken });
    if (isBlacklisted) {
      console.log('NOT AUTH. TOKEN IS BLACKLISTED.');
      return next(new NotAuthError('Not authenticated. Blacklisted token.'));
    }
  } catch (err) {
    console.error('Error checking blacklist:', err);
    return next(new Error('Server error while validating token.'));
  }

  // Validate the token
  try {
    const validatedToken = validateJSONToken(authToken); // Assuming this function verifies the JWT
    req.token = validatedToken; // Attach the validated token to the request object
  } catch (error) {
    console.log('NOT AUTH. TOKEN INVALID.');
    return next(new NotAuthError('Not authenticated.3'));
  }

  next();
}

