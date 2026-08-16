# Signaturkandidat ETR — Energitransfer-, tröskel- och relaxationssignatur i materia


## Kandidatprotokoll version 0.0 — upprättat efter granskning av inlämnat förslag


**Namnbytesnot (2026-08-08)**

Kandidaten hette ursprungligen **J**. Bokstaven är bytt mot namnrymdskoden **ETR** (energitransfer).

- **J förkastades** eftersom ensam versal J redan bär D-rapportens symmetriska invarianter J₁ = tr(Σ),
  J₂ᵗ och J₃ᵗ.
- **Mellansteget P förkastades** eftersom sönderfallsträdet då fått beteckningen **T_P**, som är
  Plancktiden — i ett dokument som räknar ΔE·Δt ≳ ħ/2 och har en kärnfysikalisk underklass. P bär
  dessutom redan partikelnotens spårtyper P1–P6, kampanjnamnet P1 och bryggfaserna P0–P3.
- **ETR valdes**: noll förekomster i katalogens dokument, entydigt maskinläsbart.

Omdöpta identifierare: `G_ETR`, `T_ETR`, `S_ETR`, `ETR-Q1`–`ETR-Q5`, `ETR-cal-fail`, `ETR-none`,
`ETR-classical`, `ETR-struct`, `ETR-quantum-suspect`, `ETR-quantum-strong`, `ETR-nuclear`,
`ETR-form`, `ETR-prov`, `ETR-pipeline`, `ETR-vittne`.

Korsreferenser till syskonkandidaten pekar nu på **QFD** (tidigare I). Förkortningen **FDT** i
uttrycket "FDT-regim" är *teoremet* och är avsiktligt orörd. Evidensklassreferenser
("Klass I-vittne") och den svenska prepositionen "I" är oförändrade. **Sakinnehållet är oförändrat.**

*Status: **kandidat, admission-pending.** Målklass: Klass II strukturell materia-/process-signatur, kvantneutral i grundform, med kvantinnehåll via Q-kriterier och externt vittne — förslagets egen klassbedömning, bekräftad av granskningen. Detta dokument är inte en signaturrapport utan ett kandidatprotokoll enligt katalogens antagningsordning: det definierar kandidatens fysik, vittnen, kända bedragare och inträdesprov. Plattformen är antagningsnämnd; beslutsgång i §13. Kandidat QFD och kandidat ETR utgör antagningskön; bokstäver öppnas i den ordning proven godkänns.*


---


## 1. Sammanfattning


Signaturkandidat ETR mäter energins väg genom materia: hur tillförd energi omfördelas, lagras, frigörs och omvandlas över frihetsgraderna — elektroniska tillstånd, vibrationer/fononer, spinnsystem, bindningar, defekter, fasövergångar och mekanisk spänning — med trösklar, relaxationsvägar och sönderfallskaskader som mätobjekt. Kärnmening (antagen från förslaget): *ETR frågar hur tillförd energi rör sig genom materiens kvantiserade nivåer: vilka barriärer passeras, vilka tillstånd öppnas, vilka sönderfallsvägar väljs, och vilka spår lämnas i ljus, värme, vibration, spinn, defekter och fasövergångar.*


Granskningens huvudresultat. För det första fyller ETR en verklig lucka med teoretiskt motiverad plats: den interventionella familjens starka-driv-domän — QFD mäter jämviktens fluktuation–respons i linjär regim, ETR mäter kanalval och kaskader när systemet drivs över trösklar; SED-domen över QFD (kvantfenomen bortom klassiskt nollpunktsfält kräver icke-linjäritet) pekar ut exakt den regim ETR bebor. För det andra är grund-J kvantneutral: trösklar, relaxation, hysteresis och fasövergångar är klassisk termodynamik och materialfysik, och förslagets femgradiga klassning med förtjänad quantum-nomenklatur antas. För det tredje skärps samtliga fem kvantkriterier med fientliga imitatörer: Lorentz-oscillatorn mot ETR-Q1, barriärfördelningen mot ETR-Q2, klassiska svävningar mot ETR-Q3, arvsregeln kring ETR-Q4, och fri klassisk kinetik mot ETR-Q5 — med parameterfri struktur som genomgående diskrimineringskrav. För det fjärde tillförs energibokslutet som inbyggd omöjlighetsdetektor (RF_energy_balance), omöjlighetsdetektor-familjens fjärde medlem.


