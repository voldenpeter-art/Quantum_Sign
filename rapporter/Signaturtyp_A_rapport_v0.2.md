# Signaturtyp A — Icke-klassisk fotonstatistik

## Fullständig rapport och protokollspecifikation, version 0.2

*Status: granskad och uppdaterad. v0.2 inarbetar det externa granskningsutlåtandet över v0.1 samt chattgranskningens bedömning av detsamma. Statusetikett (antagen från utlåtandet): **protocol-ready, target-unresolved** — teoretiskt och metodiskt stark, experimentellt mållös tills kandidatkälla och ε/M-budget definierats.*

**Ändringslogg v0.1 → v0.2:** (Ä1) formuleringen "dödtid är ensam artefakt åt fel håll" ersatt; felkällstabellen utbyggd med korskanaliga anti-korrelationsmekanismer (§5). (Ä2) Mallformen generaliserad till förregistrerad mallfamilj med trial-korrektion (§6.1–6.2). (Ä3) Tvådelade inferensens roll explicitgjord — tecknet är diskriminator inom full H₀-modell, aldrig i stället för den (§6.3). (Ä4) S_A-vektorns redundans korrigerad: Q ≡ F − 1 (identitet) och Q som integralvittne av g²-kurvan; oberoende-hierarki införd (§3). (Ä5) A klyvs i A-Lab och A-Astro (§10). (Ä6) Kandidatmatris och admissibility-gate G_A införda (§11). (Ä7) Klassningen skärpt: injicerade kontroller obligatoriska, ny kategori A-anomali (§7). (Ä8) Fermionspåret formaliserat som A_f med egen hypotesstruktur (§9.3).

---

## 1. Sammanfattning

Signaturtyp A definieras som statistiskt signifikanta avvikelser från klassisk fotonstatistik i tidsserier av enskilda fotondetektioner, med antibunching — g²(0) < 1 — som primärt vittne. A är katalogens starkaste signatur av tre skäl: dess klassiska gräns är matematiskt vattentät, dess mätteknik (Hanbury Brown–Twiss-interferometri med enfotondetektorer) är mogen och publicerad i modern astronomi, och den generaliserar naturligt från ljus till materia via kvantstatistik för identiska partiklar.

Rapportens centrala slutsatser. För det första måste A mätas via korskorrelation mellan minst två detektorer — endetektor-autokorrelation är förbjuden som evidenskälla, eftersom detektordödtid där skapar en falsk antibunching-dipp; v0.2 skärper dock att korskorrelation eliminerar den *enklaste* falska mekanismen, inte alla — korskanaliga anti-korrelationer från elektronik, mättnad, normalisering och analysval måste uteslutas separat (§5). För det andra är teststatistikan ett matchat filter över förregistrerat fiducialfönster med en förregistrerad *mallfamilj* och trial-korrigerad extremstatistik, där tecknet på kontrasten ε utgör diskriminatorn inom en fullständig instrument- och urvalsmodell. För det tredje begränsas A radiometriskt av kontrastbudgeten, vilket i v0.2 operationaliseras som en admissibility-gate: ingen astronomisk A-kampanj planeras utan G_A = |ε_obs,pred|/ε_min beräknad i förväg. För det fjärde klyvs A i två spår — A-Lab (validering mot kända icke-klassiska källor; genomförbar i dag) och A-Astro (hypotesprövning; vilande tills kandidatmatrisen levererar G_A > 1) — så att protokollets giltighet inte står och faller med astronomispårets målbrist.

## 2. Fysikalisk grund

### 2.1 Observabeln

Det centrala observablet är andra ordningens korrelationsfunktion,

g²(τ) = ⟨I(t)·I(t+τ)⟩ / ⟨I(t)⟩²,

som i fotonräknande regim skattas ur koincidensstatistik. Vid noll fördröjning gäller ekvivalent g²(0) = ⟨n(n−1)⟩/⟨n⟩². Intuitivt besvarar g²(0) frågan: givet att en foton just detekterades, hur sannolikt är det att detektera ytterligare en samtidigt, jämfört med ren slump?

### 2.2 De tre regimerna

