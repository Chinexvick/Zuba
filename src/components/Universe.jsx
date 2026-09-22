import React from 'react'

const pillars = [
  {
    tag: '01',
    title: 'A CHARACTER',
    img: '/assets/logo.png',
    copy: 'ZUBA — the fearless super dog. A future franchise mascot with real presence, moving through worlds and adventures.'
  },
  {
    tag: '02',
    title: 'A WORLD',
    img: '/assets/partners/hero.png',
    copy: 'An African-inspired universe of myth, landscape and legend, reimagined through a modern cinematic lens.'
  },
  {
    tag: '03',
    title: 'A STORY',
    img: '/assets/blog1.png',
    copy: 'Every hero has an origin. ZUBA\'s journey is just beginning — told across games, comics and animation.'
  },
  {
    tag: '04',
    title: 'A GAME',
    img: '/assets/games/game1.png',
    copy: 'Playable adventures built for speed, skill and discovery, starring ZUBA and the creatures of his world.'
  },
  {
    tag: '05',
    title: 'AN ANIMATION UNIVERSE',
    img: '/assets/comic/comic1.png',
    copy: 'Beyond the game — an expanding universe of animated stories, characters and mythology.'
  }
]

export default function Universe(){
  return (
    <section className="universe-section" id="universe">
      <div className="universe-inner">
        <div className="universe-head reveal-up">
          <span className="eyebrow">WHO IS ZUBA?</span>
          <h2 className="universe-title">ONE HERO. FIVE WORLDS.</h2>
          <p className="universe-lead">ZUBA is not one thing — he is a whole universe, rooted in African imagination and built for a global audience.</p>
        </div>

        <div className="universe-grid">
          {pillars.map((p, i) => (
            <article className={`universe-card reveal-up ${i % 2 ? 'delay-1' : ''}`} key={p.tag}>
              <div className="universe-card-media">
                <img src={p.img} alt={p.title} loading="lazy" />
                <span className="universe-card-tag">{p.tag}</span>
              </div>
              <h3>{p.title}</h3>
              <p>{p.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
