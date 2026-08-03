# Bryggan IBM → Quantum_Sign, v1

*Import av sanerad gate-model-shotdata från `ibm_marrakesh` (2026-08-02/03) in i
signaturkatalogens analyskedja. Sex jobb, 40 PUB:ar, 163 840 shots.*

---

## 0. Bindande villkor och hur de uppfylldes

BRYGGSPEC §0 ställer två krav som inte får förhandlas:

| Krav | Hur det uppfylls |
|---|---|
| Ingen konvertering till `PhotonEvent` | Bryggan har en egen typ, `IBMShotRecord`. Den rör aldrig `types/events.ts`. |
| Inga syntetiska tidsstämplar | Ingenstans i bryggan skrivs ett `t` eller `detectedT`. Fotonvägens `extractChshPairs` anropas aldrig. |

Nyckelfyndet som gjorde detta enkelt: **`C_chsh.ts` hade redan en pardirekt
kärna.** `computeS(pairs)` tar färdiga par och vet ingenting om hur de bildades;
det är bara `extractChshPairs` som är tidsstämpelbaserad. Bryggan behövde alltså
ingen ny estimator — bara en väg in i den befintliga. `ChshPair` och `computeS`
exporterades; ingen rad i beräkningen ändrades.

Alternativet — att syntetisera tidsstämplar för att återanvända fotonvägen orörd
— avvisades. Det vore ett metodfel av samma klass som B-rapportens S2-bugg:
nollhypoteserna (accidentals, time-slide) skulle testa en fysik som inte finns i
datan, och de skulle *passera*, eftersom en påhittad tidsaxel inte har några
äkta koincidenser att förstöra.

---

## 1. Reproduktionskravet — uppfyllt

Villkoret var att C-analysatorn ska reproducera den oberoende
Python-direktberäkningen ur IBM:s `BitArray` **exakt**. Gör den inte det är
bryggan fel, inte datan.

```
  S:       2.5317383 mot 2.5317383   diff 1.88e-8
  sigma_S: 0.0241785 mot 0.0241785   diff 2.91e-8
  PASS
```

Alla fyra korrelatorerna reproduceras också:

| Settingpar | E | n |
|---|---|---|
| (0,0) | +0,619629 | 4096 |
| (0,1) | −0,607910 | 4096 |
| (1,0) | +0,624512 | 4096 |
| (1,1) | +0,679688 | 4096 |

**S = 2,5317383 ± 0,0241785 → (S−2)/σ = 21,99.**

Avvikelserna på ~2·10⁻⁸ är float64-avrundning i två oberoende implementationer
(Python respektive TypeScript), inte metodskillnad. Toleransen i skriptet är
1·10⁻⁶ och testerna kräver 6 decimaler.

### Avkodningskedjan

Reproduktionen krävde att IBM:s serialiserade `BitArray` avkodas från grunden i
TypeScript: `base64 → zlib → NumPy .npy v1.0 → bitsträngar`. Headern i verklig
payload är `{'descr': '|u1', 'fortran_order': False, 'shape': (4096, 1)}`.

`scripts/lib/ibmBitArray.ts` läser bara det som faktiskt förekommer och
**avvisar allt annat högljutt** — annan dtype, Fortran-ordning, fel magic, fel
datalängd. En tyst feltolkning av råa mätbitar vore den värsta tänkbara
felklassen i hela kedjan: den kraschar inte, den ger bara fel fysik.

### Bitordningen påverkar inte S

Ett test byter q0↔q1 i varje shot och kräver att S är oförändrat till 12
decimaler. Det är det, eftersom produkten a·b är symmetrisk. Detta är den
formella bekräftelsen på det som konstaterades tidigare: **bitordningsproben
skyddar armupplösta storheter, inte korrelatorn.** Samma sak gäller Mermin —
pariteten (−1)^(antal ettor) är invariant under permutation av bitarna.

---

