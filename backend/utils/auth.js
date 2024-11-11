import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { NotAuthError } from './errors.js';


export function createJSONToken(email) {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

export function validateJSONToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function isValidPassword(password, storedPassword) {
  return bcrypt.compare(password, storedPassword);
}

export function checkAuth(req, res, next) {
  if (req.method === 'OPTIONS') {
    return next();
  }
  if (!req.headers.authorization) {
    console.log('NOT AUTH. AUTH HEADER MISSING.');
    return next(new NotAuthError('Not authenticated.1'));
  }
  const authFragments = req.headers.authorization.split(' ');

  if (authFragments.length !== 2) {
    console.log('NOT AUTH. AUTH HEADER INVALID.');
    return next(new NotAuthError('Not authenticated.2'));
  }
  const authToken = authFragments[1];
  try {
    const validatedToken = validateJSONToken(authToken);
    req.token = validatedToken;
  } catch (error) {
    console.log('NOT AUTH. TOKEN INVALID.');
    return next(new NotAuthError('Not authenticated.3'));
  }
  next();
}
