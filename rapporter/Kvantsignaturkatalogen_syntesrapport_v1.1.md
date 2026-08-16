# Kvantsignatur-katalogen — Syntesrapport

## Konsoliderad översikt, tvärgående fynd och väg framåt, version 1.1

*Status: konsolidering **före** v0.3-revisionen. `V03_INSTRUKTIONSDOKUMENT.md`
beslut 13 anger att syntes v1.1 skrivs sist, efter v0.3; detta dokument avviker
medvetet från den ordningen därför att IBM-kampanjernas lärdomar är färska och
kön av tvärgående fynd hunnit bli lång. Konsekvensen accepteras: när v0.3 är
klar krävs en v1.2 som införlivar revisionerna. Varje paragraf med bindande
status i en signaturrapport behåller sin status oförändrad.*

**Bygger på:** nio signaturrapporter v0.2, tre kandidatprotokoll (QFD v0.1,
ETR v0.0, MOM v0.0), partikelnot v1.0, rättelsenot R1, IBM-kampanjerna P0 och
P1 med tillhörande bryggspec, förregistrering, blockindelning, avvikelselista
och resultatrapport.

---

## 1. Vad som är nytt sedan v1.0

Syntes v1.0 skrevs när de nio rapporterna fanns i v0.1 och ingen rad kod hade
mött verklig kvantdata. Sedan dess har fyra saker hänt:

**Den externa granskningsrundan** förde samtliga nio rapporter till v0.2. Sju
fick korrigeringar av blockerande karaktär; en fick ett fysikfel rättat till ett
teorem (D:s trace-vittne); en fick sitt eget fundament externt verifierat
(G:s fasteorem). Rundan genererade därtill sju nya tvärgående standarder.

**Plattformen mötte hårdvara.** IBM-bryggan verifierades genom att katalogens
C-estimator reproducerade riktiga hårdvarudata exakt (S = 2,5317383, avvikelse
1,9·10⁻⁸ mellan två oberoende implementationer). Nio jobb i P0, sju
Mermin-sessioner, och en fullständig förregistrerad kampanj P1.

**Tre kandidater registrerades** med namnrymdskoder sedan enbokstavsnomenklaturen
uttömts: QFD (kvant-FDT), ETR (energitransfer i materia), MOM (momentmatris).

**Fyra lärdomar uppstod som inte fanns i någon rapport** utan i mötet mellan
dem och verkligheten: förlustkänslighetsklassificeringen, vektor-kontra-skalär,
armseparationens empiriska natur, och proveniensdisciplinen.

## 2. Arkitektur: två axlar, tre evidensklasser, en kandidatkö

### 2.1 De två axlarna (oförändrade)

**Axel 1 — icke-klassicitet i ljus och identiska partiklar:** A, B, C, D, E, F,
G, M. **Axel 2 — exotiska fält i materia:** H, katalogens enda strukturellt
oberoende gren och dess enda med färdiga teoretiskt definierade mål.

### 2.2 De tre evidensklasserna (oförändrade i princip, skärpta i språk)

**Klass I — vattentäta vittnen:** A (g²(0) < 1), B-2 (R_CS > 1), G (V < 1),
D_Q (λ_min(Σ_cal)/V_shot < 1). C står ovanför och utesluter alla lokala
dolda-variabel-modeller. **Klass II — strukturella signaturer:** B-0/B-1, D, E,
F-passiv, M-memory. **Klass III — ny fysik:** H.

**Skärpning i v1.1 — förtjänad nomenklatur som katalogregel:** ordet "quantum"
eller "kvant" i en klassning kräver ett faktiskt icke-klassicitetsvittne.
Regeln infördes i B v0.2 (femgradig skala där quantum kräver R-utfall) och
tillämpades därefter genomgående: D-fingerprint kontra D-quantum, F-memory
kontra F-strong-Q, M-memory kontra M-quantum-suspect. På hårdvara blev den
`C-hardware-consistent` och `Mermin-hardware-consistent` — aldrig `C-strong`,
eftersom locality-, freedom-of-choice- och detection-loopholes alla är öppna på
gate-model-hårdvara.

