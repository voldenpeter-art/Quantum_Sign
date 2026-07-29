# Signaturtyp D — Stabil invariant över observationstillfällen

## Fullständig rapport och protokollspecifikation, version 0.2

*Status: granskad och uppdaterad. v0.2 inarbetar det externa granskningsutlåtandet över v0.1 samt chattgranskningens bedömning av detsamma. Statusetikett (antagen från utlåtandet): **fingerprint-ready after code fixes** — D-pol kvantneutral; D-Q lovande med korrigerad vittnesdefinition.*

**Ändringslogg v0.1 → v0.2:** (Ä1) D-Q-vittnet omdefinierat: kvantvittnet är minsta kalibrerade Stokes-egenvarians under skottbrus, D_Q = λ_min(Σ_cal)/V_shot < 1; det tidigare trace-vittnet är fysikaliskt omöjligt som signatur (teorem, §6.2) och konverteras till omöjlighetsflaggan RF_stokes_bound, harmoniserad med G:s Heisenberg-bokföring (§6.3). (Ä2) Stabilitetsinferensen delad i två separata p-värden — konstantmodell-kompatibilitet (övre svans, passband) och ovanlig-stabilitet-mot-S4 (nedre svans) — med tvåsvansband och flaggan RF_vs_audit för överskattade V_s (§9.2). (Ä3) Kontrastkravet skärpt till undre osäkerhetsgräns: K_D,lower > tröskel (§5.2). (Ä4) Klassningen femgradig med förtjänad quantum-nomenklatur: D-none/D-struct/D-fingerprint-suspect/D-fingerprint-strong/D-quantum (§10). (Ä5) p⁽²⁾-regeln back-porterad enligt syntesrapporten §7 (§9). (Ä6) Statusetikett. Bokföring: utlåtandets §2 (anomalilösningen), §3 (d = 2), §7 (Horodecki) och §9 (kodblockerare) bekräftar v0.1 och bokförs som oberoende validering, inte ändring.

---

## 1. Sammanfattning

Signaturtyp D föreligger när en förregistrerad invariant-funktion av uppmätt korrelationsstruktur — invariant under passiva basbyten (SU(2)-rotationer av polarisationsbasen) och normaliserad mot intensitetsskalning — är statistiskt förenlig med en konstant över flera observationstillfällen, samtidigt som den separerar signifikant från surrogatnullen och samtidigt som de icke-invarianta råmåtten bevisligen varierar. D är katalogens identitetssignatur: ett basoberoende fingeravtryck i invariant-rummet, natt efter natt.

Rapportens centrala slutsatser. För det första är variansanomalin från den tidiga simuleringen löst: den korrelerade modellens högre råvarians var förväntad skattningsstatistik (reducerat effektivt stickprov plus sorteringsbias vid degenererat spektrum), och beslutsobjektet är det viktade konstantmodelltestet under korrekta per-sessions-osäkerheter. För det andra har invariant-vektorn exakt två frihetsgrader — I = [λ̃₁, λ̃₂] — och varje femkomponentsformulering ger rank-defekta kovarianser och felräknade frihetsgrader. För det tredje är stabilitet evidensneutral: D:s utsagokraft bärs av treenigheten separation–stabilitet–kontrast, där kontrasten kräver att omgivningen bevisligen rörde sig medan invarianten stod kvar, med undre osäkerhetsgräns på kontrastkvoten. För det fjärde är D-pol kvantneutral, och kvantanspråk (klassen D-quantum) kräver antingen det korrigerade D_Q-vittnet — komponentvis/egenvärdesbaserad sub-skottbrusvarians efter absolut kalibrering, aldrig trace under global gräns, vilket är fysikaliskt omöjligt och därmed artefaktflagga — eller oberoende disjunkt vittne, eller D-2arm med C-bekräftelse.

## 2. Definition och scope

### 2.1 Operational definition

Givet S ≥ 2 sessioner byggs en förregistrerad invariant-funktion **I**(·) från B-kedjans Stokes-korrelationer C_ij(τ). D föreligger om tre villkor uppfylls:

**(D-sep)** — invariant-separation: **I**^(s) ligger signifikant utanför den empiriska S1–S4-nullen (Mahalanobis-avstånd, empiriskt p per session, aggregerat som median respektive max).

