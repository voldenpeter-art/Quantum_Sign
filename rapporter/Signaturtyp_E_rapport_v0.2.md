# Signaturtyp E — "Kod-lik" lågdimensionell struktur i korrelationsrummet

## Fullständig rapport och protokollspecifikation, version 0.2

*Status: granskad och uppdaterad. v0.2 inarbetar det externa granskningsutlåtandet över v0.1 samt chattgranskningens bedömning av detsamma. Statusetikett (antagen från utlåtandet): **structure-ready after S5-E + stress-module fixes; quantum-neutral unless independently witnessed.***

**Ändringslogg v0.1 → v0.2:** (Ä1) Klassningen utökad till femgradig stege — E-none/E-struct/E-suspect/E-code-suspect/E-strong — där den nya klassen E-code-suspect upphöjer transitionsmetriken från framtida idé till krav, med konkret definition (entropitakt mot S5-E-null) och dubbel biasvakt (§4.3, §9). (Ä2) S4-brusmatchningen explicitgjord som bindande checklista (§4.1). (Ä3) Basinvariansmodulen försedd med tolkningstabell och egen blank/kalibreringsjämförelse (§7.1). (Ä4) v0.1:s tvåtypskrav formaliserat under katalognamnet p⁽²⁾ (§5, §9). (Ä5) Statusetikett. Bokföring: utlåtandets §2–8 och §10–11 (protokolldisciplinen, kvantneutraliteten, arvsregelns cirkularitetsexempel, S5-E, Kolmogorov-korrektionens fem krav, anti-turbulensomklassningen, d_eff-reglerna, kodstatus och domen över 6,17/5,42) bekräftar v0.1 och bokförs som oberoende validering, inte ändring.

---

## 1. Sammanfattning

Signaturtyp E föreligger när en högdimensionell korrelationsrepresentation av data — feature-vektorn y byggd av B-kedjans polarisationsupplösta g²-block och Stokes-korrelationsblock, ett fönster per datapunkt — inte fyller ut sitt förväntade rum utan ligger nära en lågdimensionell latent struktur som dessutom uppvisar kod-likhet, på ett sätt som inte replikeras av surrogaten S1–S5 och som generaliserar till blint hold-out. E är katalogens mest metoddisciplinerade och epistemiskt sköraste signatur: stark som strukturdetektor, kvantneutral som indikator.

Rapportens centrala slutsatser. För det första kan E visa att korrelationsdata är strukturerade, komprimerbara och återkommande — den kan aldrig ensam visa att strukturen är kvantmekanisk; E-strong kräver ett icke-klassicitetsvittne (A, B-2 eller C) från disjunkt detektorkedja och separat kalibreringskedja, eftersom E:s features är B:s rådata och delad rådata gör "stödjande vittnen" cirkulära. För det andra är kod-likhetsmåttet otolkbart utan drift-nullen S5-E — låg kodentropi uppstår gratis av långsam klassisk drift — och v0.2 skärper detta ytterligare: äkta kod-likhet kräver därutöver transitionsstruktur bortom AR/OU-nullen, mätt som entropitakt med dubbel biasvakt, vilket bärs av den nya klassen E-code-suspect. För det tredje är stressmodulerna artefaktfilter som endast kan nedklassa: Kolmogorov-modulen efter biaskorrektion och τ₀-förankring, basinvariansmodulen omtolkad till anti-turbulensfilter. För det fjärde förblir det tidiga resultatet d_eff 6,17 mot 5,42 otolkat tills det körts genom full pipeline med S1–S5, blindad split och matchad null.

## 2. Definition och mätobjekt

### 2.1 Operational definition

E-signatur betyder att en högdimensionell korrelationsrepresentation y ∈ ℝ^m ligger nära en lågdimensionell latent struktur (låg effektiv dimension d ≪ m) med god prediktionsförmåga på hold-out, och att den latenta strukturen uppvisar kod-likhet — återkommande diskreta tillståndsord med transitionsstruktur — på ett sätt som inte replikeras av S1–S5. Kort: korrelationsdata är komprimerbar som en latent kod, inte bara som brus plus ett par klassiska parametrar.

### 2.2 Feature-vektorn (låst)

y byggs per tidsfönster ur B-eventtabellen: g²-blocken vec(g²_ab(τ_k)) över baserna HV/DA/RL konkateneras med Stokes-blocket vec(C_ij(τ_m)) över förregistrerat lag-set. Windowing med förregistrerat T_win och T_hop ≥ T_win ger Y ∈ ℝ^{N×m}. Standardisering (μ, σ) skattas enbart på träningssplitten. B v0.2:s rå-kanalprincip gäller för allt som når feature-bygget.

### 2.3 Modellklasser

