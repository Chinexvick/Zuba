import React from 'react'

export default function Footer({ onNavigate = () => {} }){
  return (
    <footer className="site-footer" id="site-footer">
      <div className="footer-top">
        <div className="footer-left">
          <img src="/assets/logo.png" alt="Zuba" className="footer-logo" />
        </div>

        <div className="footer-right">
          <nav className="footer-social">
            <a href="https://x.com/zubatoken?s=21" aria-label="X" className="social" target="_blank" rel="noopener noreferrer" title="X">
              {/* X brand mark */}
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" width="28" height="28"><path d="M3.5 2.5L12 11l8.5-8.5L22 4l-8.5 8.5L22 21l-1.5 1.5L12 13.5 2.5 22 1 20.5 9.5 12 1 3.5z"/></svg>
            </a>

            <a href="https://chat.whatsapp.com/CnHq8ujSJCVEpTtT5ih4cZ" aria-label="WhatsApp" className="social" target="_blank" rel="noopener noreferrer" title="WhatsApp">
              {/* WhatsApp brand mark */}
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" width="28" height="28"><path d="M12 2a10 10 0 0 0-8.66 14.07L2 22l5.18-1.47A10 10 0 1 0 12 2zm3.3 14.2c-.2.6-1.1 1.2-1.6 1.3-.4.1-1 .2-1.8.1-2.8-.4-5.1-3.3-5.3-3.5-.3-.4-1-1.1-1-1.9 0-.8.4-1.2.5-1.4.2-.2.5-.3.8-.2.2.1.6.2.9.4.3.1.7.1 1-.1.3-.1.6-.2.9-.3.3-.1.6.1.9.4.3.3 1 .9 1.8 1.6.7.6 1.3 1 1.6 1.2.3.2.5.2.8.1.3-.1 1-.4 1.5-.7.5-.3 1.1-.7 1.3-.9.2-.2.3-.3.5-.2.1.1.2.3.1.6z"/></svg>
            </a>

            <a href="https://t.me/zubacommunitychat" aria-label="Telegram" className="social" target="_blank" rel="noopener noreferrer" title="Telegram">
              {/* Telegram brand mark */}
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" width="28" height="28"><path d="M22.7 2.6L1.9 10.2c-.4.2-.4.4-.2.6l3.5 2 1.6 4.9c.2.6.8.8 1.3.5l2.6-1.9 3.9 2.9c.7.5 1.2.2 1.4-.6L24 4c.2-.9-.3-1.3-1.3-.8z"/></svg>
            </a>
          </nav>
        </div>
      </div>

      <div className="footer-middle">
        <div className="footer-brand">ZUBA</div>

        <div className="footer-links">
          <div className="links-col">
            <div className="links-title">Quick Link</div>
            <ul>
              <li><button type="button" className="footer-link" onClick={() => onNavigate('home')}>Home</button></li>
              <li><button type="button" className="footer-link" onClick={() => onNavigate('wallpapers')}>Wallpaper</button></li>
              <li><button type="button" className="footer-link" onClick={() => onNavigate('mesh')}>Mesh</button></li>
              <li><button type="button" className="footer-link" onClick={() => onNavigate('comics')}>Comics</button></li>
              <li><button type="button" className="footer-link" onClick={() => onNavigate('games')}>Games</button></li>
            </ul>
          </div>

          <div className="links-col">
            <div className="links-title">Resources</div>
            <ul>
              <li><a className="footer-link" href="/whitepaper.pdf" target="_blank" rel="noopener noreferrer">Whitepaper</a></li>
              <li><a className="footer-link" href="https://dexscreener.com/bsc/0xdcc6c7cb227dc0d3544717902dcd92e4bac15a7e" target="_blank" rel="noopener noreferrer">Chart</a></li>
              <li><a className="footer-link" href="https://gitlab.com/vital-block-security/Project-KYC-Verification/-/blob/main/ZUBA_TOKEN_KYC_CERTIFICATE.pdf" target="_blank" rel="noopener noreferrer">KYC Certification</a></li>
              <li><a className="footer-link" href="https://github.com/VBS-Labs/Audit-Report/blob/main/ZUBA%20TOKEN%20CONTRACT%20AUDIT%20REPORT.pdf" target="_blank" rel="noopener noreferrer">Audit</a></li>
              <li><button type="button" className="footer-link" onClick={() => onNavigate('about')}>About</button></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div>© {new Date().getFullYear()} ZUBA. All rights reserved.</div>
      </div>
    </footer>
  )
}
