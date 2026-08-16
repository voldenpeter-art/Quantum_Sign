# Signaturkandidat QFD — Kvant-FDT-/nollpunkts-konsistenssignatur


## Kandidatprotokoll version 0.1 — reviderat efter hård extern granskning


*Status: **kandidat, admission-pending.** Målklass ändrad: QFD kandiderar inte längre som Klass I-icke-klassicitetsvittne utan som **Klass II kvant-FDT-/nollpunkts-konsistenssignatur** — katalogens första jämvikts- och nollpunktskonsistenssignatur och materiaplattformarnas kalibreringsvittne. Ändringen följer av SED-invändningen, verifierad vid källan (Novotny m.fl., Phys. Rev. A 106, 043511 (2022); Boyer, Atoms 7, 29 (2019)).*


**Namnbytesnot — så tillkom koden QFD (2026-08-08)**

Kandidaten hette ursprungligen **I**. Bokstaven är bytt mot namnrymdskoden **QFD**
(kvant-fluktuation–dissipation) i tre dokumenterade steg:

1. **Bokstaven I förkastades.** En kollisionsrevision av katalogens dokument visade att ensam
   versal I redan bär fyra etablerade betydelser: evidensklasserna I/II/III i syntesrapporten,
   D-rapportens invariant-vektor **I** = [λ̃₁, λ̃₂], intensiteten I(t) i A/B:s g²-definition, och
   enhetsmatrisen I/4 i C:s Werner-tillstånd.
2. **Mellansteget O förkastades.** Ett första byte till bokstaven **O** genomfördes men underkändes:
   gaten G_O läses som G₀ (konduktanskvantum, grundtillstånd), och O/0-förväxling i filnamn,
   tabeller och kodidentifierare är en reell parsningsrisk.
3. **Koden FDT förkastades.** Nästa förslag var namnrymdskoden **FDT**, men förkortningen förekommer
   redan 28 gånger i detta dokument som beteckning på *fluktuation–dissipationsteoremet*
   (jämvikts-FDT ×5, FDT-brott ×5, kvant-FDT-konsistens ×4, m.fl.). Signaturprefixet hade då blivit
   omöjligt att skilja från fysikens: `FDT-cal-fail` (giltighetsklass) mot `FDT-brott` (teorembrott).

**QFD valdes** eftersom koden har noll förekomster i katalogens samtliga dokument, är entydigt
maskinläsbar, och lämnar den etablerade förkortningen FDT orörd som teoremets namn. Prosan
"kvant-FDT-konsistens" och "FDT-brott" syftar därför genomgående på **teoremet**; prefixet
`QFD-` syftar genomgående på **signaturen**.

Omdöpta identifierare: `G_QFD`, `QFD-ratio`, `QFD-asym`, `QFD-core`, `QFD-ZPF-consistent`,
`QFD-cal-fail`, `QFD-thermal`, `QFD-noneq`, `QFD-none`, `QFD-quantum-supported`,
`QFD-quantum-suspect`, `QFD-quantum-strong`, `QFD-pipeline`, `QFD-vittne`, `QFD-anpassad`,
`QFD-status`. Evidensklassreferenser ("Klass I-vittne", "Klass II") och den svenska prepositionen
"I" är oförändrade. **Sakinnehållet är oförändrat i förhållande till v0.1.**

**Ändringslogg v0.0 → v0.1:** (Ä1) Taxonomifrågan (v0.0 §11.3) stängd: Klass II. SED — en klassisk teori med reellt nollpunktsfält av ħ-satt skala — reproducerar nollpunktsgolvet, coth-formen och sidbandsasymmetrin för linjära gaussiska jämviktssystem; blindhetsgränsen preciseras med källans egen formulering: SED ger kvantmekanikens förutsägelser så länge både systemdynamik och mätprocess är linjära (§4). (Ä2) Konventionslåset utökat från spektralkonvention till full mätordning (§2.4). (Ä3) N2-familjen utökad till N2a–e med obligatorisk SED/ZPF-null (§7.1). (Ä4) Bedragare 3 införd: dynamisk backaction och mätinducerad kylning, med probe- och detuning-svep samt Γ_opt/optisk-fjäder-bokföring (§6). (Ä5) RF_thermal_decoupling med motmedelsbatteri; T-svepets giltighet kräver mode-termometri (§5.3). (Ä6) Oberoendekrav för högre klassnivåer: minst en av två detektionskedjor, två moder, χ″-variationsföljning eller noll-effekt-extrapolering (§8.3). (Ä7) KMS-/detaljerad-balans-protokollet: QFD som jämviktens fullständiga självkonsistensprov, med RF_KMS, RF_KK, RF_passivity, RF_backaction samt RF_negative_occupation — den senare införd i katalogens omöjlighetsdetektor-familj (§9). (Ä8) Klassningen omgjord med QFD-ZPF-consistent som huvudklass; QFD-quantum-strong reserveras för framtida icke-linjär/icke-gaussisk utökning som slår N2e och antas inte i v0.1 (§10). (Ä9) K1-matrisen utökad till nio rader och kanariefåglarna till fem, med SED-raden som provets skarpaste (§11). Kärnmeningen antagen från utlåtandet (§13).


---


## 1. Sammanfattning


Signaturkandidat QFD mäter om materia i termisk jämvikt bär det nollpunkts- och responsmönster som kvantmekanikens fluktuation–dissipations-relation kräver — och om detta mönster överlever tekniska golv, klassisk icke-jämvikt, termisk urkoppling och mätbackaction. Kärnobservabeln är kvoten mellan brusspektrum och dissipativ respons över ett (ω, T)-svep, med det temperaturoberoende nollpunktsgolvet och den parameterfria coth-övergången som signaturform.


