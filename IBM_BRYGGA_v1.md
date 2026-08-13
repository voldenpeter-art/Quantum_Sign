# Bryggan IBM → Quantum_Sign, v1

*Import av sanerad gate-model-shotdata från `ibm_marrakesh` (2026-08-02/03) in i
signaturkatalogens analyskedja. Nio jobb, 64 PUB:ar, 262 144 shots — här kallat
**P0-materialet**.*

> **Läs tillsammans med `Quantum_IBM/P1_RESULTAT.md`.** P1-kampanjen
> (2026-08-04/12, 34 körningar) prövade en förregistrerad tidshypotes och
> kvalificerar två av slutsatserna nedan. Ställena är märkta *Uppdatering efter
> P1*. Sammanfattat: armseparationsprincipen (§4) visade sig vara **empirisk och
> materialberoende**, inte en metodprincip, och YXY-dominansen **replikerades
> inte**. D-klassningen står kvar som D-none, nu på starkare grund.

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
| **D** Stabil invariant | **går inte som D** | Kodad estimator faller med B. En longitudinell Mermin-diagnostik går, men klassas **D-none** (§10) — D-sep och K_D omätta. |
| **A** g²(0) | går inte | g²(τ) är en koincidensstatistik över en tidsaxel; ingen tidsaxel, ingen fotonantalsfrihetsgrad. |
| **B** Polarisation–tid | går inte | R_CS är en kvot mellan *rater*; ingen mättid att dividera med, ingen polarisationsfrihetsgrad. |
| **E** Lågdim | går inte | Deltagarkvoten binnar i tid; shot-index är utbytbart, så varje "dimension" man mäter är shot noise. |
| **F** Non-Markovianitet | går inte | Hela observabeln *är* en funktion av τ. Det saknas inte statistik — det saknas axeln observabeln lever på. |
| **G** Squeezing | går inte | Kontinuerlig variabel (fältkvadraturer, homodyn). Utfallsrummet här är {0,1}, inte ℝ. |
| **H** Sensornätverk | går inte | Kräver geografiskt separerade noder med absolut tid. Alla qubitar sitter millimeter isär i samma kryostat. |
| **M** Eko | går inte | Kräver en intervention mitt i utvecklingen. Kretsarna är rena prepare-and-measure. |

### Det gemensamma mönstret

**Fyra av nio signaturer (A, B, E, F) faller på samma sak: ingen tidsaxel.**
Det är inte en brist i experimentet och inte en implementationslucka. Det är en
utsaga om katalogens räckvidd: en stor del av katalogen förutsätter
*tidsupplöst detektion*, inte bara statistik. En gate-model-processor levererar perfekta
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

## 4. Longitudinell Mermin-diagnostik — **D-none**, ej signatur D

D:s **kodade** estimator går inte (Stokes-invarianten ärver B). Vad som går är en
longitudinell diagnostik i D:s anda: samma observabel vid flera **äkta**
observationstillfällen — något plattformens pseudosessioner inte kan ge.

| # | UTC | Jobb | GHZ | Kontroll |
|---|---|---|---|---|
| 1 | 08-02 19:46 | `d9npt5oqs0bc73e3ns90` | 3,6890 ± 0,0121 | 0,9761 ± 0,0271 |
| 2 | 08-02 20:13 | `d9nq9lk60llc73cadj8g` | 3,7788 ± 0,0102 | 1,0151 ± 0,0271 |
| 3 | 08-03 01:41 | `d9nv3nssfqic73argcq0` | 3,8223 ± 0,0092 | 1,0454 ± 0,0272 |
| 4 | 08-03 02:12 | `d9nvi6mij12s73fuc1ig` | 3,8052 ± 0,0096 | 0,9907 ± 0,0271 |
| 5 | 08-03 03:48 | `d9o0usgqs0bc73e3v17g` | 3,8262 ± 0,0091 | 1,0122 ± 0,0271 |
| 6 | 08-03 04:19 | `d9o1dpeij12s73fuebh0` | 3,8359 ± 0,0089 | 0,9868 ± 0,0271 |
| 7 | 08-03 06:51 | `d9o3kmk60llc73canv90` | 3,8330 ± 0,0089 | 1,0435 ± 0,0271 |

