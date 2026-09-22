import React from 'react'

const partnerLogos = [
  '/assets/partners/logo1.png',
  '/assets/partners/logo2.png',
  '/assets/partners/logo3.png',
  '/assets/partners/logo4.png',
  '/assets/partners/logo5.png',
  '/assets/partners/logo6.png'
]

export default function Partners(){
  return (
    <section className="partners-section partners-marquee reveal-up">
      <div className="partners-inner">
        <h2 className="partners-heading">Our Partners</h2>
      </div>

      <div className="partners-scroller" aria-hidden>
        <div className="partners-track">
          {Array.from({length:3}).flatMap((_,round)=>
            partnerLogos.map((src,i)=> (
              <div className="partner-item" key={`p-${round}-${i}`}>
                <div className="partner-box">
                  <img src={src} alt={`partner-${i+1}`} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