| Källtyp | g²(0) | Benämning | Klassisk? |
|---|---|---|---|
| Termisk/kaotisk (stjärnljus) | 2 (enmods) | Bunching | Ja |
| Koherent (ideal laser) | 1 | Poisson | Ja (gränsfall) |
| Enfotonkälla m.fl. | < 1 | Antibunching | **Nej** |

### 2.3 Varför gränsen är vattentät

För varje klassisk fältbeskrivning — godtycklig stokastisk intensitet I(t) ≥ 0 — följer av Cauchy–Schwarz-olikheten att ⟨I²⟩ ≥ ⟨I⟩², vilket ger g²(0) ≥ 1. Ingen klassisk intensitetsfluktuation, hur exotisk den än är, kan producera g²(0) < 1. Ett signifikant uppmätt värde under 1 är därmed ett binärt icke-klassicitetsvittne. Detta är A:s fundament och skälet till dess grindvaktsroll i katalogen: A kräver ingen kontroll över mätinställningar (till skillnad från CHSH), inga antaganden om källan, och ingen tolkning — bara korrekt hantering av instrumentet och analysen.

Viktig asymmetri som hela protokollet vilar på: antibunching är ett *tillräckligt* men inte *nödvändigt* villkor för icke-klassicitet. Många icke-klassiska tillstånd passerar obemärkta genom ett ensamt g²-test. Därför byggs A som en signaturfamilj (avsnitt 3), och därför kan A aldrig användas för att *utesluta* kvantstruktur — bara för att påvisa den.

## 3. Signaturfamiljen S_A (Ä4: redundanskorrigerad)

A-signaturen definieras som en familj av icke-klassicitetsvittnen:

**S_A = [ g²(0) − 1,  Δ_anti,  Q,  κ₃ᶠ,  κ₄ᶠ ]**   (F redovisas som F = Q + 1, ej separat vittne)

**Redundanskorrigering (bindande, v0.2).** v0.1 räknade Fano-faktorn F − 1 och Mandel-parametern Q som två oberoende vittnen. Detta var fel: Q = F − 1 per definition — identisk information i två notationer. F behålls i rapportering som pedagogisk representation men räknas aldrig som separat evidens. Granskningen fördjupar därtill: Q över räknefönster T är en viktad integral av (g²(τ) − 1) över fönstret, och därmed *korrelerad* även med punkt- och formvittnena. S_A:s ärliga struktur är en hierarki:

1. **Punktvittne:** g²(0) − 1 (dippdjupet ε).
2. **Formvittne:** Δ_anti — stiger kurvan från dippen med rätt form?
3. **Integralvittne:** Q (fönsterberoende; delvis redundant med 1–2; självständigt värde främst när g²-kurvan är brusig men räknefördelningen rik).
4. **Högre ordning:** κ₃ᶠ, κ₄ᶠ — genuint ny information bortom andra ordningen.

**Oberoenderegel (bindande):** kravet "stöd från ytterligare S_A-komponent" i klassningen (§7) uppfylls endast av nivå 2 eller nivå 4 — aldrig av Q ensamt, eftersom Q i hög grad följer med punktvittnet per konstruktion.

**Δ_anti (korrigerad definition från v0.1, oförändrad i v0.2):** Δ_anti = max över τ i det förregistrerade gridet {τ₁,…,τ_K} av (g²(τ) − g²(0)), utvärderad på fiducialgrid som exkluderar artefaktzonen. Den ursprungliga min-definitionen var degenererad (minimum → 0 när τ → 0⁺ oavsett dippdjup).

Alla komponenter påverkas av modutspädning på samma sätt: avvikelsen krymper med 1/M men tecknet bevaras — teckenbevarandet är teststatistikans kärna (avsnitt 6).

## 4. Mätarkitektur

### 4.1 Bindande arkitekturkrav

Evidens för Signaturtyp A får endast hämtas ur **korskorrelationer mellan fysiskt separata detektorer** (HBT-konfiguration: stråldelare eller pupilldelning, två eller fler enfotondetektorer av typ SPAD/SNSPD, gemensam tidsstämpling med pikosekundklass-upplösning). Endetektor-autokorrelation är förbjuden som evidenskälla och får endast användas diagnostiskt.

