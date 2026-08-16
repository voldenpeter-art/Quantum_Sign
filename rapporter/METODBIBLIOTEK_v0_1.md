# METODBIBLIOTEK_v0.1

## Katalogövergripande metodstandarder för kvantsignatur-katalogen

*Leverans 11 av 12 enligt `V03_INSTRUKTIONSDOKUMENT.md` Del 8, och den första
uppgiften i Fas 2 därför att den ändrar flera rapporter samtidigt.*

**Varför dokumentet finns.** Katalogens tvärgående regler har uppstått en och en,
i den rapport där problemet först dök upp. Informationsestimator-standarden bor i
M §4.4, trial-korrektionen i A §6.2, tvådelad inferens i C §4.3, p⁽²⁾-regeln i
H §4.1. **En tvärgående standard som bara bor i en av nio rapporter är osynlig
för de övriga åtta** — och det har redan kostat: samma sampelbias korrigerades
tre gånger innan den fick ett namn.

**Dokumentets status.** Konstruktionerna behåller sin bindande status från
ursprungsrapporten; detta dokument flyttar dem inte, det gör dem synliga. Vid
konflikt mellan denna text och ursprungsrapporten gäller ursprungsrapporten,
och konflikten ska rapporteras som fel i detta dokument.

**Numrering.** 1–15 kommer från syntes v1.0 §7, 16–24 från syntes v1.1 §6.2.
Numren är stabila identifierare — nya konstruktioner får nästa lediga nummer,
avförda behåller sitt nummer med statusmarkering.

---

## Del A — Inferens

### 1. Matchat filter med teckendiskriminator
*Ursprung: A §6.1–6.2.*

Optimal linjär statistik över förregistrerat fiducialfönster, med vikter
w_k ∝ f(τ_k)/σ_k². Två metodval är uttryckligen förkastade: oviktad integration
(felviktar brusrika bins) och svansextrapolering (informationsfattig).

**Teckendiskriminatorn:** där utspädning krymper ett vittne men aldrig byter dess
tecken är tecknet den bärande diskriminatorn — *inom* en fullständig H₀-modell,
aldrig i stället för den.

**Mallfamilj kräver trial-korrektion.** En familj {f_j} i stället för en enda mall
skapar look-elsewhere-effekt. Evidensstatistikan blir extremvärdet över familjen,
och nollfördelningen byggs med **identisk extremtagning** på surrogaten. En
mallfamilj utan trial-korrektion är organiserad mallhopping.

### 2. Tvådelad inferens
*Ursprung: C §4.3. Katalogens mest felhanterade konstruktion — fällde tre
signaturer i granskningsrundan.*

**Del 1 — primärtest:** avstånd till den klassiska gränsen i skattningens
osäkerhetsenheter (S − 2 > kσ, 1 − V > kσ, ε̂ + kσ < 0).

**Del 2 — artefaktkontroll:** surrogat och motståndare visar att pipelinen inte
klassiskt kan producera utfallet, med identisk estimatorkedja inklusive
maxtagning.

**Varför båda behövs:** ett surrogat som förstör all korrelation testar "finns
korrelation?", inte "bryts gränsen?". Ett klassiskt system med S = 1,5 kan få
godtyckligt litet shuffle-p utan kvantinnehåll.

### 3. p⁽²⁾-regeln
*Ursprung: H §4.1.*

Andra minsta p över nullfamiljerna bär beslutet. Varje vittne ska slå minst två
oberoende nullfamiljer; ingen enskild snäll null får ensam bära ett fynd.

**Not:** C v0.2 kräver p⁽²⁾ över S1–S3 **plus** motståndaren S4. Formuleringar
som anger färre familjer är regressioner, inte förenklingar.

### 4. Min-gate över pelare
*Ursprung: H §4.1.*

Ett spår bärs av sin svagaste pelare: S_spår = min över pelarna. Kombinerat med
p⁽²⁾ ger det dubbel anti-cherrypick.

### 5. Modellfamilje-null
*Ursprung: M:s N0–N4-hierarki, ålagd F v0.2 §5.2.*

Nollhypotesen är en **klass med stigande förklaringsstyrka**, aldrig en punkt.
Inferens sker mot bästa medlem i hela familjen.

**Obligatorisk medlem där tidsstruktur mäts:** en långminnesmodell
(fraktionell/flicker). Klassiskt 1/f-brus finns i varje detektor och är
långminnesbärande per definition; en detektion mot ensam OU är en
flickerdetektion.

