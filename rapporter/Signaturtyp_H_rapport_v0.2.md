# Signaturtyp H — Korrelerade fältavtryck i ett nätverk av precisionssensorer

## Fullständig rapport och protokollspecifikation, version 0.2

*Status: granskad och uppdaterad. v0.2 inarbetar det externa granskningsutlåtandet över v0.1 samt chattgranskningens bedömning av detsamma. Statusetikett (antagen från utlåtandet): **target-rich, method-exporting, awaiting sensitivity-volume map.***

**Ändringslogg v0.1 → v0.2:** (Ä1) RF_slow_front skärpt från konsistens- till preferenskrav: flaggan utlöses endast när långsam-front-hypotesen är statistiskt föredragen framför ingen-front-nullen, med konfidensregion på implicerad hastighet; vid N < 5 noder är flaggan icke-utvärderbar (fyra frontparametrar ger noll residualfrihetsgrader vid N ≤ 4) och S4e-kalibrerade trösklar bär ansvaret (§7.3). (Ä2) K-bibliotekets versionslåsning per kampanj med omprövningsregler för H-anomali-arkivet (§5.4). (Ä3) Ny klass H-env: miljöförklarade händelser får egen adress, skild från H-none (§10). (Ä4) Känslighetsvolymkartan formaliserad som stående leverabel och H:s gate-motsvarighet — den inverterade gaten: där G_A–G_G frågar om målet nås, frågar kartan var det garanterade parameterrummet är billigast att söka (§11.4). (Ä5) Statusetikett. Bokföring: utlåtandets §2 (taxonomin, arvsregelfriheten), §3 (metodinnovationerna med back-port-bekräftelse), §4 (tvåskiktsinferensen och H-anomali), §5 (frontprincipen "att vägra tolka är inte att vägra använda"), §6 (cache-kontrollen, jackknife-skärpningen) och §7 (strategifrågan) bekräftar v0.1 och bokförs som oberoende validering.

---

## 1. Sammanfattning

Signaturtyp H föreligger när minst tre rumsligt separerade precisionssensorer (atomur, optiska magnetometrar eller motsvarande) uppvisar en korrelerad avvikelse som (i) inte reproduceras av klassiska störkällor inklusive gemensamma referensartefakter och miljögenomslag, (ii) har ett amplitudmönster över heterogena sensortyper som följer de fysikaliska känslighetskoefficienterna K_i, och (iii) replikeras över oberoende sessioner. Måltavlan är exotiska fält i vakuum — ultralätta skalärer, axionliknande fält, topologiska defekter.

Rapportens centrala slutsatser. För det första är H katalogens första materiasignatur och dess enda med definierade externa mål: en publicerad teorilitteratur av kandidater, aktiva jaktprogram och egenskapen att även icke-detektion producerar kopplingsgränser. För det andra är H taxonomiskt en ny-fysik-signatur — den mäter korrelerad respons i kvantinstrument och besvarar "vad innehåller vakuum?", inte "är detta system kvantmekaniskt?". För det tredje bär H tre metodinnovationer som antagits som katalogstandard: p⁽²⁾-regeln, mode-låset och replikeringsgaten med metakombination. För det fjärde skyddas K_i-beroendet av tvåskiktsinferensen med H-anomali-kategorin och, nytt i v0.2, av versionslåst K-bibliotek per kampanj. För det femte desarmeras den vandrande miljöfronten — H:s farligaste falska positiv — av S4e plus den i v0.2 skärpta RF_slow_front, som nu kräver statistisk preferens och tillräcklig nodgeometri i stället för blott konsistens.

## 2. Definition och scope

### 2.1 Fysikalisk modell

Ett okänt fält φ som kopplar svagt till standardmodellen ger små variationer i konstanter eller spinkopplingar. Klocknod i: y_i(t) = K_i^(α)·δα/α + K_i^(μ)·δμ/μ + … + ε_i(t) med kända/kalibrerbara känslighetskoefficienter per atomövergång. Magnetometernod i: m_i(t) = G_i·φ(t, r_i) + η_i(t). Nyckeln är heterogenitet: ett äkta fältavtryck bär ett förutsägbart amplitudmönster över nätverket, miljöstörningar ett annat.

### 2.2 Operational definition

Med eventmodellen z_i(t) = b_i(t) + A_i·h(t − τ_i; θ) + n_i(t) avgörs detektion via log-likelihood-kvot/Bayes-faktor maximerad över θ, {τ_i}, {A_i}, där amplituderna ska följa K_i-mönstret och τ_i är nuisance. τ_i tolkas aldrig som propagationsfysik; dess mönsterstruktur används dock diskriminativt enligt §7.3.

### 2.3 Taxonomisk placering (bekräftad)

