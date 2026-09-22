import React from 'react'

const steps = [
  {
    title: 'Open Your Wallet App',
    body: 'Download or visit any supported wallet app of your choice.'
  },
  {
    title: 'Paste Our Contract Address',
    body: 'Connect your preferred decentralized wallet (e.g., MetaMask or Trust Wallet) to the swap interface.'
  },
  {
    title: 'Swap BNB for Our Token',
    body: 'Enter the amount of BNB you want to use and swap instantly to get our token.'
  }
]

export default function HowToBuy(){
  return (
    <section className="howto-section reveal-up">
      <div className="howto-inner">
        <h2 className="howto-title">HOW TO BUY</h2>

        <div className="howto-cards">
          {steps.map((s, i) => (
            <article className="howto-card" key={i} style={{transform: `rotate(${i===1? -1 : i===2? 1 : -2}deg)`}}>
              <div className="howto-card-inner">
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="howto-cta-wrap">
          <a className="howto-cta" href="https://pancakeswap.finance/swap?outputCurrency=0xE1bf97baCF682AE17cA3E239aB68a7b525f994A4" target="_blank" rel="noopener noreferrer">GO TO PANCAKESWAP</a>
        </div>
      </div>
    </section>
  )
}
