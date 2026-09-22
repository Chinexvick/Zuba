import React from 'react'

export default function AnimationTeaser(){
  return (
    <section className="animation-teaser" id="animation">
      <div className="animation-bg" style={{ backgroundImage: "url('/assets/comic/comic2.png')" }} />
      <div className="animation-scrim" />

      <div className="animation-inner reveal-up">
        <span className="eyebrow eyebrow-light">ZUBA STUDIOS PRESENTS</span>
        <h2 className="animation-title">THE STORY IS<br />JUST BEGINNING.</h2>
        <p className="animation-lead">
          ZUBA is more than a game character — he carries a story, a mythology, and a growing animated universe.
          Comics, shorts and episodic adventures are already taking shape.
        </p>
        <div className="animation-cta">
          <span className="film-badge">COMICS</span>
          <span className="film-badge">SHORT FILMS</span>
          <span className="film-badge">EPISODIC SERIES</span>
        </div>
      </div>
    </section>
  )
}
