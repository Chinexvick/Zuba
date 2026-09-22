import { useEffect } from 'react'

export default function ScrollReveal(){
  useEffect(()=>{
    const selector = '.reveal-up, .fade-slide-up, .fade-in, .slide-in-left, .slide-in-right, .build-card, .dna-card, .why-title, .welcome-title, .site-footer, .menu-item'
    const observedAttr = 'data-sr-observed'

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in-view')
        } else {
          entry.target.classList.remove('in-view')
        }
      })
    },{
      root: null,
      // trigger earlier so headings and below-the-fold content reveal during small scrolls
      rootMargin: '0px 0px -18% 0px',
      threshold: 0.08
    })

    // Debounced scroll handler: some browsers/contexts don't trigger IO reliably on fast scroll, so
    // we also call observeAll on scroll (lightweight and debounced via rAF)
    let scrollTick = false
    function onScroll(){
      if(scrollTick) return
      scrollTick = true
      requestAnimationFrame(()=>{
        observeAll()
        scrollTick = false
      })
    }

    function observeAll(){
      const els = Array.from(document.querySelectorAll(selector))
      els.forEach(el => {
        if(el.getAttribute(observedAttr)) return
        obs.observe(el)
        el.setAttribute(observedAttr, '1')
      })

      // Immediately mark elements that are already visible as in-view
      const viewportH = window.innerHeight || document.documentElement.clientHeight
      const thresholdPx = Math.round(viewportH * 0.12)
      els.forEach(el => {
        if(el.classList.contains('in-view')) return
        const r = el.getBoundingClientRect()
        // if element intersects the viewport area defined by threshold, mark in-view
        if(r.top < viewportH - thresholdPx && r.bottom > thresholdPx){
          el.classList.add('in-view')
        }
      })
    }

    // initial scan
    observeAll()

    // If content is rendered slightly after mount (fonts/images/layout shifts), re-scan after small delays
    const retryTimers = [120, 400, 900].map(ms => setTimeout(observeAll, ms))

    // re-scan when fonts finish loading (helps when web fonts change layout)
    let fontsPromise = null
    if(document.fonts && document.fonts.ready){
      fontsPromise = document.fonts.ready.then(() => observeAll()).catch(()=>{})
    }

    // watch for DOM changes (navigation / content swaps) and observe new elements
    const mo = new MutationObserver(mutations => {
      let added = false
      for(const m of mutations){
        if(m.addedNodes && m.addedNodes.length){ added = true; break }
      }
      if(added) observeAll()
    })

    mo.observe(document.body, { childList: true, subtree: true })

    // also re-scan on load/resize, visibility change and on SPA navigation events
    const onResize = () => observeAll()
    const onRoute = () => observeAll()
    const onVisibility = () => { if(document.visibilityState === 'visible') observeAll() }

    window.addEventListener('resize', onResize)
    window.addEventListener('load', observeAll)
    window.addEventListener('app:routeChange', onRoute)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('scroll', onScroll, { passive: true })

    return ()=>{
      obs.disconnect()
      mo.disconnect()
      retryTimers.forEach(t => clearTimeout(t))
      window.removeEventListener('resize', onResize)
      window.removeEventListener('load', observeAll)
      window.removeEventListener('app:routeChange', onRoute)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return null
}