Linjär version (PCA/SVD-subspace) är v0.1/v0.2:s enda tillåtna modell; icke-linjära modeller tillåts först senare under identisk hold-out-disciplin — kompressionsmodeller hittar alltid låg dimension om disciplinen brister.

## 3. Epistemisk status

### 3.1 E är kvantneutral (bekräftad, central)

Klassiska system är rutinmässigt lågdimensionella: atmosfär, seeing, instrumentdrift, polarisation, spektralband, magnetfält, modblandning och rate-dynamik skapar låg rank och manifold-struktur utan kvantinnehåll. Kod-likhet är lika neutral: naturen skapar återkommande tillstånd utan avsikt, information eller kvantmekanik. Korrekt tolkning: E-suspect och E-code-suspect = strukturerad korrelationsdynamik; E-strong = strukturerad korrelationsdynamik + verkligt oberoende icke-klassicitetsvittne. Litteraturanalogin (compressed sensing-tomografi, MPS, classical shadows) är inspiration, inte validering: den utnyttjar låg rank hos tillstånd experimentatorn preparerar; E inverterar till inferens om okänt ljus.

### 3.2 Arvsregelns skarpaste tillämpning (bekräftad)

E:s feature-vektor är konkatenationen av B-kedjans objekt — E:s data ÄR B:s data. Kausalkedjan crosstalk → falsk B-struktur → lågdimensionell E-struktur → "skenbart stödjande B-vittne" är inte två vittnen utan ett systematiskt fel räknat två gånger. Bindande: E-strong-vittnet kommer från disjunkt detektoruppsättning och separat kalibreringskedja (i praktiken C/G-labbet eller parallell instrumentering); utan sådant är maximal klassning E-code-suspect med anteckningen "stark klassisk strukturkandidat".

### 3.3 Relation till D

D är det statiska fingeravtrycket (basoberoende invariant konstant över sessioner), E den dynamiska repertoaren (tillståndet vandrar på lågdimensionell mångfald med återkommande lägen). Båda kvantneutrala utan externt vittne; båda under arvsregeln.

## 4. Metrikfamiljerna L, G, K

### 4.1 (L) Effektiv dimension — tre låsta regler (Ä2)

d_eff = (Σ s_k²)²/Σ s_k⁴ på standardiserad matris. Regel 1: **aldrig absolut tolkning** — i regimen m ≫ N domineras spektrumet av samplingsbrus (Marchenko–Pastur), och d_eff är endast meningsfull relativt null med identiska N, m, T_win, T_hop, rates och feature-brus. Regel 2: **S4 matchar feature-bruset enligt bindande checklista** (utlåtandets lista antagen): rate per kanal, rate per basis/pol, binvis brusnivå, dark counts, jitter, dödtid, afterpulsing, crosstalk, Mueller-mixing, långsam drift — z-scoring förstärker fotonfattiga features, och en S4 utan matchning ger en null som är för snäll eller för hård. Regel 3: **T_hop ≥ T_win** — överlappande fönster korrelerar Y:s rader och biasar d_eff nedåt (D §3:s N_eff-lärdom i ny kostym); undantag endast med explicit N_eff-modellering.

### 4.2 (G) Hold-out-generalisering

PCA tränas på train, d* väljs på val enligt förregistrerad minsta-d-regel, RE_d* utvärderas på blint test; leave-one-session-out vid få sessioner. E:s starkaste komponent: generalisering över tid skiljer struktur från överanpassning.

### 4.3 (K) Kod-likhet — S5-E plus transitionskrav (Ä1)

Codewords c_n = sign(z_n) i d*-dimensionella latentrummet; marginalmåtten U (codebook-storlek) och H (entropi). Grundproblemet kvarstår som bindande insikt: låg H produceras gratis av långsam drift (z_{n+1} ≈ z_n ger repetition utan kod).

**Steg 1 — S5-E (obligatorisk, oförändrad):** AR(1)/OU-modell fittas till observerade latenter på train med matchade marginaler och autokorrelation; syntetiska banor ger drift-nullens H. Endast H_obs < H_S5-E med stark empirisk signifikans räknas.

**Steg 2 — transitionskravet (upphöjt från idé till krav):** en kod har struktur i övergångarna, inte bara få tillstånd. Teststatistika: entropitakten H(c_{t+1} | c_t), skattad ur övergångsmatrisen och jämförd mot S5-E-null med matchade codeword-marginaler — signifikant lägre betingad entropi än driftnullen betyder att övergångarna bär struktur bortom AR/OU.

