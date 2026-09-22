import React, { useEffect, useRef } from 'react'

export default function Hero() {
  const artRef = useRef(null)
  const bgRef = useRef(null)

  useEffect(() => {
    function onScroll(){
      const y = window.scrollY || 0
      if (artRef.current) artRef.current.style.transform = `translateY(${y * 0.08}px) scale(${1 + Math.min(y,600)/9000})`
      if (bgRef.current) bgRef.current.style.transform = `translateY(${y * 0.18}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="hero-cinematic">
      <div className="hero-bg" ref={bgRef} style={{ backgroundImage: "url('/assets/backgroug.png')" }} />
      <div className="hero-vignette" />
      <div className="hero-particles" aria-hidden="true">
        {Array.from({ length: 22 }).map((_, i) => (
          <span key={i} className="ember" style={{
            left: `${(i * 37) % 100}%`,
            animationDelay: `${(i % 10) * 0.7}s`,
            animationDuration: `${9 + (i % 6) * 2}s`
          }} />
        ))}
      </div>

      <div className="hero-cine-content">
        <div className="hero-kicker fade-in">TALES OF THE SUPER DOG</div>

        <h1 className="hero-cine-title fade-slide-up">
          ZUBA
        </h1>
        <div className="hero-cine-subtitle fade-slide-up delay-1">THE SUPER DOG</div>

        <p className="hero-cine-lead fade-in delay-1">
          A character. A world. A story. An African gaming &amp; animation universe —
          born from myth, built for a global stage.
        </p>

        <div className="hero-cine-actions fade-slide-up delay-2">
          <button className="btn-cine btn-cine-primary" onClick={() => document.getElementById('universe')?.scrollIntoView({ behavior: 'smooth' })}>
            EXPLORE THE UNIVERSE
          </button>
          <button className="btn-cine btn-cine-ghost" onClick={() => document.getElementById('animation')?.scrollIntoView({ behavior: 'smooth' })}>
            ▶ WATCH THE STORY
          </button>
          <a className="btn-cine btn-cine-token" href="https://pancakeswap.finance/swap?outputCurrency=0xE1bf97baCF682AE17cA3E239aB68a7b525f994A4" target="_blank" rel="noopener noreferrer">
            BUY $ZUBA
          </a>
        </div>
      </div>

      <div className="hero-cine-art" ref={artRef}>
        <img src="/assets/logo.png" alt="ZUBA the super dog" />
      </div>

      <button className="scroll-cue" aria-label="Scroll down" onClick={() => document.getElementById('universe')?.scrollIntoView({ behavior: 'smooth' })}>
        <span className="scroll-cue-line" />
        SCROLL
      </button>
    </section>
  )
}
