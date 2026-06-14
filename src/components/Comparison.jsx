import { useState } from 'react'
import { MATERIALS, calcEffectiveCO2 } from '../data/materials.js'

const EXAMPLE_DATA = [
  {
    id: 1,
    name: 'PET fles 1L (lightweight)',
    weightG: 25,
    materialId: 'pet',
    recycledPct: 30,
    notes: 'Laag gewicht, goed recyclebaar in NL',
  },
  {
    id: 2,
    name: 'Glas fles 1L (herbruikbaar x20)',
    weightG: 400,
    materialId: 'glas',
    recycledPct: 60,
    notes: 'Hoog gewicht; break-even na ~5-10 hergebruiken vs PET',
  },
  {
    id: 3,
    name: 'Aluminium blik 0.33L (×3 = 1L)',
    weightG: 45,
    materialId: 'aluminium',
    recycledPct: 75,
    notes: 'Zeer goed recyclebaar, maar hoger per liter dan PET',
  },
  {
    id: 4,
    name: 'Kartonnen drankpak (Tetra Pak)',
    weightG: 35,
    materialId: 'karton',
    recycledPct: 20,
    notes: 'Multi-layer, recycling complex maar mogelijk',
  },
  {
    id: 5,
    name: 'HDPE fles 1L',
    weightG: 30,
    materialId: 'hdpe',
    recycledPct: 40,
    notes: 'Goedkoper alternatief voor PET, vergelijkbare impact',
  },
]

function calcPerLiter(item) {
  const mat = MATERIALS.find(m => m.id === item.materialId)
  if (!mat) return null
  const co2Factor = calcEffectiveCO2(mat, item.recycledPct)
  const weightKg = item.weightG / 1000
  const co2PerLiter = weightKg * co2Factor * 1000 // g CO2e per liter
  const waterPerLiter = weightKg * mat.waterFactor
  return { co2PerLiter, waterPerLiter, mat, co2Factor }
}

let nextId = 10