Motiveringen är dödtidsartefakten: efter ett klick är en detektor blind i typiskt 10–100 ns, vilket i autokorrelation undertrycker koincidenser vid små τ och skapar en artificiell dipp mot g² ≈ 0 — en falsk kvantsignatur, riktad åt exakt det håll protokollet letar. I korskorrelation existerar problemet inte vid τ = 0, eftersom detektor A:s dödtid inte hindrar detektor B från att klicka. Dödtidens kvarvarande fotavtryck i korskorrelation är ekostrukturer kring τ ≈ ±τ_d samt en svag taktberoende baslinjeförvrängning — kalibrerbara och inte placerade ovanpå signaturen. **v0.2-skärpning (Ä1):** korskorrelationskravet eliminerar den enklaste och typiska falska mekanismen — det eliminerar inte alla; §5 listar de korskanaliga.

Det interaktiva simuleringsverktyget demonstrerar endetektorfallet och ska i dokumentationen uttryckligen märkas som skräckexempel: termisk källa + modutspädning ~10 + dödtid producerar en kurva som okulärt är oskiljbar från en svag enfotonkälla.

### 4.2 Kalibreringskedja

Varje mätkampanj föregås och avslutas med karakterisering av: dödtid per detektor, afterpulsing-sannolikhet och tidskonstant, mörkerräknetakt, timing-jitter (IRF), korskanalig crosstalk, samt (nytt i v0.2) tidsstämplingselektronikens beteende vid samtidiga event och hög last (pile-up-test med stark pulsad källa). Tre kontrollkällor ingår obligatoriskt: koherent referens (laser, förväntat g² = 1), termisk labbkälla (förväntad bunching), samt en ljusstark stjärna som klassisk astronomisk benchmark (förväntad bunching med känd kontrast). **Injicerade kontroller (Ä7):** därtill körs positiv kontroll (känd icke-klassisk källa eller syntetisk injektion, ska detekteras) och negativ kontroll (klassisk källa genom identisk pipeline, får inte detekteras) i varje kampanj. En pipeline som inte klarar samtliga kontroller får inte användas för hypotesprövning.

## 5. Felkällor och klassiska bedragare (Ä1: utbyggd)

| Felkälla | Effekt på mätt g²_AB | Riktning | Motmedel |
|---|---|---|---|
| Dödtid (autokorr.) | Falsk dipp vid τ≈0 | **Fejkar kvant** | Korskorrelation (bindande) |
| Gemensam tidsstämplingselektronik (FIFO-mättnad, pile-up-prioritering mellan kanaler) | Undertrycker samtidiga event → falsk korsdipp | **Fejkar kvant** | Pile-up-karakterisering (§4.2), lasttest, S4-instrumentlager |
| Detektormättnad vid hög takt | Kompression av koincidenser | **Fejkar kvant** | Taktmarginal, linearitetstest |
| Felaktig normalisering vid icke-stationär intensitet | Baslinjefel → skenbar dipp eller topp | **Kan fejka kvant** | Accidentals via flera time-slides, stationaritetstest, detrending-policy förregistrerad |
| Överskattad bakgrundssubtraktion | Trycker ĝ² under sann nivå | **Fejkar kvant** | Bakgrund som H₀-nuisance, aldrig rå subtraktion |
| Korrelerade kvalitetsklipp i båda kanaler | Urvalsinducerad anti-korrelation | **Fejkar kvant** | Kvalitetsfilter förregistrerade, klipplogg, blindanalys |
| Överkorrigerad crosstalk (optisk/elektrisk) | Anti-korrelation med fel tecken efter korrektion | **Fejkar kvant** | Crosstalk-korrektion valideras på kontrollkällor |
| Analysläckage (fönster/filter valda efter datagranskning) | Godtycklig riktning | **Kan fejka kvant** | Förregistrering + blindning (§8) |
| Afterpulsing | Falsk topp vid små τ | Fejkar bunching | Kalibrering, nuisance-parameter |
| Timing-jitter | Smetar ut dipp/topp | Döljer signatur | IRF-avfaltning i modellen |
| Bakgrund/mörkerräkning | Drar g² mot 1 | Döljer signatur | Skattas, ingår i H₀ |
| Modutspädning (spatiell, spektral, polarisation) | Krymper avvikelse med 1/M | Döljer, byter aldrig tecken | Kontrastbudget, multiplexering |
| Intensitetsdrift (flicker) | Långsam extra korrelation | Fejkar bunching/struktur | Stationaritetstest, detrending |