Den avgörande revisionen i v0.1: **QFD är inte ett icke-klassicitetsvittne.** Stokastisk elektrodynamik — en klassisk stokastisk fältteori med reellt nollpunktsfält vars spektrum sätts av ħ — reproducerar för linjära gaussiska jämviktssystem exakt de observabler QFD-core mäter, inklusive sidbandsasymmetrin; detta är källverifierat i granskad litteratur. QFD kan utesluta klassisk jämvikts-FDT utan nollpunktsfält, tekniska golv, breda klasser av klassisk icke-jämvikt, felkalibrerad termometri och termisk urkoppling — men inte en SED-lik nollpunktsmodell. QFD:s ärliga och betydande värde är därför ett annat: den verifierar kvant-FDT-konsistens, observerbar nollpunktsrörelse, brusets koppling till uppmätt dissipation och att en materieplattform nått kvantbegränsad mätregim — katalogens jämvikts- och mätkedjeverifikation för materiesidan, och den interventionella familjens kalibreringssignatur för C/G/F/M-labbets oscillatorplattformar. Vägen till kvantanspråk går via externt disjunkt Klass I-vittne (QFD-quantum-supported) eller via en framtida icke-linjär utökning — aldrig via QFD-core ensam.


## 2. Fysikalisk grund


### 2.1 Klassisk fluktuation–dissipation


För ett klassiskt jämviktssystem vid temperatur T binder FDT brusspektrum till dissipativ respons: S(ω) ∝ (k_B·T/ω)·χ″(ω). Parameterfritt givet T.


### 2.2 Kvantformen (Callen–Welton)


I låst tvåsidig, symmetriserad konvention: S_sym(ω) = ħ·coth(ħω/2k_B·T)·χ″(ω), upp till konventionsfaktorer. I gränsen ħω ≪ k_B·T återfås den klassiska formen (coth x → 1/x).


### 2.3 Nollpunktsgolvet


När ħω ≫ k_B·T: klassisk jämviktsfysik utan nollpunktsfält går mot noll brus; kvantformen planar ut på ħ|χ″|-golvet. Ekvivalent sidbandsform: kvoten anti-Stokes/Stokes = n̄/(n̄+1) → 0 när n̄ → 0. **Tolkningsförbehåll (nytt, bindande):** golvet och asymmetrin är kvant-FDT-*konsistenta*, inte klassiskt *omöjliga* — se §4.


### 2.4 Mätordningslåset (Ä2: utökat)


Konventionslåsningen omfattar hela mätordningen, inte bara spektralkonvention: (i) symmetriserat kontra osymmetriserat spektrum (S_sym mot S^>, S^<); (ii) två- eller ensidigt; (iii) Hz eller rad/s; (iv) observabel — förskjutning, kraft, spänning, ström eller kvadratur; (v) operatorordning kontra detektionsobservabel — symmetriserad produkt eller normal-/tidsordnad; (vi) exakt definition av χ″; (vii) bakgrundssubtraktionspolicy; (viii) explicit detektormodell — mäter kedjan symmetriserat brus eller sidbandsordnat kvantbrus? Punkt (v) och (viii) är inte formalia: samma uppmätta asymmetri kan i olika detektionsmodeller attribueras till oscillatorns kvantbrus, fältets kvantbrus eller korrelation mellan mätbrus och backaction. Allt låses i förregistreringen; brott är RF_convention (diskvalificerande).


## 3. Vittnesdefinition — två mätformer


### 3.1 QFD-ratio


Samtidig/interfolierad mätning av S(ω) och χ(ω) genom samma kedja; kvoten R_QFD(ω, T) jämförs mot kvantformen respektive nullfamiljen över ett T-svep med minst tre punkter som spänner övergångsregionen ħω ~ k_B·T. Vittnesformen: överensstämmelse med den parameterfria kvantformen där nullfamiljens bästa medlem samtidigt förkastas — med §4:s tolkningstak.


### 3.2 QFD-asym


För system med upplösta sidband: kvoten A(ω) mellan anti-Stokes- och Stokes-styrka mot prediktionen n̄/(n̄+1), med n̄ ur oberoende termometri, under uttrycklig detektormodell (§2.4 viii) och backaction-bokföring (§6).


### 3.3 Formkonsistens


Där båda formerna mäts ska n̄/T-skattningarna vara förenliga (RF_form_inconsistency annars) — med §8.3:s oberoendekrav, ty konsistens inom en delad kedja kan blott visa att samma systematik är konsekvent.


## 4. SED-gränsen: vad QFD kan och inte kan utesluta (Ä1)


Stokastisk elektrodynamik inför ett klassiskt, reellt elektromagnetiskt nollpunktsfält med spektral skala satt av ħ. För **linjära, gaussiska jämviktssystem med linjär mätprocess** reproducerar SED kvantmekanikens förutsägelser för QFD:s observabler — inklusive nollpunktsgolv, coth-form och sidbandsasymmetri; det senare är kvantitativt demonstrerat i granskad litteratur, där asymmetrin uppstår ur korrelationen mellan mätbrus och backaction-brus i en helklassisk beräkning. Källans egen slutsats definierar blindhetsgränsen: genuina kvantfenomen bortom SED kräver icke-linjäritet i systemet eller mätprocessen.