### 2.3 Kandidatkön (ny sedan v1.0)

Tre kandidater väntar på inträdesprov, samtliga med kandidatprotokoll,
K1-utfallsmatris, kanariefåglar och admissions-gate:

| Kod | Domän | Målklass | Särdrag |
|---|---|---|---|
| **QFD** | Kvant-FDT, nollpunktsgolv i jämvikt | Klass II | Avsade sig frivilligt Klass I efter källverifierad SED-invändning |
| **ETR** | Energitransfer, trösklar, sönderfallskaskader i materia | Klass II | Sönderfallsträdet T_ETR är dess unika spår |
| **MOM** | Momentmatriskriterier | ej fastställd | MOM-låset: förregistrerad minor före mätning |

**Namnrymdsbeslutet (2026-08-08):** enbokstavsnomenklaturen är uttömd. A–H och
M behålls som arv; nya typer får namnrymdskoder som prövas mot samtliga
befintliga symboler före användning. Kandidat I blev QFD (I kolliderade med
evidensklass I och identitetsmatrisen), J blev ETR (J kolliderade med D:s
invarianter J₁, J₂ᵗ, J₃ᵗ), föreslagen K blev MOM.

**QFD:s SED-degradering är rundans starkaste intellektuella handling.**
Kandidaten avsade sig Klass I-anspråk sedan det källverifierats att stokastisk
elektrodynamik — en klassisk teori med reellt nollpunktsfält av ħ-satt skala —
reproducerar nollpunktsgolvet, coth-formen och sidbandsasymmetrin för linjära
gaussiska system. N2e-nullen är konstruerad så att den per definition inte kan
slås; den verkar genom klasstaket. Skillnaden mot Klass II-syskonen B, D, E och
F är att QFD:s klasstillhörighet är **teoretiskt härledd i förväg** medan
syskonens upptäcktes empiriskt i efterhand.

## 3. Golvmönstret — med R1-korrigeringen

v1.0 identifierade tre sorters golv. Rättelsenot R1 skärper den första sorten
genom att skilja tre mekanismer som tidigare sammanblandades:

**Ren förlust (attenuering):** binomisk gallring lämnar g²(0) **helt
oförändrad** — täljare och nämnare skalar båda som η². Förlust kostar
statistisk styrka via minskad takt, aldrig kontrast.

**Modutspädning:** M oberoende moder i samma kanal ger ε_obs ≈ ε_källa/M.
Genuin utspädning, teckenbevarande.

**Bakgrund och mörkerräkning:** okorrelerade Poisson-händelser ger
g²_obs(0) − 1 ≈ s²·(g²_källa(0) − 1) — kvadratisk undertryckning i
signalandelen.

**Konsekvensen för A-Astro är gynnsam och kontraintuitiv:** detektionseffektivitet
är inte A:s fiende. Modantal och bakgrund är. En kandidat med usel
insamlingseffektivitet men låg modblandning och mörk himmel slår en med god
effektivitet och hög modblandning. Instrumentprioriteringen vänds: modrenhet
före kvanteffektivitet.

### 3.1 Förlustkänslighetsklassificeringen (ny, från R1 §7)

Generaliseringen förklarar en asymmetri som funnits i katalogen utan att ha
varit uttalad:

**L1 — förlustinvarianta vittnen.** Normaliserade korrelationskvoter: A (g²(0)),
B-2 (R_CS, kvot av förlustinvarianta storheter). Förlust kostar endast
statistisk styrka. Budgeteras i takt, inte i kontrast.

**L2 — förlustdegraderande vittnen.** Variansbaserade mått där vakuum blandas
in: G (V′ = ηV + (1−η)), G-twin (NRF), D_Q. Vittnesmarginalen krymper linjärt
i η; förlust är en äkta kontrastfiende.

**L3 — effektivitetskritiska vittnen.** C (CHSH): utan tillräcklig total
detektionseffektivitet kan detektionsloopholen inte stängas. Förlust är inte
gradvis utan avgörande.

Klassificeringen förklarar varför A och B-2 är mätbara på ljus man knappt fångar
medan G och C kräver att man fångar det mesta — och den ska anges explicit i
varje signaturs kontrastbudgetavsnitt i v0.3.

