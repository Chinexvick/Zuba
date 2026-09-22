import React, { useEffect } from 'react'

export default function Comic(){
  useEffect(()=>{
    // Put the app into comic-mode so the background image covers the viewport
    document.body.classList.add('comic-mode')
    return () => document.body.classList.remove('comic-mode')
  }, [])

  return (
    <section className="comic-page reveal-up">
      <div className="comic-content">
        <h1 className="comic-title">ZUBA Comics</h1>
        <p className="comic-lead">Explore the Zuba comic series — artwork and panels.</p>

        <div className="comic-hero" aria-hidden="true" />

        <div className="comic-grid">
          {Array.from({length:6}, (_,i) => {
            const idx = i+1
            const src = `/assets/comic/comic${idx}.png`
            return (
              <div className="comic-card" key={src}>
                <div className="comic-thumb" aria-hidden="true">
                  <img src={src} alt={`Comic ${idx}`} />
                  <div className="lock-overlay" aria-hidden="true">🔒</div>
                </div>

                <div className="coming-label">Coming Soon</div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
