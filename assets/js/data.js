/* =========================================================
   TrunkPL – dane produktowe
   cenaSklep = typowa cena w polskim markecie (PLN)
   cena      = cenaSklep + 50% marży (cena w aplikacji)
   kaucja    = butelka szklana wielorazowa (system kaucyjny)
   ========================================================= */

const MARZA = 0.5;

function zMarza(cenaSklep) {
  return Math.round(cenaSklep * (1 + MARZA) * 100) / 100;
}

const PIWA = [
  { id: 'tyskie',    nazwa: 'Tyskie Gronie',        browar: 'Kompania Piwowarska', styl: 'Lager jasny',      alc: 5.2, cenaSklep: 4.19, kolor: '#c4161c', kolor2: '#7a0b10', opis: 'Klasyk z Tychów. Wyrazisty, chmielowy finisz.' },
  { id: 'zywiec',    nazwa: 'Żywiec Jasne Pełne',   browar: 'Grupa Żywiec',        styl: 'Lager jasny',      alc: 5.6, cenaSklep: 4.49, kolor: '#d21f26', kolor2: '#111827', opis: 'Pełny, zbalansowany smak z tradycją od 1856 r.' },
  { id: 'lech',      nazwa: 'Lech Premium',         browar: 'Kompania Piwowarska', styl: 'Pils',             alc: 5.2, cenaSklep: 4.29, kolor: '#1f7a3f', kolor2: '#0d3d20', opis: 'Orzeźwiający pils o czystym, chmielowym profilu.' },
  { id: 'zubr',      nazwa: 'Żubr',                 browar: 'Kompania Piwowarska', styl: 'Lager jasny',      alc: 6.0, cenaSklep: 4.09, kolor: '#166534', kolor2: '#052e16', opis: 'Łagodne, słodowe piwo z Białegostoku.' },
  { id: 'warka',     nazwa: 'Warka Jasne Pełne',    browar: 'Grupa Żywiec',        styl: 'Lager jasny',      alc: 5.7, cenaSklep: 3.99, kolor: '#b91c1c', kolor2: '#450a0a', opis: 'Mocny słodowy charakter, piwo z Mazowsza.' },
  { id: 'harnas',    nazwa: 'Harnaś Jasne Pełne',   browar: 'Grupa Żywiec',        styl: 'Lager jasny',      alc: 6.0, cenaSklep: 3.49, kolor: '#0f766e', kolor2: '#042f2e', opis: 'Góralska moc w dobrej cenie.' },
  { id: 'okocim',    nazwa: 'Okocim Jasne Pełne',   browar: 'Carlsberg Polska',    styl: 'Lager jasny',      alc: 5.6, cenaSklep: 3.79, kolor: '#a16207', kolor2: '#422006', opis: 'Tradycja browaru z Brzeska od 1845 r.' },
  { id: 'perla',     nazwa: 'Perła Chmielowa',      browar: 'Perła – Browary Lub.',styl: 'Lager jasny',      alc: 6.0, cenaSklep: 4.39, kolor: '#1d4ed8', kolor2: '#0c1f5c', opis: 'Lubelski chmiel, wyraźna goryczka.' },
  { id: 'ksiazece',  nazwa: 'Książęce Złote Pszen.',browar: 'Kompania Piwowarska', styl: 'Pszeniczne',       alc: 4.9, cenaSklep: 5.49, kolor: '#ca8a04', kolor2: '#4a2c04', opis: 'Niefiltrowane pszeniczne, nuty goździków.' },
  { id: 'lomza',     nazwa: 'Łomża Export',         browar: 'Van Pur',             styl: 'Lager jasny',      alc: 5.7, cenaSklep: 3.99, kolor: '#be123c', kolor2: '#4c0519', opis: 'Podlaski klasyk, pełny i słodowy.' },
  { id: 'specjal',   nazwa: 'Specjal Jasne Pełne',  browar: 'Grupa Żywiec',        styl: 'Lager jasny',      alc: 5.7, cenaSklep: 3.69, kolor: '#0369a1', kolor2: '#082f49', opis: 'Piwo z Elbląga o gładkim, czystym smaku.' },
  { id: 'tatra',     nazwa: 'Tatra Jasne Pełne',    browar: 'Grupa Żywiec',        styl: 'Lager jasny',      alc: 6.0, cenaSklep: 3.69, kolor: '#334155', kolor2: '#0f172a', opis: 'Mocne piwo w góralskim stylu.' }
].map(p => ({
  ...p,
  kategoria: 'piwo',
  poj: '0,5 l',
  pojL: 0.5,
  kaucja: 1.00,
  cena: zMarza(p.cenaSklep)
}));

const WODKI = [
  { id: 'zubrowka',  nazwa: 'Żubrówka Biała',   producent: 'Żubrówka',       typ: 'Wódka czysta żytnia', alc: 40, cenaSklep: 32.99, kolor: '#15803d', kolor2: '#052e16', opis: 'Najpopularniejsza polska wódka żytnia. Czysta i miękka.' },
  { id: 'wyborowa',  nazwa: 'Wyborowa',         producent: 'Pernod Ricard',  typ: 'Wódka czysta żytnia', alc: 40, cenaSklep: 31.99, kolor: '#b45309', kolor2: '#431407', opis: 'Ikona eksportowa z Poznania, produkowana od 1927 r.' },
  { id: 'pantadeusz',nazwa: 'Pan Tadeusz',      producent: 'Polmos Łańcut',  typ: 'Wódka czysta',        alc: 40, cenaSklep: 33.99, kolor: '#7f1d1d', kolor2: '#2b0808', opis: 'Szlachetna, wielokrotnie destylowana klasyka.' },
  { id: 'stock',     nazwa: 'Stock Prestige',   producent: 'Stock Polska',   typ: 'Wódka czysta',        alc: 40, cenaSklep: 30.99, kolor: '#1e3a8a', kolor2: '#0b1533', opis: 'Sześciokrotnie destylowana, delikatna w smaku.' }
].map(p => ({
  ...p,
  kategoria: 'wodka',
  poj: '0,5 l',
  pojL: 0.5,
  kaucja: 0,
  cena: zMarza(p.cenaSklep)
}));

const PRODUKTY = [...PIWA, ...WODKI];

const KONFIG = {
  dostawaCena: 14.99,
  darmowaDostawaOd: 149,
  minZamowienie: 50,
  godzinySprzedazy: { od: 6, do: 22 },   // ustawowy zakaz nocnej sprzedaży
  marza: MARZA,
  miasto: 'Warszawa',
  sloty: ['Ekspres – do 45 min', 'Dziś 18:00 – 19:00', 'Dziś 19:00 – 20:00', 'Dziś 20:00 – 21:00', 'Jutro 12:00 – 13:00']
};
