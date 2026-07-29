# Signaturtyp B — Polarisation–tids-korrelation

## Fullständig rapport och protokollspecifikation, version 0.2

*Status: granskad och uppdaterad. v0.2 inarbetar det externa granskningsutlåtandet över v0.1 samt chattgranskningens bedömning av detsamma. Statusetikett (antagen från utlåtandet): **infrastructure-ready, B-2 blocked** — godkänd som infrastrukturprotokoll och strukturdetektor; kvantvittnesnivån blockerad tills dödtidsfri nämnare och detektornivå-S4 föreligger i kod.*

**Ändringslogg v0.1 → v0.2:** (Ä1) Teoremet i §4.4 utökat med en fjärde väg till falskt R > 1 — felaktig polarimetrisk inversion i analysledet — och slutsatsformuleringen ersatt; v0.1 §7.2:s instruktion "Mueller-korrigering före korrelationsberäkning" identifierad som sårbar och ersatt med principen *korrigera modellen, inte datan* (§7.2). (Ä2) S2-fixen formaliserad med villkoret |Δ_c − Δ_d| ≫ τ_max (§8.1). (Ä3) S4 utökad med analyslager utöver detektorlagret (§8). (Ä4) Klassningen femgradig; ordet "quantum" endast i klasser som kräver R-utfall (§10). (Ä5) Kandidatbudget och admissibility-gate G_B införda (§12). (Ä6) Spårklyvning B-Lab/B-Astro, harmoniserad med A v0.2 (§11). (Ä7) p⁽²⁾-regeln back-porterad enligt syntesrapporten §7 (§9). Sex av det externa utlåtandets åtgärdspunkter fanns redan i v0.1 (§4.3, §7.3, §13) och bokförs som bekräftelse, inte ändring.

---

## 1. Sammanfattning

Signaturtyp B definieras som reproducerbara tidskorrelationer i fotonflödet som beror av polarisationstillstånd, operationaliserat genom två mätobjekt: den polarisationsupplösta korrelationsmatrisen g²_ab(τ) över baserna HV, DA och RL, samt Stokes-fluktuationsmatrisen C_ij(τ). B skiljer sig fundamentalt från A på en punkt: B:s råobjekt har ingen klassisk gräns. Klassiskt ljus får uppvisa godtyckligt rik polarisation–tid-struktur, och struktur i B är därför i sig ett källfysikaliskt fynd, inte kvantevidens. Kvantinnehåll kräver ett explicit vittne: Cauchy–Schwarz-kvoten R_CS, där R_CS ≤ 1 för varje klassisk fältmodell och ett signifikant R_CS > 1 är klassiskt omöjligt.

Rapportens centrala slutsatser. För det första ärver R-vittnet dödtidsartefakten från A i värsta möjliga position — autokorrelationerna vid τ = 0 sitter i nämnaren — och ingen B-2-siffra får tolkas förrän nämnaren mäts dödtidsfritt (detektorsplitting) eller modellskattas med propagerad osäkerhet. För det andra kan fysisk optisk blandning aldrig bryta Cauchy–Schwarz i den sanna statistiken, men falska R > 1-utfall kan uppstå på fyra vägar: detektornivå-artefakter, estimatorbias, icke-stationär normalisering och — nytt i v0.2 — felaktig polarimetrisk inversion i analysledet; motståndaren S4 måste därför omfatta både detektor- och analyslager. För det tredje är B katalogens datainfrastruktur: D, E och F bygger på B-kedjans rådata, och ett systematiskt B-fel producerar korrelerade falsklarm i tre signaturer samtidigt (arvsregeln, §13). För det fjärde klyvs B i B-Lab — där Cauchy–Schwarz-brott är experimentellt demonstrerade och protokollet kan valideras mot kända sanna positiva — och B-Astro, som är target-unresolved tills kandidatbudgeten G_B levererar.

## 2. Definition och mätobjekt

### 2.1 Tre nivåer

**B-0 — polarisationsupplöst g².** För polarisationsutgångar a, b inom en analysbas mäts G²_ab(τ) = ⟨I_a(t)·I_b(t+τ)⟩ och normaliseras till g²_ab(τ). Detta är vektoriell HBT: samma metodkedja som A, med polarisationsprojektion före detektorn. Signaturen på denna nivå är ett icke-trivialt mönster i hela matrisen över flera baser och fördröjningar — inte bara en topp vid τ = 0.

