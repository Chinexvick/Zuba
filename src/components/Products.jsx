import React, { useState, useRef, useEffect } from 'react'

const products = [
  {
    id: 'raba',
    title: 'Raba',
    logo: '/assets/partners/raba.png',
    caption: 'Built to bring crypto closer to everyday life, Raba is a crypto bill payment application that allows users to pay for daily utilities using cryptocurrency without converting to fiat.',
    details: "Our goal is simple: make spending crypto seamless, practical, and accessible. Raba is still in development, with a strong focus on real-world utility.",
    href: '#'
  },
  {
    id: 'zuba-game',
    title: 'ZUBA Game',
    logo: '/assets/logo.png',
    caption: 'Created for fun, speed, and adventure, ZUBA Game is an endless runner mobile game featuring ZUBA, the super dog.',
    details: 'The game blends playful storytelling with fast-paced gameplay, offering an engaging experience for casual and competitive players alike. ZUBA Game is currently in production.',
    href: '#'
  }
]

export default function Products(){
  const [index, setIndex] = useState(0)
  const touchStartX = useRef(null)
  const touchEndX = useRef(null)
  const containerRef = useRef(null)

  useEffect(()=>{
    // simple auto-advance loop (optional) - disabled by default
    return () => {}
  }, [])

  function goTo(i){
    const count = products.length
    setIndex((i + count) % count)
  }

  function onTouchStart(e){
    touchStartX.current = e.touches[0].clientX
  }
  function onTouchMove(e){
    touchEndX.current = e.touches[0].clientX
  }
  function onTouchEnd(){
    if(touchStartX.current == null || touchEndX.current == null) return
    const dx = touchStartX.current - touchEndX.current
    const threshold = 40
    if(dx > threshold) goTo(index+1)
    else if(dx < -threshold) goTo(index-1)
    touchStartX.current = null
    touchEndX.current = null
  }

  return (
    <section className="products-section reveal-up" aria-labelledby="products-title">
      <div className="products-inner">
        <h2 id="products-title" className="products-title">Products in Development</h2>

        <div className="products-carousel" ref={containerRef} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
          {products.map((p, i)=> (
            <article key={p.id} className={`product-card ${i===index? 'active':''}`} aria-hidden={i===index? 'false':'true'}>
              <div className="product-logo"><img src={p.logo} alt={`${p.title} logo`} /></div>
              <div className="product-body">
                <h3>{p.title}</h3>
                <p className="product-caption">{p.caption}</p>
                <p className="product-details">{p.details}</p>
                <a className="product-cta" href={p.href}>Visit {p.title}</a>
              </div>
            </article>
          ))}
        </div>

        <div className="products-dots" role="tablist" aria-label="Products navigation">
          {products.map((p,i)=> (
            <button key={p.id} className={`dot ${i===index? 'active':''}`} onClick={()=>goTo(i)} aria-label={`Show ${p.title}`} aria-pressed={i===index}></button>
          ))}
        </div>
      </div>
    </section>
  )
}