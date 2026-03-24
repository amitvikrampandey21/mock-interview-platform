# Mock Interview Platform

This is a simple mock interview practice project. A user can create an account, fill interview details, generate questions, answer them in text or voice mode, and review feedback at the end.

Author: Amit Vikram Pandey - Full Stack Developer

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Express.js
- MongoDB

## Main Features

- Candidate account creation
- Interview form based on role, level, skills, focus areas, and projects
- Question generation based on the details entered by the user
- Text mode and voice mode for answers
- Interview feedback with score and summary
- Interview history

## Project Structure

- `apps/web` - frontend
- `apps/api` - backend
- `packages/types` - shared types

## How To Run

1. Install dependencies

```bash
npm install
```

2. Create env files

```bash
copy apps\api\.env.example apps\api\.env
copy apps\web\.env.example apps\web\.env.local
```

3. Add values in `apps/api/.env`

- `MONGODB_URI`
- `JWT_SECRET`

4. Start the project

```bash
npm run dev
```

5. Open in browser

```bash
http://localhost:3000
```

If port `3000` is busy, check the terminal and open the `Local:` URL shown there.

## Interview Flow

1. Create account
2. Fill interview details
3. Generate interview questions
4. Answer questions
5. Submit interview
6. Check feedback and score

## Notes

- This project is focused only on mock interview practice.
- It does not require OpenAI API.
- If MongoDB is not available, some flows can still work with fallback storage.