## 2. Nollhypoteser: vilka som gäller för shotdata

Det här är den del av bryggan som kräver mest omdöme. Katalogens
surrogatfamiljer är byggda för tidsupplöst fotondata; de flesta av dem har
ingen mening här.

**Giltiga** (implementerade i `scripts/lib/ibmChshBridge.ts`):

| Null | Bevarar | Förstör | Utfall (400 replikat) |
|---|---|---|---|
| Label-shuffle inom settingpar | marginaler per bucket | A↔B-korrelationen | S = 0,0263 ± 0,0213 · 0/400 ≥ observerat · p = 2,5·10⁻³ |
| Stratifierad bootstrap | bucketstorlekar (4096 var) | — (osäkerhetsskattning) | S = 2,5300 ± 0,0249 mot analytisk σ = 0,0242 |

Bootstrap-σ och analytisk σ stämmer på 3 %, vilket är oberoende bekräftelse på
att `σ_S = √Σ(1−E²)/n` är rätt formel för den här datan.

p = 2,5·10⁻³ är **upplösningsgolvet** vid 400 replikat ((0+1)/(400+1)), inte ett
mätt p-värde. Det säger "surrogatfördelningen är helt separerad från
observationen", inte "sannolikheten är 0,25 %". Med (S−2)/σ = 22 är det den
analytiska signifikansen som bär, inte permutationstestet.

**Ogiltiga för denna datatyp** — och detta är en positiv utsaga, inte en lucka:

- **S2 time-slide** — förskjuter en tidsaxel som inte finns.
- **Accidentals** — beräknas som R₁·R₂·Δt ur singelrater och koincidensfönster.
  Ingen av de tre storheterna existerar här.
- **Koincidensfönster-variation** — det finns inget fönster; paret är definierat
  av kretsen, inte av samtidighet.
- **Dödtidsnullar** — en qubitmätning har ingen dödtid i den mening en SPAD har.

Att köra dem ändå skulle ge p-värden som ser bra ut och betyder ingenting.

---

## 3. Signaturkartläggning: vad som går och vad som inte går

Fullständig körning: `npx tsx scripts/ibmSignatureMap.ts`.

| Signatur | | Skäl i en mening |
|---|---|---|
| **C** CHSH/Bell | **går** | Paret existerar per konstruktion i varje shot — enda A–F-signaturen som överlever översättningen orörd. |
| **D** Stabil invariant | **går delvis** | Kodad estimator faller med B, men D:s *metod* går på Mermin-vektorn över fyra äkta sessioner. |
| **A** g²(0) | går inte | g²(τ) är en koincidensstatistik över en tidsaxel; ingen tidsaxel, ingen fotonantalsfrihetsgrad. |
| **B** Polarisation–tid | går inte | R_CS är en kvot mellan *rater*; ingen mättid att dividera med, ingen polarisationsfrihetsgrad. |
| **E** Lågdim | går inte | Deltagarkvoten binnar i tid; shot-index är utbytbart, så varje "dimension" man mäter är shot noise. |
| **F** Non-Markovianitet | går inte | Hela observabeln *är* en funktion av τ. Det saknas inte statistik — det saknas axeln observabeln lever på. |
| **G** Squeezing | går inte | Kontinuerlig variabel (fältkvadraturer, homodyn). Utfallsrummet här är {0,1}, inte ℝ. |
| **H** Sensornätverk | går inte | Kräver geografiskt separerade noder med absolut tid. Alla qubitar sitter millimeter isär i samma kryostat. |
| **M** Eko | går inte | Kräver en intervention mitt i utvecklingen. Kretsarna är rena prepare-and-measure. |

### Det gemensamma mönstret

**Fyra av åtta signaturer (A, B, E, F) faller på samma sak: ingen tidsaxel.**
Det är inte en brist i experimentet och inte en implementationslucka. Det är en
utsaga om katalogens räckvidd: halva katalogen förutsätter *tidsupplöst
detektion*, inte bara statistik. En gate-model-processor levererar perfekta
mätstatistiker och noll temporal information — den är rätt instrument för C och
fel instrument för A/B/E/F, oavsett hur många shots man kör.