**Korrigerad rangordningsformulering (ersätter v0.1 §5):** Dödtid i endetektor-autokorrelation är den enda *enkla och typiska* artefakten som direkt imiterar den centrala A-signaturen vid τ ≈ 0, och den elimineras arkitektoniskt. Full A-evidens kräver därutöver uteslutning av korskanaliga anti-korrelationer från elektronik, mättnad, normalisering, bakgrundshantering och analysval — tabellens övre block. Samtliga "fejkar kvant"-rader ingår obligatoriskt i S4-motståndarens instrumentlager.

## 6. Teststatistik och beslutslogik

### 6.1 Parametrisk modell (Ä2: mallfamilj)

Mätt korskorrelation modelleras som

g²_AB(τ) = 1 + ε · f_j(τ; θ_j) ⊛ IRF(τ) + η_inst(τ),

där {f_j} är en **förregistrerad mallfamilj** — inte en universalmall. Exponentialformen e^(−|τ|/τ_c) är en kandidat (Lorentzisk spektralprofil); familjen inkluderar därutöver efter källhypotes t.ex. gaussisk form (gaussiskt filter), dämpat oscillerande form (Rabi-dynamik hos enskild emitter), och pulsad form. Familjen och dess parametergrid låses vid förregistrering. Instrumenttermerna η_inst (afterpulsing-eko, baslinjedrift, bakgrund) bär nuisance-parametrar med prior från kalibreringen. Parametern ε är kontrasten: ε > 0 bunching (klassiskt förenligt), ε < 0 antibunching (icke-klassiskt).

### 6.2 Statistikan (Ä2: trial-korrektion över familjen)

Per mall är den optimala linjära skattningen det matchade filtret

T_j = Σ_k w_k · (ĝ²_AB(τ_k) − 1),  med vikter w_k ∝ f_j(τ_k)/σ_k²,

över **förregistrerat fiducialfönster** [τ_min, τ_max] där τ_min ligger utanför artefaktzonen. Två metodval förkastas fortsatt: oviktad integration (felviktar brusrika bins) och svansextrapolering (informationsfattig — informationen om ε ligger vid |τ| ≲ τ_c). **Nytt i v0.2:** eftersom familjen {f_j} skapar look-elsewhere-effekt definieras evidensstatistikan som extremvärdet över familjen (mest negativa normerade ε̂_j), och nollfördelningen byggs med *identisk* extremtagning på surrogaten — C-rapportens §4.2-disciplin i A-form. En mallfamilj utan trial-korrektion vore bara organiserad mallhopping.

Slutgiltig evidensform: profil-likelihood eller Bayesiansk modellevidens för

H₀: ε ≥ 0 (klassisk källa + full instrumentmodell inkl. §5:s korskanaliga mekanismer, nuisance profilerade/marginaliserade, urvalseffekter modellerade)
H₁: ε < 0 (icke-klassisk komponent krävs).

### 6.3 Diskriminatorns logik (Ä3: explicitgjord)

Modutspädning krymper |ε| men bevarar tecknet; utspätt termiskt ljus ger ε = +1/M, aldrig negativt. Tecknet på ε är därmed diskriminatorn — **inom** ramverket ovan, aldrig i stället för det. Explicit: kravet är ε̂ < 0 *och* robusthet mot H₀ = {ε ≥ 0} + full instrumentmodell + urvalseffekter + normaliseringsfel. En signifikant negativ skattning som inte prövats mot tabellens samtliga "fejkar kvant"-mekanismer är inte ett vittne utan en kandidat till §5.

## 7. Klassningsregler (Ä7: skärpta, ny kategori)

