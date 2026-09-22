import React, { useEffect } from 'react'

export default function Mesh(){
  useEffect(()=>{
    // Put the app into mesh-mode so the background image covers the viewport
    document.body.classList.add('mesh-mode')
    return () => document.body.classList.remove('mesh-mode')
  }, [])

  return (
    <section className="mesh-page reveal-up">
      <div className="mesh-content">
        <h1 className="mesh-title">ZUBA Mesh Ecosystem</h1>
        <p className="mesh-lead">Discover mesh-ready collectibles and the Zuba ecosystem.</p>

        <div className="mesh-grid">
          {Array.from({length:6}, (_,i) => {
            const idx = i+1
            const src = `/assets/meshs/mesh${idx}.png`
            return (
              <div className="mesh-card" key={src}>
                <button className="mesh-thumb" aria-label={`Preview mesh ${idx}`}>
                  <img src={src} alt={`Mesh ${idx}`} />
                </button>

                <div className="coming-label">Coming Soon</div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