### Klassningen är D-none, inte D-struct

D v0.2 §10 kräver för **D-struct** att *båda* p-testen är godkända. D-stab
förkastas, och §10 utlöser då **D-none explicit**. Att rapportera "D-stab ej
uppfylld" och samtidigt "D-struct" var en självmotsägelse mot bindande
protokoll — den är rättad.

Ärligare etikett: **D-inspirerad longitudinell Mermin-diagnostik, ej
klassificerbar som signatur D.** Mermin-vektorn har aldrig visats invariant
under de passiva bastransformationer D kräver av en invariant.

| D-ben | Status |
|---|---|
| D-stab | konstantmodellen **förkastas** → D-none |
| D-sep | **EJ MÄTT.** D-sep är i §9.3 ett Mahalanobis-avstånd mot empiriska surrogatfördelningar med p⁽²⁾-disciplin. Det vi mätte är GHZ-arm mot kontrollarm — **armseparation**, 257,3σ, en annan storhet. |
| D-kontrast (K_D) | **EJ MÄTT** — ingen omgivningsvariabel registrerad |

### Konstantmodelltest — skalär och vektor

| Test | χ² | df | Dom |
|---|---|---|---|
| Skalär M, signal | 129,4 | 6 | förkastas |
| Skalär M, kontroll | 6,1 | 6 | förenlig med konstant inom shot noise |
| **Vektor** (per korrelator, summerad) | **155,9** | 24 | förkastas |

Vektortestet är strängare och ligger närmare D:s invariantbegrepp — **en
invariant är en vektor, inte ett tal.** Skalär-M är en summa där kompenserande
termförändringar tar ut varandra. Per term: XXX 23,1 · XYY 36,0 · **YXY 61,9** ·
YYX 34,9. YXY bär 40 % av instabiliteten i P0-materialet och det syns inte i M.

> **Uppdatering efter P1** (`Quantum_IBM/P1_RESULTAT.md`). YXY-andelen var
> 23,3 % i P1:s åtta primärkörningar. **Den starka YXY-dominansen från P0
> replikerades alltså inte i P1.** Det är utsagan datan bär — inte att
> dominansen var eller inte var en beständig instrumentegenskap. Åtta körningar
> mot sju, en annan tidsperiod och en annan kalibreringscykel räcker inte för
> att skilja en försvunnen egenskap från en som varierar långsammare än
> mätfönstret.

### Formen: tidig nivåförändring + platå, inte fortlöpande drift

| Grupp | M̄ | χ² | df |
|---|---|---|---|
| Tidiga 2 (söndag kväll) | 3,7412 ± 0,0078 | 32,2 | 1 |
| Senare 5 (måndag) | 3,8251 ± 0,0041 | **6,7** | 4 |

Nivåskifte **9,5σ**; platån håller även i vektortestet (χ² = 22,0, df = 16).
Stegen efter nivåskiftet är +1,58σ, +0,77σ, −0,23σ — rent brus.

**Förändringspunkten är vald efter att datan setts och är därmed explorativ.**
Den får inte behandlas som ett förregistrerat test.

### Vad variationen lokaliseras till — och varför slutsatsen är materialberoende

Armarna delar qubitar, jobb, shots, analyskedja, bitordning och
teckenkonvention — men **inte kretsdjup**. GHZ-armen har 2 tvåqubitsgrindar och
djup ~12; kontrollen har 0 och djup 1–4.

**I detta material** (P0, sju sessioner) var kontrollen förenlig med konstans i
skalär M: χ² = 6,1 mot df = 6. Eftersom kontrollen låg stilla medan signalen inte
gjorde det, lokaliseras variationen här till **entangling-kretsens prestanda** —
tvåqubitsgrindfidelitet, GHZ-preparation, trequbitskoherens — snarare än till ett
abstrakt "tillstånd" isolerat från grindkedjan.

