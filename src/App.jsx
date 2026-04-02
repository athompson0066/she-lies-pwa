import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import codes from './data/codes.json'
import './App.css'

// Dark Mode Toggle
function DarkModeToggle({ isDark, setIsDark }) {
  return (
    <button className="dark-toggle" onClick={() => setIsDark(!isDark)}>
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}

// Home Page - Code List
function Home({ isDark }) {
  const [search, setSearch] = useState('')
  
  const filteredCodes = codes.filter(code => 
    code.title.toLowerCase().includes(search.toLowerCase()) ||
    code.content.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="home">
      {/* Full Bleed Cover Hero */}
      <div className="cover-hero">
        <img src="/cover.jpg" alt="SHE LIES" className="cover-image" />
        <div className="cover-overlay">
          <h1>SHE LIES</h1>
          <p className="subtitle">The 48 Codes Every Man Must Know About Female Infidelity</p>
          <p className="author">By Nii Odoi Thompson</p>
        </div>
      </div>
      
      <div className="search-box">
        <input 
          type="text" 
          placeholder="Search codes..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <div className="codes-grid">
        {filteredCodes.map(code => (
          <Link to={`/code/${code.num}`} key={code.num} className="code-card">
            <span className="code-num">{String(code.num).padStart(2, '0')}</span>
            <span className="code-title">{code.title.replace(`CODE ${code.num}: `, '')}</span>
          </Link>
        ))}
      </div>
      
      <footer className="footer">
        <p>© 2026 Nii Odoi Thompson. All rights reserved.</p>
      </footer>
    </div>
  )
}

// Code Reader Page
function CodeReader({ isDark }) {
  const [code, setCode] = useState(null)
  const [progress, setProgress] = useState({})
  
  useEffect(() => {
    const saved = localStorage.getItem('she-lies-progress')
    if (saved) setProgress(JSON.parse(saved))
  }, [])
  
  useEffect(() => {
    if (code) {
      localStorage.setItem('she-lies-progress', JSON.stringify({
        ...progress,
        [code.num]: Date.now()
      }))
    }
  }, [code])

  // Load code from URL param
  useEffect(() => {
    const path = window.location.pathname
    const match = path.match(/\/code\/(\d+)/)
    if (match) {
      const num = parseInt(match[1])
      const found = codes.find(c => c.num === num)
      if (found) setCode(found)
    }
  }, [])

  if (!code) return <div className="loading">Loading...</div>

  return (
    <div className="reader">
      <nav className="reader-nav">
        <Link to="/" className="back-btn">← Back</Link>
        <span className="code-indicator">{String(code.num).padStart(2, '0')}/48</span>
      </nav>
      
      <article className="code-content">
        <header className="code-header">
          <span className="big-num">{String(code.num).padStart(2, '0')}</span>
          <h1>{code.title.replace(`CODE ${code.num}: `, '')}</h1>
        </header>
        
        <div className="content-body">
          {code.content.split('\n\n').map((para, i) => {
            // Case study detection
            if (para.includes('Marcus Webb') || para.includes('David Chen') || 
                para.includes('Kevin') || para.includes('Jennifer') || 
                para.includes('Jason') || para.includes('Consider the architecture')) {
              return <div key={i} className="case-study">{para}</div>
            }
            // Section headers
            if (para.includes('THE JUDGEMENT') || para.includes('THE JUDGMENT') ||
                para.includes('THE TRANSGRESSION') || para.includes('THE OBSERVANCE') ||
                para.includes('THE REVERSAL') || para.includes('THE SOLUTION') ||
                para.includes('CODE SUMMARY') || para.includes('RESOURCES')) {
              return <h2 key={i} className="section-header">{para}</h2>
            }
            // Short aphorisms
            if (para.length < 150 && para.length > 20) {
              return <blockquote key={i} className="aphorism">{para}</blockquote>
            }
            // Regular paragraphs
            return <p key={i}>{para}</p>
          })}
        </div>
      </article>
      
      <nav className="code-nav">
        {code.num > 1 && (
          <Link to={`/code/${code.num - 1}`} className="prev-code">← Previous</Link>
        )}
        {code.num < 48 && (
          <Link to={`/code/${code.num + 1}`} className="next-code">Next →</Link>
        )}
      </nav>
    </div>
  )
}

// App Wrapper
function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('she-lies-dark')
    return saved ? JSON.parse(saved) : true
  })

  useEffect(() => {
    localStorage.setItem('she-lies-dark', JSON.stringify(isDark))
    document.body.className = isDark ? 'dark' : 'light'
  }, [isDark])

  return (
    <BrowserRouter>
      <div className={`app ${isDark ? 'dark' : 'light'}`}>
        <DarkModeToggle isDark={isDark} setIsDark={setIsDark} />
        <Routes>
          <Route path="/" element={<Home isDark={isDark} />} />
          <Route path="/code/:id" element={<CodeReader isDark={isDark} />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
