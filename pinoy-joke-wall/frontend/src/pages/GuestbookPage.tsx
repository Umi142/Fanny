import { useEffect, useState } from 'react';
import './GuestbookPage.css';

interface Joke {
  id: string;
  content: string;
  author_name: string;
  likes: number;
  created_at: string;
}

export default function GuestbookPage() {
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [newJoke, setNewJoke] = useState('');
  const [gumballJoke, setGumballJoke] = useState<{ content: string } | null>(null);

  const loadJokes = async () => {
    try {
      const res = await fetch('/api/jokes');
      if (!res.ok) throw new Error(`Failed to fetch jokes: ${res.status}`);
      const data = await res.json();
      setJokes(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadJokes();
  }, []);

  const handleSubmit = async () => {
    if (!newJoke.trim()) return;

    const audio = new Audio('/sounds/submit.mp3');
    audio.play();

    try {
      await fetch('/api/jokes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newJoke, author_name: 'Anonymous' })
      });
      setNewJoke('');
      await loadJokes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (jokeId: string) => {
    try {
      await fetch('/api/jokes/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jokeId })
      });
      await loadJokes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleGumball = async () => {
    const audio = new Audio('/sounds/gumball.mp3');
    audio.play();

    try {
      const res = await fetch('/api/pinoy_jokes/random');
      if (!res.ok) throw new Error(`Failed to fetch gumball joke: ${res.status}`);
      const randomJoke = await res.json();
      setGumballJoke(randomJoke);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Pinoy Joke Wall</h1>
      </header>

      <section className="form-section">
        <input
          type="text"
          placeholder="Share your joke..."
          value={newJoke}
          onChange={(e) => setNewJoke(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit</button>
      </section>

      <section className="jokes-section">
        <h2>Latest Jokes</h2>
        {jokes.length === 0 ? (
          <p className="empty">No jokes yet. Be the first!</p>
        ) : (
          jokes.map(j => (
            <div className="joke-card fade-in" key={j.id}>
              <p className="joke-content">{j.content}</p>
              <p className="joke-author">— {j.author_name}</p>
              <button className="like-btn" onClick={() => handleLike(j.id)}>
                🔥 {j.likes}
              </button>
              <small>{new Date(j.created_at).toLocaleString()}</small>
            </div>
          ))
        )}
      </section>

      <section className="gumball-section">
        <button className="gumball-btn" onClick={handleGumball}>
          🎱 Turn the Gumball Machine
        </button>
        {gumballJoke && (
          <div className="joke-card bounce-in">
            <p className="joke-content">{gumballJoke.content}</p>
            <p className="joke-author">— Pinoy Joke</p>
          </div>
        )}
      </section>

      <footer>
        <small>Made with ❤️ in Codespaces</small>
      </footer>
    </div>
  );
}
