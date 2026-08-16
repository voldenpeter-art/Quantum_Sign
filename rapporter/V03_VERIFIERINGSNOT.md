# V03_VERIFIERINGSNOT.md

## Fas 1 — verifieringspass inför v0.3-revisionen

*Leverans 1 av 12 enligt `V03_INSTRUKTIONSDOKUMENT.md` Del 8. Fas 1 är klar när
varje rad i Del 4 har en status. Detta dokument ger status per referens enligt
V-regeln: **ingen v0.3-ändring genomförs på en referens som inte kunnat
verifieras mot primärkälla.***

**Datum:** 2026-08-13. **Statusar:** `VERIFIERAD` / `MOTBEVISAD` /
`EJ VERIFIERBAR`.

---

## 1. Sammanfattning

Sex poster stod som `EJ VERIFIERAD` i instruktionsdokumentets Del 2.3 och
Bilaga A. Fyra är nu verifierade mot primärkälla, två förblir icke
verifierbara därför att påståendena aldrig specificerats tillräckligt för att
kunna prövas.

De två prioriterade posterna — LIGO:s dB-storhet och processtensorns rätta
primärkälla — verifierades i förarbetet och redovisas i §2 med de fynd som
följde.

| Post | Berör | Status |
|---|---|---|
| LIGO dB-storhet (PRX 13, 041021) | G | **VERIFIERAD** + omräkningsfälla identifierad |
| Processtensorns ramverkskälla | F | **VERIFIERAD** + delning i tre citat föreslagen |
| Virgo 8,5 / 5,6 dB | G | **VERIFIERAD** — PRL 131, 041403 (2023) |
| VERITAS/H.E.S.S. SII g² | A | **VERIFIERAD** — tre oberoende instrument |
| H.E.S.S. tredjeordningskorrelation g³ | B (och A) | **VERIFIERAD** — nu publicerad i MNRAS |
| Cosmic Bell / loopholefria Bell 2015–2018 | C | **VERIFIERAD** — se §3.4 |
| EPR-steering-gränser | C | **EJ VERIFIERBAR** — påståendet ospecificerat |
| "PTT-fidelity 0,99 för 10 kubitar" | tröskelvillkor | **EJ VERIFIERBAR** — påståendet ospecificerat |

---

## 2. De två prioriterade posterna

### 2.1 LIGO-squeezingens dB-storhet — VERIFIERAD, med omräkningsfälla

**Referens:** Ganapathy et al., *Phys. Rev. X* **13**, 041021 (2023).

**Verifierat:** 300 m filterkavitet, 15–18 % räckviddsökning. Referensen är
korrekt och bär de påståenden G v0.2 gör om den.

**Fyndet som betyder mer än siffran:** granskningsdokumentet och källan anger
dB i olika storheter — amplitud kontra effekt. Det är inte en redaktionell
detalj utan en **omräkningsfälla i G:s framåtmodell**: en amplitudfaktor *a*
måste kvadreras innan den går in som varians, V = 1/a². Blandas storheterna får
förlustbudgeten fel med en faktor två i exponenten.

**Åtgärd i Fas 2:** G v0.3 §6.2 skrivs om så att härledningen anger storhet
explicit vid varje steg, och en omräkningsrad läggs in i kalibreringskedjan.

### 2.2 Processtensorns primärkälla — VERIFIERAD, med delning

**Motbevisat:** arXiv:2509.07661 (Keeling, Stoudenmire, Bañuls, Reichman) är en
perspektivartikel om **numeriska simuleringsmetoder** för icke-markovsk dynamik,
inte ett vittnes- eller mätramverk. Den kan inte bära påståendet att BLP och RHP
"underordnas" processtensorn. Detta står fast.

**Verifierad rätt källa:** Pollock, Rodríguez-Rosario, Frauenheim, Paternostro &
Modi, *"Non-Markovian quantum processes: Complete framework and efficient
characterization"*, **Phys. Rev. A 97, 012127 (2018)**.

**Rekommendation:** dela i tre citat, eftersom ett enda inte bär hela
påståendet — (i) PRA 97, 012127 för ramverket, (ii) PRL 120, 040405 för det
operationella Markov-villkoret, (iii) Milz & Modi:s översikt i PRX Quantum för
den samlade behandlingen.

**Öppen detalj:** en volymnummerdiskrepans noterades vid verifieringen och ska
lösas innan citaten skrivs in i F v0.3.

---

## 3. De fyra övriga posterna

### 3.1 Virgo-squeezing — VERIFIERAD

**Referens:** Virgo Collaboration, *"Frequency-Dependent Squeezed Vacuum Source
for the Advanced Virgo Gravitational-Wave Detector"*, **Phys. Rev. Lett. 131,
041403 (2023)**.

**Verifierade siffror, ordagrant ur källan:** cirka **8,5 dB genererad
squeezing**; upp till **5,6 dB kvantbrusundertryckning** uppmätt vid hög
frekvens; nära filterkavitetens resonansfrekvens begränsar intrakavitetsförluster
värdet till **cirka 2 dB**. Rotationsfrekvensstabilitet cirka 6 Hz RMS.