## 4. Arvsregeln och dess strängare fall

**Arvsregeln (oförändrad):** signaturer som delar rådata räknas aldrig som
oberoende bekräftelse av varandra. B är datastommen; D, E och F bygger på
B-kedjan, och E:s features är bokstavligen B:s objekt.

**Ett strängare fall har identifierats (öppen fråga till v0.3):** D_Q och G-pol
är inte två signaturer som delar rådata — de är **samma vittne** under två namn.
D äger invariansfrågan över sessioner, G äger vittnesdefinition och
kalibreringskedja, men storheten λ_min(Σ_cal)/V_shot är identisk. Arvsregeln
täcker delad rådata; här är vittnet självt delat. Syntes v1.2 måste klargöra hur
D och G redovisas så att de aldrig kan läsas som två oberoende Klass I-vittnen.

## 5. Bedragarens återkomster

**Dödtiden** återkom i fem signaturer, varje gång i ny kostym: A (falsk
antibunching i autokorrelation), B (R_CS-vittnets nämnare), C
(koincidensräkningar), G-twin (räknevarians), F och M (ekon vid fasta
fördröjningar).

**Katalogprincipen står fast:** varje artefakt som fejkar åt signaturens håll
ska identifieras, namnges och antingen elimineras arkitektoniskt eller ingå i
motståndaren — och dess uppträdande i en signatur ska trigga sökning efter dess
kostymer i alla andra.

**Ny bedragare med samma karaktär: sampelbias i informationsskattare.**
Korrigerad tre gånger — E:s transitionsmetrik, F:s Chapman–Kolmogorov-test,
M:s ömsesidiga information — med samma åtgärd varje gång. Det ledde till
informationsestimator-standarden (§6).

## 6. Metodbiblioteket — kraftigt utökat

v1.0 formaliserade femton konstruktioner. v1.1 lägger till nio.

### 6.1 Från v1.0 (oförändrade)

Matchat filter med teckendiskriminator (A); tvådelad inferens (C); p⁽²⁾-regeln
(H); min-gate över pelare (H); modellfamilje-null (M:s N0–N4, ålagd F); mätbar
null (G); drift-null på latenter (E:s S5-E); förregistrering med blint hold-out
(E); mode-lås (H); hård replikeringsgate med metakombination (H); scorecard och
trafikljus (M); injection/ROC-krav; S3-minnesspektroskopi (F);
Heisenberg-bokföring (G); kontrastkrav (D).

### 6.2 Nya i v1.1

**16. Förtjänad nomenklatur.** Ordet quantum i en klassning kräver ett faktiskt
vittne. Genomförd i samtliga v0.2-rapporter och i hårdvaruklassningen.

**17. Gate-familjen.** Admissions-gater med identisk bandstruktur (< 1 ej
målbar; 1–3 svag; > 3 möjlig; > 10 prioriterad): G_A (kontrastbudget), G_B
(depolarisationsbudget), G_C (parbudget), G_F (svansbudget), G_G
(kalibreringsbudget), G_QFD, G_ETR. **H:s inverterade gate** är
känslighetsvolymkartan: där syskonen frågar "når vi målet?" frågar H "var i det
garanterat existerande parameterrummet är sökandet billigast?"

**18. Kanariefågel-principen.** Varje pipeline ska bära minst en injektion som
är konstruerad för att *avslöja pipelinens opålitlighet*, inte dess funktion.
Sex signaturer har nu var sin: C:s p = 0,70 (strax under Bell-gränsen), E:s
AR(1)-driftinjektion, F:s dämpade klassiska oscillator, G:s avsiktliga
kalibreringssabotage, H:s långsamma front, M:s parningsshufflade data. QFD har
fem, varav SED-raden är den skarpaste: klassas den som quantum har protokollet
misslyckats i sin helhet.

**19. Oavgjort tillfaller nollan.** Vid informationskriterie-oavgjort mellan
signalmodell och klassisk familj vinner den klassiska. Formulerad i F v0.2,
gäller katalogbrett.