**A-none.** Ingen signifikant negativ ε, ingen robust Δ_anti, inga S_A-komponenter överlever S1–S4.

**A-suspect.** Minst ett negativt A-vittne, men något av följande saknas: reproduktion; oberoende instrumentkonfiguration; blindanalys; S4-överlevnad; stabil baslinje och normalisering; eller injicerade kontroller ej genomförda.

**A-strong.** Samtliga följande: (1) ε̂ < 0 med empiriskt p < 10⁻⁵ mot S1–S4 inklusive fullt instrumentlager; (2) två- eller flerdetektor-korskorrelation; (3) förregistrerat fiducialfönster och mallfamilj; (4) blindad analys; (5) minst två oberoende sessioner; (6) minst två instrumentkonfigurationer eller kanaluppdelningar; (7) injicerad positiv och negativ kontroll passerade; (8) icke-redundant S_A-stöd — formvittnet Δ_anti eller κ-nivån, aldrig Q ensamt (§3); (9) källmodell med kontrastbudget där |ε_pred| > ε_min, alternativt klassning enligt nedan.

**A-anomali (ny kategori, importerad från H-rapportens §5).** Statistik på strong-nivå (krav 1–8) men utan källmodell över kontrastgolvet (krav 9 fallerat). Arkiveras för modellrevision, omprövas mot uppdaterad kandidatmatris, eskalerar aldrig till strong, kasseras aldrig. Motivering: robust evidens är evidens oavsett förutsägelse — men ett oförklarat ε < 0 är oftare en oidentifierad rad i §5-tabellen än ny fysik, och kategorin håller båda möjligheterna levande utan att belöna någon i förtid.

Trösklarna låses vid förregistrering, inte efter datainsamling.

## 8. Nollmaskin, surrogat och analysdisciplin

Punktvärden utan nollfördelning är otolkbara. Protokollet kräver:

**Surrogatdata S1–S4.** S1: tidsomkastade/permuterade eventtabeller (bryter kausal struktur, bevarar marginalstatistik). S2: takt-matchade Poisson-syntetiska data. S3: fasrandomiserade data (bevarar spektrum, bryter högre ordningens struktur). S4: den klassiska motståndaren — termisk källa genom komplett instrumentmodell inklusive §5:s samtliga "fejkar kvant"-mekanismer (dödtid, pile-up-elektronik, mättnad, normaliseringsfel, urvalsklipp), med parametrar dragna ur kalibreringens osäkerheter, aktivt trimmad för att maximera falsk negativ ε. p⁽²⁾-regeln (H §4.1) tillämpas: vittnet ska slå minst två oberoende nullfamiljer.

**Injection tests.** Syntetiska icke-klassiska signaturer med känt ε injiceras; pipelinen ska återfinna dem med korrekt skattat ε och utan falsklarm på nollinjektioner. Detektionseffektivitet och falsklarmstakt rapporteras som funktion av ε — pipelinens ROC-karakteristik, obligatorisk bilaga. I A-Lab-spåret (§10) görs injektionen även fysiskt med verklig enfotonkälla.

**Förregistrering och blindanalys.** Fiducialfönster, τ-grid, mallfamilj, trösklar, S_A-komponenter och beslutsregler låses innan riktig data analyseras. Analysen körs blint (tecken-scramblad ε tills alla kvalitetssnitt frysts). Detta är den enda punkten som skiljer programmet från strukturerat självbedrägeri.

## 9. Fysikalisk räckvidd och gränser

### 9.1 Ingen genväg förbi ljusrestiden

A ger en rikare beskrivning av det ljus som anländer nu — statistik som kodar emissions- och propagationsfysik — men kvantkorrelationer kan inte användas för superluminal signalering (no-signaling). Bindande gränsdragning.

### 9.2 Signaturen är inte en evig etikett

Observerad fotonstatistik beror på källfysik, propagation, modblandning samt instrumentets filterbandbredd, polarisationsval, jitter och binning. A-signaturen definieras alltid som en normaliserad familj relativt en specificerad mätkedja, aldrig som en rå kurva.

### 9.3 Fermionspåret formaliserat: A_f (Ä8)