**B-1 — Stokes-korrelationsmatrisen.** Ur binnade räknetal per kanal byggs diskreta Stokes-serier S₁ = n_H − n_V, S₂ = n_D − n_A, S₃ = n_R − n_L (och S₀ = totalintensitet), varefter fluktuationskorrelationerna C_ij(τ) = ⟨ΔS_i(t)·ΔS_j(t+τ)⟩ beräknas för i, j ∈ {1,2,3}. Detta fångar polarisationstillståndets dynamik på Poincaré-sfären, inklusive korskopplingar mellan axlarna.

**B-2 — kvantvittnesnivån.** Cauchy–Schwarz-vittnet R_CS (avsnitt 4). CHSH via koincidenser med valbara analysvinklar behandlas som tier-3 och hör hemma i Signatur C:s protokoll.

### 2.2 Baskravet

Tre ömsesidigt obiaserade baser (HV, DA, RL) krävs för tomografisk komplett beskrivning; med en enda bas är två tredjedelar av Poincaré-sfären osynlig. Basmätningen sker antingen parallellt (SIM: fler detektorer, delad fotonbudget) eller sekventiellt (MOD: modulerad analysbas, kräver stationaritet över modulationscykeln). Valt läge loggas obligatoriskt per run; de två lägena har olika artefaktprofiler och får inte blandas i samma nullfördelning. **v0.2-notering (Ä3):** MOD-mätning under icke-stationär källa är en identifierad väg till skenbara korskopplingar och ingår i S4:s analyslager.

## 3. Den klassiska tvetydigheten — varför rå B-struktur inte är kvantevidens

A:s klassiska gräns (g²(0) ≥ 1) följer av en olikhet. B:s råobjekt saknar motsvarighet: en klassisk källa med roterande polarisation ger dramatisk C_ij-dynamik; tidsberoende Faraday-rotation ger tydliga polarisation–tid-mönster; delvis polariserat termiskt ljus ger via Siegert-relationen g²_ab(τ) = 1 + |γ_ab(τ)|² korsbunching mellan kanaler helt utan kvantinnehåll. Den tidiga simuleringens "svaga men märkbara topp vid noll fördröjning" i H/V-korskorrelationen är exakt vad klassiskt, delvis polariserat termiskt ljus producerar, och utgör därför ingen kvantevidens — den bekräftar endast att pipelinen kan se korrelationer.

Konsekvensen är strukturell: B behöver en klassning där "intressant struktur" och "kvantindikation" hålls språkligt och logiskt isär (avsnitt 10), och varje B-resultat utan passerat kvantvittne klassas som klassiskt eller strukturellt oavsett hur reproducerbart mönstret är.

## 4. Kvantvittnet R_CS

### 4.1 Definition och klassisk gräns

För två kanaler (t.ex. de två polarisationsutgångarna i en bas) definieras

R_CS(τ) = [g²₁₂(τ)]² / (g²₁₁(0) · g²₂₂(0)).

För varje klassisk stokastisk intensitetsmodell gäller Cauchy–Schwarz-olikheten [g²₁₂(τ)]² ≤ g²₁₁(0)·g²₂₂(0), alltså R_CS ≤ 1: korskanalen kan aldrig vara starkare korrelerad än det geometriska medelvärdet av autokanalerna. R_CS > 1 är klassiskt omöjligt och är ett etablerat icke-klassicitetskriterium, experimentellt demonstrerat för fotonparkällor och fyrvågsblandning. Vittnet kräver inga valbara mätinställningar och fungerar därmed på passivt ljus — B-2 är en "passiv halv-Bell": svagare evidens än CHSH (inga loopholes stängs), men mätbar på ljus man inte kontrollerar.

### 4.2 Dödtid i nämnaren (blockerande)

R-vittnets nämnare består av autokorrelationer utvärderade vid τ = 0 — exakt den punkt där detektordödtid undertrycker koincidenser (A §4). Underskattad nämnare ger uppblåst R̂ och därmed falsk kvantevidens. I analysmallen v0.1.1 är felet aktivt: kanaler aggregeras per (basis, pol) och auto-g² beräknas direkt ur den aggregerade strömmen.