**20. Omöjlighetsdetektor-familjen.** Där fysiken erbjuder en omöjlighetsrelation
ska den mätas som inbyggd lögndetektor. Fyra medlemmar: RF_heisenberg
(V_min·V_max < 1, G), RF_stokes_bound (ΣVar(S_i) < 2⟨S₀⟩, D — härledd ur
operatoridentiteten Ŝ₁²+Ŝ₂²+Ŝ₃² = Ŝ₀(Ŝ₀+2)), RF_negative_occupation (n̄ < 0
utan inversion, QFD), RF_energy_balance (ΣQ_i > 1 utöver lagerfrigöring, ETR).

**21. Informationsestimator-standarden.** Varje entropi-, entropitakt- eller
MI-baserad statistik kräver (a) biaskorrigerad estimator, (b) matchat
sampelantal mellan observation och null, (c) permutations- eller modellnull med
identisk estimatorkedja, (d) rapporterat N och tillståndsantal. v0.3 ska ersätta
"biaskorrigerad estimator" med en **beslutsregel för estimatorval** — Miller–Madow
vid måttligt K/N, NSB eller Grassberger vid stort K/N, valet förregistrerat.

**22. Giltighet skild från utfall.** En ogiltig mätning är inte ett nollresultat.
Egna klasser: G-cal-fail, QFD-cal-fail, ETR-cal-fail, Mermin-cal-fail. Och det
icke-exotiska men verkliga fyndet får egen adress i stället för papperskorgen:
H-env, QFD-noneq, ETR-classical, D-struct, F-memory, M-memory.

**23. Konsistens är inte preferens.** En modell som är *förenlig* med data har
inte visat något; den måste vara *föredragen* framför alternativet. Fällde två
gånger: C:s surrogat-p (som testade "finns korrelation?" i stället för "bryts
gränsen?") och H:s frontfit (där fyra frontparametrar ger noll
residualfrihetsgrader vid N ≤ 4, så konsistens är gratis).

**24. Skalär sammanfattning bär inte vektorpåstående.** När den förregistrerade
observabeln är vektorvärd får ett test på summan aldrig ensamt bära
stabilitetsbeslutet. Se §7.2.

## 7. Hårdvarumötet — vad IBM-kampanjerna lärde

Detta avsnitt saknar motsvarighet i v1.0 och är kapitlets tyngdpunkt: katalogens
första möte med data som inte vet vad den borde svara.

### 7.1 Vad som verifierades

**Bryggan.** Katalogens C-estimator reproducerade hårdvarudata exakt
(S = 2,5317383 ± 0,0241785, avvikelse ~2·10⁻⁸ mellan två oberoende
implementationer). Anmärkningsvärt: **ingen ny estimator behövdes.**
`computeS(pairs)` var redan pardirekt; bara pargenereringen var
tidsstämpelbaserad. C-kärnan visade sig instrumentagnostisk, vilket inte var
givet.

**Kalibreringen mot ett känt positivt.** CHSH gav 22σ över den klassiska
gränsen, Mermin N=3 gav M upp till 3,85 (96 % av kvantmaximum), GHZ-koherens
0,957 (N=3) och 0,916 (N=5) — och den separabla kontrollen gav samtidigt
E ≈ 0 och M ≈ 1. Pipelinen skilde kvantkorrelation från klassisk statistik i
verklig, brusig data utan falsklarm på kontrollen. Det är licensen katalogen
saknade: ett framtida nollresultat betyder nu "inget fanns där" och inte "vi vet
inte om verktyget fungerar".

**Tidsaxelkartläggningen.** Av nio signaturer fungerar **C** direkt på
gate-model-shots. **D** går delvis (som metod, inte som kodad estimator).
**A, B, E och F faller alla på samma sak: ingen tidsaxel** — F renast, eftersom
hela observabeln *är* en funktion av τ. **G** faller på instrumentklass
(utfallsrummet är {0,1}, inte ℝ). **H** kräver geografiskt separerade noder.
**M** faller på experimentdesign, inte datatyp — den är den enda av de sju som
är åtkomlig utan att byta instrument, med delay och mid-circuit-operation.

