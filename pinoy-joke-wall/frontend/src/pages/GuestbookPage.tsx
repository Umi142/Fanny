import { useEffect, useState } from 'react';
import './GuestbookPage.css';

interface Joke {
  id: string;
  content: string;
  author_name: string;
  likes: number;
  avatar_url: string; // This now matches your new SQL column
  created_at: string;
}

export default function GuestbookPage() {
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [newJoke, setNewJoke] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('/avatars/meme1.jpg');
  const [gumballJoke, setGumballJoke] = useState<{ content: string } | null>(null);

  // Array matches your .jpg files in public/avatars/
  const memeAvatars = [
    '/avatars/meme1.jpg',
    '/avatars/meme2.jpg',
    '/avatars/meme3.jpg',
    '/avatars/meme4.jpg',
  ];

  // Helper for Sound Effects
  const playSfx = (path: string) => {
    const audio = new Audio(path);
    audio.play().catch(() => console.log("Audio playback interaction required"));
  };

  const loadJokes = async () => {
    try {
      const res = await fetch('/api/jokes');
      const data = await res.json();
      setJokes(data);
    } catch (e) {
      console.error("Error loading jokes from database");
    }
  };

  useEffect(() => {
    loadJokes();
  }, []);

  const handleSubmit = async () => {
    if (!newJoke.trim()) return;

    playSfx('/sounds/submit.mp3');

    await fetch('/api/jokes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: newJoke,
        author_name: authorName || 'Anonymous',
        avatar_url: selectedAvatar // Saves the path to your new SQL column
      })
    });

    setNewJoke('');
    setAuthorName('');
    loadJokes();
  };

  const handleLike = async (jokeId: string) => {
    playSfx('/sounds/pop.mp3');
    await fetch('/api/jokes/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jokeId })
    });
    loadJokes();
  };

  const handleGumball = async () => {
    playSfx('/sounds/gumball.mp3');
    const res = await fetch('/api/pinoy_jokes/random');
    const data = await res.json();
    setGumballJoke(data);
  };

  // Logic for Top 3 Leaderboard
  const topJokes = [...jokes].sort((a, b) => b.likes - a.likes).slice(0, 3);

  return (
    <div className="pixel-container">
      <header>
        <h1 className="pixel-title">Joke-lah!</h1>
        <p className="pixel-subtitle">ANG WALL NG MGA PETMALU</p>
      </header>

      {/* 🏆 HALL OF FAME (LEADERBOARD) */}
      <section className="leaderboard-section">
        <h2 style={{ fontSize: '0.6rem', color: '#ffeb3b', marginBottom: '15px' }}>🏆 TOP LODI LIST 🏆</h2>
        <div className="top-lodi-list">
          {topJokes.length > 0 ? topJokes.map((j, i) => (
            <div key={j.id}>#{i + 1} {j.author_name} — {j.likes} BENTA!</div>
          )) : <div>WAITING FOR LODIS...</div>}
        </div>
      </section>

      {/* 📝 POSTING FORM */}
      <section className="form-section">
        <div className="input-group">
          <label style={{ fontSize: '0.5rem', textAlign: 'left' }}>PILI KA MEME AVATAR:</label>
          <div className="avatar-row">
            {memeAvatars.map(img => (
              <img 
                key={img} 
                src={img} 
                className={`avatar-option ${selectedAvatar === img ? 'selected' : ''}`}
                onClick={() => setSelectedAvatar(img)} 
                alt="meme selection"
              />
            ))}
          </div>
        </div>

        <div className="input-group">
          <input 
            className="pixel-input" 
            value={authorName} 
            onChange={(e) => setAuthorName(e.target.value)} 
            placeholder="PANGALAN MO..." 
          />
        </div>

        <div className="input-group">
          <textarea 
            className="pixel-textarea" 
            value={newJoke} 
            onChange={(e) => setNewJoke(e.target.value)} 
            placeholder="ANONG HIRIT MO?" 
          />
        </div>

        <button className="pixel-button" onClick={handleSubmit}>I-POST NA 'YAN!</button>
      </section>

      {/* 🍬 GUMBALL MACHINE */}
      <section className="gumball-section" style={{ marginBottom: '60px' }}>
        <p style={{ fontSize: '0.5rem', marginBottom: '15px', color: '#ff00ff' }}>RANDOM HIRIT MACHINE</p>
        <div className="gumball-machine" onClick={handleGumball}>
          <div className="glass">🍬</div>
          <div className="base"></div>
        </div>
        {gumballJoke && (
          <div className="joke-popup">
            <p style={{ fontSize: '0.75rem', color: '#000', lineHeight: '1.4' }}>{gumballJoke.content}</p>
            <button 
              className="pixel-button" 
              style={{ padding: '5px', fontSize: '0.4rem', marginTop: '10px' }} 
              onClick={() => setGumballJoke(null)}
            >
              CLOSE
            </button>
          </div>
        )}
      </section>

      {/* 📜 THE FEED (JOKE LIST) */}
      <section className="jokes-section">
        <h2 style={{ fontSize: '0.7rem', color: '#ffeb3b', marginBottom: '20px' }}>- MGA BAGONG HIRIT -</h2>
        {jokes.length === 0 ? (
          <p style={{ fontSize: '0.5rem' }}>WALA PANG HIRIT. IKAW NA MAUNA!</p>
        ) : (
          jokes.map(j => (
            <div className="pixel-card" key={j.id}>
              <img 
                src={j.avatar_url || '/avatars/meme1.jpg'} 
                className="card-avatar" 
                alt="avatar" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/avatars/meme1.jpg';
                }}
              />
              <div style={{ flex: 1 }}>
                <p className="joke-content">{j.content}</p>
                <div className="card-footer">
                  <span style={{ fontSize: '0.5rem', color: '#ff9800' }}>BY: {j.author_name}</span>
                  <button className="pixel-like" onClick={() => handleLike(j.id)}>
                    BENTA! ({j.likes})
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      <footer style={{ marginTop: '40px' }}>
        <small style={{ fontSize: '0.4rem', color: '#444' }}>MADE WITH ❤️ IN CODESPACES</small>
      </footer>
    </div>
  );
}