## 2. Fysikalisk grund


### 2.1 Energins frihetsgrader


Tillförd energi fördelas: E_in → E_translation + E_vibration + E_rotation + E_elektronisk + E_spin + E_bindning + E_defekter + E_värme. I fasta material dominerar fononkanalen; i molekyler vibration/rotation; i magnetiska material spinnexcitationer; i spända material kan energi frigöra låsta strukturer, dislokationer och fasövergångar. Mätobjektet är inte energimängden utan vägvalet.


### 2.2 Språkdisciplin (antagen från förslaget)


Spinn "snurrar inte snabbare": spinnsystem byter kvanttillstånd, polarisation, koherens eller relaxationsregim. Atomer går inte från stillhet till rörelse: termiska fluktuationer finns alltid; temperatur styr fononpopulation och medelrörelse. Elektroner exciteras, joniseras, tunnlar eller byter band; bindningar sträcks, böjs eller bryts; kärnor berörs endast vid väsentligt högre energiskalor (§2.5).


### 2.3 Trösklar och barriärer


Processhastighet över barriär: k ≈ ν·e^(−E_a/k_B·T) (Arrhenius), med spänningssänkt effektiv barriär E_a^eff = E_a − σ·V* (σ mekanisk spänning, V* aktiveringsvolym). Samma energitillskott ger därmed olika respons beroende på temperatur, mekanisk låsning, kristallinitet, defekttäthet, laddning och magnetisk ordning — ETR:s tröskelfysik.


### 2.4 Sönderfallsträdet (kandidatens starkaste objekt)


Ett exciterat tillstånd sönderfaller genom konkurrerande kanaler med hastigheter Γ_i, total Γ_tot = ΣΓ_i, livstid τ = 1/Γ_tot och branching-kvoter B_i = Γ_i/Γ_tot. Kaskaden E_n → E_{n−1} → … → E_0 med kanaltyp per steg ger ETR:s verkliga mätobjekt: sönderfallsträdet **T_ETR = {E_i, Γ_{i→j}, B_{i→j}, τ_i, ΔE_{ij}, kanaltyp}**. Urvalsregler skapar metastabila lås (efterglöd, fosforescens, spinnminne); linjebredd kopplar livstid till energiosäkerhet (ΔE·Δt ≳ ħ/2).


### 2.5 Nivåseparation


Fem mätnivåer med etablerade metoder: (1) elektroniska övergångar (absorption, emission, fotoluminescens, fotoelektroner); (2) vibrations-/fononkanalen (Raman, IR, värmeprofil, fononlivstider); (3) spinnsystem (ESR/EPR, NMR, magnetooptik, T₁/T₂); (4) defekter/spänning (akustisk emission, resistivitet, deformation, hysteresis, termisk relaxation); (5) kärnprocesser — separat underklass **ETR-nuclear** på energiskaleargument, öppnas inte i v0.0.


## 3. Vittnesdefinition


### 3.1 Responsvektorn


S_ETR = [ΔE_{ij}, Γ_{ij}, B_{ij}, τ_i, Q_rad, Q_nonrad, Q_phonon, Q_spin, Q_defect, E_a, H_hyst, ΔT, Δω_Raman, Δρ, Δσ] — nivåstruktur, kinetik, kanalandelar (Q-fraktioner), tröskel, minne och materialsvar. Vektorn förregistreras per uppställning; alla komponenter mäts med osäkerheter och delas i primära (T_ETR-träd + Q-fraktioner) och stödjande (materialsvar).