Fyra av nio signaturer förutsätter alltså tidsupplöst detektion, inte bara
statistik. Det är en utsaga om katalogens räckvidd som ingen simulering kunde ha
gett.

### 7.2 Vektor kontra skalär

Mermin-serien testades både som skalär M och som korrelatorvektor
(E_XXX, E_XYY, E_YXY, E_YYX). I P0 bar YXY-termen 40 % av vektorns χ² — helt
osynligt i skalär M. I P1 hade dominansen sjunkit till 23,3 %; den
**replikerades inte**, vilket är utsagan datan bär (8 körningar mot 7, annan
tidsperiod, annan kalibreringscykel räcker inte för att skilja en försvunnen
egenskap från en som varierar långsammare än mätfönstret).

Det starkaste enskilda beviset kom från kontrollarmen i P1: **vektortestet
förkastar konstantmodellen (χ² = 87,1, df = 28) medan skalär M över hela serien
är förenlig med konstans (χ² = 38,9, df = 33).** Samma kontroll, samma data,
motsatt dom — termerna kompenserar varandra i summan.

Detta är principen i §6.2 punkt 24, och den gäller lika mycket för kontroller
som för signaler.

### 7.3 Armseparationen är en empirisk premiss, inte en metodprincip

P0 gav argumentet: en instabil signal bredvid en stabil kontroll lokaliserar
variationen till fysiken snarare än till instrumentet eller analysen. Det såg ut
som metodologi.

**P1 visade att det är en mätning.** I P0 var kontrollen förenlig med konstans
(χ² = 6,1, df = 6) och premissen höll. I P1 förkastade kontrollvektorn
konstantmodellen, med 83 % av instabiliteten i ⟨XXX⟩_ctrl — den kanal som
fungerar som proxy för gemensam multiplikativ paritetsattenuering.

Slutsatsen står kvar för P0-materialet men **får aldrig antas**. Varje nytt
material måste visa kontrollens stabilitet innan argumentet används. Ett
resonemang som såg ut som en princip visade sig vara en empirisk premiss — och
det upptäcktes bara för att P1 mätte samma sak igen.

**Katalogregel:** kontrollens stabilitet är en mätning, inte ett antagande.

### 7.4 Felmodellen avgör slutsatsen

P1:s primärutfall blev inkonklusivt (Δ̄ = +0,0359 ± 0,0234, t = 1,533, df = 4,
p = 0,100 mot tröskeln 0,00135). De två giltiga paren pekade åt **motsatta håll**
(−0,0713 och +0,1465); Δ̄ var medelvärdet av två motstridiga observationer, inte
en svag gemensam effekt.

Det avgörande: med ren shot-brusvarians hade σ(Δ̄) blivit **3,2 gånger mindre**
och Z = 2,84 — nära det ursprungliga kriteriet, och trivialt att presentera som
"nästan signifikant". Den förregistrerade felmodellen (σ̂²_extra ur
replikatdifferenser) förhindrade att mellan-körningsvariation behandlades som
ren shot noise.

**Många shots är inte hög säkerhet om hårdvarutillståndet självt varierar mellan
körningar.** Skillnaden mellan ett inkonklusivt och ett överdrivet resultat låg i
en formulering nedskriven innan någon visste vad den skulle göra.

### 7.5 Proveniensdisciplin — innehåll i tid räcker inte

Tre gånger under P1 skapades innehållet i rätt tid medan den kryptografiska
bevisningen brast: förregistreringen (skriven före kampanjstart, committad efter
par 1), §S2:s orsak (händelse 7 aug, dokumenterad 9 aug), schemadokumentet
(skrivet 10 aug enligt filstämpel, committat 13 aug — dess egen ändringslogg
påstod commit 9 aug, vilket falsifierades av reflogen).

Konsekvensen är inte att besluten var fel — allt tyder på motsatsen — utan att
de **inte går att belägga med den styrka protokollet gör anspråk på**.

Men den kedja som verkligen betydde något höll: blockindelningen fastställdes
blint ur `execution_span` utan ett enda M-värde och committades 4,5 timmar före
primäranalysen, kryptografiskt verifierbart. Det är den enda ordning som kunde
ha korrumperat primärutfallet.

