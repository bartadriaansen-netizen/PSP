export const MATERIALS = [
  {
    id: 'golfkarton',
    name: 'Golfkarton (corrugated board)',
    virginCO2: 0.55,
    recycledCO2: 0.45,
    waterFactor: 800,
    source: 'FEFCO 2022 LCA (~491 kg/t EU avg). Biogeen C vaak neutraal.',
  },
  {
    id: 'karton',
    name: 'Karton / Solid board / Papier',
    virginCO2: 0.9,
    recycledCO2: 0.7,
    waterFactor: 1200,
    source: 'DEFRA / ADEME gemiddelden. Virgin hoger i.v.m. pulping.',
  },
  {
    id: 'pet',
    name: 'PET (polyethyleentereftalaat)',
    virginCO2: 2.4,
    recycledCO2: 0.95,
    waterFactor: 235,
    source: 'PlasticsEurope + Ercin et al. (blue ~10 L + grey hoog). rPET bespaart ~60%.',
  },
  {
    id: 'hdpe',
    name: 'HDPE (high-density polyethylene)',
    virginCO2: 2.0,
    recycledCO2: 0.8,
    waterFactor: 200,
    source: 'PlasticsEurope eco-profiles + US LCI updates. Goed recyclebaar.',
  },
  {
    id: 'pp',
    name: 'PP (polypropyleen)',
    virginCO2: 1.9,
    recycledCO2: 0.75,
    waterFactor: 180,
    source: 'Vergelijkbaar met HDPE. Vaak gebruikt in verpakkingen en films.',
  },
  {
    id: 'ldpe',
    name: 'LDPE / LLDPE film',
    virginCO2: 2.1,
    recycledCO2: 1.0,
    waterFactor: 220,
    source: 'Film extrusie iets hoger. Recycling van flexibele films lastiger.',
  },
  {
    id: 'glas',
    name: 'Glas (container glass, gemiddeld)',
    virginCO2: 0.85,
    recycledCO2: 0.55,
    waterFactor: 150,
    source: 'FEVE data + studies. Hoog energieverbruik bij virgin, recycled bespaart veel.',
  },
  {
    id: 'aluminium',
    name: 'Aluminium (can stock / folie, gemiddeld)',
    virginCO2: 3.5,
    recycledCO2: 0.6,
    waterFactor: 300,
    source: 'Hoge virgin impact (~8-12), maar EU cans vaak 70-90% recycled → laag gemiddelde.',
  },
  {
    id: 'staal',
    name: 'Staal / Blik (tinplate)',
    virginCO2: 2.0,
    recycledCO2: 0.7,
    waterFactor: 250,
    source: 'EPA WARM + studies. Goede recycling rates in NL/EU.',
  },
  {
    id: 'eps',
    name: 'EPS / Piepschuim (polystyreen)',
    virginCO2: 3.0,
    recycledCO2: 1.5,
    waterFactor: 280,
    source: 'Hoger dan andere plastics i.v.m. blowing agents. Weinig gerecycled.',
  },
]

export function getMaterialById(id) {
  return MATERIALS.find(m => m.id === id)
}

export function getMaterialByName(name) {
  return MATERIALS.find(m => m.name === name)
}

export function calcEffectiveCO2(material, recycledPct) {
  const pct = Math.max(0, Math.min(100, recycledPct || 0))
  return material.virginCO2 * (1 - pct / 100) + material.recycledCO2 * (pct / 100)
}

export function calcTotals(row) {
  const material = MATERIALS.find(m => m.id === row.materialId)
  if (!material || !row.weightG || !row.quantity) return null

  const effectiveCO2 = calcEffectiveCO2(material, row.recycledPct)
  const totalWeightKg = (row.weightG / 1000) * row.quantity
  const totalCO2 = totalWeightKg * effectiveCO2
  const totalWater = totalWeightKg * material.waterFactor

  return { effectiveCO2, totalWeightKg, totalCO2, totalWater }
}