**(D-stab)** — multi-sessionsstabilitet: **I**^(s) är förenlig med konstant modell (p_const inom passband, §9.2) och ovanligt stabil relativt motståndarnullen (p_stable-vs-S4 under tröskel).

**(D-kontrast)** — kontrastkravet: K_D,lower > K_min (§5.2).

Scope v0.1/v0.2 är D-pol; D-2arm förbereds som v0.2-spår med Horodecki-screeningen som deklarerat syfte (§7).

### 2.2 De två varianterna

**D-pol.** Ur B:s C_ij(τ) integreras sessionskovariansen Σ^(s)_ij = Σ_τ∈K w(τ)·C^(s)_ij(τ) över förregistrerat fönster K. Under basrotation transformeras Σ ↦ RΣRᵀ; egenvärdena och deras normerade form λ̃ᵢ = λᵢ/Σλ är rotationsinvarianta och intensitetsokänsliga.

**D-2arm.** Med två armar skattas korrelationstensorn T_ij; dess singulärvärden μ₁ ≥ μ₂ ≥ μ₃ är invarianta under lokala unitärer och utgör invariant-vektorn.

### 2.3 Kontinuitet med programmets ursprungsidé

D operationaliserar frågan "är en parameter konstant, driftande eller fluktuerande?": konstantmodelltest under korrekt osäkerhetsmodell, med surrogat-driven referens.

## 3. Variansanomalin — löst (bekräftad av extern granskning)

### 3.1 Anomalin och dess två mekanismer

Den tidiga simuleringen gav ~10× högre råvarians i invariant-skattningen för den korrelerade modellen än den klassiska, trots beslutsregeln "liten varians". Mekanism 1: korrelerade processer har N_eff ≈ N·Δt/(2τ_corr) < N — skattningsbruset växer trots stabil sann invariant. Mekanism 2: den klassiska modellens nära degenererade spektrum gör "största sorterade egenvärdet" till en ordningsstatistika med bias och icke-gaussisk fördelning; råvariansjämförelser över olika spektral struktur är inte väldefinierade.

### 3.2 Upplösning och bindande lärdom

Beslutsobjektet är det inverse-varians-viktade konstantmodelltestet

χ²_const = Σ_s (**I**^(s) − **Ī**)ᵀ V_s⁻¹ (**I**^(s) − **Ī**),

med V_s skattad per session med block-bootstrap/jackknife som respekterar korrelationstiden. Bindande lärdom (extern granskning instämmer): **råvarianser jämförs aldrig mellan modeller eller källor med olika effektivt stickprov eller olika spektral struktur.** Återkörningen av ursprungssimuleringen med korrekt statistik kvarstår som formell stängningsåtgärd (§12).

## 4. Invariant-vektorn: d = 2 (bekräftad)

I = [λ̃₁, λ̃₂]. Övriga storheter är härledda: λ̃₃ = 1 − λ̃₁ − λ̃₂; J₂ᵗ = Σλ̃ᵢλ̃ⱼ; J₃ᵗ = λ̃₁λ̃₂λ̃₃ (elementära symmetriska funktioner av det normerade spektrumet). Femkomponentsvektorn ger rank-defekta V_s och frihetsgrader felräknade med mer än faktor två; pinv räddar aritmetiken men inte logiken. Härledda storheter redovisas men ingår aldrig i teststatistiken. Om D_Q-vittnet (§6) antas utökas vektorn med den separat kalibrerade komponenten λ_min(Σ_cal)/V_shot till d = 3 — notera att denna komponent inte är en funktion av det normerade spektrumet eftersom den bär absolut skala via skottbruskalibreringen.

## 5. Vad D bevisar och inte bevisar

### 5.1 Stabilitet är evidensneutral

En stabil invariant kan betyda stabil källa, stabil propagation, stabil instrumentoptik, stabil pipeline-bias — eller att inget relevant varierade. D inverterar dessutom motståndarlogiken: den klassiska motståndaren "vinner" genom att vara maximalt stabil, vilket ett bra instrument gör gratis. D:s evidensinnehåll bärs av D-sep, med D-stab som konsistenskrav och D-kontrast som det som skiljer fingeravtryck från frusen bild.

### 5.2 Kontrastkravet med undre gräns (Ä3)

