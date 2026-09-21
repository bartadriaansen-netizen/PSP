/* ===================== TrunkPL – logika aplikacji ===================== */
(function () {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const LS = { wiek: 'trunkpl_wiek', koszyk: 'trunkpl_koszyk', zam: 'trunkpl_zamowienie' };

  const zl = n => n.toFixed(2).replace('.', ',') + ' zł';

  const state = {
    kat: 'wszystko',
    fraza: '',
    koszyk: load(LS.koszyk, {}),        // { id: sztuki }
    zamowienie: load(LS.zam, null),
    slot: KONFIG.sloty[0],
    widok: 'shop',
    timer: null
  };

  function load(k, fb) { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch (e) { return fb; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  const produkt = id => PRODUKTY.find(p => p.id === id);

  /* ---------- bramka wieku ---------- */
  function startAgeGate() {
    if (localStorage.getItem(LS.wiek) === 'tak') return wejdz();
    $('#ageYes').addEventListener('click', () => { localStorage.setItem(LS.wiek, 'tak'); wejdz(); });
    $('#ageNo').addEventListener('click', () => {
      $('#agegate').classList.add('hidden');
      $('#ageblock').classList.remove('hidden');
    });
  }
  function wejdz() {
    $('#agegate').classList.add('hidden');
    $('#app').classList.remove('hidden');
    render();
  }

  /* ---------- butelka (grafika CSS) ---------- */
  function bottleHTML(p) {
    const vod = p.kategoria === 'wodka';
    return `<div class="bottle ${vod ? 'bottle--vodka' : ''}" style="--c:${p.kolor}">
      <div class="bottle__cap"></div>
      <div class="bottle__neck" style="background:linear-gradient(90deg,${p.kolor},${p.kolor2})"></div>
      <div class="bottle__body" style="background:linear-gradient(90deg,${p.kolor} 0%,${p.kolor2} 55%,${p.kolor} 100%)">
        <div class="bottle__label" style="background:linear-gradient(140deg,rgba(255,255,255,.95),rgba(232,236,245,.85));color:${p.kolor2}">
          ${p.nazwa.split(' ').slice(0, 2).join(' ')}
        </div>
      </div>
    </div>`;
  }

  /* ---------- koszyk ---------- */
  function dodaj(id, n = 1) {
    const ile = (state.koszyk[id] || 0) + n;
    if (ile <= 0) delete state.koszyk[id]; else state.koszyk[id] = Math.min(ile, 99);
    save(LS.koszyk, state.koszyk);
    render();
  }
  function pozycje() {
    return Object.entries(state.koszyk).map(([id, ile]) => ({ p: produkt(id), ile })).filter(x => x.p);
  }
  function sztuk() { return pozycje().reduce((s, x) => s + x.ile, 0); }

  function podsumowanie() {
    const poz = pozycje();
    const towar  = poz.reduce((s, x) => s + x.p.cena * x.ile, 0);
    const kaucja = poz.reduce((s, x) => s + x.p.kaucja * x.ile, 0);
    const dostawa = towar === 0 ? 0 : (towar >= KONFIG.darmowaDostawaOd ? 0 : KONFIG.dostawaCena);
    return { poz, towar, kaucja, dostawa, razem: towar + kaucja + dostawa };
  }

  function godzinyOk() {
    const h = new Date().getHours();
    return h >= KONFIG.godzinySprzedazy.od && h < KONFIG.godzinySprzedazy.do;
  }

  /* ---------- nawigacja ---------- */
  function idz(w) {
    state.widok = w;
    ['shop', 'cart', 'checkout', 'order', 'biz'].forEach(v => {
      const el = $('#view' + v[0].toUpperCase() + v.slice(1));
      if (el) el.classList.toggle('hidden', v !== w);
    });
    $$('.bottom__i').forEach(b => b.classList.toggle('is-active', b.dataset.go === w ||
      (w === 'checkout' && b.dataset.go === 'cart')));
    window.scrollTo({ top: 0 });
    render();
  }

  function toast(t) {
    const el = $('#toast');
    el.textContent = t;
    el.classList.remove('hidden');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.add('hidden'), 1800);
  }

  /* ---------- render: sklep ---------- */
  function renderSklep() {
    const f = state.fraza.trim().toLowerCase();
    const lista = PRODUKTY.filter(p =>
      (state.kat === 'wszystko' || p.kategoria === state.kat) &&
      (!f || (p.nazwa + ' ' + (p.browar || p.producent) + ' ' + (p.styl || p.typ)).toLowerCase().includes(f))
    );

    $('#grid').innerHTML = lista.length ? lista.map(p => {
      const ile = state.koszyk[p.id] || 0;
      return `<article class="card" data-id="${p.id}">
        ${p.kategoria === 'wodka' ? '<span class="tagline">0,5 l · 40%</span>' : ''}
        <div class="card__img">${bottleHTML(p)}</div>
        <div class="card__name">${p.nazwa}</div>
        <div class="card__meta">${p.poj} · ${p.alc.toString().replace('.', ',')}% · ${p.browar || p.producent}</div>
        <div class="card__bottom">
          <span class="price">${zl(p.cena)}${p.kaucja ? `<small>+ ${zl(p.kaucja)} kaucji</small>` : '<small>w cenie VAT</small>'}</span>
          ${ile ? `<span class="qty" data-stop="1">
              <button data-minus="${p.id}">−</button><b>${ile}</b><button data-plus="${p.id}">+</button>
            </span>`
            : `<button class="add" data-plus="${p.id}" data-stop="1" aria-label="Dodaj">+</button>`}
        </div>
      </article>`;
    }).join('') : `<p class="muted" style="grid-column:1/-1">Brak wyników dla „${state.fraza}”.</p>`;

    const note = $('#hoursNote');
    if (!godzinyOk()) {
      note.classList.remove('hidden');
      note.innerHTML = `🕙 <strong>Sprzedaż nocna wstrzymana.</strong> Zamówienia realizujemy
        ${KONFIG.godzinySprzedazy.od}:00–${KONFIG.godzinySprzedazy.do}:00. Możesz złożyć zamówienie z dostawą na rano.`;
    } else note.classList.add('hidden');
  }

  /* ---------- render: koszyk ---------- */
  function renderKoszyk() {
    const { poz, towar, kaucja, dostawa, razem } = podsumowanie();
    $('#cartEmpty').classList.toggle('hidden', poz.length > 0);
    $('#cartList').innerHTML = poz.map(({ p, ile }) => `
      <div class="line">
        <div class="line__img">${bottleHTML(p)}</div>
        <div class="line__info">
          <div class="line__name">${p.nazwa}</div>
          <div class="line__sub">${p.poj} · ${zl(p.cena)}/szt.${p.kaucja ? ` · kaucja ${zl(p.kaucja)}` : ''}</div>
          <div class="line__tot">${zl((p.cena + p.kaucja) * ile)}</div>
        </div>
        <span class="qty"><button data-minus="${p.id}">−</button><b>${ile}</b><button data-plus="${p.id}">+</button></span>
      </div>`).join('');

    if (!poz.length) { $('#cartSummary').innerHTML = ''; return; }

    const brakuje = KONFIG.darmowaDostawaOd - towar;
    const pct = Math.min(100, towar / KONFIG.darmowaDostawaOd * 100);
    const podMin = towar < KONFIG.minZamowienie;

    $('#cartSummary').innerHTML = `
      <div class="sum">
        ${dostawa > 0 ? `<div class="small muted">Do darmowej dostawy brakuje <strong style="color:var(--gold)">${zl(brakuje)}</strong></div>
          <div class="progress"><i style="width:${pct}%"></i></div>`
        : `<div class="small" style="color:var(--green)">✅ Dostawa gratis</div>`}
        <div class="sum__r"><span>Produkty (${sztuk()} szt.)</span><span>${zl(towar)}</span></div>
        ${kaucja ? `<div class="sum__r"><span>Kaucja za butelki zwrotne</span><span>${zl(kaucja)}</span></div>` : ''}
        <div class="sum__r"><span>Dostawa</span><span>${dostawa ? zl(dostawa) : 'gratis'}</span></div>
        <div class="sum__r sum__r--tot"><span>Razem</span><span>${zl(razem)}</span></div>
      </div>
      ${podMin ? `<p class="error" style="margin-top:10px">Minimalna wartość zamówienia to ${zl(KONFIG.minZamowienie)}.
        Dodaj produkty za ${zl(KONFIG.minZamowienie - towar)}.</p>` : ''}
      <button class="btn btn--primary btn--lg" style="margin-top:12px" id="toCheckout" ${podMin ? 'disabled' : ''}>
        Przejdź do dostawy · ${zl(razem)}
      </button>`;

    const b = $('#toCheckout');
    if (b && !podMin) b.addEventListener('click', () => idz('checkout'));
  }

  /* ---------- render: zamówienie (formularz) ---------- */
  function renderCheckout() {
    const { towar, kaucja, dostawa, razem } = podsumowanie();
    $('#slots').innerHTML = KONFIG.sloty.map(s =>
      `<button type="button" class="chip ${s === state.slot ? 'is-active' : ''}" data-slot="${s}">${s}</button>`).join('');
    $('#checkoutTotals').innerHTML = `
      <div class="sum">
        <div class="sum__r"><span>Produkty</span><span>${zl(towar)}</span></div>
        ${kaucja ? `<div class="sum__r"><span>Kaucja</span><span>${zl(kaucja)}</span></div>` : ''}
        <div class="sum__r"><span>Dostawa</span><span>${dostawa ? zl(dostawa) : 'gratis'}</span></div>
        <div class="sum__r sum__r--tot"><span>Do zapłaty</span><span>${zl(razem)}</span></div>
      </div>`;
    $('#btnPay').textContent = `Zamawiam i płacę · ${zl(razem)}`;
  }

  /* ---------- render: status zamówienia ---------- */
  const KROKI = [
    { t: 'Zamówienie przyjęte',    s: 'Płatność potwierdzona' },
    { t: 'Kompletujemy zamówienie',s: 'Magazyn chłodniczy Wola' },
    { t: 'Kurier w drodze',        s: 'Weryfikacja wieku przy odbiorze' },
    { t: 'Dostarczone',            s: 'Smacznego!' }
  ];

  function renderZamowienie() {
    const z = state.zamowienie;
    if (!z) {
      $('#viewOrder').querySelector('.ordertop').innerHTML =
        `<div class="ordertop__ico">📦</div><h2>Brak zamówień</h2><p class="muted">Złóż pierwsze zamówienie w sklepie.</p>`;
      $('#track').innerHTML = ''; $('#orderRecap').innerHTML = '';
      $('.courier').classList.add('hidden');
      return;
    }
    $('.courier').classList.remove('hidden');
    $('#viewOrder').querySelector('.ordertop').innerHTML =
      `<div class="ordertop__ico">${z.krok >= 3 ? '🎉' : '✅'}</div>
       <h2>${z.krok >= 3 ? 'Dostarczone' : 'Zamówienie przyjęte'}</h2>
       <p class="muted">Numer <strong>${z.nr}</strong> · ${z.slot}</p>`;

    $('#track').innerHTML = KROKI.map((k, i) => `
      <div class="step ${i < z.krok ? 'done' : i === z.krok ? 'now' : ''}">
        <div class="step__dot">${i < z.krok ? '✓' : i + 1}</div>
        <div><div class="step__t">${k.t}</div><div class="step__s">${k.s}</div></div>
      </div>`).join('');

    $('#orderRecap').innerHTML = `
      <div class="sum">
        ${z.poz.map(x => `<div class="sum__r"><span>${x.ile} × ${x.nazwa}</span><span>${zl(x.suma)}</span></div>`).join('')}
        <div class="sum__r"><span>Dostawa · ${z.platnosc}</span><span>${z.dostawa ? zl(z.dostawa) : 'gratis'}</span></div>
        <div class="sum__r sum__r--tot"><span>Zapłacono</span><span>${zl(z.razem)}</span></div>
      </div>
      <p class="small muted" style="margin-top:10px">Dostawa: ${z.adres} · tel. ${z.tel}</p>`;
  }

  function tykaj() {
    clearInterval(state.timer);
    state.timer = setInterval(() => {
      const z = state.zamowienie;
      if (!z || z.krok >= 3) return clearInterval(state.timer);
      z.krok++;
      save(LS.zam, z);
      if (state.widok === 'order') renderZamowienie();
      if (z.krok === 2) toast('🛵 Kurier wyruszył w Twoją stronę');
      if (z.krok === 3) toast('🎉 Zamówienie dostarczone');
    }, 6000);
  }

  /* ---------- render: dla inwestorów ---------- */
  function renderBiz() {
    const srednia = PRODUKTY.reduce((s, p) => s + p.cena, 0) / PRODUKTY.length;
    const marzaSzt = PRODUKTY.reduce((s, p) => s + (p.cena - p.cenaSklep), 0) / PRODUKTY.length;
    const koszyk = 96;                       // zakładany średni koszyk (PLN)
    const marzaKoszyk = koszyk * (KONFIG.marza / (1 + KONFIG.marza));
    const kosztDostawy = 11.5;
    const cm = marzaKoszyk + KONFIG.dostawaCena * 0.42 - kosztDostawy;

    $('#viewBiz').innerHTML = `
      <div class="viewhead"><h2>TrunkPL dla inwestorów</h2></div>
      <p class="muted small">Model: quick-commerce alkoholowy. Ceny = cena marketowa +${KONFIG.marza * 100}% marży.
      Liczby poniżej to założenia demonstracyjne dla pilotażu w Warszawie.</p>

      <div class="kpis" style="margin-top:14px">
        <div class="kpi"><b>${zl(koszyk)}</b><small>Średnia wartość koszyka</small></div>
        <div class="kpi"><b>${(KONFIG.marza * 100).toFixed(0)}%</b><small>Narzut na cenę marketową</small></div>
        <div class="kpi"><b>${zl(cm)}</b><small>Marża po koszcie dostawy</small></div>
        <div class="kpi"><b>42 min</b><small>Średni czas dostawy</small></div>
      </div>

      <div class="bizbox">
        <h3>Ekonomia jednego zamówienia</h3>
        <table class="tbl">
          <tr><td>Wartość koszyka</td><td>${zl(koszyk)}</td></tr>
          <tr><td>Koszt zakupu towaru</td><td>−${zl(koszyk - marzaKoszyk)}</td></tr>
          <tr><td>Marża brutto na towarze</td><td>${zl(marzaKoszyk)}</td></tr>
          <tr><td>Opłata za dostawę (42% zamówień)</td><td>${zl(KONFIG.dostawaCena * 0.42)}</td></tr>
          <tr><td>Koszt kuriera i pakowania</td><td>−${zl(kosztDostawy)}</td></tr>
          <tr><td>Wkład na zamówienie</td><td>${zl(cm)}</td></tr>
        </table>
      </div>

      <div class="bizbox">
        <h3>Zamówienia / miesiąc (projekcja)</h3>
        <div class="bars">
          ${[18, 26, 34, 46, 58, 72, 90].map((h, i) =>
            `<div style="height:${h}%"><em>M${i + 1}</em></div>`).join('')}
        </div>
        <p class="small muted" style="margin-top:24px">Wzrost napędzany gęstością dostaw w obrębie jednej dzielnicy –
        każdy kolejny kurier obsługuje więcej zamówień na godzinę.</p>
      </div>

      <div class="bizbox">
        <h3>Asortyment</h3>
        <table class="tbl">
          <tr><td>Piwo 0,5 l (butelka zwrotna)</td><td>${PIWA.length} SKU</td></tr>
          <tr><td>Wódka 0,5 l</td><td>${WODKI.length} SKU</td></tr>
          <tr><td>Średnia cena w aplikacji</td><td>${zl(srednia)}</td></tr>
          <tr><td>Średnia marża na sztuce</td><td>${zl(marzaSzt)}</td></tr>
        </table>
      </div>

      <div class="bizbox">
        <h3>Zgodność z prawem</h3>
        <p class="small muted" style="margin:0">Weryfikacja wieku 18+ w aplikacji i ponownie przy odbiorze.
        Sprzedaż tylko w godzinach ${KONFIG.godzinySprzedazy.od}:00–${KONFIG.godzinySprzedazy.do}:00.
        Zezwolenie na sprzedaż napojów alkoholowych, punkt stacjonarny + dowóz.
        Kaucja za butelki zwrotne rozliczana zgodnie z systemem kaucyjnym.</p>
      </div>`;
  }

  /* ---------- render główny ---------- */
  function render() {
    if ($('#app').classList.contains('hidden')) return;
    if (state.widok === 'shop') renderSklep();
    if (state.widok === 'cart') renderKoszyk();
    if (state.widok === 'checkout') renderCheckout();
    if (state.widok === 'order') renderZamowienie();
    if (state.widok === 'biz') renderBiz();

    const n = sztuk(), { razem } = podsumowanie();
    $('#cartBadge').textContent = n;
    $('#cartBadge').classList.toggle('hidden', n === 0);
    const bar = $('#cartBar');
    bar.classList.toggle('hidden', n === 0 || state.widok !== 'shop');
    $('#cartBarN').textContent = n;
    $('#cartBarSum').textContent = zl(razem);
  }

  /* ---------- arkusz produktu ---------- */
  function otworzSheet(id) {
    const p = produkt(id);
    const ile = state.koszyk[id] || 0;
    $('#sheetCard').innerHTML = `
      <div class="sheet__grab"></div>
      <div class="sheet__top">
        <div style="flex:0 0 70px;display:flex;justify-content:center">${bottleHTML(p)}</div>
        <div style="flex:1">
          <h2>${p.nazwa}</h2>
          <p class="small muted" style="margin:2px 0 0">${p.browar || p.producent}</p>
          <div class="speclist">
            <span class="spec">${p.poj}</span>
            <span class="spec">${p.alc.toString().replace('.', ',')}% alk.</span>
            <span class="spec">${p.styl || p.typ}</span>
            ${p.kaucja ? '<span class="spec">butelka zwrotna</span>' : ''}
          </div>
          <div class="price" style="font-size:22px">${zl(p.cena)}
            ${p.kaucja ? `<small>+ ${zl(p.kaucja)} kaucji</small>` : ''}</div>
        </div>
      </div>
      <p class="muted" style="font-size:13.5px">${p.opis}</p>
      <p class="small muted">Cena w markecie ok. ${zl(p.cenaSklep)} – w TrunkPL płacisz za dostawę do drzwi w 45 minut.</p>
      ${ile ? `<div class="line" style="margin-top:12px">
          <div class="line__info"><div class="line__name">W koszyku</div>
          <div class="line__sub">${ile} szt. · ${zl((p.cena + p.kaucja) * ile)}</div></div>
          <span class="qty"><button data-minus="${p.id}">−</button><b>${ile}</b><button data-plus="${p.id}">+</button></span>
        </div>` : ''}
      <button class="btn btn--primary btn--lg" style="margin-top:14px" data-plus="${p.id}">Dodaj do koszyka</button>
      <button class="btn btn--ghost" data-close="1">Zamknij</button>`;
    $('#sheet').classList.remove('hidden');
  }
  const zamknijSheet = () => $('#sheet').classList.add('hidden');

  /* ---------- zdarzenia ---------- */
  document.addEventListener('click', e => {
    const t = e.target;

    const plus = t.closest('[data-plus]');
    if (plus) {
      e.stopPropagation();
      dodaj(plus.dataset.plus, 1);
      if (!$('#sheet').classList.contains('hidden')) {
        if (t.classList.contains('btn')) { zamknijSheet(); toast('Dodano do koszyka'); }
        else otworzSheet(plus.dataset.plus);
      } else if (state.widok === 'shop') toast('Dodano do koszyka');
      return;
    }
    const minus = t.closest('[data-minus]');
    if (minus) {
      e.stopPropagation();
      const id = minus.dataset.minus;
      dodaj(id, -1);
      if (!$('#sheet').classList.contains('hidden')) {
        otworzSheet(id);
      }
      return;
    }
    if (t.closest('[data-close]')) return zamknijSheet();

    const card = t.closest('.card');
    if (card) return otworzSheet(card.dataset.id);

    const go = t.closest('[data-go]');
    if (go) return idz(go.dataset.go);

    const tab = t.closest('.tab');
    if (tab) {
      state.kat = tab.dataset.kat;
      $$('.tab').forEach(x => x.classList.toggle('is-active', x === tab));
      return render();
    }
    const slot = t.closest('[data-slot]');
    if (slot) {
      state.slot = slot.dataset.slot;
      $$('[data-slot]').forEach(x => x.classList.toggle('is-active', x === slot));
      return;
    }
    if (t.closest('#cartBar')) return idz('cart');
    if (t.closest('#btnInfo')) return toast('TrunkPL · wersja demo dla inwestorów');
    if (t.closest('#btnAddr')) return toast('Dostawa: Warszawa, Śródmieście i okolice');
  });

  $('#search').addEventListener('input', e => { state.fraza = e.target.value; renderSklep(); });

  $('#formCheckout').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target, err = $('#formError');
    const d = Object.fromEntries(new FormData(f).entries());
    const brak = ['imie', 'tel', 'kod', 'adres'].filter(k => !(d[k] || '').trim());

    if (brak.length) return pokazBlad(err, 'Uzupełnij wszystkie wymagane pola.');
    if (!/^[0-9 +\-]{9,15}$/.test(d.tel)) return pokazBlad(err, 'Podaj poprawny numer telefonu.');
    if (!/^\d{2}-\d{3}$/.test(d.kod)) return pokazBlad(err, 'Kod pocztowy w formacie 00-001.');
    if (!d.oswiadczenie) return pokazBlad(err, 'Potwierdź, że masz ukończone 18 lat.');
    err.classList.add('hidden');

    const { poz, dostawa, razem } = podsumowanie();
    state.zamowienie = {
      nr: 'TPL-' + Math.floor(100000 + Math.random() * 899999),
      krok: 0,
      slot: state.slot,
      adres: d.adres,
      tel: d.tel,
      platnosc: d.platnosc,
      dostawa,
      razem,
      poz: poz.map(x => ({ nazwa: x.p.nazwa, ile: x.ile, suma: (x.p.cena + x.p.kaucja) * x.ile }))
    };
    save(LS.zam, state.zamowienie);
    state.koszyk = {}; save(LS.koszyk, state.koszyk);
    f.reset();
    idz('order');
    tykaj();
    toast('Płatność ' + d.platnosc + ' zaakceptowana');
  });

  function pokazBlad(el, txt) { el.textContent = txt; el.classList.remove('hidden'); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }

  /* ---------- start ---------- */
  startAgeGate();
  if (state.zamowienie && state.zamowienie.krok < 3) tykaj();
})();
