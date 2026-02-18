import { useEffect, useState, type FormEvent } from 'react';
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
  // --- CORE STATE MANAGEMENT ---
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [newJoke, setNewJoke] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('/avatars/meme1.jpg');
  const [gumballJoke, setGumballJoke] = useState<{ content: string } | null>(null);
  
  // --- UI STATE MANAGEMENT ---
  const [isSpinning, setIsSpinning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const memeAvatars = [
    '/avatars/meme1.jpg',
    '/avatars/meme2.jpg',
    '/avatars/meme3.jpg',
    '/avatars/meme4.jpg'
  ];

  // --- AUDIO FEEDBACK SYSTEM ---
  const playSfx = (path: string) => {
    try {
      const audio = new Audio(path);
      audio.volume = 0.25;
      audio.play();
    } catch (e) {
      console.warn("SFX failed to play - user interaction required first.");
    }
  };

  // --- API CALLS ---
  const loadJokes = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/jokes');
      if (!res.ok) throw new Error("Server communication failure.");
      const data = await res.json();
      setJokes(data);
    } catch (e) {
      setErrorMessage("Failed to load jokes. Is the server running?");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJokes();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newJoke.trim() || isSubmitting) return;

    setIsSubmitting(true);
    playSfx('/sounds/submit.mp3');

    try {
      const response = await fetch('/api/jokes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newJoke,
          author_name: authorName || 'Anonymous Lodi',
          avatar_url: selectedAvatar
        })
      });

      if (response.ok) {
        setNewJoke('');
        setAuthorName('');
        await loadJokes();
      } else {
        throw new Error("Post failed");
      }
    } catch (err) {
      setErrorMessage("Failed to post your hirit. Try again!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (jokeId: string) => {
    playSfx('/sounds/pop.mp3');
    try {
      await fetch('/api/jokes/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jokeId })
      });
      loadJokes();
    } catch (e) {
      console.error("Like interaction failed.");
    }
  };

  const handleGumball = async () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setGumballJoke(null);
    playSfx('/sounds/gumball.mp3');

    // Simulate mechanical delay
    setTimeout(async () => {
      try {
        const res = await fetch('/api/jokes/random-pinoy');
        const data = await res.json();
        setGumballJoke(data);
      } catch (e) {
        setGumballJoke({ content: "NAG-HANG ANG MACHINE! Sipain mo lodi." });
      } finally {
        setIsSpinning(false);
      }
    }, 1500);
  };

  // --- RANKING LOGIC ---
  const topJokes = [...jokes]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);

  return (
    <div className="pixel-page-wrapper">
      <div className="pixel-container">
        
        {/* TOP HEADER: FORCED CENTER */}
        <header className="pixel-header-section">
          <h1 className="pixel-title-main">Joke-lah!</h1>
          <p className="pixel-subtitle-text">ANG WALL NG MGA GENG-GENG</p>
          <div className="pixel-divider-hr" />
        </header>

        {/* LEADERBOARD SECTION: CENTERED CONTENT */}
        <section className="leaderboard-outer">
          <h2 className="section-title-centered">🏆 YOUNG STUNNA LEADERBOARD 🏆</h2>
          <div className="leaderboard-inner-box">
            {topJokes.length > 0 ? topJokes.map((j, i) => (
              <div key={j.id} className="leaderboard-row-item">
                <span className="lodi-rank">#{i + 1} {j.author_name}</span>
                <span className="lodi-points">{j.likes} BENTA!</span>
              </div>
            )) : <p className="loading-mini">Wala pang lodi dito...</p>}
          </div>
        </section>

        {/* MAXIMIZED FORM SECTION: STRETCHES FULL WIDTH */}
        <section className="form-max-container">
          <div className="form-pixel-card">
            <form onSubmit={handleSubmit} className="form-flex-column">
              
              <div className="form-field-block">
                <label className="form-pixel-label">1. CHOOSE YOUR FIGHTER:</label>
                <div className="avatar-selection-grid">
                  {memeAvatars.map((img) => (
                    <div 
                      key={img} 
                      className={`avatar-pixel-frame ${selectedAvatar === img ? 'is-selected' : ''}`}
                      onClick={() => setSelectedAvatar(img)}
                    >
                      <img src={img} alt="meme" className="avatar-pixel-img" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-field-block">
                <label className="form-pixel-label">2. NAME:</label>
                <input 
                  className="pixel-input-field-full" 
                  value={authorName} 
                  onChange={(e) => setAuthorName(e.target.value)} 
                  placeholder="Bobbie Salazar..." 
                />
              </div>

              <div className="form-field-block">
                <label className="form-pixel-label">3. ANONG BAON MONG JOKE?</label>
                <textarea 
                  className="pixel-textarea-field-full" 
                  value={newJoke} 
                  onChange={(e) => setNewJoke(e.target.value)} 
                  placeholder="Yung benta sana please..." 
                />
              </div>

              <button 
                type="submit" 
                className="pixel-submit-btn-massive" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'POSTING...' : "I-POST NA 'YAN!"}
              </button>

              {errorMessage && <p className="error-pixel-msg">{errorMessage}</p>}
            </form>
          </div>
        </section>

        {/* GUMBALL MACHINE: CENTERED ANIMATED UNIT */}
        <section className="gumball-interactive-zone">
          <div className="floating-indicator-text">CLICK ME! 👇</div>
          <div 
            className={`gumball-machine-asset breathing-mode ${isSpinning ? 'shaking-mode' : ''}`} 
            onClick={handleGumball}
          >
            <div className="globe-glass-unit">
              <span className={`candy-sprite ${isSpinning ? 'fast-spin-mode' : ''}`}>🍬</span>
            </div>
            <div className="machine-base-unit">
              <div className="coin-slot-pixel-art" />
            </div>
          </div>

          {gumballJoke && (
            <div className="joke-bubble-popup-box">
              <p className="joke-popup-content">{gumballJoke.content}</p>
              <button className="bubble-close-pixel" onClick={() => setGumballJoke(null)}>X</button>
            </div>
          )}
        </section>

        {/* THE FEED: CENTERED HEADER, CARDS ALIGNED LEFT WITHIN CENTER */}
        <section className="jokes-feed-display">
          <h2 className="section-title-centered">-- MGA BAGONG HIRIT --</h2>
          
          <div className="feed-items-stack">
            {isLoading ? (
              <div className="pixel-loading-box">LOADING JOKES...</div>
            ) : jokes.length === 0 ? (
              <p className="pixel-empty-state">No jokes found. Be the first lodi!</p>
            ) : (
              jokes.map((j) => (
                <div className="joke-pixel-card-item" key={j.id}>
                  <div className="card-avatar-side">
                    <img 
                      src={j.avatar_url || '/avatars/meme1.jpg'} 
                      className="pixel-card-avatar-img" 
                      alt="avatar" 
                      onError={(e) => { (e.target as HTMLImageElement).src = '/avatars/meme1.jpg'; }}
                    />
                  </div>
                  <div className="card-content-side">
                    <p className="joke-text-content">{j.content}</p>
                    <div className="joke-card-footer-row">
                      <span className="joke-author-tag">LODI: {j.author_name}</span>
                      <button className="pixel-benta-btn" onClick={() => handleLike(j.id)}>
                        BENTA! ({j.likes})
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* FOOTER: CENTERED */}
        <footer className="pixel-page-footer">
          <div className="footer-hr-pixel" />
          <p className="footer-copyright-text">JOKE-LAH! // HAKDOG 2026 // ALL RIGHTS PRESERVED </p>
        </footer>

      </div>
    </div>
  );
}