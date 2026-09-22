import React, { useState } from 'react'

const games = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  src: `/assets/games/game${i + 1}.png`,
  title: i === 0 ? 'ZUBA: Endless Run' : `ZUBA World ${i + 1}`
}))

export default function GamesShowcase({ onNavigate = () => {} }){
  const [active, setActive] = useState(0)
  const featured = games[active]

  return (
    <section className="games-showcase">
      <div className="games-showcase-inner">
        <div className="games-head reveal-up">
          <span className="eyebrow eyebrow-light">PLAYABLE ADVENTURES</span>
          <h2 className="games-title">ENTER THE GAMES</h2>
          <p className="games-lead">Fast, playful and rooted in the ZUBA universe. Full previews unlock soon.</p>
        </div>

        <div className="games-featured reveal-up">
          <div className="games-featured-media">
            <img src={featured.src} alt={featured.title} key={featured.src} />
            <div className="games-featured-scrim" />
            <div className="games-featured-lock">🔒 COMING SOON</div>
            <div className="games-featured-title">{featured.title}</div>
          </div>
        </div>

        <div className="games-rail" role="tablist" aria-label="Game previews">
          {games.map((g, i) => (
            <button
              key={g.id}
              className={`games-thumb ${i === active ? 'active' : ''}`}
              onClick={() => setActive(i)}
              aria-pressed={i === active}
            >
              <img src={g.src} alt={g.title} loading="lazy" />
            </button>
          ))}
        </div>

        <div className="games-showcase-cta">
          <button className="btn-cine btn-cine-ghost" onClick={() => onNavigate('games')}>SEE ALL GAMES</button>
        </div>
      </div>
    </section>
  )
}