**Konsekvens (bindande):** QFD-core kan utesluta — klassisk jämvikts-FDT utan nollpunktsfält; tekniska golv; klassisk icke-jämvikt av N2a–d-klasserna; felkalibrerad termometri; termisk urkoppling. QFD-core kan inte utesluta — en SED-lik klassisk nollpunktsmodell (N2e). Därför är QFD Klass II, och ordet "quantum" i QFD:s klassnamn kräver antingen externt disjunkt Klass I-vittne eller den icke-linjära utökningen (§10). Detta är ingen degradering utan en exaktare varudeklaration: QFD föds ärligt.


## 5. Bedragare 1–2: icke-jämvikt och tekniska golv


### 5.1 Klassisk icke-jämvikt


Effektiva temperaturer T_eff(ω) ≠ T_bad är regel i glas, drivna system och aktiv materia; generiskt FDT-brott är evidensneutral. Diskrimineringen bärs av den parameterfria formen över hela (ω, T)-svepet mot den fientliga N2-familjen (§7.1) — med oavgjort-tillfaller-nollan i kraft.


### 5.2 Tekniska golv


Förstärkar- och detektorgolv är temperaturoberoende. Diskriminering: golvattributionstestet — en systemparameter (resonans eller dämpning) varieras avsiktligt och golvet ska följa χ″-prediktionen, inte ligga still (RF_floor annars). För QFD-asym: kalibrerade klassiska injektionstoner med känd symmetri ska återges symmetriskt (RF_squash).


### 5.3 Termisk urkoppling (Ä5: ny bedragare med egen flagga)


Vid låga temperaturer kan mode, chip, fononbad och termometer ha olika temperaturer; om modens temperatur mättar medan kryostatens termometer fortsätter nedåt uppstår ett temperaturoberoende golv som inte är nollpunktsbrus — T-svepet sveper då kylskåpet, inte systemet. **RF_thermal_decoupling** med obligatoriskt motmedelsbatteri: oberoende termometri på moden själv (t.ex. ur brusnivå i klassisk regim), flera termometrar nära systemet, värmepuls-/relaxationsmätning, kontroll av Q, dämpning och resonansdrift mot temperatur, jämförelse mellan flera moder med olika ω_m, samt golvattributionstestet. Utan godkänt batteri är T-svepet ogiltigt (→ QFD-cal-fail).


## 6. Bedragare 3: dynamisk backaction och mätinducerad kylning (Ä4: ny)


Mätljuset är inte passivt: prob-fältet ger optisk dämpning (Γ_eff = Γ_m + Γ_opt), optisk fjäder (Ω_eff = Ω_m + δΩ_opt), backaction-brus, sidbandskylning och mätinducerad asymmetri via brus–backaction-korrelationer. Obligatoriska krav: (1) probe-effekt-svep med extrapolering mot noll effekt; (2) detuning-svep (röd/blå/resonans); (3) separat bokföring av Γ_opt; (4) separat bokföring av optisk fjäder; (5) gemensam modell där asymmetri, dämpning och fjäder förklaras av samma parameteruppsättning; (6) **RF_backaction** — utlöses om "nollpunktsgolvet" endast existerar i regimen där backaction dominerar, eller om asymmetrin följer probe-effekt/detuning snarare än temperatur. Detta är den centrala optomekaniska falska positiven och behandlas därefter.


## 7. Nollmaskin och inferens


### 7.1 Nullfamiljen (Ä3: utökad)


**N0** teknisk modell (förstärkargolv, detektorbrus, kedjeasymmetri; kalibreringsparametrar). **N1** klassisk jämvikts-FDT vid uppmätt T. **N2a** slät T_eff(ω) med begränsade knutpunkter. **N2b** mättande termisk urkoppling: T_mode(T_bad) = T_floor + α·T_bad. **N2c** TLS-/defektbad: strukturerade resonanser med smala toppar i T_eff(ω). **N2d** aktiv feedback/backaction: klassisk återkoppling, mätbrus, optisk kylning som ändrar brus och respons gemensamt. **N2e** SED/ZPF-null: klassisk nollpunktsmodell med ħω/2-golv — **obligatorisk**, och per §4 förväntas den inte kunna slås av QFD-core i linjära system; dess roll är att hålla klassningen ärlig (§10) och att utgöra provets skarpaste rad (§11). **N3** kombinerad motståndare: N2-familjen + N0 + squashing + backaction, aktivt trimmad.


### 7.2 Inferens


Tvådelad: **Del 1** — parameterfri formjämförelse (kvantformen utan fria skalor mot bästa N0–N2d-medlem över hela svepet; förregistrerat informationskriterium; oavgjort tillfaller nollan); notera att N2e per konstruktion är formekvivalent med kvantformen i linjär regim och därför inte deltar i del 1 utan verkar genom klasstaket (§10). **Del 2** — motståndarkontroll: N3 ska inte reproducera kombinationen golvnivå + coth-form + T-svep + golvattribution + backaction-bokföring. p⁽²⁾-regeln gäller varje vittneskomponent; drivning-av-segment utgör mätbar brusreferens (mätbar-null-principen).


## 8. Mätarkitektur


### 8.1 Minimikrav


Samtidig/interfolierad S- och χ-mätning genom samma kedja; kalibrerad svag drivning med linjäritetssvep över minst en dekad (RF_nonlinear annars); oberoende bad- **och** mode-termometri (§5.3); systemparametervariation för golvattribution; probe- och detuning-svep (§6); mätordningslåst kedja (§2.4).


### 8.2 Plattformar


Opto-/elektromekanisk oscillator (delar homodyn/heterodyn-infrastruktur med G), spinn-system, kretsresonator — den interventionella familjens hemmaplan. Ingen fältform definieras.


### 8.3 Oberoendekrav för högre klasser (Ä6)


