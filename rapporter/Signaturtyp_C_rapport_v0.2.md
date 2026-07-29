# Signaturtyp C — Bell-liknande korrelation under specifik filtrering

## Fullständig rapport och protokollspecifikation, version 0.2

*Status: granskad och uppdaterad. v0.2 inarbetar det externa granskningsutlåtandet över v0.1 samt chattgranskningens bedömning av detsamma. Statusetikett (antagen från utlåtandet): C-Lab och C-Link **protocol-ready**; C-Astro **dormant pending pair-production budget**.*

**Ändringslogg v0.1 → v0.2:** (Ä1) Spårnomenklaturen C-Lab/C-Link/C-Astro formaliserad med strategiregeln "C-Lab före C-Astro" (§11). (Ä2) p-svep-testbatteriet infört som bindande valideringsbatteri, med fidelitysteg som klämmer in Bell-gränsen 1/√2 och punkten p = 0,70 som falsk-positiv-kanariefågel (§6.2). (Ä3) Vinkelkriteriets formulering uppgraderad: formen är diagnostik, synligheten är kvantkriteriet (§5.2). (Ä4) Admissibility-gaten G_C formaliserad, harmoniserad med G_A och G_B (§3.4). (Ä5) p⁽²⁾-regeln back-porterad enligt syntesrapporten §7 (§4.3). (Ä6) Injicerade positiva/negativa kontroller infört som klassningskrav, harmoniserat med A/B v0.2 (§10). Bokföring: utlåtandets §1–3, §5–6 och §8 bekräftar v0.1:s korrigeringar (tvådelad inferens, synlighetskriteriet, klassisk S4, kodblockerarna, trösklarna) och bokförs som oberoende validering, inte ändring.

---

## 1. Sammanfattning

Signaturtyp C föreligger när tvåpartskorrelationer mellan två separata mätarmar, under förregistrerad filtrering och med valbara analysinställningar per arm, bryter CHSH-olikhetens klassiska gräns |S| ≤ 2. C är katalogens teoretiskt starkaste vittne: Bell-brott utesluter hela klassen av lokala dolda-variabel-modeller, inte bara klassiska fältmodeller, och kvantmekanikens maximum är Tsirelsons gräns 2√2 ≈ 2,828.

Rapportens centrala slutsatser. För det första har C ett **par-golv** som är kvadratiskt värre än A:s kontrastgolv: CHSH kräver koincidenser mellan armar som mäter samma fotonpar, och för en astronomisk källa skalar sannolikheten att bägge parmedlemmarna når två givna aperturer som den dubbla rymdvinkelutspädningen — passiv astronomisk C saknar därmed definierat mål tills en parmekanism med beräknad parbudget föreslagits (gate G_C, §3.4). För det andra är Bell-inferensen avståndet över den klassiska gränsen — S − 2 i skattningsosäkerhetens enheter — med surrogaten och motståndaren i en separat andra roll: att visa att selektion och artefakter inte klassiskt kan knuffa skattningen över 2 (vilket post-selection bevisligen kan, upp till S = 4). För det tredje är C:s strategiska tyngdpunkt omdefinierad till tre namngivna spår: **C-Lab** (katalogens kalibreringsstandard — enda platsen där äkta sanna positiva produceras på beställning, nu med bindande p-svep-batteri), **C-Link** (konstruerade fri-rymd-, satellit- och fiberlänkar, där entanglement-distribution är demonstrerad) och **C-Astro** (vilande). Byggordningen är bindande: C-Lab före C-Astro.

## 2. Definition och scope

### 2.1 Operational definition

En C-signatur föreligger när det finns en förregistrerad filtrering f (bandpass, tidsgate, spatial mod) och en förregistrerad CHSH-uppställning med två inställningar per arm, x ∈ {0,1} för arm A och y ∈ {0,1} för arm B, sådan att

|S(τ; f)| > 2

med replikerbarhet och robusthet mot rimliga analysvariationer, där S byggs ur koincidensräkningar enligt §4. Filterberoendet är definierande: signaturen söks som en karta (τ, f) ↦ S(τ, f) över en liten, förregistrerad filterfamilj — aldrig genom fri filterjakt i efterhand.

### 2.2 Avgränsningar

Bell-korrelationer möjliggör ingen signalering: korrelationerna framträder endast vid klassisk jämförelse av loggarna från båda armarna (no-signaling). v0.2 gör, liksom v0.1, inga loophole-fria anspråk; klassningen C-strong betyder **starkt Bell-liknande vittne** — aldrig loophole-fritt Bell-brott, en nivå som kräver event-ready-arkitektur, hög total detektionseffektivitet och rumsligt separerad snabb settings-randomisering (§7.4).

