# Signaturtyp M — Minnes-/eko-signatur: rekonstruerbara spår av tidigare tillstånd

## Fullständig rapport och protokollspecifikation, version 0.2

*Status: granskad och uppdaterad. v0.2 inarbetar det externa granskningsutlåtandet över v0.1 samt chattgranskningens bedömning av detsamma. Statusetikett (antagen från utlåtandet): **intervention-ready (lab), witness-defined, awaiting W_env pilot.***

**Ändringslogg v0.1 → v0.2:** (Ä1) W_env-protokollet skärpt: förregistrerad diskretisering av pekarhistoriken, biaskorrigerad MI-estimator med permutationsnull (fragment↔historik-shuffling) som W_env:s egen null, samt konfidensintervall på R_δ via fragment-bootstrap (§4.2). Därtill formuleras **informationsestimator-standarden** — katalogens generella standard mot det tre gånger korrigerade sampelbias-problemet (E-transitioner, F-CK, M-MI) — och köas till syntes v1.1 (§4.4). (Ä2) RF_init_corr kvantifierad: förregistrerad tröskel på eko-score-differensen randomiserad/icke-randomiserad preparation (§8.1). (Ä3) Klassningsnomenklatur: M-classical → **M-memory**, i katalogsymmetri med F-memory — klassnamnet säger vad som bevisats (§9). (Ä4) Protokollfas-mallen (Fas 0–5) köad som metodbiblioteksexport tillsammans med scorecard och trafikljus (§10). (Ä5) Statusetikett. Bokföring: utlåtandets §2 (demarkationen observation/intervention), §3 (korrigerade vittnesvektorn), §4 (W_env som starkaste tillskott, inklusive den kontextuella astronominoteringen), §5 (klassiska ekon med akustikexemplet), §6 (N0–N4 + flicker-import), §8 (initialkorrelationerna som huvudrisk) och §10 (stammoder-rollen) bekräftar v0.1 och bokförs som oberoende validering.

---

## 1. Sammanfattning

Signaturtyp M föreligger när ett systems tidigare tillstånd lämnar rekonstruerbara spår — i systemets egen dynamik (ekon under aktiv återfokusering) eller i dess omgivning (redundanta miljöavtryck) — utöver vad kalibrerade minneslösa och klassiskt-minnesbärande nollmodeller förklarar. M är katalogens svar på programmets grundfråga: lämnar det som sker läsbara spår, och kan historien läsas ur dem?

Rapportens centrala slutsatser. För det första är demarkationen mot F bindande och externt bekräftad: F frågar observationellt om dynamiken minns; M frågar interventionellt om det förflutna kan återvinnas — F äger backflow- och divisibilitetsmåtten, M äger ekoprotokollen och miljörekonstruktionen, med BLP/RHP i M:s Q-indikationslager. För det andra vilar M på två pelare: ekoscoren E* (aktiv återfokusering) och miljövittnet W_env (kvantdarwinismens redundansmått), där v0.2 ger W_env den estimatordisciplin pelaren saknade — diskretisering före skattning, biaskorrektion, permutationsnull och bootstrap-intervall. För det tredje är eko kvantneutralt (klassiska tidsreverseringsspeglar refokuserar nära perfekt) och M-memory är det hedervärda default-utfallet; kvantanspråk bärs uteslutande av Q-lagret. För det fjärde är initiala system–miljö-korrelationer M:s lömskaste falska positiv — minne som inte skapades utan fanns där — och prepareringsrandomiseringen med kvantifierad tröskel är obligatorisk. För det femte formaliseras M:s arv: signaturen som lärde katalogen dess disciplin exporterar nu fasmallen, scorecardet och trafikljuset, och tar själv emot informationsestimator-standarden som rundans sista tvärgående lärdom.

## 2. Konceptuell grund

### 2.1 Ursprungsidén och dess korrigering (bindande)

Programidén — att energi eller partiklar bär ett bestående märke — korrigerades till sin försvarbara form: energi är en bevarad mängd utan struktur; tillstånd (fördelning, fas, korrelationer, entanglement) bär historia. Minnesspåret lever i information och korrelationer, aldrig i energin som sådan. Den forskningsbara formuleringen: tidigare tillstånd lämnar i många fall rekonstruerbara spår i form av korrelationer, koherensrester eller miljöavtryck, även när lokal observation antyder irreversibilitet.

### 2.2 De tre fysikaliska mekanismerna