HBT-korrelationer följer av kvantstatistik för identiska partiklar: bosoniska atomer bunchar, fermioniska antibunchar (Pauli), experimentellt etablerat i atom- och elektronsystem. **v0.2 formaliserar att detta inte är "A med omvänt tecken" utan en egen variant, A_f — identisk-partikel-korrelationssignaturen — med egen hypotesstruktur:**

H₀: klassisk/distinguerbar partikelström + fullständig instrumentmodell
H₁: identiska fermioner med Pauli-inducerad antibunching.

Skillnaden är fundamental: i foton-A är antibunching den överraskande avvikelsen och termiskt ljus nollan; i A_f är antibunching den *förväntade* kvantstatistiska effekten och nollan är distinguerbarhet. Vittnesriktningen, kontrollkällorna (distinguerbara partiklar som negativ kontroll) och kontrastbudgeten formuleras om därefter. A_f öppnas som eget protokoll när materiespåret aktiveras; metodkedjan (korskorrelation, matchat filter, surrogat, kontrastbudget) återanvänds oförändrad.

## 10. Spårklyvning: A-Lab och A-Astro (Ä5)

**A-Lab.** Validering av hela protokollet mot kända icke-klassiska källor (kvantpunkt, färgcentrum, atom/jon, hero-SPDC): fysiska sanna positiva, kontrollerad degradering (avsiktlig modblandning för ε/M-svep), ROC-karakterisering med verkligt ljus. Genomförbar i dag, samordnas med C/G-labbet (C §11, G §10) och är förutsättningen för att någon A-Astro-siffra någonsin ska vara trovärdig. A-Lab är protokollets hem tills vidare.

**A-Astro.** Astronomisk hypotesprövning. Vilande som kampanjspår tills kandidatmatrisen (§11) levererar minst en källa med G_A > 1; till dess bedrivs A-Astro som teoriuppdrag (kandidatfysik) och som klassisk benchmark-verksamhet (bunching-mätningar för pipelinevalidering, vilket är etablerad intensitetsinterferometri).

Klyvningen skyddar protokollet: A faller inte för att astronomispåret saknar mål, och astronomispåret frestas inte att sänka ribban för att få något att göra.

## 11. Kontrastbudget, kandidatmatris och admissibility-gate (Ä6)

### 11.1 Budgetformeln

SNR ≈ |ε_obs| · R · √(τ_c · T · N),

med R fotontakt, T integrationstid, N oberoende multiplexade kanaler/baslinjer, och ε_obs = ε_källa/M. Empirisk kalibrering: Vega-bunching vid 0,5 m-teleskop — ≈32 h, amplitud ≈ 9,5·10⁻³, koherenstid ≈ 0,34 ps, SNR ≈ 2,8. Skalning till |ε_obs| ≈ 10⁻⁵ ger tusentals år per enskild kanal; hävstången är parallellisering (√N), ej smalare filter (fotonförlusten äter koherensvinsten exakt, R√τ_c ∝ √Δν).

### 11.2 Kandidatmatrisen (nytt arbetsobjekt, högsta prioritet)

För varje kandidatkälla dokumenteras {R, τ_c, M, ε_källa, ε_obs, T, N, riskprofil}. Preliminär bedömning per klass (från granskningsutlåtandet, antagen som utgångspunkt):

| Kandidatklass | Preliminär bedömning |
|---|---|
| Vanliga stjärnor | Klassisk/termisk bunching; ingen negativ A |
| Exoplanetreflektion | Extrem modutspädning, låg fotontakt |
| Astrofysiska masrar/lasrar | Koherenta eller supertermiska; ej automatiskt antibunchade |
| Pulsarer | Intressant tidsstruktur; negativ g²(0) ej given |
| Enskilda kosmiska emittrar | Teoretiskt intressanta; nästan alltid för svaga |
| Plasma-/rekombinationslinjer | Många emittrar; negativ kontrast späds sannolikt bort |
| Labbsystem (kvantpunkt/atom) | Realistiskt för A-Lab; ej astronomiskt |

Matrisen är levande: varje ny kandidatidé får en rad med siffror innan den får en observationsnatt.

