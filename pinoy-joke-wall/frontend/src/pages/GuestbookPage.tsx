import { useEffect, useState } from 'react';

interface Joke {
  id: string;
  content: string;
  author_name: string;
  likes: number;
  created_at: string;
}

export default function GuestbookPage() {
  const [jokes, setJokes] = useState<Joke[]>([]);

  useEffect(() => {
    fetch('/api/jokes')
      .then(res => res.json())
      .then(data => setJokes(data));
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Pinoy Joke Wall</h1>
      {jokes.map(j => (
        <div key={j.id} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc' }}>
          <p><strong>{j.author_name}</strong>: {j.content}</p>
          <p>🔥 {j.likes} likes</p>
          <small>{new Date(j.created_at).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}