**Katalogregel:** commit ska ingå i samma rutin som körningen. Ett dokument som
skrivits i tid men committats i efterhand är svagare bevis än ett som aldrig
skrevs — därför att det inbjuder till att tro att disciplinen var starkare än
den var.

### 7.6 Kodfrysning

P1 föreskrev att instrumentet (`run_mermin.py`) inte fick ändras under
kampanjen. Regeln överträddes: hämtnings- och journalfunktionalitet byggdes in
under pågående kampanj. Överträdelsen upptäcktes, instrumentet återställdes
bitidentiskt, och inga kampanjmätningar har identifierats som producerade med
den modifierade versionen.

**En senare tom diff bevisar återställning, inte obruten historik.** Avvikelsen
står kvar i listan. Lärdomen är arkitektonisk: funktionalitet som behövs under
en kampanj ska ligga i separata skript (`fetch_job.py`, `journal_finalize.py`),
aldrig i det frysta instrumentet.

## 8. C/G-labbet — trovärdighetsnavet, nu med fem medlemmar

v1.0 identifierade fyra signaturer som pekade mot samma fysiska plats. Med
kandidaterna är den interventionella familjen: **C** (SPDC-par), **G**
(OPO-squeezing), **F-aktiv** (preparerade prober), **M** (ekoprotokoll och
W_env), **QFD** (jämviktens fluktuation–respons, delar mätkedja med G),
**ETR** (stark drivning över trösklar).

QFD och ETR är komplementära i drivstyrka: QFD mäter jämviktens linjära regim,
ETR den icke-linjära drivna. SED-domen över QFD pekar ut exakt varför —
kvantfenomen bortom klassiskt nollpunktsfält kräver icke-linjäritet, vilket är
ETR:s hemvist.

**Principen står oförändrad:** en katalog vars pipelines aldrig sett ett äkta
positivt är okalibrerad per definition. IBM-arbetet är det första steget på den
vägen, men gate-model-hårdvara ersätter inte C/G-labbet — den täcker en av nio
signaturer.

## 9. Måltavlan och simuleringsstatus

**Måltavlan är oförändrad:** sju av nio signaturer avslutar sin rapport med
samma sorts fråga — protokollet är färdigt, var finns källan? Frågorna är
teoriuppdrag, inte instrumentfrågor, och R1 har skärpt A:s: leta inte efter
ljusstarka källor, leta efter **modrena**.

**Simuleringsstatus har fått ett tredje lager.** v1.0 skilde kodvalidering från
evidens. Nu finns tre nivåer: (i) simuleringar som reproducerar läroboksvärden
(S = 2,828 är Tsirelson) — kodvalidering; (ii) simuleringar med realistisk
brusprofil — pipelinevalidering; (iii) verklig hårdvarudata med känt facit —
kalibrering. Endast (iii) ger licensen att tolka ett nollresultat.

## 10. Öppna frågor

Dessa ska avgöras i v0.3 eller v1.2 och står här för att inte tappas bort:

**10.1 D_Q ≡ G-pol.** Samma vittne under två namn. Redovisningsformen måste
klargöras så att de aldrig kan läsas som två oberoende Klass I-vittnen (§4).

**10.2 Mermin–Peres kontra Leggett–Garg.** Granskningen avvisade Mermin–Peres
på tillämpbarhetsgrund (sekventiella kommuterande mätningar går inte på passiv
stråle) men rekommenderade Leggett–Garg med argumentet att den kringgår
par-golvet. **Samma argument gäller ordagrant för Mermin–Peres**: båda är
enskilda-system-vittnen utan separationskrav, båda har ett kvarvarande hål av
samma slag (MP: kompatibilitet/disturbance; LG: clumsiness). Att döma dem olika
saknar motivering — antingen prövas båda mot unikhetskriteriet på lika villkor,
eller avvisas båda. Oavgjord.

**10.3 Namnrymdskollision i E.** Metrikfamiljen (G) kolliderar med signaturtyp
G i en katalog där G-pol, G_G och G_F alla är etablerade. Föreslagen
omdöpning: (DIM) effektiv dimension, (GEN) hold-out-generalisering, (COD)
kod-likhet. Frigör samtidigt L och K.

