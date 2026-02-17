import { useEffect, useState } from 'react';
import './GuestbookPage.css';

interface Joke {
  id: string;
  content: string;
  author_name: string;
  likes: number;
  avatar_url: string;
  created_at: string;
}

export default function GuestbookPage() {
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [newJoke, setNewJoke] = useState('');
  const [authorName, setAuthorName] = useState('');
  // Corrected to .jpg
  const [selectedAvatar, setSelectedAvatar] = useState('/avatars/meme1.jpg');
  const [gumballJoke, setGumballJoke] = useState<{ content: string } | null>(null);

  // Corrected to .jpg
  const memeAvatars = [
    '/avatars/meme1.jpg',
    '/avatars/meme2.jpg',
    '/avatars/meme3.jpg',
    '/avatars/meme4.jpg',
  ];

  const playSfx = (path: string) => {
    const audio = new Audio(path);
    audio.play().catch(() => console.log("Sound muted"));
  };

  const loadJokes = async () => {
    try {
      const res = await fetch('/api/jokes');
      const data = await res.json();
      setJokes(data);
    } catch (e) { console.error("Database error"); }
  };

  useEffect(() => { loadJokes(); }, []);

  const handleSubmit = async () => {
    if (!newJoke.trim()) return;
    playSfx('/sounds/submit.mp3');
    await fetch('/api/jokes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: newJoke,
        author_name: authorName || 'Anonymous',
        avatar_url: selectedAvatar
      })
    });
    setNewJoke(''); setAuthorName(''); loadJokes();
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

  const topJokes = [...jokes].sort((a, b) => b.likes - a.likes).slice(0, 3);

  return (
    <div className="pixel-container">
      <header>
        <h1 className="pixel-title">Joke-lah!</h1>
        <p className="pixel-subtitle">ANG WALL NG MGA PETMALU</p>
      </header>

      <section className="leaderboard-section">
        <h2 style={{fontSize: '0.6rem', color: '#ffeb3b', marginBottom: '15px'}}>🏆 TOP LODI LIST 🏆</h2>
        <div className="top-lodi-list">
          {topJokes.map((j, i) => (
            <div key={j.id}>#{i + 1} {j.author_name} — {j.likes} BENTA!</div>
          ))}
        </div>
      </section>

      <section className="form-section">
        <div className="input-group">
          <label style={{fontSize: '0.5rem', textAlign: 'left'}}>PILI KA MEME AVATAR:</label>
          <div className="avatar-row">
            {memeAvatars.map(img => (
              <img 
                key={img} src={img} 
                className={`avatar-option ${selectedAvatar === img ? 'selected' : ''}`}
                onClick={() => setSelectedAvatar(img)} 
                alt="meme"
              />
            ))}
          </div>
        </div>

        <div className="input-group">
          <input 
            className="pixel-input" value={authorName} 
            onChange={(e) => setAuthorName(e.target.value)} 
            placeholder="PANGALAN MO..." 
          />
        </div>

        <div className="input-group">
          <textarea 
            className="pixel-textarea" value={newJoke} 
            onChange={(e) => setNewJoke(e.target.value)} 
            placeholder="HIRIT MO..." 
          />
        </div>

        <button className="pixel-button" onClick={handleSubmit}>I-POST NA 'YAN!</button>
      </section>

      <section className="gumball-section" style={{marginBottom: '50px'}}>
        <div className="gumball-machine" onClick={handleGumball}>
          <div className="glass">🍬</div>
          <div className="base"></div>
        </div>
        {gumballJoke && (
          <div className="joke-popup">
            <p style={{fontSize: '0.75rem', color: '#000'}}>{gumballJoke.content}</p>
            <button className="pixel-button" style={{padding: '5px', fontSize: '0.4rem'}} onClick={() => setGumballJoke(null)}>CLOSE</button>
          </div>
        )}
      </section>

      <section className="jokes-section">
        <h2 style={{fontSize: '0.7rem', color: '#ffeb3b', marginBottom: '20px'}}>- MGA BAGONG HIRIT -</h2>
        {jokes.map(j => (
          <div className="pixel-card" key={j.id}>
            <img 
              src={j.avatar_url} 
              className="card-avatar" 
              alt="avatar" 
              /* This fix handles existing .png links in your DB */
              onError={(e) => { (e.target as HTMLImageElement).src = '/avatars/meme1.jpg'; }}
            />
            <div style={{flex: 1}}>
              <p className="joke-content">{j.content}</p>
              <div className="card-footer">
                <span style={{fontSize: '0.5rem', color: '#ff9800'}}>BY: {j.author_name}</span>
                <button className="pixel-like" onClick={() => handleLike(j.id)}>BENTA! ({j.likes})</button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}