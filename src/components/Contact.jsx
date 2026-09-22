import React, {useState} from 'react'

export default function Contact(){
  const [copied, setCopied] = useState(false)
  const address = '0xE1bf97baCF682Ae17cA3e239aB68a7b525f994A4'

  async function copy() {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(()=>setCopied(false), 1800)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <section className="contact-section reveal-up">
      <div className="contact-wrap">
        <div className="rope-pin" />
        <div className="rope-lines" />

        <div className="contact-board" role="region" aria-label="contact address">
          <h3>CONTACT ADDRESS</h3>
          <div className="contact-address">{address}</div>
          <button className="copy-btn" onClick={copy}>{copied? 'COPIED' : 'COPY ADDRESS'}</button>
        </div>
      </div>
    </section>
  )
}