### 6. Mätbar null
*Ursprung: G §6.1.*

Där nollhypotesen kan **mätas** i stället för simuleras är den primär och
surrogaten sekundära. G:s vakuumreferens (blockerad signalport genom identisk
kedja) är katalogens enda exempel — men principen ska prövas i varje ny
uppställning.

**Frekvenskrav:** interfolierad referens delar endast drift som är långsammare än
växlingsperioden. Chopper-frekvensen ska ligga över detektionskedjans uppmätta
1/f-driftknä, annars är "delad drift" en förhoppning.

### 7. Drift-null på latenter
*Ursprung: E:s S5-E.*

Kompressions- och kodmått jämförs mot AR/OU-fittade banor, inte bara mot
strukturförstörda surrogat. Låg kodentropi uppstår gratis av långsam drift.

### 8. Oavgjort tillfaller nollan
*Ursprung: F v0.2 Ä4. Gäller katalogbrett.*

Vid informationskriterie-oavgjort mellan signalmodell och klassisk familj vinner
den klassiska. Tveksamhet är inte evidens.

### 9. Konsistens är inte preferens
*Ursprung: C §4.3 och H §7.3 — fällde två gånger.*

En modell som är *förenlig* med data har inte visat något; den måste vara
*föredragen* framför alternativet enligt förregistrerad modelljämförelse.

**Skärpning från H:** konsistens vid noll residualfrihetsgrader är gratis. En
plan front har fyra parametrar; vid N ≤ 4 noder passar den alltid. Kontrollera
alltid att frihetsgraderna räcker innan en konsistens tolkas.

### 10. Skalär sammanfattning bär inte vektorpåstående
*Ursprung: IBM-kampanjerna P0 och P1; syntes v1.1 §7.2.*

När den förregistrerade observabeln är vektorvärd får ett test på summan aldrig
ensamt bära stabilitetsbeslutet. Kompenserande termförändringar försvinner i
skalären.

**Belagt i båda riktningarna:** i P1 förkastade kontrollvektorn konstantmodellen
(χ² = 87,1, df = 28) medan skalär M över samma serie var förenlig med konstans
(χ² = 38,9, df = 33). Samma kontroll, samma data, motsatt dom.

**Precisering:** en invariant kan mycket väl vara skalär — det avgörande är
transformationslagen, inte antalet komponenter. Regeln gäller den förregistrerade
observabelns dimension, inte invariansbegreppet.

---

## Del B — Disciplin före data

### 11. Förregistrering med blint hold-out
*Ursprung: E §5 — katalogens bästa implementation.*

Schema, trösklar, fönster, feature-ordning, standardisering, surrogatdefinitioner
och split-design låses innan data ses. d* väljs på valideringsmängd och fryses.
Test förblir blint tills pipelinen är fryst.

**Bindande princip:** *ingen latent struktur tolkas om modellval, standardisering,
fönster, filter och teststatistik inte var låsta före test.*

**Den saknade komponenten i flera rapporter:** primärobservabeln ska väljas
**före data, på disjunkt datamängd**. Identisk formulering med MOM-låset.

### 12. Mode-lås
*Ursprung: H §3.4.*

Spårval fryses vid baseline; robusthetsvarianter utvärderar samma mode. Behov av
modebyte för att nå strong loggas som röd flagga. Nya moder tillkommer per
förregistrering, aldrig per post-hoc-flip.

### 13. Hård replikeringsgate med metakombination
*Ursprung: H §8.*

Confirm-runs över sessioner med Fisher- eller Stouffer-kombinerat metavärde.
Suspect ≥2 confirm-runs i olika sessioner; strong ≥3 över ≥2 sessioner.

### 14. Scorecard och trafikljus
*Ursprung: M v0.2 Fas 5.*

Kvantifierad robusthet 0–20 p över datakvalitet, reproducerbarhet,
null/surrogat-separation, analysrobusthet och blindning, plus riskklassning per
resultat.

### 15. Injection- och ROC-krav
*Ursprung: samtliga rapporter.*

Varje pipeline ska återfinna injicerad känd signal och publicera
detektionskaraktäristik innan riktiga data tolkas. **För klass I-vittnen ska
injektionen vara fysisk**, inte syntetisk — en pipeline som aldrig sett ett äkta
positivt är okalibrerad per definition.