### 3.2 Energibokslutet (granskningens tillägg — omöjlighetsdetektor)


Q-fraktionerna ska summera till 1 inom propagerade osäkerheter, med explicit lagringsterm för metastabil energi och frigöringsbokföring över tid: ΣQ_i(t) + Q_lagrad(t) = 1. **RF_energy_balance:** uppmätt total utenergi som signifikant överstiger inenergi plus dokumenterad lagerfrigöring är fysikaliskt omöjlig och klassar sessionen som artefaktkontaminerad — kalibreringsfel, pumpläckage in i detektionskanaler eller dubbelbokförda kanaler. Fjärde medlemmen i katalogens omöjlighetsdetektor-familj (RF_heisenberg, RF_stokes_bound, RF_negative_occupation). Bokslutet är samtidigt ETR:s kvalitetsmått: en uppställning som inte sluter balansen inom förregistrerad tolerans är ogiltig för T_ETR-anspråk (→ ETR-cal-fail).


### 3.3 Demarkationer (bindande)


**Mot QFD:** QFD äger jämviktens linjära fluktuation–respons (svag störning, FDT-regim); ETR äger driven regim över trösklar (stark störning, kanalval, kaskader). Komplementära: QFD verifierar plattformens kvantbegränsade vila, ETR kartlägger vägvalen under drivning. **Mot F:** relaxationstider och minnesdynamik i ETR är features i energibokföringen; F äger korrelationsdynamikens vittnen (CK-test, revival-mallar) — korskörning tillåten, aldrig oberoende bekräftelse på delad rådata. **Mot M:** hysteresis i ETR är tillståndsvariablers vägberoende under drivning; M äger rekonstruktion av det förflutna (eko, miljövittne). **Mot A/G:** emissionsstatistik efter energitillskott (ETR-Q4) är A/G:s vittnen, anropade externt.


## 4. Kvantkriterierna ETR-Q1–Q5 (skärpta av granskningen)


Grund-J är kvantneutral; Q-kriterierna bär allt kvantinnehåll, och varje kriterium får sin fientliga imitatör:


**ETR-Q1 — nivåstruktur bortom linjär spektroskopi.** Diskreta linjer i *linjär* respons är klassiskt imiterbara: Lorentz-oscillatormodellen reproducerar linjära absorptions-/emissionsspektra med resonansstruktur. **Lorentz-oscillatorn är ETR:s motsvarighet till QFD:s SED-null och obligatorisk motståndare (N4, §6).** Kvantindikationen kräver icke-linjära kännetecken: mättnadsbeteende, anharmonisk stege (nivåavstånd som ändras systematiskt uppåt i kaskaden), eller hν-tröskling (responsen styrs av fotonenergin, inte intensiteten, vid fixerad total effekt).


**ETR-Q2 — förbjuden klassisk passage (tunnling).** Som formulerat ("övergång trots för låg T/spänning") imiteras kriteriet av barriärfördelningar i oordnade material, lokala varmpunkter och spänningskoncentrationer. Skärpt krav: (i) Arrhenius-analysens lågtemperaturplatå — hastigheten planar ut i stället för att frysa ut — över ett T-svep; (ii) barriärfördelningsnullen (N3) explicit förkastad, ty en fördelning med svans mot låg E_a fejkar platåer; (iii) isotophävstången där tillgänglig: tunnlingssannolikheten beror på massan (κ ∝ √m i exponenten), klassisk aktivering gör det inte — parameterfri diskriminator av QFD-lärdomens typ.


**ETR-Q3 — koherent dynamik.** Kopplade klassiska oscillatorer svävar också; koherent oscillation i driven respons är suspect-nivå. Kvantattribution kräver icke-linjära kännetecken, t.ex. oscillationsfrekvensens karakteristiska skalning med drivamplituden bortom linjär modell, eller kollaps–återkomst-struktur.


