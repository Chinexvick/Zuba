import React from 'react'

const phrases = ['A CHARACTER', 'A WORLD', 'A STORY', 'A GAME', 'AN ANIMATION UNIVERSE', 'AFRICAN IMAGINATION']

export default function Banner(){
  return (
    <div className="zuba-banner reveal-up" aria-hidden>
      <div className="zuba-track">
        {phrases.map((t, i) => (
          <div key={i} className="zuba-item">{t} <span className="dot">✦</span></div>
        ))}
        {phrases.map((t, i) => (
          <div key={"dup-"+i} className="zuba-item">{t} <span className="dot">✦</span></div>
        ))}
      </div>
    </div>
  )
}