### 16. Kanariefågel-principen
*Ursprung: C v0.2 §6.2, generaliserad.*

Varje pipeline ska bära minst en injektion konstruerad för att **avslöja
pipelinens opålitlighet**, inte dess funktion. Falsklarm på en kanariefågel
underkänner provet i sin helhet.

| Signatur | Kanariefågel |
|---|---|
| C | p = 0,70 i Werner-svepet (S = 1,98, strax under gränsen) |
| E | AR(1)-driftinjektion — får inte ge kodlikhet |
| F | Dämpad klassisk oscillator — får inte ge Q-antydan |
| G | Avsiktligt kalibreringssabotage — ska fångas av parkonsistensfiten |
| H | Långsam front — ska ge H-env, aldrig H-suspect |
| M | Parningsshufflad data — ska ge noll |
| QFD | SED-injektion — får aldrig ge någon quantum-klass |
| ETR | Lorentz-oscillator, barriärfördelning, fri kinetik |

### 17. Proveniensdisciplin
*Ursprung: IBM-kampanj P1; syntes v1.1 §7.5.*

**Commit ska ingå i samma rutin som körningen.** Innehåll som skrivits i tid men
committats i efterhand är svagare bevis än man tror — det inbjuder till att anta
att disciplinen var starkare än den var.

**Belagt tre gånger i P1:** förregistreringen (skriven före kampanjstart,
committad efter par 1), en orsaksdokumentation (händelse 7 aug, nedskriven
9 aug), ett schemadokument (skrivet 10 aug, committat 13 aug — dess egen
ändringslogg påstod commit 9 aug, vilket falsifierades av reflogen).

**Konsekvensen är inte att besluten var fel** — allt tyder på motsatsen — **utan
att de inte går att belägga med den styrka protokollet gör anspråk på.**

**Vad som däremot höll och visar vad regeln är värd:** blockindelningen
fastställdes blint ur exekveringstider utan ett enda utfallsvärde och
committades 4,5 timmar före analysen, kryptografiskt verifierbart. Det var den
enda ordning som kunde ha korrumperat primärutfallet.

### 18. Kodfrysning under kampanj
*Ursprung: IBM-kampanj P1; syntes v1.1 §7.6.*

Instrumentet ändras inte under pågående kampanj. Funktionalitet som behövs under
körningen — återupptagning efter avbrott, journalföring — ligger i **separata
skript**, aldrig i det frysta instrumentet.

**Verifieringsform:** en tom diff efter återställning bevisar återställning, inte
obruten historik. Frysningen beläggs med commit-historik, inte med filens
nuvarande innehåll.

---

## Del C — Diagnostik och gränser

### 19. Gate-familjen
*Ursprung: A §11.3, generaliserad över katalogen.*

Admissions-gater med identisk bandstruktur: **< 1** ej målbar; **1–3** svag
kandidat; **> 3** möjlig; **> 10** prioriterad. Ingen kampanj planeras utan
beräknad gate.

| Gate | Kvot |
|---|---|
| G_A | \|ε_obs,pred\| / ε_min |
| G_B | ΔR_pred / ΔR_min |
| G_C | R_par,pred / R_min |
| G_F | SNR_pred(svansregim) / SNR_min |
| G_G | η(1−V)_pred / δ_SNL,min |
| G_QFD | golv-mot-teknisk-marginal / minsta upplösbara S/χ″-avvikelse |
| G_ETR | förutsagd kanalseparation / minsta upplösbara kanalandel |

**H:s inverterade gate** är känslighetsvolymkartan: där syskonen frågar "når vi
målet?" frågar H "var i det garanterat existerande parameterrummet är sökandet
billigast?" Beräknas före varje kampanj, uppdateras efter.

### 20. Omöjlighetsdetektor-familjen
*Ursprung: G §7 och D §6.2, generaliserad.*

Där fysiken erbjuder en omöjlighetsrelation ska den mätas som **inbyggd
lögndetektor**. Ett uppmätt värde på omöjlig sida är inte ett starkt fynd — det
är bevisad artefakt, och sessionen klassas som ogiltig.

| Flagga | Relation | Signatur |
|---|---|---|
| RF_heisenberg | V_min·V_max ≥ 1 | G |
| RF_stokes_bound | ΣVar(Ŝ_i) ≥ 2⟨Ŝ₀⟩ (ur Ŝ₁²+Ŝ₂²+Ŝ₃² = Ŝ₀(Ŝ₀+2)) | D |
| RF_negative_occupation | n̄ ≥ 0 utan populationsinversion | QFD |
| RF_energy_balance | ΣQ_i ≤ 1 plus dokumenterad lagerfrigöring | ETR |

