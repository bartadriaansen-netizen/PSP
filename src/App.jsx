import { useState } from 'react'
import Calculator from './components/Calculator.jsx'
import MaterialsDB from './components/MaterialsDB.jsx'
import Comparison from './components/Comparison.jsx'
import Instructions from './components/Instructions.jsx'

const TABS = [
  { id: 'calculator', label: '🧮 Calculator' },
  { id: 'materials', label: '📋 Factoren Database' },
  { id: 'comparison', label: '📊 Vergelijking' },
  { id: 'instructions', label: 'ℹ️ Instructies' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('calculator')

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <h1>CO₂ &amp; Watervoetafdruk Calculator <span>Verpakkingen</span></h1>
          <div className="header-meta">
            Versie 1.0 · Juni 2026 · Gebaseerd op gemiddelde Europese LCA-data (FEFCO, PlasticsEurope, studies) · Systeem: Cradle-to-gate
          </div>
        </div>
      </header>

      <nav className="tabs">
        <div className="tabs-inner">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="main">
        {activeTab === 'calculator' && <Calculator />}
        {activeTab === 'materials' && <MaterialsDB />}
        {activeTab === 'comparison' && <Comparison />}
        {activeTab === 'instructions' && <Instructions />}
      </main>
    </div>
  )
}