Två godkända åtgärder. (i) **Detektorsplitting per kanal:** varje polarisationsutgång delas på två detektorer och g²_aa(0) skattas som korskorrelation mellan dem (HBT-inom-kanal) — dödtidsfri per konstruktion, till priset av dubblerat detektorantal. (ii) **Modellextraktion:** g²_aa(0) skattas med A-protokollets matchade filter/profil-likelihood från fördröjningar utanför artefaktzonen, med osäkerheten propagerad in i R:s nullfördelning. Uttryckligen förbjudet: att golva nämnartermerna vid 1 — termiskt ljus har g²_aa(0) = 2, och med golv vid 1 blir klassisk korsbunching (g²₁₂ upp till 2) ett falskt R = 4. **Bindande regel: ingen B-2-siffra tolkas förrän nämnaren är dödtidsfri eller modellskattad med propagerad osäkerhet.**

### 4.3 Estimatorbias och look-elsewhere

R̂ bildas som kvot av brusiga skattningar, vilket ger positiv bias (Jensen); accidental-normalisering med en enda time-slide-realisering adderar brus — flera oberoende slides medelvärdesbildas, och minsta räknetal per bin krävs. Maxtagning över τ-fönster skapar look-elsewhere; nullfördelningen genereras med identisk estimatorkedja inklusive maxtagning, räknetalskrav och antal slides. Förregistrering av max-statistiken är bindande.

### 4.4 Teoremet, med fyra vägar (Ä1: utökat)

Cauchy–Schwarz-olikheten gäller för varje klassisk intensitetsmodell — inklusive varje *fysiskt* optiskt blandad sådan. En fysisk Mueller-matris, hur felkalibrerad optiken än är, transformerar ett klassiskt fält till ett annat klassiskt fält; optisk crosstalk, dubbelbrytning, basrotation och instrumentpolarisation kan därför aldrig i den sanna intensitetsstatistiken producera R > 1.

**Korrigerad slutsatsformulering (bindande, ersätter v0.1):** *Ingen fysisk klassisk optisk blandning kan i den sanna intensitetsstatistiken bryta Cauchy–Schwarz. Falska R_CS > 1-utfall kan däremot uppstå genom detektornivåartefakter, estimatorbias, icke-stationär normalisering eller felaktig polarimetrisk inversion.* De fyra vägarna:

1. **Detektornivå-artefakter** — korrelerade detektionshändelser som inte är fältintensiteter: crosstalk-blixtar (breakdown flash), elektrisk afterpulse-koppling mellan kanaler, dödtidseffekten i nämnaren (§4.2), samt mättnad/pile-up i gemensam tidsstämplingselektronik (A v0.2 §5).
2. **Estimatorbias** (§4.3).
3. **Icke-stationaritet** som bryter normaliseringens antaganden — drift som flyttar effekt mellan kanaler inom analysfönstret, inklusive MOD-mätning under icke-stationär källa.
4. **Felaktig polarimetrisk inversion i analysledet (ny i v0.2).** En Mueller-*inversion* applicerad på data är inte en fysisk Mueller-avbildning utan linjär algebra på skattningar: den kan vara icke-fysikalisk, förstärka brus nära singulära kalibreringsmatriser och skapa skenbara korskorrelationsöverskott. Väg 4 identifierades av det externa utlåtandet och träffar en befintlig v0.1-instruktion (§7.2), som härmed ersätts.

Motståndarkravet följer: S4 måste omfatta detektorlagret (väg 1) *och* analyslagret (väg 3–4) — se §8.

## 5. Mätarkitektur och kalibrering

Baskrav: polarisationsanalys per kanal (PBS + HWP/QWP eller ekvivalent), minst två samtidiga fotonräknarkanaler, time-tagging med TDC, samt Mueller/Jones-kalibrering av instrumentpolarisation med loggad kalibreringsversion. För B-2-nivån tillkommer detektorsplitting per kanal (§4.2) eller dokumenterad modellextraktion av nämnartermerna. För C_ij krävs alla tre baser i SIM- eller MOD-läge med loggat lägesval.

Polarisationsspecifika kalibreringsmoment utöver A:s kedja: utsläckningsförhållande per PBS-utgång, detektoreffektivitets-obalans mellan kanaler, fältrotation/parallaktisk vinkel som funktion av tid, fiberväg (multimode-fiber polarisationsscramblar och är i praktiken diskvalificerande för B), samt (nytt i v0.2, harmoniserat med A v0.2 §4.2) tidsstämplingselektronikens beteende vid samtidiga event och hög last, och kalibreringsmatrisens villkorstal med osäkerheter (§7.2).

Kontrollmätningar (minimum): rotation av HWP/QWP ska transformera mönstret förutsägbart; byte av fiber/optisk väg — signaturen får inte följa hårdvaran; blankpekning och intern LED; opolariserad standardkälla samt kända polarisationsstandarder för Mueller-modellering.