### 2.3 Relation till B

B:s Cauchy–Schwarz-vittne R_CS är C:s inställningsfria lillasyskon: det utesluter klassiska fältmodeller utan valbara analysvinklar, men stänger inga loopholes och når inte LHV-klassens uteslutningskraft. Beslutshierarkin: A utesluter klassiska fält via fotonstatistik, B-2 via korskorrelationsstyrka, C utesluter lokala dolda variabler. Varje nivå kostar mer instrument och fotonbudget än den föregående.

## 3. Par-golvet — C:s fundamentala begränsning

### 3.1 Problemet

CHSH-koincidenser måste komma från händelser där arm A och arm B mäter var sin medlem av samma korrelerade par. I laboratorium arrangeras detta trivialt (SPDC: en foton per arm). För en astronomisk källa på avstånd d gäller att varje parmedlem oberoende måste träffa sin apertur med sannolikhet ~A/(4πd²); parkoincidensflödet skalar som produkten — en dubbel rymdvinkelutspädning som gör paruppsamling från astronomiska avstånd radiometriskt hopplös för varje känd källgeometri. Där A:s kontrastgolv kan attackeras med multiplexering (√N-vinst) finns för C ingen motsvarande hävstång: multiplexering hjälper inte den som inte har några par att samla.

### 3.2 Inversionen i etablerad forskning

De publicerade Cosmic Bell-testen använder astronomiskt ljus som slumpgenerator för mätinställningarna — settings-oberoende garanteras av att fotonernas egenskaper avgjordes för länge sedan (stjärnljus respektive kvasarljus i de två generationerna av test) — medan de entanglade paren produceras i laboratoriet. Etablerad forskning använder alltså astronomin för exakt den komponent detta program har gratis (inställningar) och laboratoriet för den komponent programmet saknar (par). Det externa utlåtandet bekräftar slutsatsen: astronomin löser settings-oberoendet, inte parförsörjningen.

### 3.3 Konsekvens

C-Astro vilandeförklaras tills en kandidatmekanism för astrofysikalisk parproduktion med beräknad parbudget passerar gaten i §3.4.

### 3.4 Admissibility-gaten G_C (Ä4)

Harmoniserad med G_A (A v0.2 §11.3) och G_B (B v0.2 §12):

G_C = R_par,pred / R_min,

där R_par,pred är den förutsagda parkoincidenstakten till de två aperturerna för kandidatmekanismen (efter geometri, förluster och koherensbevarande) och R_min den minimitakt som ger S-skattning med begärd signifikans inom realistisk kampanjtid. Förregistrerade band: G_C < 1 ej målbar; 1–3 svag; > 3 möjlig; > 10 prioriterad. Ingen C-Astro-kampanj planeras utan beräknad G_C. Öppningen av C-Astro kräver därutöver dokumenterad mekanism för hur parens korrelationer överlever propagationen.

## 4. Matematisk form och inferens

### 4.1 Dataobjekt

Per händelse loggas arm (A/B), inställning (x respektive y), utfall a, b ∈ {+1, −1}, tidsstämpel och filtermetadata. Koincidensräkningarna N_ab^xy(τ; f) byggs inom förregistrerat fönster, korrelationsfunktionen är

E(x, y; τ, f) = (N₊₊ + N₋₋ − N₊₋ − N₋₊) / (N₊₊ + N₋₋ + N₊₋ + N₋₊)

och CHSH-parametern S(τ, f) = E(0,0) + E(0,1) + E(1,0) − E(1,1), med klassisk gräns |S| ≤ 2 och kvantmaximum 2√2.

### 4.2 Max-statistiken och trial-kontroll

S_max(f) = max över förregistrerat τ-fönster av |S(τ, f)|; S_global = max över filterfamiljen av S_max(f). Nullfördelningar byggs med exakt samma max-statistik, vilket ger automatisk korrektion för multipla tester. Konstruktionen behålls oförändrad.

### 4.3 Tvådelad inferens (bekräftad av utlåtandet; p⁽²⁾ tillagd)

Shufflade surrogat förstör all korrelation och testar "finns korrelation?" — inte "bryts den klassiska gränsen?". Klassiskt korrelerat ljus når legitimt |S| = 2; ett S = 1,5 kan få godtyckligt litet shuffle-p utan kvantinnehåll. Bindande inferens:

**Del 1 — primärtest mot den klassiska gränsen.** Skatta σ_S för S_global via bootstrap över koincidenser (eller deltametod) och kräv S_global − 2 > k·σ_S med förregistrerat k (3 för suspect, 5 för strong).

**Del 2 — selektions- och artefaktkontroll.** Surrogaten S1–S3 och motståndaren S4 visar att pipelinen, med identisk estimatorkedja inklusive max-statistik, inte klassiskt kan producera S̃ > 2. Detta är inte redundant med del 1: post-selection och koincidensfönster-manipulation tillåter lokala klassiska modeller att nå S upp till 4 (detection- och coincidence-time-loopholes). **p⁽²⁾-regeln (Ä5, back-porterad från H §4.1):** del 2-kontrollen kräver att andra minsta p över surrogatfamiljerna understiger tröskeln — ingen enskild null bär ensam ett fynd.

### 4.4 Kalibreringsstatus för simuleringen

Den tidiga simuleringens S = 2,828 är exakt Tsirelsons gräns: kodvalidering, ingen evidens. Oförändrad status.

## 5. Den kvantmekaniska hypotesen (korrigerad)

### 5.1 Vinkelskanningens roll

C-strong kräver utöver S-testet en förregistrerad vinkelskanning där E(θ) fittas mot V·cos(2θ + φ) över fler inställningar än CHSH:s fyra — standardpraxis vid parkällekarakterisering och betydligt mer informativ än fyra punkter.

### 5.2 Synligheten är kvantkriteriet (Ä3: uppgraderad formulering)

Malus lag ger att klassisk polarisationskorrelation — inklusive banal polarisatorläcka — också producerar perfekt cos(2θ)-form. Bindande regel (utlåtandets formulering antagen): **cosinusformen är en konsistens- och instrumentdiagnostik; synligheten över 1/√2 ≈ 0,707, med osäkerhetsmarginal, är kvantkriteriet** (ekvivalent S = 2√2·V > 2). Signifikant V > 1/√2 krävs för C-strong (samma k-disciplin som primärtestet); formavvikelse från cos(2θ) är röd flagga för instrumentstruktur, formöverensstämmelse i sig är evidensneutral.

## 6. Motståndardesign och injektionsmodell

### 6.1 S4 är och förblir klassisk

En depolariserad Werner-stat, ρ_W = p·ρ + (1−p)·I/4, är inte en nollhypotes utan signalmodellen H1 med reducerad fidelity (S = 2√2·p; brott kräver p > 1/√2). Att kräva att data "slår" en kvantmodell testar kvant mot kvant och förlorar falsifierbarheten. Bindande: S4 = lokal klassisk modell + fullt instrumentlager (Mueller-mixing, dödtid, afterpulsing, detektor-crosstalk, jitter, klockdrift, förlust) + selektionsstress (koincidensfönster-variation, effektivitetsobalans, post-selection-strategier), aktivt trimmad att maximera S̃. Utlåtandet bekräftar konstruktionen oförändrad.

### 6.2 Werner-modellens rätta plats — och p-svep-batteriet (Ä2, bindande)

Werner-modellen är injektions- och powermodellen. v0.2 fastställer det bindande valideringsbatteriet (utlåtandets fidelitystege, antagen):

**p ∈ {1,0; 0,9; 0,8; 0,72; 0,70; 0,6}** — i C-Lab med fysiska par och kontrollerad depolarisering, i simulering med syntetiska.

Stegets konstruktion klämmer in Bell-gränsen 1/√2 ≈ 0,7071: vid p = 0,72 (S = 2,04) ska pipelinen finna ett svagt men äkta brott; vid p = 0,70 (S = 1,98) får den ingenting rapportera. **Punkten p = 0,70 är batteriets falsk-positiv-kanariefågel:** en pipeline som klassar C-suspect eller högre där är bevisat opålitlig, med facit i hand. Förväntade utfall per steg dokumenteras i förväg; rapporterad ROC omfattar återfinningsgrad över hela stegen, beteende i gränszonen, no-signalling-flaggning under artefaktinjektion och post-selection-stress. En pipeline som endast testats mot simulerade nuller och aldrig mot verkliga positiva kvanttillstånd är okalibrerad.

## 7. Instrumentkrav

### 7.1 Miniminivå

Två separata armar med time-tagging och synkroniserad tidsbas (sub-ns); tvåutfallsdetektion per arm (PBS-utgångar); valbara analysinställningar per arm (HWP/QWP, EOM/Pockels) med händelsevis loggade settings; Mueller/Jones-kalibrering med versionshantering; förregistrerad filterfamilj (3–8 filter-ID), fixa koincidensfönster och τ-grid. B v0.2:s rå-kanalprincip gäller i tillämpliga delar: kalibrering som framåtmodell, inte inverstransformation av data.

