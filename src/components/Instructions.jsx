export default function Instructions() {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>

        <div className="card">
          <div className="card-header">
            <span className="card-title">🧮 Hoe gebruik je de Calculator?</span>
          </div>
          <div className="card-body">
            <ol style={{ paddingLeft: 20, lineHeight: 2, fontSize: 13, color: 'var(--gray-700)' }}>
              <li>Ga naar het tabblad <strong>Calculator</strong></li>
              <li>Vul in de <span style={{ background: '#fef9c3', padding: '1px 4px', borderRadius: 3 }}>gele cellen</span>:
                <ul style={{ paddingLeft: 16, marginTop: 4 }}>
                  <li>Verpakkingsitem / beschrijving</li>
                  <li>Kies het Materiaal (dropdown)</li>
                  <li>Gewicht per stuk in gram (bijv. 20 voor een PET flesje)</li>
                  <li>Aantal stuks dat je wilt berekenen</li>
                  <li>% Gerecycled materiaal (0–100%)</li>
                </ul>
              </li>
              <li>De <span style={{ background: '#dcfce7', padding: '1px 4px', borderRadius: 3 }}>groene cellen</span> berekenen automatisch:
                <ul style={{ paddingLeft: 16, marginTop: 4 }}>
                  <li>Effectieve CO₂-factor (op basis van % gerecycled)</li>
                  <li>Totaal gewicht in kg</li>
                  <li>Totaal CO₂-uitstoot (kg CO₂e)</li>
                  <li>Geschat waterverbruik (indicatief)</li>
                </ul>
              </li>
              <li>Onderin zie je totalen en een visuele vergelijking</li>
            </ol>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">🔢 Berekeningsformules</span>
          </div>
          <div className="card-body">
            <div style={{ fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.8 }}>
              <div style={{ marginBottom: 12 }}>
                <strong>Effectieve CO₂-factor:</strong>
                <div style={{ background: 'var(--gray-50)', padding: '8px 12px', borderRadius: 6, marginTop: 4, fontFamily: 'monospace', fontSize: 12 }}>
                  CO₂ = virgin × (1 - %recycled/100)<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ recycled × (%recycled/100)
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>Totaal CO₂ (kg CO₂e):</strong>
                <div style={{ background: 'var(--gray-50)', padding: '8px 12px', borderRadius: 6, marginTop: 4, fontFamily: 'monospace', fontSize: 12 }}>
                  (gewicht_g / 1000) × aantal × CO₂_factor
                </div>
              </div>
              <div>
                <strong>Waterverbruik (liter):</strong>
                <div style={{ background: 'var(--gray-50)', padding: '8px 12px', borderRadius: 6, marginTop: 4, fontFamily: 'monospace', fontSize: 12 }}>
                  (gewicht_g / 1000) × aantal × water_factor
                </div>
                <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 4 }}>
                  Water = blue + grey water footprint. Indicatief.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">🎯 Beste praktijken</span>
          </div>
          <div className="card-body">
            <ul style={{ paddingLeft: 20, lineHeight: 2, fontSize: 13, color: 'var(--gray-700)' }}>
              <li>Gebruik als <strong>screening / quick scan</strong> of voor interne vergelijkingen</li>
              <li>Voor officiële carbon footprint rapportage (CSRD, ISO 14064):
                <ul style={{ paddingLeft: 16 }}>
                  <li>Vraag EPDs op bij leveranciers</li>
                  <li>Gebruik LCA-software (openLCA + ecoinvent, SimaPro)</li>
                  <li>Definieer een duidelijke functionele eenheid</li>
                  <li>Neem transport, gebruiksfase en EOL mee</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">💡 Tips om impact te verlagen</span>
          </div>
          <div className="card-body">
            <ul style={{ paddingLeft: 20, lineHeight: 2, fontSize: 13, color: 'var(--gray-700)' }}>
              <li><strong>Lightweighting</strong> — verlaag gewicht per stuk</li>
              <li><strong>Meer recycled content</strong> — verhoog % gerecycled</li>
              <li><strong>Herbruikbare systemen</strong> — maak break-even analyses</li>
              <li><strong>Transport optimaliseren</strong> — minder volume/gewicht</li>
              <li><strong>Design for recycling</strong> — mono-materiaal, makkelijk scheidbaar</li>
              <li><strong>Materiaalswitch</strong> — vergelijk alternatieve materialen in de vergelijkingstab</li>
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">💧 CO₂ vs Watervoetafdruk</span>
          </div>
          <div className="card-body">
            <div style={{ fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.8 }}>
              <p><strong>CO₂ (klimaatimpact)</strong> is goed gestandaardiseerd via LCA en GHG Protocol.</p>
              <br/>
              <p><strong>Waterverbruik</strong> is complexer:</p>
              <ul style={{ paddingLeft: 20, marginTop: 4 }}>
                <li><em>Blue water</em>: consumptief gebruik (rivieren, grondwater)</li>
                <li><em>Green water</em>: regenwater (landbouw)</li>
                <li><em>Grey water</em>: water nodig voor verdunning van vervuiling</li>
              </ul>
              <br/>
              <p style={{ fontSize: 12, color: 'var(--gray-500)' }}>Data is minder beschikbaar en variabel per regio/fabriek. De getallen hier zijn indicatief.</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">📚 Bronnen &amp; Aannames</span>
          </div>
          <div className="card-body">
            <ul style={{ paddingLeft: 20, lineHeight: 2, fontSize: 13, color: 'var(--gray-700)' }}>
              <li><strong>Golfkarton:</strong> FEFCO LCA 2022 (~491 kg CO₂e/ton)</li>
              <li><strong>Plastics</strong> (PET, HDPE, PP, LDPE): PlasticsEurope Eco-profiles</li>
              <li><strong>Glas, Al, Staal:</strong> LCA studies + EPA WARM model</li>
              <li><strong>Water PET:</strong> ~235 L/kg (Ercin et al. / Water Footprint Network)</li>
              <li><strong>Systeemgrenzen:</strong> Cradle-to-gate (grondstof t/m productiepoort)</li>
            </ul>
            <div style={{ marginTop: 12, fontSize: 11, color: 'var(--gray-400)', background: 'var(--gray-50)', padding: '8px 12px', borderRadius: 6 }}>
              Transport, gebruiksfase en end-of-life (recycling/incineratie) zijn <em>niet</em> inbegrepen in deze berekeningen.
            </div>
          </div>
        </div>
      </div>

      <div className="disclaimer" style={{ marginTop: 20 }}>
        <strong>Disclaimer:</strong> Dit is een hulpmiddel op basis van gemiddelde waarden en openbare data. Resultaten zijn indicatief en geen vervanging voor een gedetailleerde, leverancierspecifieke Life Cycle Assessment (LCA). Voor kritieke toepassingen altijd een gekwalificeerde LCA-expert raadplegen.
      </div>
    </>
  )
}