G och H faller inte på tid utan på **instrumentklass** (kontinuerlig variabel
respektive geografi). G:s omöjlighet här är exakt samma gräns som gör G till en
stubbe i simuleringen (CLAUDE.md §6.1), och den gäller lika hårt åt
hårdvaruhållet.

M är den enda posten som är omöjlig av **experimentdesign** snarare än datatyp.
M går att köra på IBM — det kräver bara en annan krets (delay +
mid-circuit-operation). Det är den enda av de sju omöjliga som är åtkomlig utan
att byta instrument.

---

## 4. D-försöket: äkta flersessionsdata, ofullständigt kontrastkrav

D:s **kodade** estimator går inte — invarianten där är egenvärdena hos
Stokes-kovariansen, som ärver B:s rådata (arvsregeln) och faller med B.

D:s **metod** går däremot: en basoberoende invariant mätt vid S ≥ 2 oberoende
observationstillfällen, testad för separation + stabilitet + kontrast.
Mermin-korrelatorvektorn (⟨XXX⟩, ⟨XYY⟩, ⟨YXY⟩, ⟨YYX⟩) i **fyra** skilda jobb
över 6,5 timmar ger exakt det. Och till skillnad från plattformens
pseudosessioner (`D-RF-PSEUDOSESSION`, fyra tidssegment ur *en* körning) är
sessionerna här **äkta**. IBM-materialet kan alltså något simuleringen inte kan.

| # | UTC | Jobb | GHZ | Kontroll |
|---|---|---|---|---|
| 1 | 08-02 19:46 | `d9npt5oqs0bc73e3ns90` | 3,6890 ± 0,0121 | 0,9761 ± 0,0271 |
| 2 | 08-02 20:13 | `d9nq9lk60llc73cadj8g` | 3,7788 ± 0,0102 | 1,0151 ± 0,0271 |
| 3 | 08-03 01:41 | `d9nv3nssfqic73argcq0` | 3,8223 ± 0,0092 | 1,0454 ± 0,0272 |
| 4 | 08-03 02:12 | `d9nvi6mij12s73fuc1ig` | 3,8052 ± 0,0096 | 0,9907 ± 0,0271 |

**Stabilitetsbenet mäts med ett konstantmodelltest** (`constantModelFit`),
χ² = Σ w_i(M_i − M̄)², w_i = 1/σ_i², df = 3. Med S ≥ 3 sessioner testar man hela
serien mot en modell istället för att jaga enskilda steg — och testet får inte
fler frihetsgrader varje gång en punkt läggs till.

| Arm | χ² | df | M̄ | Dom |
|---|---|---|---|---|
| Signal (GHZ) | **84,2** | 3 | 3,7834 ± 0,0051 | konstanthypotesen förkastas (p ≈ 3·10⁻¹⁸) |
| Kontroll (\|+++⟩) | **3,7** | 3 | 1,0068 ± 0,0136 | förenlig med konstant (p ≈ 0,30) |

| D-ben | Utfall | |
|---|---|---|
| **D-sep** (separation signal ↔ kontroll) | 191,8σ | uppfyllt |
| **D-stab** (konstans över sessioner) | χ² = 84,2, df = 3 | **ej uppfyllt** |
| **D-kontrast** (K_D) | ej mätt | **ingen omgivningsvariabel registrerad** |

**Klassning: D-struct — och även det med reservation.** Separationsbenet bär,
stabilitetsbenet *faller*, och kontrastbenet är omätt. Detta är inte ett uppfyllt
D-fynd. Det är ett **ofullständigt kontrastkrav med ett falsifierat
stabilitetsantagande**, och rapporteras som sådant (D v0.2 §10).