För QFD-ZPF-consistent på strong-nivå och för QFD-quantum-supported krävs minst en av: samma oscillator genom två olika detektionskedjor; två mekaniska moder med olika frekvens i samma system; samma mode med både respons- och sidbandsmätning under separata kedjekalibreringar; avsiktlig χ″-förändring med golvföljning; probe-extrapolering till noll backaction. Formkonsistens inom en enda delad kedja räcker aldrig.


## 9. KMS-protokollet: jämviktens självkonsistens (Ä7)


QFD uppgraderas från kvotmätning till fullständigt jämviktskonsistensprov: symmetriserat brus, osymmetriserat brus (där mätbart), respons, sidbandsasymmetri, temperatur och kausalitet ska alla passa **samma** jämviktsmodell. Intern rödflaggslogik:


**RF_KMS** — detaljerad balans (S(−ω)/S(+ω) = e^{−ħω/k_B·T} i låst konvention) faller mot oberoende termometri; tolkas med försiktighet per §2.4 (viii), ty asymmetrins attribution är detektormodellberoende. **RF_KK** — χ′ och χ″ bryter Kramers–Kronig: responsdata är internt okausala, mätningen ogiltig. **RF_passivity** — systemet uppträder som aktivt medium utan registrerad drivning. **RF_negative_occupation** — fit ger n̄ < 0 utan populationsinversion: fysikaliskt omöjligt, bevisad artefakt; **införs härmed i katalogens omöjlighetsdetektor-familj** tillsammans med G:s RF_heisenberg och D:s RF_stokes_bound. **RF_backaction** — §6. KMS-bokföringen gör QFD robustare utan att göra den Klass I — och det är precis dess syfte.


## 10. Klassning (v0.1; Ä8)


**QFD-cal-fail.** Konvention, linjäritet, termometri/urkopplingsbatteri, backaction-bokföring, KK-konsistens eller golvattribution faller: mätningen ogiltig (giltighetsklass).


**QFD-thermal.** Klassisk jämvikts-FDT bekräftad med precision — termometri- och kalibreringsresultat med eget värde.


**QFD-noneq.** FDT-brott föreligger men N2a–d-familjen (icke-jämvikt, urkoppling, TLS, feedback) förklarar eller är likvärdig: det icke-exotiska fyndets adress.


**QFD-ZPF-consistent (huvudklass).** Data följer Callen–Welton-/nollpunktsformen parameterfritt över (ω, T)-svepet; N0–N2d förkastade; golvattribution, backaction-bokföring, KMS-konsistens och kanariefåglar passerade; §8.3-oberoende uppfyllt på strong-nivå — **men SED/ZPF-nullen (N2e) är per konstruktion inte utesluten.** Detta är QFD:s ärliga topputfall i egen kraft: kvant-FDT-konsistens och observerad nollpunktsrörelse, utan icke-klassicitetsanspråk.


**QFD-quantum-supported.** QFD-ZPF-consistent plus samtidigt oberoende Klass I-vittne (G, A, B-2 eller C) från disjunkt detektionskedja på samma plattform — E-strong-mönstret i materieform.


**QFD-quantum-strong.** Reserverad: kräver protokollutökning med icke-gaussiskt, icke-linjärt eller ordningskänsligt vittne som bevisligen slår N2e (t.ex. anharmonisk oscillator/tvånivåsystem med nivåstruktur och urvalsregler, Fock-statistik eller negativ Wignerfunktion — varvid gränsen mot A/G/C ska respekteras: QFD gör inte Klass I genom att smuggla in syskonens vittnen). Antas inte i v0.1; öppnas endast genom eget tilläggsprotokoll med eget prov.


**Röda flaggor:** RF_convention (diskvalificerande); RF_nonlinear; RF_floor; RF_squash; RF_thermal_decoupling; RF_backaction; RF_form_inconsistency; RF_KMS; RF_KK; RF_passivity; RF_negative_occupation (→ QFD-cal-fail).


## 11. Inträdesprovet (Ä9: utökat)


### K1 — utfallsmatrisen (nio rader)


| Injektion | Krav på QFD-pipeline |
|---|---|
| Kvant-FDT-oscillator | QFD-ZPF-consistent |
| **SED/ZPF-oscillator** | **QFD-ZPF-consistent — aldrig någon quantum-klass** |
| Klassisk minnesprocess (multi-OU/flicker) | none (F:s domän) |
| Klassisk icke-jämvikt, slät T_eff | QFD-noneq |
| Klassisk icke-jämvikt, TLS-resonanser | QFD-noneq eller QFD-cal-fail |
| Termiskt urkopplad oscillator | RF_thermal_decoupling |
| Tekniskt golv utan χ″-koppling | RF_floor |
| Squashing-/asymmetriartefakt | RF_squash |
| Dynamisk backaction | RF_backaction eller korrekt backaction-attribution — aldrig quantum |


SED-raden är provets skarpaste: **klassas den som någon quantum-nivå har protokollet misslyckats i sin helhet.** Kvantraden och SED-raden ska ge samma klass (QFD-ZPF-consistent) — det är inte ett fel utan beviset på att klassningen är ärlig.


### K2 — fem kanariefåglar


(1) Tekniskt golv → RF_floor; (2) squashing → RF_squash; (3) **SED-injektion → aldrig quantum-klass**; (4) **termisk urkoppling → RF_thermal_decoupling**; (5) **backaction-inducerad asymmetri och kylning → RF_backaction**. Falsklarm på någon underkänner provet.


### K3 — protokollkravet