**Dubbel biasvakt (bindande):** betingade entropiskattare är än mer sampelstorleksbiasade än marginella (övergångsmatrisen har |C|² celler mot marginalens |C|). Därför gäller Miller–Madow-korrektion (eller motsvarande) för både H och H-takt, matchat antal övergångar mellan observation och null (subsampling till minsta N), samt rapportering av N_transitions och d* så att mekaniska beroenden är synliga. Utan vakten återinför transitionskravet exakt den bias Kolmogorov-modulen korrigerades för.

U:s och H:s mekaniska d*-beroende (övre gräns 2^d*) dokumenteras; d* låses innan K-metriken beräknas.

## 5. Förregistrering, hold-out och p⁽²⁾ (Ä4)

E-låset kvarstår som katalogstandard: (1) grid, fönster, feature-schema med ordning, standardisering, surrogatdefinitioner och split-design låses innan data ses; (2) d* väljs på val och fryses; (3) filterfamilj hanteras med min-statistik mot null byggd med samma urvalsregel; (4) surrogat läcker aldrig över splitgränser; (5) opreregistrerad eller oblindad pipeline ger automatiskt E-none. Utlåtandets principformulering antas som katalogens: *ingen latent struktur tolkas om modellval, standardisering, fönster, filter och teststatistik inte var låsta före test.* v0.1:s krav "mot minst två surrogattyper" formaliseras under katalognamnet **p⁽²⁾-regeln** (H §4.1): andra minsta p över surrogatfamiljerna bär beslutet.

## 6. Surrogatmaskinen

**S1** pol-label-shuffle (tider orörda; rates och dödtidsmönster exakt bevarade). **S2** time-slide av enbart minuspol-kanalen (relativ förskjutning — B-rättningen införd; villkoret |Δ_c − Δ_d| ≫ τ_max ur B v0.2 gäller). **S3** blockpermutation. **S4** klassisk motståndare med B-nivåns instrumentlager och checklistematchningen i §4.1 regel 2 — v0.1-prototypen (ratematchad Poisson + AR(1)-drift + polflip) är ärlig men otillräcklig för strong och byggs ut. **S5-E** latent drift-null (§4.3) — obligatorisk för hela K-familjen.

## 7. Stressmodulerna (artefaktfilter; kan endast nedklassa)

### 7.1 Basinvariansmodulen — anti-turbulensfilter med tolkningstabell (Ä3)

Premisskorrigeringen kvarstår: klassiskt polariserat ljus är starkt basberoende (Malus; PBS-crosstalk är basbunden), så hög δ_B är ingen kvantflagga. Bindande tolkningstabell (utlåtandets, antagen):

| Utfall | Tolkning |
|---|---|
| Låg δ_B | Strukturen basagnostisk — atmosfär/common-mode misstänkt (nedklassningsgrund) |
| Hög δ_B | Turbulens ensam mindre sannolik — men kvantneutralt |
| Samma mönster i kalibrering/blank | Instrumentmisstanke (modulens egen blank-jämförelse, ny i v0.2) |

Implementation: per-bas-featurebyggare (enbart g²-blocket för vald bas — hela y från en bas bryter feature-schemat, Stokes-blocket kräver alla tre baser), normalisering per block med matchade dimensioner.

### 7.2 Kolmogorov-modulen — fem korrektionskrav (bekräftade)

Premissen behålls (turbulensens τ₀ ~ 1–10 ms; struktur som överlever fönster ≫ τ₀ är inte frusen atmosfär), implementationens confound åtgärdas: större T_win ger färre fönster ger mekaniskt lägre Ĥ — utslagsriktningen var biasen, inte fysiken. Bindande krav: (1) matchat antal fönster via subsampling; (2) biaskorrigerad entropi (Miller–Madow); (3) svep förankrat i per-session skattat τ₀ (T_win ∈ [0,1·τ₀, 100·τ₀] logaritmiskt); (4) trendtest mot log T_win; (5) asdict-fixen (kopiera config, ersätt win_ps separat — dubblerat nyckelord ger TypeError).

### 7.3 Modulernas plats

Körs efter primärklassningen; basagnostisk struktur respektive τ₀-bunden kodlikhet är vardera nedklassningsgrund. Ingen modul kan uppklassa.

## 8. Instrumentkrav och dataformat

E ärver B v0.2:s krav i sin helhet (time-tagging, tre baser SIM/MOD med loggat läge, versionerad kalibrering med villkorstal, detektorkarakterisering inklusive pile-up-test) och skärper två: stabil jitter relativt Δτ över hela kampanjen, och stort informativt m (minst tre baser, gärna förregistrerad bandpassfamilj). Windowing-parametrarna tillhör E-låset. Arvsregeln strukturell: E räknas aldrig som oberoende bekräftelse av B/D/F på delad rådata.

## 9. Klassning (v0.2, femgradig stege; Ä1)

**E-none.** Ingen lågdim-separation, eller hold-out faller, eller stressfilter utlöst utan motbevis, eller pipeline ej förregistrerad/blind, eller splitläckage (diskvalificerande).