### 7.2 Setting-disciplin

R�knebalans över de fyra (x,y)-kombinationerna kontrolleras (obalans är röd flagga); för högre ambitionsnivå randomiseras inställningarna snabbt och oberoende per arm. Inställningarna är den komponent programmet fullt kontrollerar även för astronomiskt ljus — settings är inte C:s problem, paren är (§3).

### 7.3 No-signalling-sanity

Marginalerna p(a|x,y) får inte bero märkbart på motpartens inställning: NS_A och NS_B hålls under förregistrerad tolerans, beräknade **koincidensbaserat** enligt förregistrerad regel (aldrig hårdkodad proxy). Hög NS bevisar inte signalering utan indikerar instrumentfel, selektionsbias eller bugg — röd flagga, inte fysik.

### 7.4 Avstånd till loophole-hårda anspråk

Riktiga Bell-claims kräver därutöver hög total detektionseffektivitet (detection loophole), rumslig separation med snabb slumpmässig settings-switch (locality loophole), event-ready/heralding och fullständig förlustbudget. v0.2 gör inget av detta och säger det öppet.

## 8. Dataformat

Eventtabellen utökar B-schemat med arm, setting, outcome och filter_id: session_id, run_id, arm (A/B), setting (0/1), det_id, outcome (+/−), t_ps (int64, monoton), filter_id, quality_flags. Metadata per run: mappning setting→analysvinkel per arm, filterdefinitioner, TDC-upplösning och jitter, dödtids- och afterpulsingmodell, Mueller/Jones-kalibreringsversion, settings-genereringsmetod. Preprocessing i låst ordning med setting-sanity och klockjustering A↔B (fast offset plus driftmodell).

## 9. Kodgranskning (kvarstående blockerare)

**Fynd 1 (blockerande): spegelstubbarna.** S3- och S4-generatorerna returnerar kopior av indata → ~hälften av nullproverna identiska med observationen → p_global ≳ 0,25 strukturellt → pipelinen kan aldrig klassa något som C-strong, inklusive perfekta singlettpar. Fail-safe åt konservativt håll men icke-funktionell som beslutsmotor. **Fynd 2:** no-signalling-proxyn är död kod (hårdkodat 0,0) — ersätts koincidensbaserat. **Fynd 3:** S2-offseten refererar odefinierad funktion; förregistrerad konstant ≫ τ_max, en arm skiftas. **Fynd 4:** primärtestet S − 2 > k·σ_S saknas helt och är huvudvägen. **Fynd 5 (accepterat):** O(N²)-koincidensmotorn kräver two-pointer/streaming; replikerings- och robusthetsgrindar obligatoriska i skarp version. Utlåtandets blockeringslista sammanfaller med denna; ingen simuleringsomgång är meningsfull före fynd 1–4.

## 10. Klassning (v0.2; Ä6)

**C-none.** S_global ≤ 2, eller primärtestet ej uppfyllt på suspect-nivå, eller röda flaggor.

**C-suspect.** S_global − 2 > 3σ_S; replikering i minst två runs (helst två sessioner); NS inom tolerans; robust mot binning ±2×, fönsterperturbation och jackknife (10–20 %); inga starka röda flaggor; men utan fullständig S4-stress, utan passerad vinkelskanning eller utan genomfört p-svep-batteri.

**C-strong.** S_global − 2 > 5σ_S med p⁽²⁾-disciplin, replikerat i minst två oberoende sessioner; vinkelskanning med V > 1/√2 signifikant; NS inom tolerans; klassisk S4 inklusive selektionsstress når ej över 2 i samma pipeline; förlustbudget och settings-logg dokumenterade; p-svep-batteriet genomfört och godkänt inklusive kanariefågelpunkten (Ä6: injicerad positiv och negativ kontroll — batteriet utgör båda); alla kontrollmätningar (blank, LED, opolariserad standard) passerade. C-strong betyder starkt Bell-liknande vittne, aldrig loophole-fritt brott (§7.4).

**Röda flaggor (ovillkorlig nedklassning):** effekten försvinner eller byter tecken vid minimal ändring av koincidensfönster; stark (x,y)-obalans; NS över tolerans; signaturen följer det_id snarare än setting/outcome; samma S_max på blank- eller LED-kontroll; filterval utanför förregistrerad familj; vinkelrespons med stark formavvikelse från cos(2θ); falsklarm på kanariefågelpunkten p = 0,70.