Detta dokument utgör K3 i reviderad form; godkänt prov kräver därtill beräknad gate G_QFD (§12) för minst en laboratoriekonfiguration, samt att samtliga sju inträdesvillkor ur granskningsutlåtandet — SED-null, urkopplingsmotståndare, backaction-motståndare, mätordningslås, KMS-bokföring, QFD-ZPF-consistent-klassen, SED-säker matris — är implementerade och demonstrerade.


## 12. Admissibility-gate G_QFD


G_QFD = (förutsagd golv-mot-teknisk-marginal) / (minsta upplösbara S/χ″-avvikelse givet kalibreringsprecision), harmoniserad med gate-familjen och banden < 1 / 1–3 / > 3 / > 10; beräknas per konfiguration och kvantifierar var kalibreringsbudgeten sätter gränsen. Kandidaten är target-rich i laboratorium; gaten är ändå obligatorisk inför provet.


## 13. Relation till katalogen och beslutsgång


**Plats:** interventionella familjen; delar mätkedjeinfrastruktur med G; blir vid antagning materiaplattformarnas kalibreringssignatur — verifikationen att C/G/F/M-labbets oscillatorsida är kvantbegränsad och termiskt ärlig. **Unikhetsrummet (reviderat):** QFD mäter jämviktens kvant-FDT-konsistens; F dynamikens minne; M det förflutnas återvinningsbarhet; G brus under vakuumnivån. Gränsen mot G kvarstår komplementär — G detekterar konstruerad icke-klassicitet med vattentätt vittne, QFD detekterar jämviktens nollpunktsmönster med konsistensvittne — och klasskillnaden är nu exakt känd och teoretiskt härledd, vilket skiljer QFD från Klass II-syskonen B/D/E/F vars klasstillhörighet upptäcktes empiriskt.


**Kärnmening (antagen från utlåtandet, bindande):** *QFD mäter inte kvantighet i stark informationsfysisk mening; QFD mäter om materia i jämvikt bär det nollpunkts- och responsmönster som kvant-FDT kräver — och om detta mönster överlever tekniska golv, icke-jämvikt, termisk urkoppling och mätbackaction.*


**Beslutsgång:** (1) detta v0.1-dokument granskas; (2) K1-matrisens nio injektioner och K2:s fem kanariefåglar implementeras i plattformen efter Sprint-milstolparna; (3) antagningsnämnden bedömer utfallsmatrisen — SED-raden avgör; (4) vid godkänt öppnas bokstaven QFD som **Klass II-medlem** med rapport v0.1 och QFD-ZPF-consistent som huvudklass; (5) vid underkänt arkiveras kandidaten med dokumenterade skäl. QFD-quantum-strong-spåret förblir stängt tills ett separat icke-linjärt tilläggsprotokoll med eget prov föreligger.


## 14. Slutsats


Signaturkandidat QFD lämnar den hårda granskningen mindre än den kom in som anspråk och större som instrument. SED-invändningen — källverifierad i granskad litteratur — stänger Klass I-vägen för linjära system med matematisk finalitet: naturen tillåter en klassisk imitatör av nollpunktsgolvet, och katalogen dömer vittnen efter vad de överlever. Men det som återstår är inget tröstpris: en signatur som parameterfritt verifierar kvant-FDT-konsistens, avslöjar termisk urkoppling, bokför backaction, bär fem kanariefåglar och en omöjlighetsdetektor, och kalibrerar materiesidans hela mätregim — född ärligare än någon annan kandidat, eftersom den föds med sin egen begränsning inskriven i första stycket. Om provet går vägen blir QFD katalogens första medlem vars viktigaste egenskap inte är vad den bevisar, utan hur exakt den vet vad den inte bevisar.














---


# ARKIV — ERSATT VERSION


> **Varning.** Nedanstående är kandidatprotokoll **v0.0**, som är **ersatt av v0.1 ovan** och
> inte får citeras som gällande. v0.0 gör fortfarande ett **Klass I-anspråk** som SED-invändningen
> sedan rev ner; målklassen är i v0.1 ändrad till Klass II. Texten behålls enbart som
> versionshistorik.







# Signaturkandidat QFD — Kvant-fluktuation–dissipation (FDT-signaturen) [ARKIV v0.0]


## Kandidatprotokoll version 0.0 — upprättat inför inträdesprov


*Status: **kandidat, ej katalogmedlem.** Statusetikett: candidate, admission-pending. Detta dokument är inte en signaturrapport utan ett kandidatprotokoll enligt katalogens antagningsordning: det definierar kandidatens fysik, vittnen, kända bedragare och det inträdesprov (K1–K3) som måste godkännas innan bokstaven QFD öppnas. Plattformen är antagningsnämnd; beslutsgången fastställs i §12. Kandidaten föreslogs i plattformsgranskningen och konkretiserades i chattgranskningen; detta dokument utgör K3-leveransen.*


---


## 1. Sammanfattning


Signaturkandidat QFD avser detektion av kvantmekaniska jämviktsfluktuationer genom brott mot den klassiska fluktuation–dissipations-relationen, med nollpunktsgolvet som kärnvittne: när ħω ≫ k_B·T förutsäger klassisk fysik att brusspektrumet försvinner med temperaturen, medan kvantmekaniken förutsäger ett temperaturoberoende golv med skala satt av ħ — utan fria parametrar.


Kandidatens styrkor: den är interventionell (target-rich i laboratorium, inget målproblem), den är katalogens mest materia-vänliga kandidat (mekaniska oscillatorer, spinn, kretsar), dess mätlinje är experimentellt etablerad (sidbandsasymmetri-mätningar i optomekanik demonstrerar rutinmässigt nollpunktsrörelse), och den bär ett teoretiskt unikhets-argument mot F och M: en harmonisk oscillator i grundtillståndet har varken minne eller återvinningsbart förflutet men bryter ändå klassisk FDT.