## 6. Dataformat

Eventtabellen är katalogens gemensamma språk och delas med D, E och F. Obligatoriska kolumner: session_id, run_id, setting_id (modulationsfas eller "SIM"), det_id, basis (HV/DA/RL), pol (+/−), t_ps (monoton int64), quality_flags. Metadata per run: mål, våglängdsband och filterbandbredd, våtplattevinklar/modulationsschema, TDC-upplösning, dödtids- och afterpulsing-modell, Mueller/Jones-kalibreringsversion inklusive villkorstal och osäkerheter. Parquet/Arrow rekommenderas för volym. det_id är obligatorisk — utan den kan RF-DET (§10) inte utvärderas och detektorsplitting inte representeras.

## 7. Metrics och scores

### 7.1 g²-matrisen

Koincidenshistogram H_ab(k) per kanalpar och τ-bin, normaliserat mot rates eller mot accidentals via time-slide av ena kanalen (flera slides medelvärdesbildade, minsta räknetal per bin). Output: matrisfunktionen τ ↦ [g²_ab(τ)]. Korrelationerna beräknas alltid på **råa kanaler** — se §7.2.

### 7.2 Stokes-blocket och kalibreringens plats (Ä1: ersätter v0.1)

v0.1 föreskrev Mueller-korrigering av data *före* korrelationsberäkning. Instruktionen ersätts av principen **korrigera modellen, inte datan**:

- **B-0 och B-2:** korrelationer beräknas på råa, okorrigerade kanaler; instrumentets polarisationsblandning ingår som framåtmodell i H₀ (kalibrerad Mueller-modell som nuisance-struktur), aldrig som inverstransformation av data. Därmed kan väg 4 (§4.4) inte uppstå i vittneskedjan.
- **B-1 (Stokes-rekonstruktion):** där inversion är oundviklig gäller tre krav: (i) villkorstalskontroll av kalibreringsmatrisen med förregistrerad tolerans — nära-singulära matriser diskvalificerar runen för B-1; (ii) osäkerhetspropagering från kalibrering genom inversionen till C_ij; (iii) **identisk inversion appliceras på samtliga surrogat och på S4**, så att observation och null bär samma eventuella inversionsartefakter. En pipeline som inverterar data men inte null jämför äpplen med okorrigerade päron.

### 7.3 Skalära scores

D_g separeras i auto-del och kors-del (D_g^auto, D_g^cross): termisk autobunching är förväntad för varje het källa och skulle annars dominera en gemensam score och göra B-core-pass trivialt. Kors-delen bär B-innehållet; auto-delen är diagnostik (A:s domän). D_C aggregerar motsvarande för C_ij.

## 8. Surrogatmaskinen S1–S4 (Ä2, Ä3)

**S1 — polarisationsetikett-shuffle** (inom run, per basis och detektor, valfritt i tidsblock): tidsstämplar orörda — rates, dödtidsmönster och intensitetsdynamik bevaras exakt, pol↔tid-kopplingen förstörs. B:s primära null.

**S2 — time-slide/accidentals (Ä2: formaliserad).** Varje kanal c = (basis, pol, det) får egen slumpad offset Δ_c med wrap inom run, under villkoret **|Δ_c − Δ_d| ≫ τ_max för alla kanalpar som ska dekorrigeras**; alternativt parvis skiftning av enbart b-sidan. Gemensam skiftning av alla kanaler är förbjuden (v0.1-buggen: bevarar alla parvisa tidsskillnader och gör surrogatet identiskt med data).

**S3 — blockbootstrap i tid:** permuterad blockordning per kanal; bevarar korttidsstruktur, bryter långminne.

**S4 — motståndare i två lager (Ä3).** *Detektorlagret:* klassisk Stokes-vektor (OU/AR med drift och Faraday-proxy), kanalräkning som inhomogen Poisson, plus Mueller-mixing, dödtid per detektor, afterpulsing, detektor-crosstalk, timing-jitter, mättnad/pile-up och dark counts, med parametrar ur kalibreringens osäkerheter. *Analyslagret (nytt):* felkalibrerad Mueller-inversion inom osäkerheterna, nära-singulära kalibreringsmatriser, kanalobalans, felaktig normalisering under rate-drift, tidsberoende polarisationsrotation, samt MOD-sekvensering under icke-stationär källa. Båda lagren trimmas aktivt för att maximera falska scores och falskt R. Utan analyslagret testas väg 4 aldrig; utan detektorlagret testas väg 1 aldrig — och quantum-strong-tröskeln är då inte försvarbar.

