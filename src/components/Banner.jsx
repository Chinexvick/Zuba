import React from 'react'

export default function Banner(){
  const items = new Array(12).fill('ZUBA #')
  return (
    <div className="zuba-banner reveal-up" aria-hidden>
      <div className="zuba-track">
        {items.map((t, i) => (
          <div key={i} className="zuba-item">{t}</div>
        ))}
        {items.map((t, i) => (
          <div key={"dup-"+i} className="zuba-item">{t}</div>
        ))}
      </div>
    </div>
  )
}