K_D = (normerad variation i förregistrerade icke-invarianta råmått: flux, rå g²-form, orienteringsberoende komponenter) / (normerad variation i **I**), båda som χ²/dof mot konstant modell med korrekta osäkerheter. **v0.2-skärpning:** kravet ställs på kvotens undre osäkerhetsgräns, K_D,lower > K_min (förslag K_min = 10), med osäkerheten propagerad från båda leden. Punktvärdeskrav förbjuds: kvoten exploderar artificiellt när invariantens variation råkar hamna nära noll eller när V_s överskattas — det senare fångas dessutom av RF_vs_audit (§9.2), eftersom samma grundorsak samtidigt ger p_const ≈ 1.

### 5.3 Instrument-invariant kan inte uteslutas statistiskt

Ingen intern statistik skiljer källans invariant från instrumentets. Endast kontrollbatteriet gör åtskillnaden: dark/blank-körningar, pekvariation och fältrotation (mönstret får inte följa känd Mueller-mixing), hårdvarubyten (fingeravtrycket får inte följa fibern). D:s epistemiska gräns, inte fotnot.

### 5.4 D-pol är kvantneutral

Inget i egenvärdesstrukturen hos en klassisk Stokes-kovarians är icke-klassiskt. D-pol är en identitetssignatur av samma evidensklass som B-0/B-1: vetenskapligt intressant, kvantmässigt tyst. Kvantanspråk förbehålls klassen D-quantum (§10).

## 6. D-Q-vittnet, korrigerat (Ä1)

### 6.1 v0.1-vittnets fel

v0.1 föreslog trace-invarianten J₁ = tr(Σ) prövad mot den globala gränsen 2⟨S₀⟩ som kvantvittne. Detta var felkonstruerat: polarisationssqueezing verkar komponentvis — en Stokes-komponent under skottbrusnivån, konjugatet anti-squeezat över — och summan trycks inte under den globala gränsen.

### 6.2 Skärpning till teorem

Felet är djupare än en praktisk invändning. Ur operatoridentiteten Ŝ₁² + Ŝ₂² + Ŝ₃² = Ŝ₀(Ŝ₀ + 2) följer

Var(Ŝ₁) + Var(Ŝ₂) + Var(Ŝ₃) = ⟨Ŝ₀(Ŝ₀+2)⟩ − |⟨**Ŝ**⟩|² ≥ Var(Ŝ₀) + 2⟨Ŝ₀⟩ ≥ 2⟨Ŝ₀⟩,

där sista steget använder |⟨**Ŝ**⟩| ≤ ⟨Ŝ₀⟩. Summan kan alltså **aldrig, för något kvanttillstånd, underskrida 2⟨Ŝ₀⟩**. Ett uppmätt J₁/(2⟨S₀⟩) < 1 är fysikaliskt omöjligt — inte "sannolikt felkalibrering" utan bevisad artefakt: felaktig kalibrering, definitionsfel, överdriven förlust- eller bakgrundskorrektion, eller elektronikbrusfel.

### 6.3 Konsekvens: vittnet omdefinieras, felet blir verktyg

**Kvantvittnet (bindande):** D_Q = λ_min(Σ_cal)/V_shot < 1 signifikant — minsta egenvarians hos den absolutkalibrerade Stokes-kovariansen under skottbrusnivån (ekvivalent komponentvis min_i Var(S_i)/V_shot efter diagonalisering), med anti-squeezingen i konjugatriktningen uppmätt och redovisad samt total brusbudget dokumenterad. Detta är etablerad polarisationssqueezing och identisk med G-pol (G v0.1 §3.3); protokollansvaret delas som tidigare — D äger invariansfrågan över sessioner, G äger vittnesdefinition och kalibreringskedja (koherent referenskälla genom identisk kedja, linearitetstest enligt G §6.2).

**Omöjlighetsflaggan (ny):** **RF_stokes_bound** — uppmätt ΣVar(S_i) < 2⟨S₀⟩ efter kalibrering diskvalificerar sessionen som artefaktkontaminerad. Trace-testet konverteras därmed från trasigt vittne till inbyggd lögndetektor, harmoniserad med G:s RF_heisenberg: D blir katalogens andra signatur med en fysikalisk omöjlighetsdetektor i väggen. Motsvarande mjukare kontroll: D_Q < 1 utan uppmätt anti-squeezing i konjugatet flaggar felkalibrering.

## 7. D-2arm och Horodecki-bryggan (bekräftad)

