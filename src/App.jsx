import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Snow from './components/Snow'
import ScrollReveal from './utils/ScrollReveal'
import Hero from './components/Hero' 
import Banner from './components/Banner'
import About from './components/About'
import HowToBuy from './components/HowToBuy'
import Contact from './components/Contact'
import Products from './components/Products'
import Tokenomics from './components/Tokenomics'
import Partners from './components/Partners'
import Blog from './components/Blog'
import Article from './components/Article'
import Footer from './components/Footer'
import Wallpaper from './components/Wallpaper'
import Mesh from './components/Mesh'
import Comic from './components/Comic'
import Games from './components/Games'
import Universe from './components/Universe'
import GamesShowcase from './components/GamesShowcase'
import AnimationTeaser from './components/AnimationTeaser'

export default function App() {
  const [page, setPage] = useState('home')

  function handleNavigate(to){
    setPage(to)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // notify scroll reveal to re-scan new content (helps with SPA navigation)
    window.dispatchEvent(new Event('app:routeChange'))
  }

  useEffect(()=>{
    // Toggle body classes for special full-viewport pages
    if(page === 'wallpapers'){
      document.body.classList.add('wallpaper-mode')
    } else {
      document.body.classList.remove('wallpaper-mode')
    }

    if(page === 'mesh'){
      document.body.classList.add('mesh-mode')
    } else {
      document.body.classList.remove('mesh-mode')
    }

    if(page === 'comics'){
      document.body.classList.add('comic-mode')
    } else {
      document.body.classList.remove('comic-mode')
    }

    if(page === 'games'){
      document.body.classList.add('games-mode')
    } else {
      document.body.classList.remove('games-mode')
    }

    if(page === 'about'){
      document.body.classList.add('about-mode')
    } else {
      document.body.classList.remove('about-mode')
    }

    return () => {
      document.body.classList.remove('wallpaper-mode')
      document.body.classList.remove('mesh-mode')
    }
  },[page])

  return (
    <div className="app-root">
      <Snow />
      <ScrollReveal />
      <Header onNavigate={handleNavigate} />
      <main className="main-area">
        {page === 'home' && (
          <>
            <Hero />
            <Universe />
            <GamesShowcase onNavigate={handleNavigate} />
            <AnimationTeaser />
            <Banner />
            <Products />
            <HowToBuy />
            <Tokenomics />
            <Contact />
            <Partners />
          </>
        )}

        {page === 'wallpapers' && (
          <Wallpaper />
        )}

        {page === 'mesh' && (
          <Mesh />
        )}

        {page === 'comics' && (
          <Comic />
        )}

        {page === 'games' && (
          <Games />
        )}

        {page === 'about' && (
          <About />
        )}

        {page === 'blog' && (
          <Blog onNavigate={handleNavigate} />
        )}

        {page === 'post' && (
          <Article />
        )}

        <Footer onNavigate={handleNavigate} />
      </main>
    </div>
  )
}