Kandidatens kända bedragare, som motiverar inträdesprovet: (1) klassiska icke-jämviktssystem bryter FDT rutinmässigt (effektiva temperaturer i glas, drivna system, aktiv materia) — generiskt FDT-brott är därför evidensneutral, och vittnet måste vara den parameterfria ħ-formen verifierad över ett temperatursvep; (2) tekniska brusgolv (förstärkare, detektorer) är också temperaturoberoende — den banala tvillingen till det djupa resultatet — och mätkedjeartefakter kan skapa falsk sidbandsasymmetri; kalibreringsbördan är av G-klass. Kandidatens taxonomiska placering (Klass I eller Klass II) lämnas medvetet öppen och avgörs av inträdesprovets utfall (§11.3).


## 2. Fysikalisk grund


### 2.1 Klassisk fluktuation–dissipation


För ett klassiskt system i termisk jämvikt vid temperatur T binder FDT det spontana brusspektrumet till den dissipativa responsen: S(ω) ∝ (k_B·T/ω)·χ″(ω), där χ″ är imaginärdelen av den linjära responsfunktionen (systemets svar på svag drivning) och S brusspektrumet av samma variabel. Relationen är parameterfri givet T: mäter man både passivt brus och drivet svar är kvoten bestämd. Detta är klassisk jämviktsfysiks hårdaste interna konsistenskrav.


### 2.2 Kvantformen (Callen–Welton)


Kvantmekanisk jämvikt ersätter den klassiska temperaturfaktorn: det symmetriserade brusspektrumet uppfyller S_sym(ω) ∝ ħω·coth(ħω/2k_B·T)·χ″(ω)/ω-strukturen (konventionsberoende form; se §2.4). I gränsen ħω ≪ k_B·T reduceras coth-faktorn till den klassiska (coth x → 1/x) och relationerna sammanfaller.


### 2.3 Nollpunktsgolvet — kärnvittnet


I motsatt gräns, ħω ≫ k_B·T, går klassisk fysik mot noll brus medan kvantformen planar ut på ett temperaturoberoende golv: S_sym → ħ·|χ″|-nivån, satt av nollpunktsfluktuationerna. Två egenskaper gör golvet till vittne: (i) det är **parameterfritt** — ħ är naturens konstant, ingen skala fittas; (ii) det är **format** — hela coth-övergången från klassisk regim till golv, som funktion av både ω och T, är förutsagd utan justerbara parametrar. En ekvivalent, icke-symmetriserad formulering: kvoten mellan emissions- och absorptionssidband (anti-Stokes/Stokes) är n̄/(n̄+1), som går mot noll när n̄ → 0 — klassiskt brus ger kvoten 1.


### 2.4 Konventionslåsning (bindande redan i kandidatstadiet)


FDT-litteraturen använder olika spektralkonventioner (symmetriserat/en-sidigt/två-sidigt spektrum; vinkel- eller vanlig frekvens; olika normalisering av χ″). Blandade konventioner producerar falska faktorer 2 och falska "avvikelser". Kandidatprotokollet kräver: en enda konvention väljs, dokumenteras med explicita definitioner av S och χ″, och låses i förregistreringen; alla prediktionsformler härleds i den låsta konventionen innan någon data ses. Detta är QFD:s motsvarighet till A:s fiducialfönster-låsning — en trivialitet som fäller program när den slarvas.


## 3. Vittnesdefinition — två mätformer


### 3.1 QFD-ratio (spektralkvotsformen)


Mät på samma system, i samma konfiguration: (a) det passiva brusspektrumet S(ω) över förregistrerade band, (b) responsfunktionen χ(ω) via svag kalibrerad drivning (linjäritet verifierad, §10 röda flaggor). Bilda kvoten R_QFD(ω, T) = S(ω)/χ″(ω) och jämför mot den parameterfria kvantprediktionen respektive den klassiska, över ett **temperatursvep** med minst tre T-punkter som spänner övergångsregionen ħω ~ k_B·T. Vittnet är inte "avvikelse från klassisk FDT" utan **överensstämmelse med kvantformen utan fria skalparametrar där den klassiska formen samtidigt förkastas**.


### 3.2 QFD-asym (sidbandsformen)


För system med upplösta sidband (optomekanik-klass): kvoten A(ω) mellan anti-Stokes- och Stokes-sidbandens integrerade styrka. Kvantprediktion: A = n̄/(n̄+1) < 1, med n̄ ur oberoende termometri; klassisk prediktion: A = 1. Vittnet är A signifikant under 1, konsistent med oberoende n̄-skattning, och robust mot mätkedjans kända asymmetri-artefakter (§5).


### 3.3 Konsistenskrav mellan formerna


Där båda formerna är mätbara på samma system ska de ge förenliga n̄/T-skattningar; inkonsekvens är röd flagga (RF_form_inconsistency) — samma logik som G:s parkonsistensfit.


## 4. Bedragare 1: klassisk icke-jämvikt


Klassiska system utanför jämvikt bryter FDT som regel, inte undantag: åldrande glas, drivna system och aktiv materia beskrivs med frekvensberoende effektiva temperaturer T_eff(ω) ≠ T_bad just därför att fluktuation/respons-kvoten avviker. Konsekvens (bindande): **generiskt FDT-brott är evidensneutral.** Kvantanspråket bärs uteslutande av den parameterfria formen: (i) golvets nivå förutsagd av ħ och uppmätt χ″ utan fri skala; (ii) coth-övergångens läge förutsagt av ħω/2k_B·T utan fri skala; (iii) T-svepet — en klassisk T_eff-modell måste följa med varje ny badtemperatur ad hoc, medan kvantformen förutsäger hela svepet i förväg. Inferensen (§7) ställer kvantformen mot en klassisk familj där T_eff(ω) får vara en slät fri funktion — och kvantformen måste vinna på både passning och parsimoni, med oavgjort-tillfaller-nollan-regeln i kraft.