**ETR-Q4 — icke-klassisk emission efter energitillskott.** g²(0) < 1, sub-skottbrus eller CS-brott i det emitterade ljuset är A/G/B-2:s vittnen: ETR anropar dem som externa, med arvsregelns disjunkthetskrav. ETR-Q4 är därmed per konstruktion vägen till ETR-quantum-strong, aldrig ett internt ETR-vittne.


**ETR-Q5 — branching bortom klassisk kinetik (ETR:s mest originella vittne, skärpt null).** Förslagets null "klassisk termisk modell" är för snäll: klassisk kinetik med fria hastighetskonstanter Γ_ij fittar varje branching-tabell — Γ:na är fria parametrar, och en fri fit förklarar allt och förutsäger inget. Diskriminatorn måste vara **parameterfri struktur**: branching-mönster som följer urvalsregler (rörelsemängdsmoment, paritet, spinn) utan fittade vikter; kanalval som byter diskontinuerligt vid förutsagda fältvärden (nivåkorsningar/antikorsningar styrda av uppmätta g-faktorer); branching-kvoter vars fält- eller polarisationsberoende förutsägs av nivåstrukturen innan mätning. Fri-kinetik-nullen (N2) är obligatorisk motståndare, och ETR-Q5-anspråk utan parameterfri förutsägelse klassas som ETR-struct.


## 5. Bedragare


**Lokal uppvärmning/varmpunkter:** skenbar sub-tröskelaktivering ur lokal T över nominell; motmedel: effektsvep med extrapolering, termisk avbildning där möjligt, pulslängdsberoende. **Barriärfördelning (N3):** oordnade materials E_a-spridning imiterar tunnlingsplatåer och mjuka trösklar. **Pumpläckage:** drivenergins direktläckage in i detektionskanaler bokförs som "respons"; motmedel: spektral/temporal separation, blockerade-kanal-kontroller, energibokslutet. **Kalorimetrisk drift:** Q_värme-skattningens baslinjefel; interfolierade referenscykler (mätbar-null-principen). **Fotoinducerad laddning/ytkemi:** långsamma parasitiska kanaler som imiterar metastabil lagring; motmedel: atmosfär-/vakuumkontroll, cykelutmattningstest. **Detektionskedjans olinjäritet:** mättnad i detektorer imiterar mättnadskännetecken (falsk ETR-Q1); linearitetstest per kanal obligatoriskt. **Hysteresis av instrument, inte prov:** uppställningens egen historik (temperaturlag i hållare, magnetisering i komponenter); motmedel: tomprovs-cykler.


## 6. Nollfamilj (ETR-form av N-hierarkin)


**N0** — instrument- och baslinjeodell: drift, läckage, detektionsolinjäritet, kalorimetrisk baslinje. **N1** — klassisk värmemodell: värmeledning/kapacitet, jämn termalisering utan kanalstruktur. **N2** — fri klassisk kinetik: rate-ekvationer med fria Γ_ij, fittade till data — motståndaren mot ETR-Q5 och all T_ETR-tolkning; oavgjort tillfaller nollan. **N3** — disorder/barriärfördelning: E_a-fördelning med förregistrerad familj — motståndaren mot ETR-Q2. **N4** — Lorentz-oscillator/klassisk spektroskopimodell: linjära resonanser med klassiska linjeformer — motståndaren mot ETR-Q1. **S-surrogat:** cykelpermutation (bryter drivning–respons-parning), interfolierade referenscykler, blockpermutation över sessioner. p⁽²⁾-regeln och informationsestimator-standarden (för entropibaserade kanalmått, om sådana införs) gäller från dag ett.


## 7. Mätarkitektur