**Kvoten 22× mellan signalens och kontrollens χ² är det som gör detta till en
fysikutsaga och inte en analysartefakt.** Armarna delar allt — samma qubitar,
samma jobb, samma antal shots, samma analyskedja, samma bitordning och
teckenkonvention — utom tillståndet som prepareras. En instabilitet i kedjan
hade träffat båda. Kontrollens χ² = 3,7 mot df = 3 är exakt vad rent brus ska ge.

Serien är dessutom icke-monoton: +5,67σ, +3,15σ, −1,28σ. Datan utesluter både
"konstant" och "monotont fallande", men kan inte skilja omkalibrering från
långsam förbättring från fluktuation med okänd period. Den förregistrerade
riktningsförutsägelsen (M₂ ≤ M₁) föll redan vid körning 2 och står kvar
falsifierad. Se `Quantum_IBM/results/DRIFT_MERMIN.md`.

För att komma vidare till ett riktigt K_D krävs att en omgivningsvariabel
registreras (kalibreringstidpunkt, temperatur, backend-belastning) och visas
variera *mer* än invarianten. Det har vi inte gjort.

---

## 5. Klassning av C-fyndet

**C-hardware-consistent.** Inte C-strong.

S = 2,5317383 ± 0,0241785 bryter den lokalrealistiska gränsen med 21,99σ, och
den separabla kontrollen håller sig under gränsen. Men tre kryphål är helt
öppna:

- **Locality** — qubitarna sitter millimeter isär i samma kryostat; ingen
  rymdlik separation mellan mätningarna.
- **Freedom of choice** — inställningarna är kompilerade in i kretsen i förväg,
  inte slumpade vid mättillfället.
- **Detection** — postselektion är inte relevant här (varje shot ger utfall),
  men mätningen är inte fair-sampling-fri i den mening en loophole-free
  fotonuppställning är.

Resultatet är **förenligt med** kvantmekanik och oförenligt med den
lokalrealistiska gränsen *givet att kretsen gör vad den påstås göra*. Det är en
instrumentkonsistensutsaga, inte ett loophole-fritt Bell-test. Jämför NIST-datan
i `scripts/importNistBell.ts`, som stänger locality och detection.

---

## 6. Filer

| Fil | Roll |
|---|---|
| `scripts/lib/ibmBitArray.ts` | base64 → zlib → npy → bitsträngar. Avvisar allt oväntat. |
| `scripts/lib/ibmChshBridge.ts` | Shot → `ChshPair`, korrelatorer, σ_S, giltiga nullar. |
| `scripts/lib/ibmMerminBridge.ts` | Paritet, Mermin-värde per arm, ⟨X^⊗N⟩. |
| `scripts/importIbmChsh.ts` | Reproduktionskravet + nullar. Avslutar med nollskild kod vid avvikelse. |
| `scripts/ibmSignatureMap.ts` | Kartläggningen i §3 + D-försöket i §4. |
| `scripts/lib/ibmBridge.test.ts` | 35 tester: avkodning, teckenkonvention, reproduktion, nullar, Mermin, konstantmodell. |
| `fixtures/ibm/` | Sanerade jobbfiler (endast `user_id` strippat) + PROVENANCE. |

Fixturerna är IBM:s egna `result.json` med `user_id` borttaget. Shotdatan är
**bitidentisk** med originalet (verifierat med SHA-256 per PUB) — jobb-ID,
tidsstämplar och kalibreringssnapshot är avsiktligt bevarade.

---

## 7. Vad detta inte är

- Inget loophole-fritt Bell-test (§5).
- Inget uppfyllt D-fynd (§4).
- Ingen driftkurva. Fyra punkter över 6,5 timmar visar att variation **finns**
  och är signifikant; de visar inte dess form, period eller orsak.
- Ingen utvidgning av katalogen. Sju av nio signaturer går inte att köra på den
  här datatypen, och det är rapporterat som ett resultat, inte som en TODO.
