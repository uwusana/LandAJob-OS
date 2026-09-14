# Authentication Setup

Land a Job OS uses an Express API, MongoDB/Mongoose, bcrypt password hashing, and JWTs stored in HTTP-only cookies.

## Server

1. Copy `server/.env.example` to `server/.env`.
2. Set `MONGODB_URI` to the MongoDB database to use.
3. Set `JWT_SECRET` to a long random value. Never commit `server/.env`.
4. Start the API:

```powershell
cd server
npm install
npm run dev
```

The API runs on `http://localhost:4000` by default.

## Client

The client defaults to `/api/v1` and Vite proxies `/api` to `http://localhost:4000` during development. Copy `client/.env.example` to `client/.env` only when the API is hosted at a different base URL.

```powershell
cd client
npm install
npm run dev
```

## Session behavior

- Registration and login issue a JWT in an HTTP-only cookie.
- The JWT is never placed in localStorage or exposed to frontend JavaScript.
- `/api/v1/auth/me` validates the cookie and returns the public user fields.
- Protected React routes wait for session validation and redirect unauthenticated users to `/login`.
- Logout clears the cookie and returns the user to the unauthenticated state.
- Passwords are stored only as bcrypt hashes. The `passwordHash` field is excluded from normal user queries and never returned to the client.