H hör inte till A–G:s vittneshierarki utan öppnar katalogens andra axel: exotisk-fält-detektion i materiasektorn — fullbordandet av programmets direktiv att inte låsa mätobjektet vid ljus. Arvsregeln är trivialt uppfylld: H delar ingen rådata, instrumentkedja eller kalibrering med A–G och är katalogens enda strukturellt oberoende gren.

## 3. Spårarkitekturen

### 3.1 Preprocess

Per nod: detrend (medianfilter/LOESS), robust normalisering (median/MAD), valfri AR(1)/OU-whitening. Miljökanaler (temperatur, vibration, lokalt B-fält, RF, nätspänning) loggas parallellt och används uteslutande diagnostiskt — q_env är rödflaggsindikator, aldrig vinstfeature.

### 3.2 OSC-spåret (kvasi-monokromt)

Parvis koherens C_ij(f) över förregistrerat band, nätverkskoherens C_net(f) = median över par, f* = argmax. Pelare: C_net(f*), fas-konsistensen κ_φ, K-mönster-fitten χ²_K. Look-elsewhere över bandet hanteras genom att surrogaten kör identisk pipeline inklusive maxtagning över f (C §4.2-disciplinen).

### 3.3 GLITCH-spåret (transient)

Per nod transient-score s_i(t) = max över kernelbank; nätverkskombination S_net(t) = max över tillåtna {τ_i} av Σ w_i·s_i(t + τ_i); pelare: S_net(t*), align-kvaliteten A_align, χ²_K på eventamplituder.

### 3.4 Baseline-mode-låset

mode₀ = argmax(S_OSC, S_G) fryses vid baseline; robusthetsvarianter utvärderar samma mode; modebyte för att nå strong loggas som RF_mode_flip. Nya moder (RINGDOWN som v0.3-kandidat) tillkommer per förregistrering, aldrig per post-hoc-flip.

## 4. Scoring och inferens

### 4.1 p⁽²⁾-regeln (H:s export, katalogstandard)

Per pelare F och surrogattyp S: empiriskt p_F^(S); p_F^(2) = andra minsta över {S1…S4}; z_F = −log₁₀ p_F^(2); spårscore S_spår = min över pelarna av z_F. Varje pelare måste slå minst två oberoende nullfamiljer och spåret bärs av sin svagaste pelare — dubbel anti-cherrypick. Back-porterad till A–G (bekräftat).

### 4.2 Trösklar

S_suspect = 3 (≈ p ≤ 10⁻³), S_strong = 6 (≈ p ≤ 10⁻⁶).

### 4.3 CMC-scoren

Cross-modal consistency: händelser med hög korrelationsscore men fallerande fysik-ratios mellan sensortyper flaggas RF_cmc_low och diskvalificeras från H-strong; K-osäkerheter propageras enligt §5.

## 5. K_i-beroendet — tvåskiktsinferens med versionslåsning

### 5.1 Tvåskiktsinferensen (bekräftad)

Skikt 1 (modellagnostiskt: koherens, fas, alignment utan K-fit) kan som mest ge H-suspect. Skikt 2 (K-låst: χ²_K/CMC med propagerade osäkerheter) krävs för H-strong. En äkta men femodellerad signal kan därmed aldrig klassas bort till none — den fastnar synligt på suspect.

### 5.2 K-osäkerheter

χ²_K med σ²_eff = σ²_a + (g·σ_K)²; K-biblioteket versioneras per övergång med dokumenterade osäkerheter.

### 5.3 H-anomali (bekräftad)

Skikt-1-stark händelse med fallerad K-fit: arkiveras för modellrevision, eskalerar aldrig, kasseras aldrig. K-nullkontrollen kvarstår: amplitudmönstret fittas parallellt mot miljökopplingsmallar; bättre miljöfit (förregistrerat informationskriterium) flaggar RF_env_pattern oavsett χ²_K.

### 5.4 Versionslåsning (Ä2, ny)

K-bibliotekets version **fryses per kampanj vid förregistrering**; alla klassningar i kampanjen refererar den frysta versionen. Retroaktiva K-uppdateringar: (i) triggar obligatorisk omprövning av H-anomali-arkivet mot nya värden — det är arkivets syfte; (ii) får aldrig omklassa publicerade kampanjutfall utan explicit omanalys med egen etikett (t.ex. "reklassificerad under K-bibliotek v2.1") och bevarad ursprungsklassning i loggen. Regeln hindrar tyst historierevision åt båda hållen.

## 6. Surrogat och motståndare

