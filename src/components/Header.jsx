import React, { useState, useEffect, useRef } from 'react'

export default function Header({ onNavigate = () => {} }) {
  const [open, setOpen] = useState(false)
  const firstLinkRef = useRef(null)

  function handleNavigate(to){
    setOpen(false)
    onNavigate && onNavigate(to)
  }

  useEffect(() => {
    if (open) {
      document.body.classList.add('mobile-menu-open')
      // Set focus into the drawer for keyboard users
      setTimeout(() => firstLinkRef.current?.focus(), 80)

      // ensure menu items are visible immediately (fallback in case observer is delayed)
      setTimeout(() => {
        const items = Array.from(document.querySelectorAll('.mobile-drawer .menu-item'))
        items.forEach((it) => it.classList.add('in-view'))
      }, 120)
    } else {
      document.body.classList.remove('mobile-menu-open')
      // remove any in-view classes from menu items when closing so animations can replay next open
      const items = Array.from(document.querySelectorAll('.mobile-drawer .menu-item'))
      items.forEach((it) => it.classList.remove('in-view'))
    }

    return () => { document.body.classList.remove('mobile-menu-open') }
  }, [open])

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand">
          <img src="/assets/logo.png" alt="Zuba logo" className="logo" />
          <span className="brand-name">Zuba</span>
        </div>

        <nav className="nav">
          <a onClick={() => handleNavigate('home')} role="button" tabIndex={0}>Home</a>
          <a onClick={() => handleNavigate('games')} role="button" tabIndex={0}>Games</a>
          <a onClick={() => handleNavigate('comics')} role="button" tabIndex={0}>Animation</a>
          <a onClick={() => handleNavigate('mesh')} role="button" tabIndex={0}>Mesh</a>
          <a onClick={() => handleNavigate('wallpapers')} role="button" tabIndex={0}>Wallpapers</a>
          <a onClick={() => handleNavigate('about')} role="button" tabIndex={0}>About</a>
          <a onClick={() => handleNavigate('blog')} role="button" tabIndex={0}>Blog</a>
          <a className="nav-token" href="https://dexscreener.com/bsc/0xdcc6c7cb227dc0d3544717902dcd92e4bac15a7e" target="_blank" rel="noopener noreferrer">$ZUBA</a>
        </nav>

         <button type="button" className="join-btn menu-join-btn" onClick={() => { setOpen(false); window.open('https://t.me/zubacommunitychat', '_blank') }}>JOIN COMMUNITY</button>

        <button
          className={`hamburger ${open ? 'is-open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          <span className="line" />
          <span className="line" />
          <span className="line" />
        </button>
      </div>

      {open && (
        <div className="mobile-overlay" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <aside className="mobile-drawer animate" role="menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-brand" style={{display:'flex',alignItems:'center',gap:12}}>
              <img src="/assets/logo.png" alt="Zuba" className="logo" />
              <span className="brand-name">Zuba</span>
            </div>
            <button className="mobile-close" aria-label="Close menu" onClick={() => setOpen(false)}>×</button>

            <nav className="mobile-links" onClick={(e) => e.stopPropagation()}>
              <div className="menu-box">
                <button type="button" className="mobile-link menu-item" ref={firstLinkRef} onClick={() => handleNavigate('home')}>Home</button>
                <button type="button" className="mobile-link menu-item" onClick={() => handleNavigate('games')}>Games</button>
                <button type="button" className="mobile-link menu-item" onClick={() => handleNavigate('comics')}>Animation</button>
                <button type="button" className="mobile-link menu-item" onClick={() => handleNavigate('mesh')}>Mesh</button>
                <button type="button" className="mobile-link menu-item" onClick={() => handleNavigate('wallpapers')}>Wallpapers</button>
                <button type="button" className="mobile-link menu-item" onClick={() => handleNavigate('about')}>About</button>
                <button type="button" className="mobile-link menu-item" onClick={() => handleNavigate('blog')}>Blog</button>
                <a className="menu-item" href="https://dexscreener.com/bsc/0xdcc6c7cb227dc0d3544717902dcd92e4bac15a7e" target="_blank" rel="noopener noreferrer">$ZUBA Chart</a>

                {/* Prominent in-menu Join CTA so it is always visible */}
                <div className="menu-join">
                  <button type="button" className="join-btn menu-join-btn" onClick={() => { setOpen(false); window.open('https://t.me/zubacommunitychat', '_blank') }}>JOIN COMMUNITY</button>
                </div>
              </div>
            </nav>

            <div className="mobile-cta">
              <button className="join-btn" onClick={() => { setOpen(false); window.open('https://t.me/zubacommunitychat', '_blank') }}>JOIN COMMUNITY</button>
            </div>
          </aside>
        </div>
      )}
    </header>
  )
}