**10.4 Avslagsnoten saknas som dokumenttyp.** Fyra IBM-inspirerade förslag har
avvisats utan att skälen dokumenterats i katalogen. Värdet av att pröva högt och
lågt ligger inte i att anta svaga kandidater utan i att **dokumentera avslagen**
med skäl, källor och återöppningsvillkor, så att samma förslag inte utreds från
noll om två år.

**10.5 Hash-anomali i P0-fixtur.** `hw_shotrecords_20260802T053539Z` har
removedCount = 0 men avvikande hash — sannolikt re-serialisering, ej verifierat.

## 11. Väg framåt

**Fas 0 — v0.3-revisionen (pågående).** Verifieringspass först (Fas 1 i
`V03_INSTRUKTIONSDOKUMENT.md`), sedan revidering. V-regeln gäller: ingen ändring
på overifierad referens. Två verifieringar är klara (LIGO-squeezingreferensen,
processtensorreferensen).

**Fas 1 — blockerande kodfixar** enligt v1.0 §11, kompletterade med
back-portering av metodbiblioteket punkt 16–24.

**Fas 2 — nollmaskiner och injection/ROC** med p⁽²⁾-disciplin och
kanariefågel i varje pipeline.

**Fas 3 — C/G-labbet**, nu med sex medlemmar i den interventionella familjen.

**Fas 4 — kandidaternas inträdesprov.** QFD:s K1-matris med SED-raden som
avgörande; ETR:s Lorentz-, barriär- och fri-kinetik-rader; MOM:s rad 6.

**Fas 5 — fältprogram med definierade mål:** H mot svagaste publicerade gränser,
A:s intensitetsinterferometri med modrenhetsbudget enligt R1.

**Fas 6 — teoriuppdraget.** Måltavlans frågor besvaras eller begravs med siffror.

## 12. Programmets epistemiska självförståelse

v1.0 formulerade svaret på födelsefrågan i tre lager: det som "saknas" för att
förutbestämma en händelse är information som är *utspädd*, *strukturellt
oåtkomlig* eller *omflyttad*, med kvantindeterminismen som fjärde lager där
ingen dold variabel finns att sakna.

v1.1 lägger till en fjärde sorts insikt, och den kom från hårdvaran: **det som
ser ut som en princip kan vara en mätning.** Armseparationen var det tydligaste
fallet, men mönstret återkom: att kontrollen är stabil, att YXY dominerar, att
felmodellen bara är en formalitet, att en tom git-diff bevisar historik. Varje
gång såg något generellt ut och visade sig vara materialberoende.

Det är kanske programmets mognaste lärdom. Katalogen byggdes för att fråga vad
som skulle kunna fejka ett fynd. Den har nu lärt sig att ställa samma fråga om
sina egna metodargument — och att svaret ibland är att de gäller, men bara här,
bara nu, bara i detta material.

## 13. Slutsats

Kvantsignatur-katalogen har sedan v1.0 gått från nio granskade protokoll till
nio granskade protokoll som mött verklighet. Bryggan håller: katalogens
estimator reproducerar hårdvarudata exakt. Kalibreringen är gjord: pipelinen
skiljer kvantkorrelation från klassisk statistik med en negativ kontroll bredvid.
Räckvidden är kartlagd: fyra av nio signaturer kräver en tidsaxel som
gate-model-data inte har.

Och metodbiblioteket har vuxit med nio konstruktioner, varav de fyra viktigaste
föddes ur misstag som upptäcktes: förlustinvariansen ur ett golden test som mätte
något som inte inträffar, vektorprincipen ur en term som var osynlig i summan,
armseparationens reservation ur en kontroll som slutade vara stabil,
proveniensdisciplinen ur tre dokument som skrevs i tid och committades för sent.

Katalogens viktigaste resultat är fortfarande inte en signatur. Det är att den
byggde en standard där ett framtida fynd kommer att förtjäna att bli trott — och
att den nu också har mätt sig själv mot verklig data och funnit både att
standarden håller och exakt var den inte gör det.