**S1** nodvis time-shift (|δ_i| ≥ W_max; bryter simultanitet, bevarar PSD och lokala glitchformer). **S2** fasrandomisering per nod (OSC-spårets skarpaste null). **S3a/S3b** blockpermutation respektive event-shuffle mellan noder, med dygnsviktad variant för nätverk med diurnala bruscykler. **S4-familjen:** S4a gemensam drift + steg; S4b smalbandsinjektion vid kända linjer med nodspecifika gains; S4c miljögenomslags-syntes ur faktiska miljökanaler (den "blinda" varianten utan fältmodell); S4d pipeline-artefaktemulator; **S4e propagerande front** — syntetisk miljöfront med realistiska hastigheter (väder ~1–30 m/s, seismik ~km/s), nodpositionsberoende fördröjningar och gradvis amplitudprofil. H-strong faller om någon S4-variant replikerar samma spår med liknande score.

## 7. Falska positiva och röda flaggor

### 7.1 Gemensamma referensartefakter

GNSS-glitchar, synkbuggar, samtidiga mjukvaruuppdateringar. Motmedel: dubbel tidskälla, hashad pipelineversion, skuggkanal utan fysikkoppling.

### 7.2 Instrumentrespons

Klockservon svarar på störningar med ringningar — falska transienter med struktur. Motmedel: servoresponsmodell och dekonvolutionstest per klocktyp; transientrespons som eget kalibreringsmoment.

### 7.3 Den vandrande fronten och RF_slow_front (Ä1: skärpt)

En miljöfront skapar äkta korrelerade avvikelser med nodberoende fördröjningar — och GLITCH-spårets τ-maximering är byggd att hitta och belöna sådana uppradningar. Principen kvarstår bekräftad: τ tolkas aldrig som fysikresultat, men dess mönsterstruktur används som rödflagga, ty en miljöfront rör sig i m/s–km/s medan galaktiska defektpassager sveper nätverket i hundratals km/s.

**Skärpt flagglogik (bindande):** En plan front har fyra parametrar (två riktningsvinklar, hastighet, tidsnollpunkt). Därav:

1. **Utvärderbarhet:** vid N < 5 noder saknas residualfrihetsgrader — fitten är alltid perfekt och säger ingenting. Flaggan deklareras då *icke-utvärderbar* i rapporten, och frontdiskrimineringen bärs i stället av S4e-kalibrerade trösklar på (S_net, A_align)-kombinationen.
2. **Preferens, inte konsistens:** vid N ≥ 5 utlöses RF_slow_front endast när långsam-front-modellen (implicerad hastighet under förregistrerat v_min) är **statistiskt föredragen** framför ingen-front-nullen enligt förregistrerad modelljämförelse (informationskriterium eller likelihood-kvot med S4e-kalibrerad fördelning). Blott förenlighet vid låga frihetsgrader är gratis och utlöser ingenting.
3. **Redovisning:** konfidensregion på implicerad hastighet och riktning rapporteras alltid när fitten körs — som diagnostik, aldrig som fysikanspråk.

### 7.4 Övriga flaggor

RF_mode_flip; RF_cmc_low; RF_env_explains/RF_env_pattern; stark obalans i nodbidrag; geomagnetisk storm-korrelation (rymdväderindex regresseras och loggas); null-cache-ogiltighet (§9).

## 8. Robusthetspaket och replikeringsgate

Robusthetsmodulen (dt×2/÷2, band±/kernel±, window±, jackknife) med per-variant-rapport och worst-collapse-reason. Jackknife för strong: alla block över tröskel, inget enskilt block bär mer än förregistrerad andel av S₀ (förslag 40 %), minst 12 block. Replikeringsgaten: confirm-run kräver S₀ över tröskel, samma mode₀, passerad K-fit, ingen dominerande miljöförklaring, S4-fail-to-explain; H-suspect ≥2 confirm-runs i olika sessioner, H-strong ≥3 över ≥2 sessioner med Fisher/Stouffer-kombinerat metavärde. Katalogens hårdaste gate; back-porterad som standard.

## 9. Null-cache och drift

Fast-mode mot cachead null kräver giltighetskontroll: sessionens brussignatur (bandvis PSD, MAD-nivåer, miljökorrelationer) jämförs mot cache-genereringens med förregistrerad tolerans; utanför tolerans tvingas full omräkning. Regressionssvit verifierar att fast- och full-mode ger ekvivalenta p-värden på gemensam testdata.

## 10. Klassning (v0.2; Ä3)

**H-none.** Ingen korrelerad avvikelse över tröskel; ingenting funnet.

**H-env (ny).** Korrelerad avvikelse funnen och **förklarad**: miljömodellen eller referensartefaktanalysen reproducerar händelsen inom osäkerheterna (RF_env_explains, S4c-replikation, front-preferens enligt §7.3). Vetenskapligt verkligt utfall med egen adress — nätverket detekterade något, och det något var jorden, inte vakuum. Parallell till B-classical/D-struct/F-memory: det icke-exotiska fyndet förtjänar ett namn, inte en papperskorg. H-env-händelser matar miljömodellens förbättring och S4c-biblioteket.

