import { useState } from 'react'
import { MATERIALS } from '../data/materials.js'

const CATEGORY_MAP = {
  golfkarton: { label: 'Papier/Karton', cls: 'tag-paper' },
  karton: { label: 'Papier/Karton', cls: 'tag-paper' },
  pet: { label: 'Plastic', cls: 'tag-plastic' },
  hdpe: { label: 'Plastic', cls: 'tag-plastic' },
  pp: { label: 'Plastic', cls: 'tag-plastic' },
  ldpe: { label: 'Plastic', cls: 'tag-plastic' },
  glas: { label: 'Glas', cls: 'tag-glass' },
  aluminium: { label: 'Metaal', cls: 'tag-metal' },
  staal: { label: 'Metaal', cls: 'tag-metal' },
  eps: { label: 'Plastic', cls: 'tag-plastic' },
}

function fmt(n, d = 2) {
  return n.toLocaleString('nl-NL', { minimumFractionDigits: d, maximumFractionDigits: d })
}

function RecyclingBenefit({ material }) {
  const saving = ((material.virginCO2 - material.recycledCO2) / material.virginCO2 * 100)
  return (
    <span style={{ fontSize: 11, color: saving > 50 ? '#16a34a' : '#d97706', fontWeight: 600 }}>
      -{saving.toFixed(0)}%
    </span>
  )
}

export default function MaterialsDB() {
  const [filter, setFilter] = useState('all')

  const categories = ['all', 'Papier/Karton', 'Plastic', 'Glas', 'Metaal']

  const filtered = filter === 'all'
    ? MATERIALS
    : MATERIALS.filter(m => CATEGORY_MAP[m.id]?.label === filter)

  return (
    <>
      <div className="tip-box">
        <span>📋</span>
        <span>
          Deze factoren worden gebruikt in de calculator. Gebaseerd op gemiddelde Europese LCA-data (2022–2026).
          <strong> Virgin</strong> = primaire productie. <strong>100% Recycled</strong> = volledig post-consumer gerecycled materiaal.
        </span>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Materiaalfactoren</span>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`btn ${filter === cat ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter(cat)}
                style={{ padding: '5px 12px', fontSize: 12 }}
              >
                {cat === 'all' ? 'Alle materialen' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="table-wrap">
          <table className="db-table">
            <thead>
              <tr>
                <th>Categorie</th>
                <th>Materiaal</th>
                <th style={{ textAlign: 'right' }}>Virgin CO₂<br/>(kg CO₂e/kg)</th>
                <th style={{ textAlign: 'right' }}>Recycled CO₂<br/>(kg CO₂e/kg)</th>
                <th style={{ textAlign: 'right' }}>Besparing<br/>door recycling</th>
                <th style={{ textAlign: 'right' }}>Water<br/>(L/kg)</th>
                <th>CO₂ Verhouding Virgin/Recycled</th>
                <th>Bron / Opmerking</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => {
                const cat = CATEGORY_MAP[m.id]
                const maxVirgCO2 = 3.5
                const virginPct = (m.virginCO2 / maxVirgCO2) * 100
                const recycledPct = (m.recycledCO2 / maxVirgCO2) * 100

                return (
                  <tr key={m.id}>
                    <td>
                      <span className={`tag ${cat?.cls || ''}`}>{cat?.label || '—'}</span>
                    </td>
                    <td style={{ fontWeight: 500, color: 'var(--gray-800)' }}>{m.name}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>
                      <span style={{ color: m.virginCO2 > 2 ? 'var(--red)' : m.virginCO2 > 1 ? '#d97706' : 'var(--green)' }}>
                        {fmt(m.virginCO2)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>
                      <span style={{ color: m.recycledCO2 < 0.8 ? 'var(--green)' : '#d97706' }}>
                        {fmt(m.recycledCO2)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <RecyclingBenefit material={m} />
                    </td>
                    <td style={{ textAlign: 'right' }}>{m.waterFactor.toLocaleString('nl-NL')}</td>
                    <td style={{ minWidth: 200 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                          <span style={{ width: 50, color: 'var(--gray-500)' }}>Virgin</span>
                          <div style={{ flex: 1, height: 8, background: 'var(--gray-100)', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{
                              width: `${virginPct}%`, height: '100%',
                              background: 'linear-gradient(90deg, #dc2626, #f97316)',
                              borderRadius: 4
                            }} />
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                          <span style={{ width: 50, color: 'var(--gray-500)' }}>Recycled</span>
                          <div style={{ flex: 1, height: 8, background: 'var(--gray-100)', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{
                              width: `${recycledPct}%`, height: '100%',
                              background: 'linear-gradient(90deg, #16a34a, #4ade80)',
                              borderRadius: 4
                            }} />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 11, color: 'var(--gray-500)', maxWidth: 300 }}>{m.source}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">CO₂ factoren vergelijking (virgin vs recycled)</span>
        </div>
        <div className="card-body">
          <div style={{ marginBottom: 8, fontSize: 12, color: 'var(--gray-500)' }}>Oranje = virgin productie · Groen = 100% gerecycled</div>
          {MATERIALS.map(m => (
            <div key={m.id} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--gray-700)', marginBottom: 4 }}>{m.name}</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ width: 70, fontSize: 11, color: 'var(--gray-500)', textAlign: 'right' }}>Virgin</div>
                <div style={{ flex: 1, height: 16, background: 'var(--gray-100)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: `${(m.virginCO2 / 3.5) * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #ea580c, #fb923c)',
                    borderRadius: 4,
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                    paddingRight: 6, fontSize: 10, color: 'white', fontWeight: 700
                  }}>
                    {m.virginCO2}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 3 }}>
                <div style={{ width: 70, fontSize: 11, color: 'var(--gray-500)', textAlign: 'right' }}>Recycled</div>
                <div style={{ flex: 1, height: 16, background: 'var(--gray-100)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: `${(m.recycledCO2 / 3.5) * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #15803d, #4ade80)',
                    borderRadius: 4,
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                    paddingRight: 6, fontSize: 10, color: 'white', fontWeight: 700
                  }}>
                    {m.recycledCO2}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="disclaimer">
        <strong>Eenheden:</strong> CO₂ in kg CO₂-equivalent per kg materiaal (cradle-to-gate). Water in liter totaal watervoetafdruk (blue + grey) per kg materiaal — indicatief en sterk variabel per regio/fabriek.
        Pas factoren aan bij eigen leveranciersdata of EPD-documenten voor meer nauwkeurige resultaten.
      </div>
    </>
  )
}
