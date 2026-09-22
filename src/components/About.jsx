import React, { useEffect } from 'react'

export default function About(){
  useEffect(()=>{
    document.body.classList.add('about-mode')
    return () => document.body.classList.remove('about-mode')
  }, [])

  return (
    <>
      <section className="wallpaper-page about-page">
        <div className="about-hero">
          <h1 className="about-hero-title fade-slide-up">Who We Are</h1>
        </div>
      </section>

      <section className="about-section" aria-labelledby="about-zuba">
        <div className="about-inner fade-slide-up">
          <div className="about-image">
            <img src="/assets/partners/hero.png" alt="Zuba creative team" />
          </div>

          <div className="about-card reveal-up delay-1">
            <h2 id="about-zuba">About ZUBA</h2>
            <div className="about-copy">
              <p>ZUBA was created from the heart of African imagination — a place where stories are not just told, but felt, seen, and played.</p>
              <p>We grew up consuming games, cartoons, and animated legends that never looked like us… never sounded like us… never carried our worlds. But Africa has always been full of heroes, monsters, gods, warriors, spirits, and stories powerful enough to shake the world.</p>
              <p>So we built ZUBA — a gaming and animation-powered universe where African culture meets futuristic technology. We craft playable worlds, cinematic characters, battle-driven storylines, and animated universes inspired by real myths, real cities, real history, and raw African creativity.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mission-vision-section" aria-labelledby="mission-vision">
        <div className="mission-vision-inner">
          <div className="mv-column reveal-up">
            <h2 id="mission-vision">Our Mission</h2>
            <p>To build world-class African-inspired games and animated universes that inspire, entertain, and give creatives and players real ownership in the worlds they help grow.</p>
          </div>

          <div className="mv-column reveal-up delay-1">
            <h2 className="vis-title">Our Vision</h2>
            <p>To become the leading blockchain-powered gaming and animation studio emerging from Africa, creating global franchises that stand alongside the biggest names in entertainment.</p>
          </div>
        </div>
      </section>

      <section className="building-section" aria-labelledby="what-building">
        <div className="building-inner">
          <h2 id="what-building" className="building-title">What We Are Building</h2>

          <div className="build-grid">
            <div className="build-card reveal-up"><h3>Story driven games</h3></div>
            <div className="build-card reveal-up delay-1"><h3>Action packed battle mechanics</h3></div>
            <div className="build-card reveal-up"><h3>Animated films and episodic series</h3></div>
            <div className="build-card reveal-up delay-1"><h3>African-inspired characters and creatures</h3></div>
            <div className="build-card reveal-up"><h3>Digital worlds and metaverse-style environments</h3></div>
            <div className="build-card reveal-up delay-1"><h3>Community-driven creative studios</h3></div>
          </div>
        </div>
      </section>

      <section className="dna-section" aria-labelledby="our-dna">
        <div className="dna-inner">
          <h2 id="our-dna" className="dna-title">Our DNA</h2>

          <div className="dna-grid">
            <div className="dna-card reveal-up"><span className="icon">🎮</span><p>Built for gamers</p></div>
            <div className="dna-card reveal-up delay-1"><span className="icon">🎬</span><p>Designed for storytelling</p></div>
            <div className="dna-card reveal-up"><span className="icon">🌍</span><p>Rooted in African imagination</p></div>
            <div className="dna-card reveal-up delay-1"><span className="icon">⚙️</span><p>Powered by blockchain technology</p></div>
            <div className="dna-card reveal-up"><span className="icon">🔥</span><p>Driven by community</p></div>
          </div>
        </div>
      </section>

      <section className="why-section" aria-labelledby="why-zuba">
        <div className="why-inner">
          <h2 id="why-zuba" className="why-title reveal-up">Why ZUBA Exists</h2>

          <div className="why-copy">
            <p>Because African stories deserve global screens.</p>
            <p>Because African heroes deserve global gameplay.</p>
            <p>Because African imagination deserves powerful engines.</p>
          </div>
        </div>
      </section>

      <section className="welcome-section" aria-labelledby="welcome-zuba">
        <div className="welcome-inner">
          <h2 id="welcome-zuba" className="welcome-title reveal-up">Welcome to the ZUBA Universe</h2>

          <div className="welcome-copy">
            <p>Not a meme.</p>
            <p>Not a pump.</p>
            <p>Not a trend.</p>
            <p>A world</p>
            <p>A story.</p>
          </div>
        </div>
      </section>
    </>
  )
}