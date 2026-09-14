import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { requireAuth } from './middleware/auth.js';
import authRouter from './routes/auth.js';

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());

app.get('/api/v1/health', (request, response) =>
  response.json({ status: 'ok' })
);
app.use('/api/v1/auth', authRouter);
app.get('/api/v1/auth/me', requireAuth, (request, response) =>
  response.json({
    user: {
      id: request.user._id.toString(),
      name: request.user.name,
      email: request.user.email,
    },
  })
);

app.use((error, request, response, next) => {
  if (response.headersSent) return next(error);
  console.error(error);
  return response
    .status(error.status || 500)
    .json({ error: 'Something went wrong on the server.' });
});