**Reversibilitet:** unitär utveckling förstör ingen information; partialspåret över miljön får lokal historia att se förlorad ut — globalt bevarad, lokalt oåtkomlig. **Miljöspår:** interaktion präglar systemtillståndet i omgivningens frihetsgrader; no-hiding-teoremet preciserar att lokalt försvunnen information flyttar till andra frihetsgrader. **Eko/revival:** imperfekt tidsreversering (Loschmidt-eko, spinn-eko-familjen) kan delvis återfokusera dynamiken. Poincaré-/kvantrecurrence är teoretisk bakgrund, inte mätprogram.

### 2.3 Avgränsning: rekonstruktion, aldrig återkomst

M lovar rekonstruktion av information om det förflutna, aldrig återkomst till det; ekonens perturbationskänslighet är måttet på varför makroskopisk reversering inte skalar. Klausulen har no-signaling-klausulernas status.

## 3. Demarkationen mot F (bekräftad)

**F (observation):** minns dynamiken? — korrelationsdynamikens form på data man inte styr (F-passiv) respektive divisibilitets- och backflow-mått med prober (F-aktiv). F äger N_BLP, N_RHP och semigrupp/CK-testen.

**M (intervention och rekonstruktion):** kan det förflutna återvinnas? — (i) aktiv återfokusering: ekoprotokoll där imperfekt reverserad utveckling appliceras och återkomstgraden mäts; (ii) miljörekonstruktion: avläsning av systemhistorik ur omgivningsfragment.

**Korrigerad vittnesvektor:** S_M = [E*, W_env, C_ctrl]. BLP/RHP citeras i Q-lagret (Q₃/Q₄); CK/multi-time delas med F under uttrycklig ägarnotering. Korskörning av F-passiv på M-data uppmuntras men räknas aldrig som oberoende bekräftelse på delad rådata.

## 4. M-witness: omgivningen som vittne (Ä1: estimatordisciplinerad)

### 4.1 Grund

Kvantdarwinism: systemets pekartillstånd präglas redundant i omgivningens fragment; objektivitet uppstår när många oberoende fragment bär samma historik. Redundansen är mätbar och demonstrerad i fotoniska experiment; no-hiding-teoremet är den teoretiska licensen.

### 4.2 Operationalisering med estimatordisciplin (skärpt)

Den åtkomliga omgivningen delas i disjunkta fragment {E_k}. Protokoll i låst ordning:

1. **Diskretisering först:** pekarhistoriken grovkornas till förregistrerade tillstånd (K_p nivåer, schema låst i Fas 0) *innan* någon informationsskattning görs — MI på kontinuerliga eller efterhandsvalda indelningar är fritt val förklätt till mätning.
2. **Biaskorrigerad MI:** I(S : E_f) per fragmentstorlek f skattas med biaskorrigerad estimator (Miller–Madow-klass eller motsvarande), med rapporterat sampelantal.
3. **Permutationsnull (W_env:s egen null):** fragment↔historik-parningen shufflas; nullfördelningen av Î under bruten parning, med identisk estimatorkedja, kalibrerar signifikansen — MI-bias drabbar observation och null lika.
4. **Redundans med intervall:** R_δ = antal disjunkta fragment som var för sig når (1−δ)·H(S); konfidensintervall via bootstrap över fragmentindelningar. W_env = nullnormerad R_δ.

W_env saknar klassisk gräns — redundant klassisk prägling är darwinismens normalfall — och är strukturellt vittne; kvantinnehåll endast via Q-lagret (fragmentkorrelationernas kvantstruktur).

### 4.3 Programmets cirkel (kontextuell, bekräftad)

Ljus är ett miljöfragment; astronomisk observation är avläsning av redundanta miljöregister över källors förflutna — katalogens A–G-program är tillämpad M-witness på det enda fragment som når oss. Anmärkningen ändrar ingen beslutsregel.

### 4.4 Informationsestimator-standarden (ny, köad till syntes v1.1)

Sampelbias i informationsskattare har nu korrigerats tre gånger i katalogen — E:s transitionsmetrik, F:s Chapman–Kolmogorov-test, M:s MI — med samma åtgärd varje gång. v0.2 formulerar därför katalogstandarden: **varje entropi-, entropitakt- eller MI-baserad statistik kräver (a) biaskorrigerad estimator, (b) matchat sampelantal mellan observation och null (subsampling till minsta N), (c) permutations- eller modellnull med identisk estimatorkedja, och (d) rapporterat N och tillståndsantal så att mekaniska beroenden är synliga.** Standarden gäller retroaktivt (E §4.3, F §3.2 uppfyller den redan) och förs till metodbiblioteket som obligatorium för varje framtida informationsbaserad metrik.