För tvåarms-tensorn T ger Horodecki-kriteriet S_max = 2√(μ₁² + μ₂²); Bell-brott är möjligt om och endast om μ₁² + μ₂² > 1 (tvåqubit-fallet). D-2arm förscreenar därmed C: stabila singulärvärden med μ₁² + μ₂² > 1 identifierar när C-mätning är mödan värd, utan C:s settings-apparat. Systemkopplingen låses: D-2arm valideras i C-labbet mot verkliga SPDC-par (C v0.2 §11, p-svep-batteriet ger samtidigt μ-svep), C mäter därefter faktisk CHSH. Par-golvet (C §3) gäller oförändrat för astronomisk D-2arm.

## 8. Instrumentkrav och dataformat

D-pol ärver B v0.2:s krav i sin helhet, inklusive rå-kanalprincipen (korrigera modellen, inte datan — B v0.2 §7.2) för allt som når invariantberäkningen, med B-1-inversionens tre krav (villkorstal, osäkerhetspropagering, identisk inversion på null) där Stokes-rekonstruktion är oundviklig. Specifikt för D: basschema, bandpass, gates, τ-fönster K och viktning w(τ) identiskt förregistrerade över alla sessioner; varje mellansessionsändring i mätkedjan flaggas och kräver full omkalibrering. För D_Q-vittnet tillkommer G:s absoluta skottbruskalibrering. Sessionsdisciplin: en session = ett observationstillfälle med fryst konfiguration. Arvsregeln gäller med full kraft: D delar rådata med B/E/F och räknas aldrig som oberoende bekräftelse av dessa.

## 9. Stabilitets- och separationsstatistik

### 9.1 Per-sessions-osäkerheter

V_s skattas med block-bootstrap eller block-jackknife på tidsbins med blocklängd ≫ korrelationstiden, med korrekt jackknife-skalfaktor ((n−1)/n-viktning) — v0.1-fyndet om felskalad jackknife kvarstår som kodblockerare. Kovariansinversion med villkorstalskontroll (efter d = 2 ordinär invers plus regularitetskontroll, aldrig pinv i tysthet).

### 9.2 Två stabilitets-p (Ä2)

Två frågor, två tester, får aldrig blandas:

**A — konstantmodell-kompatibilitet (övre svans):** p_const = P(χ²_ν ≥ χ²_obs) med ν = (S−1)·d. Kravet är ett **passband**: 0,05 < p_const < 0,995. Undre gränsen förkastar instabil invariant; övre gränsen flaggar för-bra-passning — p_const ≈ 1 betyder överskattade V_s, vilket samtidigt blåser upp K_D artificiellt. En grundorsak, två symptom, en flagga: **RF_vs_audit** (V_s-revision krävs innan vidare tolkning).

**B — ovanlig stabilitet mot motståndare (nedre svans):** p_stable-vs-S4 = P(χ²_S4-null ≤ χ²_obs), där S4 körs i stabilitetsmaximerande läge. Kravet är lågt värde: observerad stabilitet ska vara ovanlig även mot en motståndare som *försöker* vara stabil.

D-stab kräver båda. v0.1:s enda p_stab (enbart B-typ mot blandad null) utgår; noteras att strukturförstörda surrogat ofta har trivialt hög invariant-spridning (degenererade spektra, §3.1), varför B-testet endast är utsagokraftigt mot stabilitets-S4.

### 9.3 Separationstest och p⁽²⁾ (Ä5)

Per session Mahalanobis-avstånd mot surrogatfördelningen; empiriskt p_sep,s; aggregat som median (suspect) respektive max — alla sessioner (strong). **p⁽²⁾-regeln (back-porterad från H §4.1):** separationen ska hålla mot minst två oberoende surrogatfamiljer.

### 9.4 Tvåläges-S4 (bekräftad)

S4 körs i två lägen — stabilitetsmaximerande (mot D-stab) och separationsmaximerande (mot D-sep) — och båda redovisas. En klassisk motståndare som når samma kombination (separation + stabilitet + kontrast) fäller fyndet.

## 10. Klassning (v0.2, femgradig; Ä4)

**D-none.** S < 2 sessioner; eller ingen separation mot relevant null; eller p_const under passbandet (konstantmodellen förkastas); eller K_D,lower under tröskel; eller röd flagga.

**D-struct.** Separerad och stabil invariant (båda p-testen godkända) men kontrastkravet eller kontrollbatteriet ofullständigt. Kandidat, ej fingeravtrycksanspråk.