Minimikrav: (i) kalibrerad energitillförsel (puls- eller ramp-drivning med loggad E_in per cykel); (ii) flerkanalsdetektion med separerade kanaler (optisk emission, kalorimetri/termometri, Raman/IR, spinnresonans, akustisk emission, resistivitet, mekanisk sensorik — delmängd per uppställning, förregistrerad); (iii) energibokslutets slutning inom tolerans (§3.2); (iv) linearitetstest per detektionskanal; (v) T-svep och där tillämpligt fält- och spänningssvep (σ-hävstången ur §2.3); (vi) interfolierade referens- och tomprovscykler; (vii) för ETR-Q2: T-svep till platåregim plus isotopvariant där materialsystemet tillåter. Naturliga plattformar: färgcentrum/kvantpunkter (delar infrastruktur med A-Lab), spinnsystem (delar med D-Q/G-pol), mikromekaniska/spända material (delar med QFD). ETR är target-rich i laboratorium; ingen fältform definieras i v0.0.


## 8. Gate G_ETR


G_ETR = (förutsagd kanalseparation) / (minsta upplösbara kanalandel givet bokslutstolerans och kanalöverhörning), harmoniserad med gate-familjens band < 1 / 1–3 / > 3 / > 10. Gaten kvantifierar om uppställningen alls kan särskilja de kanaler T_ETR-anspråket kräver — en uppställning med två kanaler och 30 % överhörning har inget branching-vittne att erbjuda oavsett statistik. Beräknas per konfiguration före prov.


## 9. Klassning (v0.0, förslagets stege antagen med granskningens tillägg)


**ETR-cal-fail (giltighetsklass).** Energibokslut, linearitetstest, referenscykler eller kanalseparation under tolerans: mätningen ogiltig.


**ETR-none.** Ingen reproducerbar energirespons utöver N0–N1.


**ETR-classical.** Tydlig tröskel, relaxation, hysteresis eller fasövergång, förklarad av klassisk materialmodell (N1–N4) — hedervärt materialfysikaliskt resultat.


**ETR-struct.** Reproducerbart responsmönster som separerar material/tillstånd och överlever hela nollfamiljen med p⁽²⁾-disciplin, men utan kvantindikation enligt de skärpta Q-kriterierna.


**ETR-quantum-suspect.** ETR-struct plus minst ett skärpt Q-kriterium (Q1 med icke-linjära kännetecken; Q2 med platå + N3-förkastelse; Q3 med icke-linjär skalning; Q5 med parameterfri strukturförutsägelse) — replikerat, robust, utan röda flaggor.


**ETR-quantum-strong.** ETR-quantum-suspect plus oberoende Klass I-vittne (A, G, B-2, C eller D_Q) från disjunkt detektionskedja på samma system (ETR-Q4-vägen), eller etablerat kvantmaterialmått från separat mätkedja.


**Röda flaggor:** RF_energy_balance (→ ETR-cal-fail); RF_nonlinear_chain (detektionsolinjäritet); RF_pump_leak (respons följer läckagekanal); RF_hot_spot (effektberoende oförenligt med bulkuppvärmningsmodell åt fel håll); RF_instrument_hysteresis (tomprov visar samma minne); RF_barrier_tail (N3 likvärdig med tunnlingsmodell — oavgjort tillfaller nollan); Q-anspråk utan parameterfri förutsägelse.


## 10. Inträdesprovet


### K1 — utfallsmatrisen


| Injektion/uppställning | Krav på ETR-pipeline |
|---|---|
| Klassisk värmemodell (ren termalisering) | ETR-none/ETR-classical |
| Fri klassisk kinetik med strukturlös branching | ETR-struct som tak — aldrig Q5 |
| **Lorentz-oscillator-spektrum (linjärt)** | **ETR-struct som tak — aldrig Q1** |
| **Barriärfördelning med låg-E_a-svans** | **ETR-classical — aldrig Q2** |
| Simulerad äkta tunnlingsplatå + isotopskift | ETR-quantum-suspect (Q2) |
| Simulerad urvalsregelstyrd branching med nivåkorsning | ETR-quantum-suspect (Q5) |
| Injicerat pumpläckage | RF_pump_leak |
| Brutet energibokslut | RF_energy_balance → ETR-cal-fail |
| Kvantemissionsstatistik på emissionskanalen (syntetisk) | Q4-flagga → extern vittnesväg, aldrig internt ETR-vittne |