### 11.3 Admissibility-gaten

G_A = |ε_obs,pred| / ε_min(R, τ_c, T, N).

Förregistrerade beslutsband: G_A < 1 — ej målbar, teoretisk kandidat; 1 < G_A < 3 — svag kandidat, kräver stark multiplexering; G_A > 3 — möjlig observationskandidat; G_A > 10 — prioriterad. Ingen A-Astro-kampanj planeras utan beräknad G_A; ingen A-strong hävdas utan uppfyllt krav 9 (§7) eller ärlig A-anomali-klassning.

## 12. Valideringsläge mot litteraturen

Metodkedjan är legitim och aktiv i publicerad forskning: intensitetsinterferometri mäter g² på stjärnljus från 0,25 m-system upp till Cherenkov-arrayer (VERITAS, MAGIC, H.E.S.S.), med Asiagos fotonräknande Vega-mätningar och 0,5 m-bunchingmätningen som småteleskopreferenser, och HBT-kontrasten boson/fermion är demonstrerad i atomära system. Etablerat: bunching i stjärnljus, fotonräknande arkitektur, SNR-skalning, fermionisk antibunching i materia. Spekulativt och odemonstrerat: robust icke-klassisk fotonstatistik från astronomiska källor, samt varje informationsöverföring bortom ljusrestid. Programmet placerar sig medvetet i gapet: etablerad metodkedja, oetablerad hypotes, strikt beslutslogik — nu med etiketten protocol-ready, target-unresolved som ärlig varudeklaration.

## 13. Relation till övriga signaturer

A är katalogens grindvakt: billigast, mest robust, binär i sin klassiska gräns. Beslutshierarkin: A först, C som guldstandard där inställningar kontrolleras, E och F som strukturprober ovanpå, M som interventionellt spår. E-strong kräver oberoende A/B/C-vittne från disjunkt kedja, vilket gör A:s tillförlitlighet till en förutsättning för katalogens övre våningar. Bokstavsschemat är låst: A fotonstatistik, B polarisation–tid, C Bell/CHSH, D invarianter, E lågdim struktur, F non-Markovianitet, G squeezing, H sensornätverk, M minnesspår; A_f öppnas som materievariant under A:s paraply.

## 14. Öppna frågor och åtgärdslista (omprioriterad i v0.2)

(1) **Bygg kandidatmatrisen** (§11.2) med siffror för minst tre kandidatklasser — programmets viktigaste enskilda uppgift; (2) A-Lab-valideringsplan samordnad med C/G-labbet (fysiska sanna positiva, ε/M-svep); (3) implementera nollmaskinen S1–S4 med utbyggt instrumentlager (§5-tabellens övre block) och p⁽²⁾-disciplin; (4) injection tests med ROC; (5) beräkna ε_min och G_A-exempel för en småteleskop- och en multiplexerad konfiguration; (6) formulera A_f-protokollet (§9.3) inför materiespåret; (7) uppdatera simuleringsverktyget med korskorrelationsläge och pile-up-demonstration; (8) förregistrera v1.0-trösklar före första skarpa kampanj.

Den öppna forskningsfrågan kvarstår oförändrad i sak men har nu sitt verktyg: finns astrofysikaliska processer med ε_källa < 0 och ε/M över kontrastgolvet? Kandidatmatrisen och G_A-gaten gör frågan kvantitativ i stället för retorisk.

## 15. Slutsats

Signaturtyp A förblir katalogens mest försvarbara komponent, och v0.2 har gjort den svårare att angripa på exakt de punkter där v0.1 var angripbar: dödtidens ensamrätt på "fejkar kvant" är återkallad och tabellen fylld med de korskanaliga bedragarna; mallmonopolet är ersatt av en trial-korrigerad familj; Q:s dubbelröstning är stoppad; och målbristen är omvandlad från öppen fråga till arbetsobjekt med gate och matris. Spårklyvningen ger till sist var sak sin plats: A-Lab där protokollet kan bevisa sig mot verkligt kvantljus i dag, A-Astro där det väntar — protocol-ready, target-unresolved — på att kandidatfysiken förtjänar en observationsnatt.
