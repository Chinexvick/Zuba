import React from 'react'

export default function Snow({ count = 18 }){
  const flakes = Array.from({ length: count })
  return (
    <div className="snow-wrapper" aria-hidden="true">
      {flakes.map((_, i) => {
        const style = {
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 8}s`,
          animationDuration: `${12 + Math.random() * 28}s`,
          opacity: 0.2 + Math.random() * 0.55,
          fontSize: `${6 + Math.random() * 12}px`,
          transform: `translateZ(0)`
        }
        return <span key={i} className="snow-flake" style={style}>•</span>
      })}
    </div>
  )
} 