## 5. Bedragare 2: tekniska golv och mätkedjeasymmetri


Förstärkarbrus och detektorgolv är temperaturoberoende — precis som nollpunktsgolvet. Diskriminering: det tekniska golvet är **inte knutet till den samtidigt uppmätta χ″** — det saknar kvantformens frekvensform och följer inte med när systemets resonans eller dämpning ändras, medan nollpunktsgolvet gör det. Protokollkrav: golvattributionstest där en systemparameter (resonansfrekvens eller dämpning) avsiktligt varieras och golvet ska följa χ″-prediktionen, inte ligga still. För QFD-asym gäller därtill att klassiskt brus i mätkedjan kan skapa falsk sidbandsasymmetri genom korrelationseffekter i detektionen (squashing-klassens artefakter); motmedlet är kalibrerade klassiska injektionstoner med känd symmetri som ska återges symmetriskt (RF_squash om inte). Kalibreringsbördan är sammantaget av G-klass, och G:s maskineri återanvänds: interfolierad referens (drivning på/av; kall/varm last där tillämpligt), linearitetstest, förregistrerad avdragspolicy identisk för signal och referens.


## 6. Mätarkitektur


Minimikrav: (i) samtidig eller interfolierad mätning av S(ω) och χ(ω) genom samma kedja; (ii) kalibrerad svag drivning med dokumenterad amplitud och verifierad linjär respons (svep över minst en dekad drivamplitud; svaret ska skala linjärt — avvikelse är röd flagga RF_nonlinear); (iii) oberoende termometri av badtemperaturen för T-svepet; (iv) systemparametervariation för golvattributionstestet (§5); (v) konventionslåst spektralkedja (§2.4). Naturliga plattformar i den interventionella familjens infrastruktur: opto-/elektromekanisk oscillator (delar homodyn/heterodyn-kedja med G), spinn-system, kretsresonator. Ingen astronomisk form definieras i v0.0 — kandidaten är laboratorieboren, och en eventuell fältform är en senare fråga som i så fall får egen gate.


## 7. Nollmaskin och inferens


### 7.1 Nullfamiljen (QFD-anpassad hierarki)


**N0** — teknisk modell: förstärkargolv + detektorbrus + mätkedjeasymmetri, parametrar ur kalibrering. **N1** — klassisk jämvikt: exakt klassisk FDT vid uppmätt T. **N2** — klassisk icke-jämvikt: T_eff(ω) som slät fri funktion (förregistrerad parametrisering med begränsat antal knutpunkter — helt fri funktion kan passa allt och är ingen hypotes). **N3** — kombinerad motståndare: N2 + N0 + squashing-mekanismer, aktivt trimmad att imitera kvantformen. Surrogat: drivning-av-segment som mätbar brusreferens (G-principen: mätbar null primär), fasrandomisering och blockpermutation som sekundära; p⁽²⁾-regeln gäller varje vittneskomponent.


### 7.2 Inferens


Tvådelad enligt C-mönstret. **Del 1 — parameterfri formjämförelse:** kvantformen (inga fria skalparametrar; endast nuisance ur kalibrering) mot bästa medlem i N0–N2 över hela (ω, T)-svepet, avgjord med förregistrerat informationskriterium; **oavgjort tillfaller nollan.** **Del 2 — motståndarkontroll:** N3 ska inte kunna reproducera kombinationen golvnivå + coth-form + T-svep + golvattributionstest i identisk pipeline. Klassningen kräver båda.


## 8. Inträdesprovet (bindande antagningsvillkor)


### K1 — Unikhetsmatrisen


Fyra injektioner körs genom tre pipelines (QFD, F-passiv/aktiv, M) med krävd utfallsmatris:


| Injektion | QFD | F | M |
|---|---|---|---|
| Grundtillståndsoscillator (Markoviansk, ekofri) | **utslag** | none | none |
| Klassiskt minnessystem (multi-OU/flicker) | none | **utslag** | enligt M-protokoll |
| Klassisk icke-jämvikt (T_eff ≠ T) | **QFD-noneq**, aldrig quantum | — | — |
| Tekniskt golv utan χ″-koppling | **none/RF_floor** | none | none |


Matrisen visar att QFD bär egen information (rad 1), inte dubblerar F/M (rad 2), och hanterar sina bedragare (rad 3–4).


### K2 — Kanariefåglarna


Två obligatoriska: (i) injicerat tekniskt golv — får aldrig klassas över QFD-none, ska utlösa RF_floor via golvattributionstestet; (ii) injicerad klassisk asymmetri-artefakt (squashing-mekanism) — får aldrig ge QFD-quantum-suspect, ska utlösa RF_squash. Falsklarm på någon kanariefågel underkänner provet i sin helhet.


### K3 — Protokollkravet


Detta dokument, kompletterat efter K1–K2-utfall med kalibrerade trösklar, utgör K3. Godkänt prov kräver därtill beräknad gate G_QFD (§9) för minst en konkret laboratoriekonfiguration.


## 9. Admissibility-gate G_QFD


