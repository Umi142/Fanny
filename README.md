# 🎭 Pinoy Joke Wall
A full-stack, interactive platform for sharing Filipino humor. Users can post jokes with meme avatars, "Benta" (like) their favorites, and use a Gumball Machine to fetch random classic jokes.

---

## 🌐 Live Links
- **Frontend UI:** [https://fanny-psi.vercel.app/](https://fanny-psi.vercel.app/)(https://fanny-psi.vercel.app?_vercel_share=dSKdIo4NeCY5hXcDosETNEJWagDF5HKX)

---

## ✨ Features
- **Community Wall:** Real-time-ish feed of user-submitted jokes.
- **"Benta!" (Like) System:** Persistent upvoting via Supabase RPC.
- **The Gumball Machine:** A randomizer that pulls jokes from a curated table.
- **Meme Avatars:** Choose from iconic Filipino memes (e.g., meme1.jpg, meme2.jpg) when posting.
- **Admin Archiving:** Easily hide "test" or inappropriate posts via the Supabase Dashboard without deleting data.

---

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Framer Motion
- **Backend:** NestJS (Deployed as a Vercel Serverless Function)
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel

---

## 📦 Database Documentation

### 1. Schema: `jokes` Table
This table stores all user submissions.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid | Primary Key (Default: uuid_generate_v4()) |
| `content` | text | The text of the joke |
| `author_name`| text | Name of the user posting |
| `avatar_url` | text | Path to the meme image (e.g., /meme1.jpg) |
| `likes` | int8 | Number of "Benta" clicks (Default: 0) |
| `is_archived`| boolean| Whether the joke is hidden (Default: false) |
| `created_at` | timestamptz| Timestamp of submission |

### 2. SQL Functions (RPC)
Run these in your Supabase SQL Editor to enable core logic:

**A. Increment Likes**
```sql
CREATE OR REPLACE FUNCTION increment_likes(joke_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE jokes
  SET likes = likes + 1
  WHERE id = joke_id;
END;
$$ LANGUAGE plpgsql;

⚙️ Environment Variables
Add these to your Vercel Project Settings or local .env files:
Variable Name,Required For
SUPABASE_URL,Backend (NestJS)
SUPABASE_KEY,Backend (NestJS)
VITE_SUPABASE_URL,Frontend (Vite)
VITE_SUPABASE_ANON_KEY,Frontend (Vite)

📡 API Endpoints
Jokes
GET /api/jokes - Returns all non-archived jokes ordered by newest.
POST /api/jokes - Create a new joke. (Body: { content, author_name, avatar_url })
POST /api/jokes/like - Increments like count. (Body: { id })
GET /api/jokes/random-pinoy - Returns one random joke for the Gumball machine.

