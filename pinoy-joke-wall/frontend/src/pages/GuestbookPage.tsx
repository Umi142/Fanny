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

  // Fetch jokes from backend
  useEffect(() => {
    fetch('/api/jokes')
      .then(res => res.json())
      .then(data => setJokes(data));
  }, []);

  // Submit new joke
  const handleSubmit = async () => {
    if (!newJoke.trim()) return;

    const audio = new Audio('/sounds/submit.mp3');
    audio.play();

    await fetch('/api/jokes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newJoke, author_name: 'Anonymous' })
    });

    setNewJoke('');
    const res = await fetch('/api/jokes');
    setJokes(await res.json());
  };

  // Like a joke
  const handleLike = async (jokeId: string) => {
    await fetch('/api/jokes/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jokeId })
    });

    const res = await fetch('/api/jokes');
    setJokes(await res.json());
  };

  // Gumball machine effect
  const handleGumball = async () => {
    const audio = new Audio('/sounds/gumball.mp3');
    audio.play();

    const res = await fetch('/api/pinoy_jokes/random');
    const randomJoke = await res.json();
    alert(`🎱 Gumball Joke: ${randomJoke.content}`);
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
        {jokes.map(j => (
          <div className="joke-card fade-in" key={j.id}>
            <p>{j.content}</p>
            <p><strong>{j.author_name}</strong></p>
            <button onClick={() => handleLike(j.id)}>🔥 {j.likes}</button>
            <small>{new Date(j.created_at).toLocaleString()}</small>
          </div>
        ))}
      </section>

      <section className="gumball-section">
        <button className="gumball-btn" onClick={handleGumball}>
          🎱 Turn the Gumball Machine
        </button>
      </section>

      <footer>
        <small>Made with ❤️ in Codespaces</small>
      </footer>
    </div>
  );
}
