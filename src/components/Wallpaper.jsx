import React, { useState } from 'react'

export default function Wallpaper(){
  const [preview, setPreview] = useState(null)

  const wallpapers = Array.from({length:10}, (_,i) => ({
    src: `/assets/wall${i+1}.png`,
    // alternate orientation: even index => landscape, odd => portrait
    type: (i % 2 === 0) ? 'Landscape' : 'Portrait',
    // download/preview target for portrait items should be the vertical file
    // (keeps displayed thumbnail as the original file but downloads/previews the portrait)
    downloadSrc: (i % 2 === 0) ? `/assets/wall${i+1}.png` : `/assets/wall${i+1}-portrait.png`
  }))

  return (
    <section className="wallpaper-page reveal-up">
      <div className="wallpaper-content">
        <h1>ZUBA Wallpapers </h1>

        {/* Hero preview block: sits above the wallpapers grid so the grid is below the background image */}
        <div className="wallpaper-hero" aria-hidden>
         
        </div>

        <div className="wallpapers-grid">
          {wallpapers.map((wp, idx) => (
            <div className="wallpaper-card" key={wp.src}>
              <button className={`wallpaper-thumb ${wp.type.toLowerCase()}`} onClick={() => setPreview(wp.downloadSrc)} aria-label={`Preview wallpaper ${idx+1}`}>
                <img src={wp.src} alt={`Zuba wallpaper ${idx+1}`} />
              </button>

              <div className="type-label"><span className="label">TYPE</span> <span className="kind">{wp.type}</span></div>

              <a className="join-btn download-btn" href={wp.downloadSrc} download={wp.downloadSrc.split('/').pop()}>
                Download
              </a>
            </div>
          ))}
        </div>

        {preview && (
          <div className="wp-modal" role="dialog" aria-modal="true" onClick={() => setPreview(null)}>
            <div className="wp-modal-inner" onClick={(e)=>e.stopPropagation()}>
              <button className="wp-close" onClick={() => setPreview(null)} aria-label="Close preview">×</button>
              <img src={preview} alt="Preview wallpaper" />
              <div className="wp-actions">
                <a className="join-btn" href={preview} download>
                  Download
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