G_QFD = (förutsagd golv-mot-teknisk-marginal) / (minsta upplösbara S/χ″-avvikelse givet kalibreringsprecision), harmoniserad med G-gatens konstruktion (G v0.2 §5.2) och banden < 1 / 1–3 / > 3 / > 10. För laboratoriesystem nära grundtillståndet är G_QFD ≫ 1 förväntad — kandidaten är target-rich — men gaten beräknas ändå per konfiguration: den kvantifierar var kalibreringsbudgeten sätter gränsen, och det är den siffra antagningsnämnden ska se.


## 10. Provisorisk klassning


**QFD-cal-fail.** Kalibreringsbatteri underkänt (linearitet, konventionsvalidering, golvattribution ej genomförbar): mätningen ogiltig — giltighetsklass enligt G-cal-fail-mönstret.


**QFD-none.** Giltig mätning; ingen signifikant avvikelse från bästa N0–N1-medlem.


**QFD-thermal.** Klassisk jämvikts-FDT bekräftad med precision: hedervärt utfall med eget värde — kvoten är då ett termometri- och kalibreringsresultat.


**QFD-noneq.** FDT-brott föreligger men klassisk icke-jämviktsmodell (N2) föredras eller är likvärdig: egen adress för det icke-exotiska fyndet (H-env-mönstret) — vetenskapligt verkligt, publicerbart, inte kvantevidens.


**QFD-quantum-suspect.** Kvantformen föredragen (del 1) med p⁽²⁾-disciplin; replikering i ≥2 runs; golvattributionstest passerat; men ofullständigt T-svep, ofullständig N3-stress eller ej genomförd formkonsistens (§3.3).


**QFD-quantum-strong.** Kvantformen föredragen över fullt (ω, T)-svep utan fria skalparametrar; N3 fail-to-imitate; golvattribution, formkonsistens, kanariefåglar och kalibreringsbatteri passerade; replikerat över ≥2 oberoende sessioner.


**Röda flaggor:** RF_nonlinear (drivsvar ej linjärt); RF_floor (golv utan χ″-koppling); RF_squash (klassisk injektionston återges asymmetriskt); RF_form_inconsistency (QFD-ratio och QFD-asym oförenliga); RF_convention (spektralkonvention ej låst eller inkonsistent tillämpad — diskvalificerande); golv som inte följer systemparametervariation.


## 11. Relation till katalogen


### 11.1 Familjetillhörighet


Interventionella familjen: C/G-labbet, F-aktiv, M — och QFD delar bokstavligen mätkedja med G (homodyn/heterodyn, interfolierad referens, linearitetstest, kalibreringsbudget). Vid antagning blir C/G-labbets infrastruktur QFD:s hem utan nyinvestering i grundkedjan.


### 11.2 Unikhetsrummet


QFD mäter jämviktens kvantfluktuationer; F mäter dynamikens minne; M mäter det förflutnas återvinningsbarhet; G mäter brus under vakuumnivån i fältkvadraturer. Gränsen mot G förtjänar precisering: G:s vittne är sub-vakuumvarians (kräver squeezade tillstånd), QFD:s vittne är nollpunktsgolvets närvaro och form i termisk jämvikt (kräver inga speciella tillstånd — bara ett kallt system och ärlig kalibrering). De är komplementära: G detekterar konstruerad icke-klassicitet, QFD detekterar jämviktens inbyggda.


### 11.3 Öppen taxonomifråga (avgörs av provet)


Klass I-status kräver en olikhet ingen klassisk modell kringgår. QFD:s komplikation: klassisk *icke-jämvikt* kan imitera godtyckliga fluktuation/respons-kvoter punktvis — det är den parameterfria *formen över svepet* som klassisk fysik inte reproducerar utan ad hoc-anpassning per temperatur. Om K1/N3-körningarna visar att ingen begränsad klassisk T_eff-familj klarar hela svepet, kvalificerar QFD som formbaserat Klass I-vittne; om diskrimineringen i praktiken vilar på parsimoni-argument snarare än omöjlighet, placeras QFD i Klass II med krav på stödvittne. Frågan lämnas öppen med avsikt — att avgöra den är en av inträdesprovets leveranser.


## 12. Beslutsgång


(1) Detta dokument (K3-utkast) granskas — föreliggande steg. (2) Efter plattformens Sprint-milstolpar implementeras K1-matrisens injektioner och K2-kanariefåglarna. (3) Antagningsnämnden (plattformskörning + granskning i denna kanal) bedömer utfallsmatrisen mot §8:s krav. (4) Vid godkänt: bokstaven QFD öppnas, kandidatprotokollet uppgraderas till Signaturtyp QFD rapport v0.1 med kalibrerade trösklar, och taxonomifrågan (§11.3) besvaras i rapporten. (5) Vid underkänt: kandidaten arkiveras med dokumenterade skäl och får återkomma vid ny evidens — arkivering är ett resultat, inte ett misslyckande. Ingen del av katalogen refererar QFD som medlem före steg 4.


## 13. Slutsats


Signaturkandidat QFD bär ett löfte ingen befintlig katalogmedlem ger: att mäta kvantmekanikens närvaro i ren jämvikt — inget minne, inget eko, ingen entanglement, bara det golv naturen vägrar tömma. Dess fysik är lärobokssäker, dess mätlinje beprövad och dess hemvist redan byggd i den interventionella familjen. Men kandidaten bär också två väldokumenterade bedragare, och katalogens hårdaste lärdom gäller den med full kraft: ett vittne är inte vad det liknar utan vad det överlever. Därför öppnas ingen bokstav på löftet — den öppnas, om alls, på en utfallsmatris där QFD sett sina imitatörer i ögonen och pipelinen valt rätt varje gång. Det är så en katalog som granskat sig själv nio gånger tar emot sin tionde medlem: född granskad, eller inte alls.