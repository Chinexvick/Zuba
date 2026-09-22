import React from 'react'

const items = [
  { pct: '85%', title: 'Liquidity and\nFair launch' },
  { pct: '5%', title: 'Development' },
  { pct: '10%', title: 'Marketing' }
]

export default function Tokenomics(){
  return (
    <section className="tokenomics-section reveal-up">
      <div className="tokenomics-inner">
        <h2 className="tokenomics-title">Tokenomics</h2>

        <div className="tokenomics-cards">
          {items.map((it, i) => (
            <div className="token-card" key={i} style={{transform: `translateY(${i===1? -6 : 0}px)`}}>
              <div className="token-card-inner">
                <div className="token-pct">{it.pct}</div>
                <div className="token-sub">{it.title.split('\n').map((line, idx) => <div key={idx}>{line}</div>)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
