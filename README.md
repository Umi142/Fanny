# 🎭 Pinoy Joke Wall

A full-stack, interactive platform for sharing Filipino humor. Users can post jokes with meme avatars, "Benta" (like) their favorites, and use a Gumball Machine to fetch random classic jokes.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit-blue)](https://fanny-psi.vercel.app/)

---

## 📋 Table of Contents

- [🌐 Live Links](#-live-links)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📋 Prerequisites](#-prerequisites)
- [🚀 Installation](#-installation)
- [⚙️ Environment Setup](#️-environment-setup)
- [🏃‍♂️ Running Locally](#️-running-locally)
- [🏗️ Building for Production](#️-building-for-production)
- [🚀 Deployment](#-deployment)
- [📡 API Documentation](#-api-documentation)
- [📦 Database Documentation](#-database-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🌐 Live Links

- **Frontend UI:** [https://fanny-psi.vercel.app/](https://fanny-psi.vercel.app/)
- **Backend API:** Deployed as Vercel Serverless Functions

---

## ✨ Features

- **Community Wall:** Real-time-ish feed of user-submitted jokes.
- **"Benta!" (Like) System:** Persistent upvoting via Supabase RPC.
- **The Gumball Machine:** A randomizer that pulls jokes from a curated table.
- **Meme Avatars:** Choose from iconic Filipino memes (e.g., meme1.jpg, meme2.jpg) when posting.
- **Admin Archiving:** Easily hide "test" or inappropriate posts via the Supabase Dashboard without deleting data.
- **Responsive Design:** Works on desktop and mobile devices.
- **TypeScript:** Full type safety across frontend and backend.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** NestJS (Node.js), TypeScript
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel (Serverless Functions for backend, Static for frontend)
- **Version Control:** Git
- **Package Management:** npm

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- **Supabase Account** - [Sign up here](https://supabase.com/)

---

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Umi142/Fanny.git
   cd Fanny
   ```

2. **Navigate to the project directory:**
   ```bash
   cd pinoy-joke-wall
   ```

3. **Install dependencies for both frontend and backend:**
   ```bash
   npm run install-all
   ```

   This command will install dependencies for both the frontend and backend simultaneously.

---

## ⚙️ Environment Setup

### Supabase Setup

1. Create a new project on [Supabase](https://supabase.com/).
2. Go to your project's Settings > API to get your `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
3. In the SQL Editor, create the `jokes` table and the RPC function (see [Database Documentation](#-database-documentation)).

### Environment Variables

Create `.env` files in both `backend/` and `frontend/` directories.

**Backend (.env):**
```env
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_service_role_key_here
```

**Frontend (.env):**
```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

> **Note:** For local development, you can use the anon key for both frontend and backend. For production, use the service role key for backend operations that require elevated permissions.

---

## 🏃‍♂️ Running Locally

### Development Mode

To run both frontend and backend in development mode simultaneously:

```bash
npm run dev
```

This will start:
- Frontend on `http://localhost:5173` (Vite dev server)
- Backend on `http://localhost:3000` (NestJS dev server with hot reload)

### Individual Services

**Frontend only:**
```bash
cd frontend
npm run dev
```

**Backend only:**
```bash
cd backend
npm run start:dev
```

### Testing

**Backend tests:**
```bash
cd backend
npm run test
```

**Frontend linting:**
```bash
cd frontend
npm run lint
```

---

## 🏗️ Building for Production

### Build Both Services

```bash
npm run build
```

This will build both frontend and backend for production.

### Individual Builds

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
npm run build
```

---

## 🚀 Deployment

This project is configured for deployment on Vercel.

### Vercel Deployment

1. Connect your GitHub repository to Vercel.
2. Vercel will automatically detect the `vercel.json` configuration.
3. Set the environment variables in your Vercel project settings.
4. Deploy!

The `vercel.json` file configures:
- Backend as a serverless function
- Frontend as static files
- API routes under `/api/*`

### Manual Deployment

If deploying elsewhere:

1. Build the frontend and serve the `dist/` folder.
2. Deploy the backend as a Node.js application.
3. Ensure environment variables are set.
4. Configure your web server to proxy API calls to the backend.

---

## 📡 API Documentation

The backend provides the following REST endpoints:

### Jokes

- **GET** `/api/jokes`
  - Returns all non-archived jokes ordered by newest.
  - Response: Array of joke objects

- **POST** `/api/jokes`
  - Create a new joke.
  - Body: `{ content: string, author_name: string, avatar_url: string }`
  - Response: Created joke object

- **POST** `/api/jokes/like`
  - Increments like count for a joke.
  - Body: `{ id: string }`
  - Response: Success message

- **GET** `/api/jokes/random-pinoy`
  - Returns one random joke for the Gumball machine.
  - Response: Single joke object

### Error Responses

All endpoints return appropriate HTTP status codes and error messages in JSON format.

---

## 📦 Database Documentation

### Schema: `jokes` Table

| Column      | Type        | Description                          |
|-------------|-------------|--------------------------------------|
| `id`        | uuid       | Primary Key (Default: uuid_generate_v4()) |
| `content`   | text       | The text of the joke                 |
| `author_name`| text      | Name of the user posting             |
| `avatar_url`| text       | Path to the meme image (e.g., /meme1.jpg) |
| `likes`     | int8       | Number of "Benta" clicks (Default: 0) |
| `is_archived`| boolean   | Whether the joke is hidden (Default: false) |
| `created_at`| timestamptz| Timestamp of submission              |

### SQL Functions (RPC)

Run these in your Supabase SQL Editor to enable core logic:

**Increment Likes Function:**
```sql
CREATE OR REPLACE FUNCTION increment_likes(joke_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE jokes
  SET likes = likes + 1
  WHERE id = joke_id;
END;
$$ LANGUAGE plpgsql;
```

**Random Pinoy Joke Function:**
```sql
CREATE OR REPLACE FUNCTION get_random_pinoy_joke()
RETURNS TABLE(id uuid, content text, author_name text, avatar_url text, likes bigint, is_archived boolean, created_at timestamptz) AS $$
BEGIN
  RETURN QUERY
  SELECT j.id, j.content, j.author_name, j.avatar_url, j.likes, j.is_archived, j.created_at
  FROM jokes j
  WHERE j.is_archived = false
  ORDER BY RANDOM()
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Test your changes locally
- Ensure code passes linting
- Update documentation if needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Thanks to the Filipino community for the endless supply of humor!
- Built with ❤️ using modern web technologies

---

*Last updated: February 18, 2026*