### 8.1–8.2 Kodfynd (kvarstående från v0.1)

S2-generatorbuggen (gemensam skiftning) åtgärdas enligt Ä2. RF2-symmetriflaggan är nära vakuös (samma koincidenser per konstruktion) och ersätts med extern timing-referens (gemensam pulsad kalibreringskälla). S4:s driftterm (ackumulerande slumpvandring) dokumenteras; basmappningens trippelräkning av fotonbudget justeras med 1/3-faktor vid SIM-jämförelser. Koincidensmotorn kräver two-pointer/streaming för verkliga flöden. Kodens klassningslogik synkroniseras med specens hårdare regel: röd flagga nedklassar ovillkorligt.

## 9. Beslutslogik och trösklar (Ä7: p⁽²⁾)

Per run beräknas D_g^cross, D_g^auto, D_C och R_CS-max; nullfördelningar med minst 300 (helst 1000) surrogat per typ och identisk estimatorkedja. Trösklar: Q99 av mix-nullen för core/Stokes-pass; Q99.9 av tvålagers-S4-nullen för kvantvittnet. **p⁽²⁾-regeln (back-porterad från H §4.1):** varje pass kräver att andra minsta p över surrogatfamiljerna understiger tröskeln — ingen enskild null får ensam bära ett fynd. Replikeringskrav: minst två oberoende runs, helst två sessioner. Robusthet: binning ±2×, jackknife 10–20 %, fönstervariationer.

## 10. Klassning (Ä4: femgradig; "quantum" endast med R-utfall)

**B-none.** Varken D_g^cross eller D_C överstiger mix-nullens tröskel med replikering.

**B-classical.** Core- och/eller Stokes-pass, men mönstret reproduceras av S4 eller förklaras av instrument/atmosfär/propagation inom osäkerheterna. Tolkning: käll- eller propagationsfysikaliskt intressant (magnetfält, Faraday-dynamik, emissionens mikrofysik) — publicerbar astrofysik, inte kvantevidens.

**B-struct-unresolved.** Pass som överlever hela S1–S4 (båda lagren) med p⁽²⁾-disciplin, robust mot binning och jackknife, inga röda flaggor — men inget R-utfall. Kandidat för uppföljning. *Ersätter v0.1:s "B-quantum-suspect": klassen bar ordet quantum utan kvantvittne, vilket inbjöd till övertolkning.*

**B-quantum-suspect.** Som ovan plus preliminärt R_CS > 1 med signifikans mot tvålagers-S4-null och dödtidssäker nämnare — men utan full replikering över sessioner eller utan andra instrumentkonfigurationen.

**B-quantum-strong.** R_CS > 1 med empiriskt p < 10⁻³ (p⁽²⁾-disciplin) mot tvålagers-S4-null, replikerat över minst två sessioner och två instrumentkonfigurationer eller kanaluppdelningar, dokumenterad dödtidsfri eller modellskattad nämnare (§4.2), rå-kanalkedja enligt §7.2, dokumenterad polarimetrisk kalibrering med villkorstal, passerade kontrollmätningar samt injicerad positiv och negativ kontroll (harmoniserat med A v0.2 §4.2).

**Röda flaggor (ovillkorlig nedklassning):** signaturen följer det_id snarare än polarisation; försvinner eller byter tecken vid minimal ändring av Δτ/koincidensfönster; samma mönster vid blankpekning eller intern LED; parallaktisk vinkel/instrumentrotation förklarar mönstret; nämnartermer utan dödtidssäker hantering; inversion applicerad på data men inte på null; kalibreringsmatris utanför villkorstalstolerans.

## 11. Spårklyvning: B-Lab och B-Astro (Ä6)

**B-Lab.** Cauchy–Schwarz-brott är experimentellt demonstrerade i kontrollerade kvantoptiska system (parkällor, fyrvågsblandning) — B-2 har alltså kända fysiska sanna positiva, producerbara i C/G-labbet med samma källklass som C:s par och G:s tvillingstrålar (tvåmods-squeezing bryter CS; G-rapporten §3.2). B-Lab validerar hela kedjan: dödtidssäker nämnare, tvålagers-S4, ROC med verkligt icke-klassiskt ljus, kontrollerad degradering (depolarisationssvep för kontrastbudgetens kalibrering). B-Lab är genomförbar i dag och är B-2:s hem tills vidare.

