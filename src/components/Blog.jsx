import React, { useEffect } from 'react'

export default function Blog({ onNavigate }){
  useEffect(() => {
    const b = document.body
    // enable blog mode and ensure other page modes are cleared
    b.classList.add('blog-mode')
    b.classList.remove('wallpaper-mode', 'mesh-mode', 'comic-mode', 'games-mode', 'about-mode')
    return () => { b.classList.remove('blog-mode') }
  }, [])

  return (
        <section className="blog-section">

      <div className="blog-hero">
        <h1 className="blog-hero-title">ZUBA Blog</h1>
      </div>

      <div className="blog-inner">
        <article className="blog-card">
          <div className="blog-img">
            <img src="/assets/blog1.png" alt="Zuba logo" />
          </div>

          <div className="blog-content">
            <div className="blog-meta">
              <span className="blog-date">Feb 2, 2026</span>
              <span className="blog-tag">General</span>
            </div>

            <h2 className="blog-title">Why Africa Needs Its Own Games — And How ZUBA Is Leading the Charge</h2>

            <p className="blog-excerpt">In recent years the global gaming industry has exploded into a multi-billion-dollar cultural force — shaping stories, identities, art, technology, and how people see themselves in virtual worlds. Yet for all its growth, one glaring imbalance remains: African cultures, stories and creators are vastly under-represented in mainstream games. This isn’t just a missed business opportunity — it’s a missed moment for representation, creativity, and cultural empowerment.</p>

            <div className="blog-author">
              <img className="author-avatar" src="/assets/logo.png" alt="Chinedu Victory avatar" />
              <div className="author-info">
                <div className="author-name">Chinedu Victory</div>
                <div className="author-time">3 min read</div>
              </div>
              <button className="read-link" onClick={() => onNavigate && onNavigate('post')} >Read Article</button>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}