## 5. Kvantstatus: eko är kvantneutralt (bekräftad)

Klassiska ekon är spektakulära: tidsreverseringsspeglar i akustik refokuserar ljudfält nära perfekt med klassisk fysik; spinn-ekon har semiklassisk beskrivning; klassiskt färgat brus, periodisk drivning och feedback ger revivals. E* > 0 bevisar återfokuserbarhet, inte kvantminne. Kvantbördan bärs av Q-lagret: Q₁ klassisk modellrejektion, Q₂ koherens-/basberoende, Q₃ ancilla-/entanglement-vittne, Q₄ processtensorindikation — där Q₃/Q₄ kräver tomografisk kontroll och placerar M-quantum-strong i laboratoriet, i den interventionella familjen med F-aktiv och C/G-labbet.

## 6. Nullhierarkin N0–N4 (bekräftad katalogstandard)

N0 vitbrus + mätfel; N1 klassisk korrelerad signal (ARMA/OU + drift) **med obligatorisk långminnesmedlem** (fraktionell/flicker — F-lärdomen importerad); N2 Markovisk dynamisk modell; N3 kvasistatisk disorder/parameterdrift; N4 hybrid klassisk-feedbackmodell. Inferens endast mot bästa medlem i hela hierarkin; oavgjort tillfaller nollan (F v0.2 Ä4 gäller katalogbrett). Historisk notering bekräftad: N-hierarkin föregrep den modellfamilje-standard som senare ålades F — M är katalogens metodologiska stammoder.

## 7. Surrogat, protokollfaser och analysdisciplin

Fas 0 förregistrering (inklusive diskretiseringsschema och RF_init_corr-tröskel); Fas 1 kalibrering och artefaktkartläggning; Fas 2 huvudsekvenser (ekoprotokoll med två preparationer, prepareringsrandomisering obligatorisk); Fas 3 surrogaten S1 (label-shuffle), S2 (fasrandomisering; relativa skift per B-lärdomen), S3 (blockbootstrap; blockstege = minnesspektroskopi per F §5.3), S4 (klassiskt färgat brus + kontroll-loop-null); Fas 4 nullhierarkin; Fas 5 låst pipeline med robusthetstester, scorecard (0–20 p) och trafikljus. p⁽²⁾-regeln gäller M-core-komponenterna. Fasmallen, scorecardet och trafikljuset köas som metodbiblioteksexport (Ä4).

## 8. Falska positiva

### 8.1 Initiala system–miljö-korrelationer (huvudrisk; Ä2: kvantifierad)

Korrelerad start ger reducerad dynamik som inte är CP och fejkar backflow/minne utan dynamisk mekanism — minne som fanns, inte skapades. Motmedel (obligatoriskt i Fas 2): **prepareringsrandomisering med kvantifierad diagnostik** — eko-score mäts med och utan aktiv omberedning; differensen jämförs mot förregistrerad tröskel (satt i Fas 0 ur kalibreringens osäkerheter); signifikant differens utlöser RF_init_corr och blockerar tolkning tills prepareringen åtgärdats. En diagnostik utan tröskel är en åsikt; tröskeln gör den till mätning.

### 8.2 Instrumentella

Timing-jitter och synkfel; aliasing; käll-/kalibreringsdrift; dödtid/afterpulsing (A-disciplinen — bedragarens femte kostym); utjämningsartefakter (RF_smoothing: filterkärnor ringmodulerar och tillverkar ekon — preprocess låses i Fas 0 och appliceras identiskt på alla nullmodeller).

### 8.3 Analytiska och fysiska-men-klassiska

Post-selection, parameterjakt, binningberoende; klassiskt färgat brus, periodisk drivning, feedback, miljöer med klassiskt minne — fångas av N-hierarkin och rödflaggslistan med RF_init_corr och RF_smoothing.

## 9. Klassning (v0.2; Ä3)

**M-none.** M-core (E*, W_env efter C_ctrl-grind) passerar inte trösklarna mot fullständig N-hierarki och S1–S4 med p⁽²⁾-disciplin, eller röd flagga.

**M-memory** *(ersätter M-classical; klassnamnet säger vad som bevisats, i symmetri med F-memory)*. M-core passerar med replikering och robusthetsscore över tröskel, men Q-vektorn är tyst eller klassiska modeller överlever Q₁. Tolkning: äkta, reproducerbart minne — käll-, miljö- eller feedbackfysik; publicerbart, hedervärt default.

**M-quantum-suspect.** M-memory plus Q₁ (klassisk rejektion) och Q₂ (koherens-/basberoende) positiva; prioriterad för tomografisk uppföljning.