**Rättelse att införa i G v0.3:** Virgos filterkavitet är **285 m**, inte 300 m.
LIGO:s är 300 m. Blandas de i samma stycke blir båda fel.

**Kontextsiffra (verifierad i samma sökning, användbar i G §10 roll 2):**
frekvensberoende squeezing i LIGO under O4 ökade detektionsfrekvensen för
gravitationsvågor med upp till 65 %.

**Betydelse för katalogen:** siffrorna stärker G:s mognadsreferens (§10 roll 2)
och ger ett andra oberoende instrument utöver LIGO. De rör inte G:s
vittnesdefinition och kräver ingen ändring av klassningen.

### 3.2 VERITAS/H.E.S.S. stellar intensity interferometry — VERIFIERAD

Tre oberoende instrument med publicerade g²-mätningar på stjärnljus:

| Instrument | Referens | Innehåll |
|---|---|---|
| **VERITAS** | Abeysekara et al., *Nature Astronomy* **4**, 1164 (2020) | β CMa och ε Ori, vinkeldiameter med >5 % precision, fyra 12 m-teleskop, offline-korrelation |
| **VERITAS** | Acciari et al., *ApJ* (2024), doi 10.3847/1538-4357/ad2b68 | β UMa, första vinkeldiametern vid visuella våglängder; 416 nm smalbandsfilter, ~13 nm bandpass |
| **MAGIC** | Acciari et al., *MNRAS* **491**, 1540 (2019) | Optisk intensitetsinterferometri med IACT |
| **H.E.S.S.** | Zmija et al. (2024) | Andra ordningens korrelationer; underlag för g³-arbetet i §3.3 |

**Ytterligare verifierat:** VERITAS har sedan 2019 observerat **över 40 stjärnor**
med m_v < 3,8 och vinkeldiametrar 0,4–1,2 mas under starkt månljus, då
gammaobservationer ändå inte är möjliga.

**Betydelse för katalogen:** detta stärker A:s §12 (valideringsläge mot
litteraturen) väsentligt. Metodkedjan är inte bara legitim utan i rutinmässig
drift på tre instrument. Den observationsstrategiska detaljen — SII körs under
månljus när gammaastronomin ändå pausar — är värd att skriva in i A v0.3 §10
(A-Astro), eftersom den betyder att observationstid för intensitetsinterferometri
är **billig** på befintlig infrastruktur.

### 3.3 H.E.S.S. tredjeordningskorrelation — VERIFIERAD, nu publicerad

**Referens:** Zmija, Anton, Mitchell, Saha, Silva Batista, Vogel, Zink, Kaiser &
Funk, *"Towards measuring astrophysical third order correlation functions with
the H.E.S.S. optical intensity interferometer"*, **MNRAS 546** (2026);
arXiv:2512.13485.

**Verifierat innehåll:** första uppmätta tredjeordningskorrelationerna för
astrofysikaliska mål — Nunki (σ Sgr, mag_B = 1,9; 105 minuters
tretelekopsdata) och Dschubba (δ Sco, mag_B = 2,2; 372 minuter). Kampanjer
2022 och 2023, totalt cirka 72,5 timmar, fem stjärnsystem med uppmätta
vinkeldiametrar. Fotomultiplikatorer digitaliserade var 1,6 ns, offline-korrelation.
Syftet är slutningsfasen (cos φ), som tredjeordningskorrelationer ger tillgång
till.

**Observation som instruktionsdokumentet inte gör:** posten är listad under **B**
(önskvärd), men den är minst lika relevant för **A**. A:s signaturfamilj S_A
innehåller de högre faktoriella kumulanterna κ₃ᶠ och κ₄ᶠ, och detta är den
första astrofysikaliska mätningen av tredjeordningskorrelation över huvud taget.
Att signal-brus-förhållandet för trefotonkorrelationer beskrivs som för litet för
nuvarande generations instrument är därtill en **direkt empirisk kalibrering av
A:s kontrastbudget i κ-regimen** — precis den sorts siffra G_A-gaten behöver.

**Åtgärd i Fas 2:** posten flyttas från B:s önskvärda till A:s underlag för
§11.2 (kandidatmatrisen), med B som sekundär avnämare.

### 3.4 Cosmic Bell och loopholefria Bell-experiment — VERIFIERAD

Dessa referenser verifierades i granskningsrundan för C v0.2 och i
NIST-korrespondensen, och de är etablerade primärkällor:

| Experiment | Referens |
|---|---|
| Loopholefritt Bell, elektronspinn i diamant | Hensen et al., *Nature* **526**, 682 (2015) |
| Loopholefritt Bell, fotoner (NIST) | Shalm et al., *PRL* **115**, 250402 (2015) |
| Loopholefritt Bell, fotoner (Wien) | Giustina et al., *PRL* **115**, 250401 (2015) |
| Cosmic Bell, stjärnljus som slumpkälla | Handsteiner et al., *PRL* **118**, 060401 (2017) |
| Cosmic Bell, kvasarljus | Rauch et al., *PRL* **121**, 080403 (2018) |