**E-struct.** Låg d_eff eller god rekonstruktion föreligger, men hold-out, replikation eller surrogatstöd är otillräckligt. Notering, ej anspråk.

**E-suspect.** p_L < 0,01 med p⁽²⁾-disciplin och p_G < 0,01 på blint test; replikation i ≥2 oberoende sessioner eller leave-one-session-out utan kollaps; robusthet mot binning/fönster/T_hop; S4 (checklistematchad) reproducerar inte strukturen; inga röda flaggor. Tolkning: strukturerad korrelationsdynamik.

**E-code-suspect (ny).** E-suspect plus kod-likhet: p_K < 0,001 mot S5-E och minst en ytterligare surrogatfamilj (p⁽²⁾), **samt** transitionsstruktur bortom AR/OU-nullen (entropitaktstestet i §4.3 steg 2, med dubbel biasvakt). Tolkning: strukturerad dynamik med äkta kodkaraktär — fortfarande kvantneutral; utan disjunkt vittne är detta maximal klassning, antecknad som "stark klassisk strukturkandidat".

**E-strong.** E-code-suspect plus minst ett samtidigt positivt icke-klassicitetsvittne (A, B-2 eller C) från disjunkt detektorkedja och separat kalibreringskedja (§3.2).

**Röda flaggor (nedklassning):** periodicitetsflagga (spektral topp nära nät/mekanik); extrem basis/pol-obalans; kortlags-korrelationer matchande känd detektorartefakt; samma lågdimensionalitet på dark/blank/kalibrering; selection leakage (diskvalificerande); basagnostisk struktur (§7.1); τ₀-bunden kodlikhet (§7.2).

## 10. Kodstatus (fyra blockerare för full tolkning)

E-mallen är katalogens mest körbara — S1–S3 korrekta med B-rättningarna införda, two-pointer-motor på plats, hold-out-logiken enligt spec; detta är inte C/D-mallarnas spegelläge. Blockerande för full tolkning: (1) S5-E saknas — K-familjen är otolkbar utan den; (2) Kolmogorov-modulens sample-size-confound (§7.2:s fem krav); (3) asdict-buggen; (4) S4 för enkel — B-nivåns instrumentlager plus checklistan §4.1. Nytt i v0.2: (5) transitionsmetriken med dubbel biasvakt implementeras tillsammans med S5-E — de delar null-infrastruktur.

## 11. Det gamla resultatet 6,17 mot 5,42

Otolkat tills vidare. Skillnaden kan vara verklig strukturskillnad, samplingseffekt, feature-brus, fönsterkorrelation, standardiseringsartefakt, drift eller nullberoende. Rättegången kvarstår beställd: båda modellerna genom full E-pipeline med S1–S5, blindad split och matchad null — först då får siffran mening.

## 12. Öppna frågor och åtgärdslista

I prioritetsordning: (1) implementera S5-E och transitionsmetriken gemensamt (delad null-infrastruktur, dubbel biasvakt) — blockerande för all K-tolkning; (2) korrigera Kolmogorov-modulen (fem kraven) och asdict-buggen; (3) per-bas-featurebyggare med modulens blank-jämförelse; (4) bygg ut S4 enligt checklistan; (5) T_hop-validering i konfigurationen; (6) genomför rättegången 6,17/5,42; (7) injection tests: syntetisk källa med känd Markov-kod över K prototyper ska ge E-code-suspect med korrekt U/H/H-takt och utan falsklarm på AR(1)-drift — driftinjektionen är kanariefågeln (jämför C v0.2 §6.2); (8) disjunkt-vittnes-logistik med C/G-labbet för framtida E-strong-anspråk.

Öppen forskningsfråga (oförändrad): existerar någon astrofysikalisk eller instrumentell process som producerar diskret, transitionsstrukturerad kod-likhet bortom drift, moddynamik och turbulens? E:s ärligaste möjliga utfall förblir ett kvantitativt nej — varvid varje framtida E-code-suspect blir desto mer betydelsebärande.

## 13. Slutsats

Signaturtyp E lämnar granskningsrundan som den kom in: katalogens mest disciplinerade protokoll, nu med sin mest ambitiösa del — kod-likheten — försedd med den stege den saknade. E-struct och E-code-suspect ger varje fynd en ärlig adress, transitionskravet skiljer kod från långsamhet, och den dubbla biasvakten ser till att skärpningen inte själv blir en bias. E:s löfte är oförändrat och dess gräns likaså: den hittar strukturerade, återkommande tillståndsfamiljer och lämnar dem vidare till A, B-2 och C för kvantdomen — quantum-neutral unless independently witnessed, och stolt över det.