> **P1 fäller den generella versionen av detta argument.**
>
> I P1:s åtta primärkörningar **förkastar kontrollvektorn konstantmodellen**:
> χ² = 87,1, df = 28, p = 6·10⁻⁸. 83 % av det (71,9 av 87,1) sitter i
> ⟨XXX⟩_ctrl.
>
> **Armseparationsprincipen är alltså materialberoende och får inte antas.**
> Formuleringen "kontrollen är stabil, alltså sitter variationen i
> entangling-kretsen" är giltig för P0-materialet där premissen mättes och höll.
> Den är *inte* en generell egenskap hos uppställningen. Varje nytt material
> måste visa kontrollens stabilitet innan slutsatsen dras — och i P1 gick den
> inte att visa.
>
> Detta är en av de mest användbara sakerna hela IBM-spåret har producerat: ett
> argument som såg ut som en metodprincip visade sig vara en empirisk premiss.

### Vad ⟨XXX⟩_ctrl faktiskt mäter

Kontrollens ⟨XXX⟩ är en **proxy för gemensam multiplikativ paritetsattenuering**
— inte ett rent läsfelsmått. §T7 i `P1_TILLAGG_BLINDAT.md` säger det själv:
kontrollkretsen har djup 1–4, så ⟨XXX⟩_ctrl innehåller även en preparations- och
enkelqubitskomponent utöver läsfelet. Normeringen M/⟨XXX⟩_ctrl är en
förstaordningskorrektion, inte en läsfelskorrektion.

Att symmetriskt läsfel med sannolikhet p skalar varje paritetsterm med (1−2p)³
står kvar och är korrekt — men ⟨XXX⟩_ctrl mäter den *sammanlagda* multiplikativa
faktorn, inte enbart p.

### Skalär mot vektor — tvärgående resultat

P0 visade det för signalen. P1 bekräftar det för kontrollen, och det gör
lärdomen allmän:

| Test | P1-kontrollen | Dom |
|---|---|---|
| Vektor, per korrelator, 8 primärkörningar | χ² = 87,1, df = 28 | förkastas |
| Skalär M, hela serien om 34 körningar | χ² = 38,9, df = 33 | förenlig med konstans |

Samma arm, samma data, motsatt dom. Termerna kompenserar varandra i summan.

> **En skalär sammanfattning kan aldrig ensam bära ett stabilitetstest av en
> vektorvärd observabel.** Mermin-M är en teckenviktad summa över fyra
> korrelatorer; en förändring i XYY kan döljas av en motsatt förändring i YXY
> utan att M rör sig. Stabilitetstestet måste därför göras per komponent och
> summeras, inte på skalären.
>
> Detta gäller lika för signal och kontroll, och det gäller oavsett hur bekvämt
> skalären är att rapportera.

### Språkgräns

σ_M är **ren shot noise**. Kontrollen är *"förenlig med konstantmodell inom
shot-noise-osäkerheten"*, inte *"bevisligen konstant"* — systematikbudgeten är
omätt. P1 visar varför den skillnaden inte är pedantisk: samma kontroll som är
förenlig med konstans i skalär M förkastar konstantmodellen i vektortest.

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
| `scripts/lib/ibmBridge.test.ts` | 38 tester: avkodning, teckenkonvention, reproduktion, nullar, Mermin, konstantmodell. |
| `fixtures/ibm/` | Sanerade jobbfiler (endast `user_id` strippat) + PROVENANCE. |

Fixturerna är IBM:s egna `result.json` med `user_id` borttaget. Shotdatan är
**bitidentisk** med originalet (verifierat med SHA-256 per PUB) — jobb-ID,
tidsstämplar och kalibreringssnapshot är avsiktligt bevarade.

---

## 7. Vad detta inte är

- Inget loophole-fritt Bell-test (§5).
- Inget D-fynd alls — utfallet är **D-none** (§4).
- Ingen driftkurva. Sju punkter över 11 timmar visar att variation **finns**
  och är signifikant; de visar inte dess form, period eller orsak.
- Ingen utvidgning av katalogen. Sju av nio signaturer går inte att köra på den
  här datatypen, och det är rapporterat som ett resultat, inte som en TODO.
