import { useState, useCallback } from 'react'
import { MATERIALS, calcTotals } from '../data/materials.js'

let nextId = 7

const INITIAL_ROWS = [
  { id: 1, description: '500ml PET waterfles (voorbeeld)', materialId: 'pet', weightG: 20, quantity: 1000, recycledPct: 30 },
  { id: 2, description: 'Kartonnen verzenddoos klein (voorbeeld)', materialId: 'golfkarton', weightG: 150, quantity: 500, recycledPct: 80 },
  { id: 3, description: 'Glas fles 330ml bier (voorbeeld)', materialId: 'glas', weightG: 180, quantity: 200, recycledPct: 60 },
  { id: 4, description: 'Aluminium blikje 330ml (voorbeeld)', materialId: 'aluminium', weightG: 15, quantity: 1000, recycledPct: 75 },
  { id: 5, description: 'LDPE plastic zak / folie verpakking', materialId: 'ldpe', weightG: 8, quantity: 2000, recycledPct: 20 },
  { id: 6, description: 'PP tray / clamshell verpakking', materialId: 'pp', weightG: 25, quantity: 800, recycledPct: 40 },
]

function fmt(n, decimals = 2) {
  if (n == null || isNaN(n)) return '—'
  return n.toLocaleString('nl-NL', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function fmtInt(n) {
  if (n == null || isNaN(n)) return '—'
  return Math.round(n).toLocaleString('nl-NL')
}

export default function Calculator() {
  const [rows, setRows] = useState(INITIAL_ROWS)

  const updateRow = useCallback((id, field, value) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }, [])

  const addRow = useCallback(() => {
    setRows(prev => [...prev, {
      id: nextId++,
      description: '',
      materialId: 'pet',
      weightG: '',
      quantity: '',
      recycledPct: 0,
    }])
  }, [])

  const deleteRow = useCallback((id) => {
    setRows(prev => prev.filter(r => r.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    if (confirm('Alle rijen verwijderen?')) {
      setRows([])
    }
  }, [])

  const resetExamples = useCallback(() => {
    nextId = 7
    setRows(INITIAL_ROWS)
  }, [])

  // Compute totals
  const computed = rows.map(r => ({ ...r, ...calcTotals(r) }))
  const totalCO2 = computed.reduce((s, r) => s + (r.totalCO2 || 0), 0)
  const totalWater = computed.reduce((s, r) => s + (r.totalWater || 0), 0)
  const totalWeight = computed.reduce((s, r) => s + (r.totalWeightKg || 0), 0)

  return (
    <>
      <div className="tip-box">
        <span>💡</span>
        <span>Vul de <strong>gele cellen</strong> in. De <strong>groene cellen</strong> worden automatisch berekend op basis van de materiaalfactoren.</span>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Verpakkingen invoer</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <div className="legend">
              <div className="legend-item"><div className="legend-swatch swatch-yellow"></div> Invulveld</div>
              <div className="legend-item"><div className="legend-swatch swatch-green"></div> Berekend</div>
            </div>
            <button className="btn btn-secondary" onClick={resetExamples}>↺ Voorbeelden</button>
            <button className="btn btn-danger" onClick={clearAll}>🗑 Alles wissen</button>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 32 }}>#</th>
                <th style={{ minWidth: 200 }}>Verpakkingsitem / Beschrijving</th>
                <th style={{ minWidth: 200 }}>Materiaal</th>
                <th style={{ width: 110 }}>Gewicht/stuk (g)</th>
                <th style={{ width: 90 }}>Aantal stuks</th>
                <th style={{ width: 130 }}>% Gerecycled</th>
                <th style={{ width: 130 }}>CO₂ factor (kg/kg)</th>
                <th style={{ width: 110 }}>Totaal gewicht (kg)</th>
                <th style={{ width: 130 }}>Totaal CO₂ (kg CO₂e)</th>
                <th style={{ width: 140 }}>Water indicatief (L)</th>
                <th style={{ width: 36 }}></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr className="empty-row">
                  <td colSpan={11}>Geen rijen. Klik op "+ Rij toevoegen" om te beginnen.</td>
                </tr>
              )}
              {computed.map((row, i) => (
                <CalculatorRow
                  key={row.id}
                  row={row}
                  index={i}
                  onUpdate={updateRow}
                  onDelete={deleteRow}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--gray-100)' }}>
          <button className="btn btn-primary" onClick={addRow}>
            + Rij toevoegen
          </button>
        </div>
      </div>

      <div className="totals-grid">
        <div className="total-card co2">
          <div className="total-label">Totaal CO₂-uitstoot</div>
          <div className="total-value">{fmt(totalCO2, 1)}</div>
          <div className="total-unit">kg CO₂-equivalent (productiefase)</div>
        </div>
        <div className="total-card water">
          <div className="total-label">Totaal waterverbruik (indicatief)</div>
          <div className="total-value">{fmtInt(totalWater)}</div>
          <div className="total-unit">liter (blue + grey, schatting)</div>
        </div>
        <div className="total-card weight">
          <div className="total-label">Totaal verpakkingsgewicht</div>
          <div className="total-value">{fmt(totalWeight, 1)}</div>
          <div className="total-unit">kilogram</div>
        </div>
      </div>

      {rows.length > 1 && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">CO₂ per verpakking (visueel)</span>
          </div>
          <div className="card-body">
            <CO2Chart rows={computed} />
          </div>
        </div>
      )}

      <div className="disclaimer">
        <strong>Disclaimer:</strong> Dit is een hulpmiddel op basis van gemiddelde waarden en openbare data. Resultaten zijn indicatief (cradle-to-gate) en geen vervanging voor een gedetailleerde, leverancierspecifieke Life Cycle Assessment (LCA). Voor officiële carbon footprint rapportage (CSRD, ISO 14064) altijd een gekwalificeerde LCA-expert raadplegen.
      </div>
    </>
  )
}