**Sökregel:** varje ny signatur ska genomsöka sin fysik efter en
omöjlighetsrelation innan protokollet fastställs.

### 21. Informationsestimator-standarden
*Ursprung: M §4.4. Korrigerad tre gånger innan den fick namn.*

Varje entropi-, entropitakt- eller MI-baserad statistik kräver:

**(a)** biaskorrigerad estimator; **(b)** matchat sampelantal mellan observation
och null (subsampling till minsta N); **(c)** permutations- eller modellnull med
identisk estimatorkedja; **(d)** rapporterat N och tillståndsantal, så att
mekaniska beroenden är synliga.

**Estimatorvalet ska vara en beslutsregel, inte en hårdkodad estimator:**
Miller–Madow är förstahandsval för diskreta tillståndsrum med måttligt K/N; vid
stort K/N är den otillräcklig och NSB eller Grassberger anges som alternativ.
Valet förregistreras.

**Uppfyllt av:** E §4.3 (transitionsmetriken), F §3.2 (Chapman–Kolmogorov),
M §4.2 (W_env).

### 22. Giltighet skild från utfall
*Ursprung: G §9, generaliserad.*

**En ogiltig mätning är inte ett nollresultat.** Sessioner som fallerar
kalibreringsbatteriet får egen klass och räknas aldrig i replikeringsstatistik åt
något håll: `G-cal-fail`, `QFD-cal-fail`, `ETR-cal-fail`, `Mermin-cal-fail`.

**Och det icke-exotiska men verkliga fyndet får egen adress** i stället för
papperskorgen: `H-env` (miljöförklarad händelse), `QFD-noneq` (klassisk
icke-jämvikt), `ETR-classical`, `D-struct`, `F-memory`, `M-memory`,
`B-classical`. Ett hedervärt utfall som saknar namn blir ett utfall man frestas
att omtolka.

### 23. Förtjänad nomenklatur
*Ursprung: B v0.2 Ä4, generaliserad.*

Ordet "quantum" eller "kvant" i en klassning kräver ett **faktiskt
icke-klassicitetsvittne**. Klassnamnet ska säga vad som bevisats, inte vad som
hoppas.

**På gate-model-hårdvara:** `C-hardware-consistent`,
`Mermin-hardware-consistent` — aldrig `C-strong`. Locality-,
freedom-of-choice- och detection-loopholes är alla öppna; resultatet är ett
kalibreringsmått, inte ett bevis mot lokal realism.

### 24. Kontrollens stabilitet är en mätning, inte ett antagande
*Ursprung: IBM-kampanjerna P0 och P1; syntes v1.1 §7.3.*

Armseparationsargumentet — *en instabil signal bredvid en stabil kontroll
lokaliserar variationen till fysiken snarare än till instrumentet* — såg ut som
metodologi. **P1 visade att det är en empirisk premiss.**

I P0 var kontrollen förenlig med konstans (χ² = 6,1, df = 6) och premissen höll.
I P1 förkastade kontrollvektorn konstantmodellen, med 83 % av instabiliteten i en
enda term.

**Regel:** varje nytt material måste visa kontrollens stabilitet innan argumentet
används. Slutsatsen får aldrig ärvas från ett tidigare material.

**Generaliseringen är katalogens mognaste lärdom:** ett resonemang som ser ut som
en princip kan vara en mätning. Detsamma gällde YXY-dominansen, felmodellens
betydelse och antagandet att en tom git-diff bevisar historik — fyra gånger såg
något generellt ut och visade sig materialberoende.

---

## Del D — Artefaktkataloger

### 25. Bedragarens kostymer
*Ursprung: syntes v1.0 §6.*

**Varje artefakt som fejkar åt signaturens håll ska identifieras, namnges och
antingen elimineras arkitektoniskt eller ingå i motståndaren — och dess
uppträdande i en signatur ska trigga sökning efter dess kostymer i alla andra.**

**Dödtiden, fem kostymer:** A (falsk antibunching i autokorrelation — elimineras
arkitektoniskt med korskorrelation), B (R_CS-vittnets nämnare), C
(koincidensräkningar), G-twin (räknevarians), F och M (ekon vid fasta
fördröjningar).