**M-quantum-strong.** Därtill Q₃ (ancilla-/entanglement-vittne) eller Q₄ (processtensorindikation) signifikant, i förregistrerad blind analys med full scorecard; laboratorieklassning per §5.

**Röda flaggor:** RF_init_corr (§8.1); RF_smoothing; signaturen följer det_id/hårdvara; binning-/blockstege-skala sammanfallande med instrumentperiod; W_env utan uppfylld informationsestimator-standard (§4.4) — informationssiffror utan biasdisciplin är ogiltiga, inte svaga.

## 10. M:s roll i katalogen

**Roll 1 — interventionella familjens tredje medlem:** C/G-labbet + F-aktiv + M utgör katalogens samlade interventionella program — platsen där kontroll över preparationen köper vittnen som passiv observation aldrig når. **Roll 2 — metodologisk stammoder, nu formaliserad:** M exporterar fasmallen (Fas 0–5), scorecardet och trafikljuset till metodbiblioteket; M importerar p⁽²⁾, flicker-medlemmen, prepareringsrandomiseringens kvantifiering och informationsestimator-standarden — cirkeln där M lärde katalogen och katalogen lärt M sluts i bokförd form. **Roll 3 — filosofisk slutsten:** M adresserar programmets födelsefråga och ger det disciplinerade svaret: spår finns; de lever i korrelationer och miljöredundans, inte i energin; de kan delvis återvinnas med intervention men aldrig bli en väg tillbaka; och deras kvantnatur är ett empiriskt Q-lagerbeslut, inte ett antagande.

## 11. Kodstatus

Implementationskrav (uppdaterade): (1) E*-modulen med nullnormerade revival-toppar och identisk maxstatistik på surrogaten; (2) **W_env-modulen enligt §4.2:s fyra steg** — diskretisering, biaskorrigerad MI, permutationsnull, fragment-bootstrap — byggd på samma övergångs-/informationsinfrastruktur som E:s transitionsmetrik och F:s CK-test (informationsestimator-standarden ger gemensam kodbas för alla tre); (3) N-hierarkins fitter med långminnesmedlem; (4) prepareringsrandomiseringens tröskeljämförelse; (5) scorecard- och trafikljusautomatik; (6) förebyggande: inga spegelstubbar, relativa skift, replikeringsgrindar och blindning från dag ett.

## 12. Öppna frågor och åtgärdslista

(1) **W_env-piloten:** fragmentdesign för en konkret fotonisk uppställning i C/G-labbet, med §4.2-protokollet och en känd-redundans-injektion som kanariefågel (syntetisk miljö med konstruerad R_δ ska återfinnas; parningsshufflad data ska ge noll) — statusetikettens "awaiting W_env pilot" pekar hit; (2) demarkationens dokumentgenomförande (BLP/RHP-ägarskap till F med korsreferenser) — bekräftat, verkställs i repo-versionerna; (3) RF_init_corr-tröskelns kalibreringsprocedur; (4) injection-program: klassiskt minne (N1–N4-dragningar) ska ge M-memory, injicerat kvantminne med ancilla-läsbar struktur ska nå suspect/strong med korrekt Q-attribution, ROC per nivå; (5) gemensam informationsestimator-kodbas med E och F; (6) syntesleveranser: fasmall, scorecard, trafikljus, informationsestimator-standard.

Öppen forskningsfråga (oförändrad): existerar naturliga system vars omgivningsfragment bär hög, läsbar redundans över tillståndshistorik på åtkomliga tidsskalor — och kan W_env formuleras för fragment man inte valt själv? M hör tills vidare hemma i laboratoriet, där dess vittnen är verkliga, dess nullar mätbara och dess anspråk falsifierbara.

## 13. Slutsats

Signaturtyp M sluter granskningsrundan där katalogen började: vid frågan om historien lämnar spår. Demarkationen höll, ekonas kvantneutralitet höll, och det starkaste tillskottet — omgivningen som vittne — fick i granskningen exakt vad ett starkt tillskott behöver: disciplinen som gör det mätbart i stället för vackert. Att W_env:s akilleshäl visade sig vara samma sampelbias som redan fällts två gånger i katalogen gav rundan dess sista och kanske viktigaste skörd: informationsestimator-standarden, som ser till att ingen framtida metrik behöver upprepa korrigeringen en fjärde gång. M lämnar rundan som den gick in — stammoder och slutsten på samma gång — med sitt disciplinerade svar på programmets födelsefråga intakt: spåren finns, de kan läsas, och om de är kvantmekaniska avgör experimentet, aldrig önskan.
