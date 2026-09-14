import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

const router = Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function publicUser(user) {
  return { id: user._id.toString(), name: user.name, email: user.email };
}

function setSessionCookie(response, userId) {
  const token = jwt.sign({ sub: userId.toString() }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
  response.cookie(env.cookieName, token, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: env.nodeEnv === 'production' ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

router.post('/register', async (request, response, next) => {
  try {
    const { name, email, password } = request.body;
    const normalizedEmail = email?.trim().toLowerCase();
    if (
      !name?.trim() ||
      !emailPattern.test(normalizedEmail || '') ||
      !password ||
      password.length < 8
    ) {
      return response
        .status(400)
        .json({
          error:
            'Name, valid email, and a password of at least 8 characters are required.',
        });
    }

    const existingUser = await User.findOne({ email: normalizedEmail }).lean();
    if (existingUser) {
      return response
        .status(409)
        .json({ error: 'An account with that email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });
    setSessionCookie(response, user._id);
    return response.status(201).json({ user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000)
      return response
        .status(409)
        .json({ error: 'An account with that email already exists.' });
    return next(error);
  }
});

router.post('/login', async (request, response, next) => {
  try {
    const normalizedEmail = request.body.email?.trim().toLowerCase();
    const { password } = request.body;
    if (!emailPattern.test(normalizedEmail || '') || !password) {
      return response
        .status(400)
        .json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: normalizedEmail }).select(
      '+passwordHash'
    );
    const validPassword =
      user && (await bcrypt.compare(password, user.passwordHash));
    if (!validPassword)
      return response
        .status(401)
        .json({ error: 'Email or password is incorrect.' });

    setSessionCookie(response, user._id);
    return response.json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

router.post('/logout', (request, response) => {
  response.clearCookie(env.cookieName, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: env.nodeEnv === 'production' ? 'strict' : 'lax',
    path: '/',
  });
  return response.status(204).send();
});

export default router;
