import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

export async function requireAuth(request, response, next) {
  try {
    const token = request.cookies[env.cookieName];
    if (!token) {
      return response.status(401).json({ error: 'Authentication required.' });
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub)
      .select('_id name email')
      .lean();
    if (!user) {
      return response
        .status(401)
        .json({ error: 'Session is no longer valid.' });
    }

    request.user = user;
    return next();
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      return response.status(401).json({ error: 'Authentication required.' });
    }
    return next(error);
  }
}