**Direkt bekräftelse:** NIST:s Krister Shalm har i korrespondens med detta
projekt bekräftat två odokumenterade artefakter i 2015 års rådata (en
firmware-bugg med hoppande tidsstämplar och ett hjärtslag på kanal 64), samt
bekräftat att analysen vilade på synkpulsernas relativa positioner snarare än
absoluta tidsstämplar.

**Åtgärd i Fas 2:** C v0.3 §7.2 kan dokumentera settings-oberoende i Cosmic
Bell-anda enligt instruktionsdokumentets 4.C punkt 2. Den önskvärda ändringen är
därmed **upplåst**.

---

## 4. De två icke verifierbara posterna

### 4.1 EPR-steering-gränser — EJ VERIFIERBAR

Granskningsdokumentet anger "EPR-steering-gränser" utan att specificera vilken
gräns, vilket system eller vilken publikation. Litteraturen är omfattande och
gränserna beror på antal mätinställningar, dimension och antaganden — det finns
ingen enskild storhet att verifiera.

**Följd enligt V-regeln:** ingen ändring genomförs. Om steering ska införas i C
v0.3 krävs först ett preciserat påstående med angiven källa; posten står kvar
som öppen.

**Bedömning:** steering är begreppsligt intressant för katalogen som
mellannivå mellan entanglement och Bell-nonlokalitet — asymmetriskt, med
ensidiga apparatoberoende antaganden. Men det är ett **eget protokollarbete**,
inte en referensändring i C.

### 4.2 "PTT-fidelity 0,99 för 10 kubitar" — EJ VERIFIERBAR

Påståendet saknar källa, och förkortningen PTT är inte definierad i något
katalogdokument. Ett tröskelvillkor kan inte införas på en siffra vars innebörd
inte går att fastställa.

**Följd enligt V-regeln:** ingen ändring genomförs. Posten avförs tills en källa
och en definition levereras.

---

## 5. Fynd utöver uppdraget

Två saker framkom under verifieringen som inte stod på listan men bör noteras:

**5.1 Virgos kavitetslängd** (285 m mot LIGO:s 300 m) är en faktisk felkälla i
G:s befintliga text om båda nämns i samma stycke. Rättas i Fas 2.

**5.2 Tredjeordningsposten är felplacerad** (§3.3). Att den listats under B och
inte A är sannolikt ett arv från granskningsdokumentets egen struktur; A:s
κ-nivå är dess rätta hemvist.

---

## 6. Fas 1:s status

**Fas 1 är avslutad** i den mening instruktionsdokumentet kräver: varje post i
Del 2.3 och Bilaga A har nu en status.

| Kategori | Antal |
|---|---|
| VERIFIERAD | 6 |
| MOTBEVISAD | 1 (arXiv:2509.07661 som vittnesramverk — konstaterat i förarbetet) |
| EJ VERIFIERBAR | 2 |

**Kvarstående detalj före Fas 2:** volymnummerdiskrepansen i processtensorcitaten
(§2.2) ska lösas, eftersom F v0.3 är blockerad på den.

**Vad som är upplåst för Fas 2:**

| Signatur | Upplåst av | Ändringens art |
|---|---|---|
| **G** | §2.1, §3.1 | Tvingande: dB-storhet och omräkningsfälla; rättelse av kavitetslängd |
| **F** | §2.2 | Tvingande, efter volymnummerkontroll: tre citat i stället för ett |
| **A** | §3.2, §3.3 | Underlag till §11.2 och §12; observationsstrategisk not om månljusfönster |
| **C** | §3.4 | Önskvärd: settings-oberoende i Cosmic Bell-anda |
| **B** | §3.3 | Sekundär avnämare av g³-referensen |

**Vad som förblir låst:** EPR-steering och PTT-fidelity. Ingen ändring i C eller
i tröskelvillkoren på dessa grunder.

---

## 7. Rekommenderad ordning för Fas 2

Instruktionsdokumentets ordning står fast och bekräftas av verifieringen:

1. **Tvärgående regler** (metodbiblioteket) — de ändrar flera rapporter
2. **G** — fristående och nu fullt verifierad, inklusive den nya
   omräkningsfällan
3. **E och M** — informationsestimator-standarden, gemensam
4. **F** — kräver att volymnummerfrågan löses först
5. **H** — GNOME-nullen, verifierad sedan tidigare
6. **A, B, C, D** — A får nytt underlag, C får en upplåst önskvärd ändring,
   B och D är i huvudsak dokumentation

---

## Ändringslogg

2026-08-13: dokumentet upprättat. Sex poster verifierade mot primärkälla, två
avförda som icke verifierbara. Två fynd utöver uppdraget noterade.
