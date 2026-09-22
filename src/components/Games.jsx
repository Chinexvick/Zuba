import React, { useEffect } from 'react'

export default function Games(){
  useEffect(()=>{
    document.body.classList.add('games-mode')
    return () => document.body.classList.remove('games-mode')
  }, [])

  return (
    <section className="comic-page reveal-up">
      <div className="comic-content">
        <h1 className="comic-title">ZUBA Games</h1>
        <p className="comic-lead">Playable experiences are coming — preview locked screens below.</p>

        <div className="comic-hero" aria-hidden="true" />

        <div className="comic-grid">
          {Array.from({length:5}, (_,i) => {
            const idx = i+1
            const src = `/assets/games/game${idx}.png`
            return (
              <div className="comic-card" key={src}>
                <div className="comic-thumb" aria-hidden="true">
                  <img src={src} alt={`Game ${idx}`} />
                  <div className="lock-overlay" aria-hidden="true">🔒</div>
                </div>

                <div className="coming-label">Locked</div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
