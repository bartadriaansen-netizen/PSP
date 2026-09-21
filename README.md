# TrunkPL – demo-app alcoholbezorging (PL)

Mobiele webapp (in het Pools) waarmee klanten Pools bier van 0,5 l en wodka bestellen.
Gebouwd als **werkende demo voor investeerders**: geen build, geen dependencies, geen backend.
Open `index.html` en het draait.

## Starten

```bash
# optie 1 – dubbelklik
open index.html

# optie 2 – lokale server (nodig voor PWA-installatie op de telefoon)
python3 -m http.server 8080
# → http://localhost:8080
```

Op de telefoon: open de URL in Chrome/Safari → "Toevoegen aan beginscherm". Dan opent hij
fullscreen als echte app (manifest + icoon zitten erin).

## Wat de app kan

| Scherm | Inhoud |
|---|---|
| Bramka wieku | 18+ check, keuze onthouden in localStorage |
| Sklep | 16 producten, zoeken, filteren (Wszystko / Piwo / Wódka), productdetail-sheet |
| Koszyk | aantallen, statiegeld, bezorgkosten, voortgangsbalk gratis bezorging, minimumbedrag |
| Dostawa i płatność | adresformulier met validatie, tijdslots, BLIK / karta / Przelewy24 / gotówka, 18+ verklaring |
| Zamówienie | ordernummer, live statustracker (4 stappen, loopt vanzelf door), koerier, samenvatting |
| Biznes | investeerdersscherm: unit economics, marge, projectie, assortiment, juridische compliance |

Winkelwagen en bestelling overleven het sluiten van de app (localStorage).

## Prijsopbouw

Elk product heeft `cenaSklep` (gangbare prijs in een Poolse supermarkt) en daarop **+50% marge**:

```
cena = cenaSklep × 1,5
```

Voorbeelden: Tyskie 4,19 → **6,29 zł** · Żywiec 4,49 → **6,74 zł** ·
Żubrówka Biała 32,99 → **49,49 zł** · Wyborowa 31,99 → **47,99 zł**.

Assortiment: 12 bieren 0,5 l (Tyskie, Żywiec, Lech, Żubr, Warka, Harnaś, Okocim, Perła,
Książęce, Łomża, Specjal, Tatra) en 4 wodka's 0,5 l (Żubrówka Biała, Wyborowa, Pan Tadeusz,
Stock Prestige).

## Poolse realiteit die erin verwerkt zit

- **Kaucja 1,00 zł** per glazen retourfles bier (system kaucyjny), apart op de bon.
- **Verkoopvenster 6:00–22:00** – buiten die uren toont de app een melding.
- **Leeftijdscontrole twee keer**: in de app en nogmaals door de koerier bij de deur.
- Bezorgkosten 14,99 zł, gratis vanaf 149 zł, minimumbestelling 50 zł.

## Aanpassen

- Producten en prijzen: `assets/js/data.js` (ook marge, bezorgkosten, tijdslots in `KONFIG`).
- Logica en schermen: `assets/js/app.js`.
- Styling: `assets/css/style.css`.

## Let op

Demoversie. Er is geen echte betaling, geen voorraadkoppeling en geen server.
Voor productie zijn nodig: vergunning voor alcoholverkoop (zezwolenie), echte
leeftijdsverificatie, PSP-integratie (BLIK/Przelewy24), kassakoppeling en logistiek.