**Sampelbias i informationsskattare, tre kostymer:** E:s transitionsmetrik, F:s
CK-test, M:s ömsesidiga information. Ledde till konstruktion 21.

### 26. Förlustkänslighetsklassificeringen
*Ursprung: Rättelsenot R1 §7.*

Tre mekanismer som ofta sammanblandas:

**Ren förlust** (binomisk gallring): lämnar g²(0) **oförändrad** — täljare och
nämnare skalar båda som η². Kostar statistisk styrka, aldrig kontrast.
**Modutspädning**: ε_obs ≈ ε_källa/M, genuin utspädning, teckenbevarande.
**Bakgrund**: g²_obs − 1 ≈ s²·(g²_källa − 1), kvadratisk undertryckning.

**Klassificeringen avgör hur varje signatur budgeteras:**

| Klass | Vittnen | Förlustens roll |
|---|---|---|
| **L1** förlustinvarianta | A (g²), B-2 (R_CS) | Kostar takt, inte kontrast. Budgeteras i R. |
| **L2** förlustdegraderande | G (V, NRF), D_Q | Vakuum blandas in; kontrastfiende, linjär i η. |
| **L3** effektivitetskritiska | C (CHSH) | Tröskel — detektionsloopholen. Inte gradvis. |

**Konsekvens för A:** detektionseffektivitet är inte A:s fiende. Modantal och
bakgrund är. Instrumentprioriteringen vänds: modrenhet före kvanteffektivitet.

### 27. Arvsregeln och dess strängare fall
*Ursprung: B §12, med tillägg från syntes v1.1 §4.*

**Signaturer som delar rådata räknas aldrig som oberoende bekräftelse av
varandra.** B är datastommen; D, E och F bygger på B-kedjan. Ett enskilt
instrumentfel kan rösta i fyra signaturer och se ut som konvergerande evidens.

**Det strängare fallet:** D_Q och G-pol är inte två signaturer som delar rådata —
de är **samma vittne** under två namn. Arvsregeln täcker delad rådata; här är
vittnet självt delat. Redovisningsformen är öppen fråga för v1.2.

**Oberoendets ekonomi:** äkta oberoende kostar parallell instrumentering och
skrivs in i varje kampanjplan som budgetpost.

### 28. Rätt null för rätt datatyp
*Ursprung: BRYGGSPEC_IBM_CHSH §6.*

Nollhypoteser är inte utbytbara mellan datatyper.

**Kräver tidsstämplar:** time-slide, accidentals, koincidensfönster-variation,
dödtidsnullar. **Giltiga för shot-data:** label-shuffle inom settingpar,
stratifierad bootstrap, permutation av settingetiketter.

**Bindande underregel — uppfinn aldrig data.** Att syntetisera tidsstämplar för
att återanvända kod ger en analys vars nollhypoteser testar en fysik som inte
finns i materialet.

---

## Del E — Användning

### Hur biblioteket tillämpas

**Vid revision av en signaturrapport:** gå igenom Del A–D och kontrollera vilka
konstruktioner som är relevanta men saknas. Varje utelämnande ska vara ett
medvetet val med skäl, inte en förbiseelse.

**Vid ny signaturkandidat:** konstruktionerna 11, 15, 16, 19, 20, 22 och 23 är
obligatoriska redan i kandidatprotokollet. Det är den ordning QFD, ETR och MOM
följde.

**Vid ny kampanj:** 11, 12, 13, 17, 18 och 28 gäller från förregistreringen.

### Vad biblioteket inte är

Det ersätter ingen rapport och skapar inga nya regler. Varje konstruktion har
en ursprungskälla med bindande status, och den statusen är oförändrad.

Det är inte heller uttömmande. Konstruktioner som ännu bara finns i en rapport
och inte visat sig tvärgående hör inte hit — biblioteket ska vara litet nog att
läsas.

---

## Ändringslogg

2026-08-13 (v0.1): dokumentet upprättat som leverans 11 och första uppgift i
Fas 2. Konstruktionerna 1–15 från syntes v1.0 §7, 16–24 från syntes v1.1 §6.2,
25–28 tillagda som artefaktkataloger (bedragarens kostymer,
förlustkänslighetsklassificeringen, arvsregeln, rätt null för rätt datatyp) —
dessa fanns som tvärgående fynd i syntesen men saknade plats i den numrerade
listan.