**H-anomali.** Skikt-1-stark, K-fallerad; arkiverad, omprövas vid K-uppdatering (§5.4), eskalerar aldrig.

**H-suspect.** Replikeringsgate på suspect-nivå (≥2 confirm-runs, olika sessioner) med S₀ ≥ 3 i skikt 1; K-fit loggad men ej krävd.

**H-strong.** Replikeringsgate på strong-nivå (≥3 confirm-runs, ≥2 sessioner, metakombination); robusthetspaket med skärpt jackknife; samtliga S4-varianter inklusive S4e fail-to-explain; K-fit och CMC passerade med propagerade osäkerheter under kampanjens frysta K-version; RF_slow_front ej utlöst (eller icke-utvärderbar med S4e-trösklar passerade); fullständigt kontrollbatteri negativt.

## 11. Validering, strategi och roll i katalogen

### 11.1 Litteraturförankring

Metodkedjan vilar på aktiv publicerad forskning: nätverksjakter på exotiska spinkopplingar (GNOME-klassen), domänväggssökningar med GPS- och optiska klocknätverk, oscillerande skalärfältssökningar via atomspektroskopi. Toy-simuleringarna har kodvalideringsstatus; det blinda injection-programmet med mock-nod och avsiktligt miljögenomslag är obligatorisk valideringsmilstolpe med publicerad ROC per mode.

### 11.2 Roller

(1) Katalogens materiasektor och enda target-rich-gren — även noll-resultat producerar kopplingsgränser; (2) metodexportör: p⁽²⁾, mode-lås, replikeringsgate, CMC-konceptet (inspirerar korsvittnes-konsistens i ljussektorn); (3) strukturellt oberoende: H kan aldrig korskontaminera A–G.

### 11.3 H-env som biprodukt

H-env-arkivet är i sig en vetenskaplig tillgång: en katalog över hur miljöfronter, rymdväder och referenssystem präglar precisionsnätverk är publicerbar geofysik/metrologi och förbättrar samtidigt S4c för varje kampanj. H betalar därmed avkastning även under väntan på exotik.

### 11.4 Känslighetsvolymkartan — den inverterade gaten (Ä4)

A–G:s gater (G_A–G_G) frågar "når vi målet?"; H:s motsvarighet vänder pilen: "var i det garanterat existerande parameterrummet (fältmassa, kopplingsstyrka, defekttäthet) är sökandet billigast?" Kartan — uteslutningsräckvidd per sessionstimme som funktion av parameterrumspunkt, jämförd mot publicerade gränser — formaliseras som **stående leverabel**: beräknas före varje kampanj, uppdateras efter, och styr var observationstiden läggs (svagaste publicerade gränser först). Ingen H-kampanj planeras utan aktuell karta; statusetikettens "awaiting sensitivity-volume map" är gatens ärliga nulägesutslag.

## 12. Öppna frågor och åtgärdslista (omprioriterad i v0.2)

(1) **Känslighetsvolymkartan** för nätverkets faktiska konfiguration mot publicerade gränser — H:s viktigaste enskilda leverabel (§11.4); (2) implementera skärpt RF_slow_front med utvärderbarhetslogik och S4e-kalibrerade fallback-trösklar (§7.3); (3) tvåskiktsinferens + H-anomali + H-env i klassningskoden; (4) K-bibliotek som versionerad vektor per övergång med osäkerheter och kampanjfrysning (§5.4); (5) null-cache-giltighetskontroll plus fast/full-regressionssvit; (6) skärpt jackknife; (7) blint injection-program med mock-nod, miljögenomslag och frontinjektion (S4e-kanariefågeln: injicerad långsam front ska ge H-env, aldrig H-suspect); (8) analyskontraktet och ingestbryggan i H-namnrymd; (9) RINGDOWN-modens förregistrering som v0.3-beslut; (10) back-porteringsstatus: p⁽²⁾/mode-lås/metagate bekräftade införda i A–G v0.2 — punkten stängs.

## 13. Slutsats

Signaturtyp H lämnar granskningsrundan som den gick in: katalogens metodologiska höjdpunkt och strategiska undantag — men med sina två känsligaste konstruktioner härdade. Frontflaggan kräver numera statistisk preferens och ärlig geometri i stället för gratis konsistens, K-biblioteket kan inte längre revidera historien i tysthet, och det icke-exotiska fyndet har fått både namn och nytta: H-env gör väntan på vakuumets hemligheter till löpande vetenskap om jordens brus. H förblir den enda signatur vars fråga inte är om målet finns utan var det är billigast att leta — och med känslighetsvolymkartan som inverterad gate har även den frågan nu sitt förregistrerade svar.