## 11. C:s tre spår (Ä1: namngivna; strategiregel bindande)

**C-Lab — obligatorisk kalibreringsstandard och katalogens strategiskt viktigaste investering.** Enda platsen där äkta sanna positiva produceras på beställning: SPDC-källa med kontrollerad depolarisering ger hela p-svep-batteriet (§6.2) fysiskt. C-Lab validerar därmed inte bara C utan hela katalogens metodkedja — eventformat, surrogatdisciplin, injection-logik, rödflaggssystem, blindanalys — mot verklig kvantdata, och levererar de disjunkta vittnen som B/D/E/F:s strong-nivåer kräver enligt arvsregeln. Samordnas med G till det gemensamma C/G-labbet (G v0.1 §10).

**C-Link — länksignatur.** För konstruerade länkar (fri rymd, satellit–mark över 1200 km-klass, fiber) är entanglement-distribution experimentellt demonstrerad; C-protokollet är direkt tillämpbart som kvalitetsmått och vittne.

**C-Astro — vilande.** Dormant pending pair-production budget: aktiveras endast av G_C ≥ 1 (§3.4) med dokumenterad överlevnadsmekanism för parens korrelationer. Utan parbudget är C-Astro inte "svårt men möjligt" — det är odefinierat som observationsprogram (utlåtandets formulering, antagen).

**Byggordning (bindande):** C-Lab före C-Astro. Passiv icke-klassicitetsjakt i astronomiskt ljus hänvisas under tiden till A och B-2, som inte kräver par.

**Arvsregeln:** C delar eventformat och delar av instrumentkedjan med B; C- och B-utfall räknas som oberoende endast vid disjunkta detektoruppsättningar och separata kalibreringskedjor.

## 12. Terminologi

"Icke-lokala korrelationer som bryter lokal realism" används i C-strong-kontext; "state preparation/filtering" för filterfamiljen där kvanttolkningen är avsiktlig. Förslaget att omdöpa "instrumentell artefakt" till "dekoherens-kanal" förblir avvisat: afterpulsing, crosstalk och dödtid är elektronik och detektorfysik; dekoherensspråk reserveras för fysikaliska kanaler i signal- och injektionsmodellerna (depolariseringen i p-svepet är ett sådant legitimt bruk).

## 13. Öppna frågor och åtgärdslista (omprioriterad i v0.2)

Blockerande kodfixar i låst ordning: (1) primärinferensen S − 2 > k·σ_S med bootstrap-σ; (2) riktig S3 (blockpermutation per arm) och klassisk S4 med instrumentlager och selektionsstress; (3) koincidensbaserad NS-skattning; (4) S2-offsetfixen. Metodfixar: (5) vinkelskannings-fit med V-kriterium; (6) replikerings- och robusthetsgrindar i klassningslogiken; (7) two-pointer-koincidensmotor. Program: (8) **C-Lab-uppställning med p-svep-batteriet som första milstolpe** — strategiskt före allt annat icke-blockerande; (9) formell parbudget-kalkyl som dokumenterar §3:s dom kvantitativt och kalibrerar G_C för minst en tänkt källgeometri; (10) C-Link-protokollanpassning (förlustbudget och settings-randomisering för länkgeometri).

Öppen forskningsfråga (oförändrad i sak, nu med gate): existerar någon astrofysikalisk process som producerar polarisationsentanglade fotonpar med bevarad koherens och geometri som ger icke-försumbar dubbel aperturträff? G_C gör frågan kvantitativ; utan ett ja med siffror förblir C-Astro vilande — vilket inte är ett misslyckande för protokollet utan dess ärligaste resultat.

## 14. Slutsats

Signaturtyp C står efter granskningsrundan stärkt på exakt det sätt en redan korrigerad rapport kan stärkas: genom oberoende bekräftelse av korrigeringarna och genom skärpta verktyg där verktyg saknades. Den tvådelade inferensen, synlighetskriteriet och den klassiska motståndaren validerades utan invändning; det nya är namnen som gör strategin exekverbar (C-Lab, C-Link, C-Astro), gaten som gör vilandeförklaringen kvantitativ (G_C), och framför allt p-svep-batteriet med sin kanariefågel vid p = 0,70 — den första valideringskonstruktion i katalogen som är designad att bevisa en pipelines opålitlighet lika gärna som dess funktion. C:s viktigaste bidrag till programmet förblir därmed vad v0.1 fastslog: inte ett framtida astronomiskt fynd, utan platsen där alla andra signaturers trovärdighet förankras — nu med ett facit inbyggt i väggen.
