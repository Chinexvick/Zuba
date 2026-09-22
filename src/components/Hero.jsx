import React from 'react'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="fade-slide-up">
          ZUBA
          <span className="break">Africa's Super Pup</span>
          <span className="break">of Creativity</span>
        </h1>

        <p className="lead fade-in">Meet $ZUBA — a fearless coin powered by community, built for the moon, and fueled by pure good vibes.</p>

        <div className="hero-actions fade-slide-up delay-1">
          <a className="btn btn-primary" href="https://pancakeswap.finance/swap?outputCurrency=0xE1bf97baCF682AE17cA3E239aB68a7b525f994A4" target="_blank" rel="noopener noreferrer">BUY ZUBA</a>
          <button className="btn btn-secondary">WHITEPAPER</button>
        </div>
      </div>
    </section>
  )
}