**B-Astro.** Target-unresolved: vilande som B-2-kampanjspår tills kandidatbudgeten (§12) levererar G_B > 1. B-0/B-1 som polarimetrisk struktursond är däremot legitim astrofysik redan nu — B-Astro:s strukturspår och kvantspår har olika mognad, och klyvningen hindrar att det förra lånar det senares anspråk.

## 12. Astronomisk realism, kandidatbudget och G_B (Ä5)

B ärver A:s kontrastproblem i polarisationsform: modutspädning, depolarisation genom turbulent/magnetiserat medium, bakgrundsljus, instrumentmixing och begränsad fotontakt trycker alla B-avvikelser mot noll. För B-2 krävs en kandidatbudget analog med A v0.2 §11: för varje kandidatkälla dokumenteras förväntat R_CS,pred efter utspädning och depolarisation, och admissibility-gaten

G_B = ΔR_pred / ΔR_min,  där ΔR = R_CS − 1 och ΔR_min sätts av pipelinens känslighet (σ_R ur S4-null),

med förregistrerade band harmoniserade med G_A: G_B < 1 ej målbar; 1–3 svag; > 3 möjlig; > 10 prioriterad. Ingen B-2-kampanj planeras utan beräknad G_B. Sökstrategin för strukturspåret kvarstår: smalbandsfilter på emissionslinjer, full trebasmätning, blankpekningar insprängda i schemat, scintillation som gemensam-mod-term i nullmodellen.

## 13. Infrastrukturrollen och arvsregeln

B är katalogens datastomme: E:s feature-vektor är konkatenationen av B:s g²-block och Stokes-block; F söker minneseffekter i B:s korrelationskurvor; D:s invarianter byggs ur samma binnade serier. Ett systematiskt fel i B-kedjan producerar korrelerade falsklarm i D, E och F samtidigt. Bindande regel: D-, E- och F-utfall räknas aldrig som oberoende bekräftelse av varandra eller av B när de delar B-kedjans rådata; oberoende kräver disjunkta detektoruppsättningar och separata kalibreringskedjor. Regeln gäller retroaktivt för alla korsreferenser av typen "E-strong kräver A/B/C-vittne".

## 14. Öppna frågor och åtgärdslista (omprioriterad i v0.2)

Blockerande kodfixar i låst ordning: (1) dödtidsfri R-nämnare (detektorsplitting eller modellextraktion med osäkerhetspropagering); (2) S2-rättning enligt Ä2; (3) tvålagers-S4 (detektor- + analyslager, §8); (4) accidentals över flera slides + minsta räknetal per bin; (5) D_g-delningen i kod. Metodfixar: (6) rå-kanalprincipen och B-1-inversionens tre krav i pipeline (§7.2); (7) RF2 → extern timing-referens; (8) förregistrerad max-statistik verifierad i null-kedjan; (9) rödflaggslogik synkad (ovillkorlig nedklassning); (10) MOD-lägesvarianten av Stokes-byggaren. Program: (11) B-Lab-valideringsplan i C/G-labbet med fysiska CS-positiva och depolarisationssvep; (12) kandidatmatris för B-2 med G_B-beräkning för minst två källklasser (parproduktionsliknande emission, korrelerade spridningsprocesser, maser-miljöer); (13) injection tests med syntetiskt R > 1 och ROC.

Ingen simuleringsomgång före punkt 1–3 är meningsfull — utlåtandets formulering antas ordagrant.

Öppen forskningsfråga (oförändrad i sak, nu med verktyg): vilka astrofysikaliska processer kan producera R_CS > 1 vid källan, och vilken depolarisation/utspädning överlever korrelationerna till observatören? Kandidatmatrisen och G_B gör frågan kvantitativ.

## 15. Slutsats

Signaturtyp B förblir katalogens rikaste råobjekt och dess datastomme, och v0.2 har stängt den lucka v0.1 själv öppnade: teoremet om optikens oskuld står, men dess slutsats var för brett formulerad — analysledets inversion kan fejka det optiken inte kan, och v0.1 bar instruktionen som gjorde det möjligt. Med rå-kanalprincipen, tvålagers-motståndaren, den formaliserade S2-fixen, den femgradiga klassningen där ordet quantum måste förtjänas, och B-Lab där vittnet kan möta äkta CS-brytande ljus, är B nu vad statusetiketten säger: infrastruktur redo att bära katalogen, med ett kvantvittne i karantän tills koden förtjänar att släppa ut det.