function CalculatorRow({ row, index, onUpdate, onDelete }) {
  const material = MATERIALS.find(m => m.id === row.materialId)

  const hasData = row.weightG && row.quantity && material
  const calcedClass = hasData ? 'calc-cell' : 'calc-cell empty'

  return (
    <tr className="fade-in">
      <td className="row-num">{index + 1}</td>
      <td>
        <input
          className="input"
          type="text"
          placeholder="Omschrijving..."
          value={row.description}
          onChange={e => onUpdate(row.id, 'description', e.target.value)}
        />
      </td>
      <td>
        <select
          className="input"
          value={row.materialId}
          onChange={e => onUpdate(row.id, 'materialId', e.target.value)}
        >
          {MATERIALS.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </td>
      <td>
        <input
          className="input input-number"
          type="number"
          min="0"
          step="0.1"
          placeholder="gram"
          value={row.weightG}
          onChange={e => onUpdate(row.id, 'weightG', parseFloat(e.target.value) || '')}
        />
      </td>
      <td>
        <input
          className="input input-number"
          type="number"
          min="0"
          step="1"
          placeholder="stuks"
          value={row.quantity}
          onChange={e => onUpdate(row.id, 'quantity', parseInt(e.target.value) || '')}
        />
      </td>
      <td>
        <div>
          <input
            className="input input-number"
            type="number"
            min="0"
            max="100"
            step="1"
            placeholder="%"
            value={row.recycledPct}
            onChange={e => onUpdate(row.id, 'recycledPct', Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
          />
          <div className="recycled-bar">
            <div className="recycled-bar-fill" style={{ width: `${row.recycledPct || 0}%` }} />
          </div>
        </div>
      </td>
      <td>
        <div className={calcedClass}>
          {hasData ? fmt(row.effectiveCO2, 3) : '—'}
        </div>
      </td>
      <td>
        <div className={calcedClass}>
          {hasData ? fmt(row.totalWeightKg, 2) : '—'}
        </div>
      </td>
      <td>
        <div className={calcedClass}>
          {hasData ? fmt(row.totalCO2, 2) : '—'}
        </div>
      </td>
      <td>
        <div className={calcedClass}>
          {hasData ? fmtInt(row.totalWater) : '—'}
        </div>
      </td>
      <td>
        <button className="btn-delete" onClick={() => onDelete(row.id)} title="Verwijder rij">
          ×
        </button>
      </td>
    </tr>
  )
}

function CO2Chart({ rows }) {
  const validRows = rows.filter(r => r.totalCO2 > 0)
  if (validRows.length === 0) return null

  const maxCO2 = Math.max(...validRows.map(r => r.totalCO2))

  return (
    <div className="bar-chart">
      {validRows.map((row, i) => {
        const pct = maxCO2 > 0 ? (row.totalCO2 / maxCO2) * 100 : 0
        const isHigh = pct > 66
        const label = row.description || MATERIALS.find(m => m.id === row.materialId)?.name || 'Item ' + (i + 1)
        return (
          <div key={row.id} className="bar-row">
            <div className="bar-label" title={label}>{label}</div>
            <div className="bar-track">
              <div
                className={`bar-fill co2${isHigh ? ' high' : ''}`}
                style={{ width: `${Math.max(pct, 2)}%` }}
              >
                {pct > 20 ? `${row.totalCO2.toFixed(1)} kg` : ''}
              </div>
            </div>
            {pct <= 20 && (
              <span style={{ fontSize: 11, color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>
                {row.totalCO2.toFixed(1)} kg
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