export default function Comparison() {
  const [items, setItems] = useState(EXAMPLE_DATA)
  const [showForm, setShowForm] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', materialId: 'pet', weightG: '', recycledPct: 0, notes: '' })

  const computed = items.map(item => ({ ...item, ...calcPerLiter(item) }))
  const maxCO2 = Math.max(...computed.map(c => c.co2PerLiter || 0))
  const maxWater = Math.max(...computed.map(c => c.waterPerLiter || 0))
  const minCO2 = Math.min(...computed.filter(c => c.co2PerLiter > 0).map(c => c.co2PerLiter))

  const addItem = () => {
    if (!newItem.name || !newItem.weightG) return
    setItems(prev => [...prev, { ...newItem, id: nextId++, weightG: parseFloat(newItem.weightG) }])
    setNewItem({ name: '', materialId: 'pet', weightG: '', recycledPct: 0, notes: '' })
    setShowForm(false)
  }

  const deleteItem = (id) => setItems(prev => prev.filter(i => i.id !== id))

  const resetExamples = () => setItems(EXAMPLE_DATA)

  return (
    <>
      <div className="tip-box">
        <span>📊</span>
        <span>
          Vergelijk verpakkingen op basis van de <strong>functionele eenheid: verpakking voor 1 liter vloeistof</strong> (eenmalig gebruik).
          Een eerlijke vergelijking vereist dezelfde functionele eenheid.
        </span>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Vergelijking per liter verpakt product</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" onClick={resetExamples}>↺ Voorbeelden</button>
            <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>
              {showForm ? '✕ Annuleren' : '+ Voeg toe'}
            </button>
          </div>
        </div>

        {showForm && (
          <div style={{ padding: '16px 20px', background: 'var(--yellow-input)', borderBottom: '1px solid var(--gray-100)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 4 }}>NAAM</label>
                <input className="input" placeholder="Bijv. PET fles 0.5L" value={newItem.name} onChange={e => setNewItem(s => ({ ...s, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 4 }}>MATERIAAL</label>
                <select className="input" value={newItem.materialId} onChange={e => setNewItem(s => ({ ...s, materialId: e.target.value }))}>
                  {MATERIALS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 4 }}>GEWICHT (g per stuk)</label>
                <input className="input input-number" type="number" placeholder="gram" value={newItem.weightG} onChange={e => setNewItem(s => ({ ...s, weightG: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 4 }}>% GERECYCLED</label>
                <input className="input input-number" type="number" min="0" max="100" placeholder="%" value={newItem.recycledPct} onChange={e => setNewItem(s => ({ ...s, recycledPct: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 4 }}>OPMERKING</label>
                <input className="input" placeholder="Optioneel" value={newItem.notes} onChange={e => setNewItem(s => ({ ...s, notes: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button className="btn btn-primary" onClick={addItem}>Toevoegen</button>
              </div>
            </div>
          </div>
        )}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Verpakkingsoptie</th>
                <th style={{ textAlign: 'right' }}>Gewicht (g)</th>
                <th>Materiaal</th>
                <th style={{ textAlign: 'right' }}>% Recycled</th>
                <th style={{ textAlign: 'right' }}>CO₂ per liter (g CO₂e)</th>
                <th style={{ textAlign: 'right' }}>Water per liter (L)</th>
                <th>Score</th>
                <th>Opmerkingen</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {computed.map(item => {
                const isBest = item.co2PerLiter === minCO2
                return (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 500 }}>
                      {isBest && <span style={{ color: 'var(--green)', marginRight: 4 }}>★</span>}
                      {item.name}
                    </td>
                    <td style={{ textAlign: 'right' }}>{item.weightG}</td>
                    <td style={{ fontSize: 12, color: 'var(--gray-600)' }}>{item.mat?.name || '—'}</td>
                    <td style={{ textAlign: 'right' }}>{item.recycledPct}%</td>
                    <td style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 600, color: isBest ? 'var(--green)' : item.co2PerLiter > maxCO2 * 0.7 ? 'var(--red)' : 'var(--gray-800)' }}>
                        {item.co2PerLiter?.toFixed(1) || '—'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {item.waterPerLiter?.toFixed(1) || '—'}
                    </td>
                    <td style={{ minWidth: 120 }}>
                      <ScoreBar value={item.co2PerLiter} max={maxCO2} isBest={isBest} />
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--gray-500)' }}>{item.notes}</td>
                    <td>
                      <button className="btn-delete" onClick={() => deleteItem(item.id)}>×</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">CO₂ per liter visueel</span>
        </div>
        <div className="card-body">
          <div style={{ marginBottom: 8, fontSize: 12, color: 'var(--gray-500)' }}>
            ★ = laagste CO₂ voetafdruk (beste optie voor klimaat)
          </div>
          {[...computed]
            .sort((a, b) => (a.co2PerLiter || 0) - (b.co2PerLiter || 0))
            .map((item, i) => {
              const pct = maxCO2 > 0 ? (item.co2PerLiter / maxCO2) * 100 : 0
              const isBest = i === 0
              return (
                <div key={item.id} className="bar-row">
                  <div className="bar-label" title={item.name}>
                    {isBest && '★ '}{item.name}
                  </div>
                  <div className="bar-track">
                    <div
                      className={`bar-fill co2${pct > 66 ? ' high' : ''}`}
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    >
                      {pct > 25 ? `${item.co2PerLiter?.toFixed(0)}g` : ''}
                    </div>
                  </div>
                  {pct <= 25 && (
                    <span style={{ fontSize: 11, color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>
                      {item.co2PerLiter?.toFixed(0)}g CO₂e
                    </span>
                  )}
                </div>
              )
            })}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Waterverbruik per liter</span>
        </div>
        <div className="card-body">
          {[...computed]
            .sort((a, b) => (a.waterPerLiter || 0) - (b.waterPerLiter || 0))
            .map((item, i) => {
              const pct = maxWater > 0 ? (item.waterPerLiter / maxWater) * 100 : 0
              return (
                <div key={item.id} className="bar-row">
                  <div className="bar-label" title={item.name}>{i === 0 && '★ '}{item.name}</div>
                  <div className="bar-track">
                    <div
                      className={`bar-fill water${pct > 66 ? ' high' : ''}`}
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    >
                      {pct > 25 ? `${item.waterPerLiter?.toFixed(1)}L` : ''}
                    </div>
                  </div>
                  {pct <= 25 && (
                    <span style={{ fontSize: 11, color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>
                      {item.waterPerLiter?.toFixed(1)}L
                    </span>
                  )}
                </div>
              )
            })}
        </div>
      </div>

      <div style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: '16px 20px', marginTop: 8 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, color: 'var(--gray-700)' }}>Belangrijke inzichten uit LCA-studies:</div>
        <ul style={{ fontSize: 13, color: 'var(--gray-600)', paddingLeft: 20, lineHeight: 1.8 }}>
          <li>PET en karton scoren vaak het laagst voor eenmalige drankverpakking (laag gewicht + redelijke factor).</li>
          <li>Glas is zwaar → hoge transportimpact + hoge productie-energie, tenzij veel hergebruikt (retour systeem).</li>
          <li>Aluminium heeft hoge recyclingvoordelen maar virgin impact is groot; goed in gesloten systemen.</li>
          <li>Herbruikbare systemen (glas of R-PET flessen) kunnen de beste optie zijn bij hoge retour rates (&gt;10-20×).</li>
          <li>Altijd volledige LCA doen inclusief transportafstand, vulsysteem en lokaal recyclingpercentage.</li>
        </ul>
      </div>
    </>
  )
}

function ScoreBar({ value, max, isBest }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ flex: 1, height: 8, background: 'var(--gray-100)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          width: `${Math.max(pct, 2)}%`,
          height: '100%',
          background: isBest
            ? 'linear-gradient(90deg, #16a34a, #4ade80)'
            : pct > 66
              ? 'linear-gradient(90deg, #dc2626, #f97316)'
              : 'linear-gradient(90deg, #d97706, #fbbf24)',
          borderRadius: 4,
        }} />
      </div>
    </div>
  )
}