**D-fingerprint-suspect.** p_const inom passband; p_sep,med < 10⁻² med p⁽²⁾-disciplin; p_stable-vs-S4 < 10⁻²; K_D,lower > K_min; inga starka röda flaggor.

**D-fingerprint-strong.** Minst tre oberoende sessioner; separation i samtliga (max_s p_sep,s < 10⁻³); p_const inom passband i aggregat; p_stable-vs-S4 < 10⁻³ mot stabilitetsmaximerande S4; K_D,lower > K_min med marginal; tvåläges-S4 replikerar inte kombinationen; fullständigt kontrollbatteri (dark/blank/LED, pekvariation, hårdvarubyte) passerat; oförändrad mätkedja eller full omkalibrering dokumenterad.

**D-quantum.** D-fingerprint-strong plus minst ett av: (i) korrigerat D_Q-vittne — λ_min(Σ_cal)/V_shot < 1 signifikant med redovisad anti-squeezing och G-kalibreringskedja; (ii) samtidigt oberoende A/B-2/C-vittne från disjunkt detektorkedja (arvsregeln); (iii) D-2arm med efterföljande C-bekräftelse; (iv) G-vittne på samma källa. Ordet quantum förekommer endast i denna klass.

**Röda flaggor (ovillkorlig nedklassning):** D i dark/blank; D följer det_id snarare än basis/pol; fingeravtrycket ändras vid trivialt K-byte; D följer pekvinkel/fältrotation konsistent med känd Mueller-mixing; mätkedja ändrad utan omkalibrering; RF_vs_audit utlöst utan åtgärdad V_s-revision; **RF_stokes_bound** (ΣVar < 2⟨S₀⟩ — fysikaliskt omöjligt, sessionen artefaktklassad); D_Q < 1 utan uppmätt anti-squeezing.

## 11. Kodstatus (blockerande, bekräftad ordning)

(1) Reducera invariant-vektorn till d = 2 och räkna om frihetsgrader och trösklar; (2) implementera riktiga S1–S4 — spegelstubbar som returnerar indata gör klassningen strukturellt omöjlig, samma fel som i C-mallen; (3) tvåläges-S4; (4) K_D med osäkerhetspropagering och undre gräns; (5) jackknife-skalfaktorn; (6) villkorstalskontroll i kovariansinversion; (7) de två stabilitets-p:na med passband och RF_vs_audit; (8) återkör ursprungssimuleringen med χ²_const i stället för råvarians och dokumentera att anomalin försvinner — formell stängning av §3.

## 12. Öppna frågor och åtgärdslista

Utöver kodlistan: (1) specificera D_Q-protokollet gemensamt med G (kalibreringskedja, koherent referens, anti-squeezing-redovisning) — G-pol och D_Q är samma vittne med delat ansvar; (2) D-2arm-validering i C-labbet mot p-svep-batteriets par (μ-svep gratis ur samma data); (3) injection tests: syntetisk källa med konstant invariant plus varierande nuisance ska ge D-fingerprint med korrekt K_D, stabil instrumentartefakt ska fastna i kontrollbatteriet, och V_s-överskattning ska utlösa RF_vs_audit; (4) kandidatfråga (oförändrad): vilka käll- eller propagationsmekanismer ger veckostabil, basoberoende invariant som inte reproduceras av stabil instrumentoptik? Kandidaterna (persistent magnetfältsgeometri, stabil spridningsmiljö) är klassiska — förenligt med D:s roll som identitetssignatur.

## 13. Slutsats

Signaturtyp D lämnar granskningsrundan med sin kärna bekräftad — separation, stabilitet, kontrast under korrekt osäkerhetsmodell — och med sina två svagaste punkter förvandlade: stabilitetsinferensen är nu två ärliga frågor i stället för en sammanblandad, och det felkonstruerade trace-vittnet har via ett operatorteorem blivit katalogens andra inbyggda lögndetektor. D bevisar fortfarande inte kvant — det bevisar identitet, och klassen som bär ordet quantum måste numera förtjäna det med ett komponentvis sub-skottbrusvittne, ett disjunkt vittne eller en Horodecki-förutsägelse som C sedan infriar. Fingeravtrycket står kvar som D:s löfte; v0.2:s bidrag är att ingen längre kan förväxla det med en frusen bild, en snäll varianskvot eller en omöjlig trace.