### K2 — kanariefåglar (obligatoriska)


(1) Lorentz-injektionen — falsk Q1-klassning underkänner provet; (2) barriärfördelningen — falsk Q2-klassning underkänner provet; (3) fri-kinetik-injektionen — falsk Q5-klassning underkänner provet; (4) brutet bokslut — måste fångas av RF_energy_balance.


### K3 — protokollkravet


Detta dokument, kompletterat efter K1–K2 med kalibrerade trösklar och beräknad G_ETR för minst en konkret uppställning.


## 11. Relation till katalogen


ETR fullbordar den interventionella familjens spektrum: QFD (jämvikt, linjär), F-aktiv (svag prob, dynamik), M (eko/rekonstruktion), ETR (stark drivning, trösklar, kaskader) — med C/G-labbet som gemensam infrastruktur. ETR:s Q-kriterier bor i exakt den icke-linjära regim SED-domen pekade ut, vilket ger QFD och ETR en gemensam framtidslinje: QFD:s eventuella quantum-strong-utökning (icke-linjärt vittne) och ETR:s Q1/Q3-kriterier är fysikaliskt släkt, och ett godkänt ETR-prov levererar metodik som QFD-utökningen kan ärva. Materiaspåret får därmed sin andra medlem efter H — H lyssnar passivt efter exotiska fält, ETR förhör materien aktivt om dess energivägar.


## 12. Öppna frågor


(1) Kvantitativ specifikation av N3-familjen (vilka E_a-fördelningsformer förregistreras?); (2) urvalsregelbibliotekets omfattning för Q5 per materialplattform; (3) ETR-nuclear-underklassens eventuella framtida öppning (egen energiskala, egen instrumentering); (4) informationsmått över kanalfördelningen (entropi över Q-fraktioner som sammanfattande statistika?) — i så fall under informationsestimator-standarden; (5) gemensam driv- och bokslutsinfrastruktur med QFD i plattformen.


## 13. Beslutsgång


(1) Detta v0.0-dokument granskas — föreliggande steg; (2) efter plattformens Sprint-milstolpar implementeras K1-matrisens nio rader och K2:s fyra kanariefåglar; (3) antagningsnämnden bedömer utfallsmatrisen — Lorentz-, barriär- och fri-kinetik-raderna avgör; (4) vid godkänt öppnas bokstaven ETR som Klass II-medlem med rapport v0.1; (5) vid underkänt arkiveras kandidaten med dokumenterade skäl. Ingen katalogdel refererar ETR som medlem före steg 4. Antagningskön: QFD och ETR prövas oberoende; delad infrastruktur (drivning, bokslut, linearitetstest) byggs en gång.


## 14. Slutsats


Signaturkandidat ETR kommer till antagningsnämnden i bättre skick än någon tidigare kandidat: självkorrigerad i språket, självklassificerad i ärlig Klass II, och med sitt starkaste objekt — sönderfallsträdet — placerat exakt där dess unika innehåll bor. Granskningens arbete har varit att ge varje kvantkriterium sin imitatör: Lorentz-oscillatorn mot nivåerna, barriärfördelningen mot tunnlingen, den fria kinetiken mot kanalvalet — och att skänka ETR det vapen ingen annan signatur fått gratis: ett energibokslut där naturen själv agerar revisor. ETR frågar vart energin tar vägen när materien tvingas välja; katalogens svar är att frågan är legitim, mätbar och värd en bokstav — den dag pipelinen visar att den kan skilja ett kvantval från en klassisk fördelning som bara låtsas välja.