import { useEffect, useState } from 'react';

export default function GuestbookPage() {
  const [jokes, setJokes] = useState([]);

  useEffect(() => {
    fetch('/api/jokes')
      .then(res => res.json())
      .then(data => setJokes(data));
  }, []);

  return (
    <div>
      <h1>Pinoy Joke Wall</h1>
      {jokes.map(j => (
        <div key={j.id}>
          <p>{j.content}</p>
          <p>🔥 {j.likes} likes</p>
        </div>
      ))}
    </div>
  );
}
