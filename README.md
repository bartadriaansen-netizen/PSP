# PSP

## ⚽ Penalty Shootout

Een browser-voetbalspel: vijf penalty's tegen een keeper die soms de goede hoek kiest.

**Spelen:** open `index.html` in je browser. Verder niets nodig — geen build, geen
installatie, geen internetverbinding. Alles (beeld, natuurkunde en geluid) zit in
dat ene bestand.

### Besturing

| | |
|---|---|
| Richten | Beweeg je muis of vinger over het doel |
| Kracht laden | Klik/tik en **houd vast** — de krachtbalk pendelt op en neer |
| Schieten | **Laat los** |
| Toetsenbord | Pijltjestoetsen om te richten, **spatie** vasthouden en loslaten |

### De truc van het spel

Kracht is een afweging, geen gratis winst:

- **Hard schieten** = de bal is er eerder dan de keeper volledig gestrekt is. Vol gas
  op de paal wordt vrijwel nooit gepakt — maar je schiet hem net zo vaak naast of
  op het hout.
- **Zacht schieten** = je legt hem precies waar je wilt, maar de keeper heeft alle
  tijd om er nog bij te komen.
- De **stippellijn op de krachtbalk** is de grens: daaronder schiet je zuiver,
  daarboven wordt het gokken.
- **Op het midden mikken** wordt afgestraft — de keeper blijft er regelmatig staan.

De keeper wordt per ronde iets sneller en leest de schutter steeds vaker.

### Technisch

Eén bestand, geen dependencies. Canvas 2D met een echte 3D-projectie (perspectief
op basis van officiële afmetingen: doel 7,32 × 2,44 m, stip op 11 m), zwaartekracht
en een effectboog op het schot. Geluid wordt live gegenereerd met de Web Audio API,
dus er zijn geen audiobestanden. Werkt op desktop en mobiel; de camera zoomt mee met
het schermformaat. De hoogste score wordt in `localStorage` bewaard.
