# Kvantsignatur-katalogen — Syntesrapport

## Konsoliderad översikt, tvärgående fynd och väg framåt, version 1.0

*Status: utkast för intern granskning. Bygger på de nio signaturrapporterna A, B, C, D, E, F, G, H och M (samtliga v0.1, konsoliderade) och redovisar det som ingen enskild rapport kunde se: mönstren över katalogen. Syntesen upprepar inte rapporternas innehåll utan refererar det; varje paragraf med bindande status i en signaturrapport behåller sin status oförändrad.*

---

## 1. Vad katalogen är

Kvantsignatur-katalogen är ett program för att avgöra, med förregistrerad statistik och fientligt testade nollhypoteser, om uppmätt ljus eller materia bär signaturer som ingen klassisk modell kan förklara — och att göra det utan att någonsin lura sig själv. Programmet föddes ur en filosofisk fråga: vad saknas för att förutbestämma en händelse, och lämnar det som sker läsbara spår? Katalogen är den frågans operationella form: nio signaturtyper, var och en med definition, matematisk form, instrumentkrav, artefaktlista, surrogatmaskin, klassningsregler och en ärligt redovisad begränsning.

Granskningsarbetet har omfattat samtliga nio signaturer, producerat korrigeringar av blockerande karaktär i sju av dem, stängt programmets äldsta öppna anomali (D:s variansgåta), löst två bokstavskollisioner (squeezing → G; sensornätverket → H), och etablerat ett tvärgående metodbibliotek. Ingen signatur lämnade granskningen oförändrad; ingen lämnade den dödförklarad.

## 2. Katalogens arkitektur: två axlar, tre evidensklasser

### 2.1 Två axlar

**Axel 1 — icke-klassicitet i ljus (och identiska partiklar):** A, B, C, D, E, F, G, M. Frågan är om det uppmätta systemets statistik, korrelationer, dynamik eller spår kräver kvantmekanik.

**Axel 2 — exotiska fält i materia:** H. Frågan är vad vakuum innehåller, mätt som korrelerade avtryck i ett nätverk av kvantinstrument. H delar ingen rådata, instrumentkedja eller kalibrering med axel 1 och är katalogens enda strukturellt oberoende gren — samt dess enda med färdiga, teoretiskt definierade mål.

### 2.2 Tre evidensklasser

**Klass I — vattentäta vittnen.** Storheter vars klassiska gräns är en olikhet, inte en tolkning: A (g²(0) < 1), B-2 (R_CS > 1), G (V < 1) och D-Q/G-pol (Stokes-varians under skottbrusgränsen). Alla fyra är projektioner av samma matematiska faktum — ingen blandning av koherenta tillstånd (positiv P-funktion) kan producera dem — mätta genom fyra olika instrumentkedjor. Ovanför dem står C (CHSH), som utesluter en ännu större klass: alla lokala dolda-variabel-modeller.

**Klass II — strukturella signaturer.** B-0/B-1 (polarisation–tid-struktur), D (invariant identitet), E (lågdimensionell kod-likhet), F-passiv (minnesdynamik) och M-classical (rekonstruerbart minne). Samtliga är kvantneutrala: de detekterar struktur, identitet, kompression och minne som klassisk fysik också producerar. Deras kvantinnehåll är villkorat — det kräver ett samtidigt klass I-vittne från *disjunkt detektorkedja* (arvsregeln, §5) eller sin aktiva laboratorieform (F-aktiv, M:s Q-lager).

**Klass III — ny fysik.** H, som inte mäter kvant/klassiskt utan fältinnehåll i vakuum. Taxonomiskt egen, metodologiskt katalogens höjdpunkt.

Denna klassindelning är syntesens viktigaste ordningsprincip: katalogens tidiga material tenderade att behandla alla signaturer som likvärdig "kvantevidens", och en stor del av granskningsarbetet bestod i att sortera dem ärligt. En klass II-signatur som presenteras som kvantbevis är programmets största trovärdighetsrisk; en klass II-signatur som presenteras som det den är — struktur, identitet, minne — är god vetenskap.

## 3. Signaturöversikt

| Sign. | Namn | Klass | Vittne/kärnobjekt | Golv (§4) | Granskningens huvudkorrigering |
|---|---|---|---|---|---|
| A | Fotonstatistik | I | g²(0) < 1, S_A-familjen | Kontrast (modutspädning) | Korskorrelationskrav; Δ_anti-bugg; kontrastbudget |
| B | Polarisation–tid | II / I (B-2) | g²_ab-matris, C_ij; R_CS | Depolarisation; dödtid i R-nämnaren | Dödtidsfri nämnare; S2-bugg; teorem om Mueller-mixing |
| C | Bell/CHSH | I+ | S > 2, synlighet V > 1/√2 | Par-golvet (dubbel rymdvinkel) | Tvådelad inferens; synlighets- ej formkriterium; klassisk motståndare |
| D | Stabil invariant | II | λ̃-spektrum, χ²_const; D-Q | Instrument-invariantens ogenomtränglighet | Anomalin stängd; d = 2-redundans; kontrastkravet K_D |
| E | Kod-lik lågdim. | II | d_eff, hold-out-RE, kodentropi | Kompression är klassisk vardag | Drift-nullen S5-E; stressmoduler omklassade; vittne via disjunkt kedja |
| F | Non-Markovianitet | II / I (aktiv) | Revival-mallar, semigrupptest; BLP/RHP (aktiv) | Flicker; fotonbudget i svansen | Passiv/aktiv-klyvning; modellfamilje-null |
| G | Squeezing | I | V < 1, NRF < 1, Heisenberg-produkt | Fasmedelvärdning; kalibreringsbudget | Treformsklyvning; mätbar vakuumnull; RF_heisenberg |
| H | Fältavtryck i sensornät | III | Nätverkskoherens, K_i-mönster, CMC | Vandrande miljöfront | Tvåskiktsinferens; RF_slow_front; S4e |
| M | Minnes-/eko | II | E* (eko), W_env (darwinism) | Initialkorrelationer; klassiska ekon | Demarkation mot F; W_env-pelaren; prepareringsrandomisering |

## 4. Golvmönstret — katalogens första tvärgående fynd

Varje signatur visade sig ha ett *golv*: en begränsning som inte är statistisk utan fysikalisk eller strukturell, och som ingen mängd data trollar bort. Golven är av tre sorter, och sorten avgör vad som kan göras åt dem.

**Utspädningsgolv (teckenbevarande):** A:s modutspädning (ε = 1/M), B:s depolarisation, G-twins förlust (V′ = ηV + 1 − η). Signaturen krymper men ljuger aldrig åt fel håll — och kan därför attackeras med parallellisering (spektral multiplexering, arrayer) och kalibreringsprecision. Dessa golv är budgetproblem: dyra men förhandlingsbara.

**Struktur- och raderingsgolv (icke förhandlingsbara):** C:s par-golv (koincidenser kräver par som aldrig anländer parvis), G-kvadraturs fasmedelvärdning ((V + 1/V)/2 ≥ 1 — signaturen raderas matematiskt), D:s instrument-invariant (statistik kan inte skilja källans identitet från instrumentets), E:s kompressionsneutralitet (låg dimension är naturens normaltillstånd). Dessa golv flyttar signaturens hem: från teleskopet till laboratoriet, eller från evidens till karakterisering.

**Motståndargolv (kräver rätt fiende):** F:s flicker (klassiskt långminne finns i varje detektor), H:s vandrande front (miljön producerar äkta fördröjda korrelationer), M:s initialkorrelationer (falskt minne som fanns från början). Dessa golv besegras inte utan *modelleras*: motståndaren måste innehålla dem, annars är varje detektion en detektion av golvet.

Golvmönstrets slutsats är programmets mognadsmärke: en signatur utan redovisat golv är inte optimistisk, den är ogranskad.

## 5. Arvsregeln och oberoendets ekonomi

B är katalogens datastomme: D, E och F bygger på B-kedjans rådata, och E:s features är bokstavligen B:s objekt. Därav arvsregeln (B §12, bindande i hela katalogen): **signaturer som delar rådata räknas aldrig som oberoende bekräftelse av varandra.** Ett enda instrumentfel — en crosstalk-artefakt, en dödtidseffekt — kan rösta i tre, fyra signaturer samtidigt och se ut som konvergerande evidens. Regeln biter hårdast i E, vars strong-nivå per definition kräver externt vittne: vittnet måste komma från disjunkt detektoruppsättning och separat kalibreringskedja, annars är korsbekräftelsen cirkulär.

Oberoendets ekonomi är därmed katalogens dyraste valuta: äkta oberoende kostar parallell instrumentering, och syntesbeslutet är att detta skrivs in i varje framtida kampanjplan som budgetpost, inte som fotnot. H är undantaget som bekräftar regeln — dess totala rådataseparation från axel 1 är exakt vad strukturellt oberoende ser ut som.

## 6. Bedragarens återkomster — dödtiden genom katalogen

Ett enskilt instrumentfenomen återkom i fem signaturer, varje gång i ny kostym: **detektordödtiden.** I A fejkar den antibunching i autokorrelation (falsk kvantsignatur, elimineras arkitektoniskt med korskorrelation). I B sitter den i R_CS-vittnets nämnare — autokorrelationerna vid τ = 0 — och blåser upp kvoten åt det farliga hållet (kräver detektorsplitting eller modellextraktion). I C förvränger den koincidensräkningarna och ingår i motståndarens instrumentlager. I G-twin komprimerar den räknevarians och fejkar sub-skottbrus. I F och M producerar den ekon vid fasta fördröjningar som imiterar minne.

Lärdomen är generell och upphöjs till katalogprincip: **varje artefakt som fejkar åt signaturens håll ska identifieras, namnges och antingen elimineras arkitektoniskt eller ingå i motståndaren — och dess uppträdande i en signatur ska trigga sökning efter dess kostymer i alla andra.** Dödtiden fick fem rapportparagrafer; nästa bedragare ska få sin första paragraf snabbare.

## 7. Metodbiblioteket — vad katalogen lärde sig av sig själv

Granskningen avslöjade en lärandekedja: konstruktioner uppfanns i en signatur, förfinades i nästa och back-porteras nu till alla. Syntesbeslutet är att formalisera dem som katalogens metodbibliotek, obligatoriskt vid varje v0.2-revision:

**Inferens.** (1) *Matchat filter med teckendiskriminator* (A §6): optimal linjär statistik över förregistrerat fiducialfönster, där artefakter och utspädning aldrig kan byta tecken på vittnet. (2) *Tvådelad inferens* (C §4.3): primärtestet mäter avstånd till den klassiska gränsen i osäkerhetsenheter; surrogat och motståndare bär den separata rollen att visa att pipelinen inte klassiskt kan nå över gränsen. Denna åtskillnad — mellan "är effekten där?" och "kan vi ha tillverkat den?" — visade sig felhanterad i tre signaturer och är bibliotekets viktigaste post. (3) *p⁽²⁾-regeln* (H §4.1): varje vittne ska slå minst två oberoende nullfamiljer; ingen enskild snäll null får bära ett fynd. (4) *Min-gate över pelare* (H): ett spår bärs av sin svagaste komponent.

**Nollhypoteser.** (5) *Modellfamilje-null* (M:s N0–N4, ålagd F): nollan är en klass med stigande förklaringsstyrka, aldrig en punkt, och långminnesmedlemmen (flicker) är obligatorisk där tidsstruktur mäts. (6) *Mätbar null* (G §6.1): där nollan kan mätas i stället för simuleras (vakuumreferens) är den primär. (7) *Drift-null på latenter* (E:s S5-E): kompressions- och kodmått jämförs mot AR/OU-fittade banor, inte bara mot strukturförstörda surrogat.

**Disciplin.** (8) *Förregistrering + blint hold-out* (E §5, katalogens bästa): schema, trösklar, fönster och d* låses innan data ses; test förblir blint tills pipelinen fryst. (9) *Mode-lås* (H §3.4): spårval fryses vid baseline; nya moder tillkommer per förregistrering, aldrig per flip. (10) *Hård replikeringsgate med metakombination* (H §8): confirm-runs över sessioner, Fisher/Stouffer-kombinerat p. (11) *Scorecard och falsklarmstrafikljus* (M v0.2): kvantifierad robusthet 0–20 p och riskklassning per resultat. (12) *Injection/ROC-krav* (samtliga): varje pipeline ska bevisa att den återfinner injicerad känd signal utan falsklarm på nollinjektion, med publicerad detektionskaraktäristik — och för klass I-vittnen ska injektionen vara *fysisk* (§8).

**Diagnostik.** (13) *S3-minnesspektroskopi* (F §5.3): blockstorlekssteget som icke-parametrisk skattare av minnesskala. (14) *Heisenberg-bokföring* (G §7): där fysiken erbjuder en omöjlighetsrelation ska den mätas som inbyggd lögndetektor. (15) *Kontrastkrav* (D §5.2): stabilitet räknas endast när omgivningen bevisligen rörde sig.

## 8. C/G-labbet — den interventionella familjen och trovärdighetsnavet

Granskningens kanske viktigaste strategiska konvergens: fyra signaturer pekade oberoende mot samma fysiska plats. C behöver en SPDC-parkälla (enda stället äkta sanna positiva finns på beställning), G behöver en OPO/squeezing-källa (samma hårdvaruklass), F-aktiv behöver prepararbara probtillstånd, och M behöver ekoprotokoll med kontrollerad preparation. **C/G-labbet** — med F-aktiv och M som medlemmar i den interventionella familjen — blir därmed katalogens trovärdighetsnav: platsen där varje pipeline möter verklig kvantdata, där Werner-p-svep och förlust/fas-degradering ger fysiska ROC-kurvor, och där klass II-signaturernas externa vittnen kan produceras på disjunkta kedjor. Principen är enkel och obönhörlig: **en katalog vars pipelines aldrig sett ett äkta positivt är okalibrerad per definition.** Labbet är därför inte ett sidoprojekt utan förutsättningen för att något fältfynd någonsin ska betyda något.

## 9. Den gemensamma måltavlan — katalogens ärligaste dokument

Sju av nio signaturer avslutade sin rapport med samma sorts öppna fråga: protokollet är färdigt, men var finns källan? Syntesen samlar dem som katalogens gemensamma måltavla, ty de är teoriuppdrag, inte instrumentfrågor:

A: finns astrofysikaliska processer med ε < 0 vid källan och ε/M-kvot över kontrastgolvet? B: finns källor med R_CS > 1 som överlever depolarisation? C: finns någon parproduktionsmekanism med icke-försumbar dubbel aperturträff? E: finns naturliga processer med diskret, transitionsstrukturerad kod bortom drift? F: finns källor med minnesstruktur på mätbara tidsskalor och amplitud över svansbudgeten? G: finns tvillingstrålekällor med NRF-budget som överlever propagation? M: finns naturliga miljöfragment med hög läsbar redundans?

D:s fråga är spegelvänd (finns stabil invariant som *inte* är instrumentet?), och H är undantaget som definierar kontrasten: H har publicerade mål och frågar i stället var i parameterrummet sökandet lönar sig. Syntesens dom är därför strategisk: **axel 1:s kortsiktiga värde ligger i laboratoriet och metodexporten; axel 2 (H) och A:s intensitetsinterferometri-spår är de enda fältprogram som i dag har definierade, finansierbara mål.** Måltavlan är samtidigt programmets starkaste vetenskapliga försvar: ett program som kan formulera exakt vad som skulle göra det meningsfullt är falsifierbart på riktigt.

## 10. Simuleringsstatus — en rättvisans inventering

Samtliga tidiga simuleringsresultat har nu fått sin ärliga status. CHSH S = 2,828: Tsirelsons gräns, kodvalidering (C §4.4). B:s H/V-topp: klassiskt reproducerbar via Siegert, kodvalidering (B §3). D:s variansanomali: löst — den gamla beslutsregeln jämförde skattningsbrus mellan olika effektiva stickprov; den korrekta χ²-statistikan stänger frågan, och återkörningen (D §12 punkt 8) formaliserar stängningen. E:s d_eff 6,17 mot 5,42: fortfarande otolkbar utan null, men nu med färdigt maskineri och en beställd rättegång (E §11 punkt 6). H:s toy-simuleringar: injicerat och återfunnet, kodvalidering (H §11). Ingenting av detta är evidens, allt är fundament — och distinktionen mellan de två är, mer än någon enskild formel, det granskningen har tillfört programmet.

## 11. Prioriterad väg framåt

**Fas 1 — blockerande kodfixar (veckor).** B: dödtidsfri R-nämnare, S2-rättning, detektornivå-S4. C: primärinferensen S − 2 > kσ, spegelstubbarna ersätts. D: d = 2-korrigeringen, tvåläges-S4. E: S5-E, stressmodulernas biaskorrektion, asdict-buggen. F: referensfamiljen med flicker-medlem. Utan fas 1 betyder inga körningar något.

**Fas 2 — nollmaskiner och injection/ROC (månader).** Fullständiga surrogatfamiljer med p⁽²⁾-disciplin i samtliga pipelines; syntetiska injection-program med publicerade ROC-kurvor per signatur; back-portering av metodbiblioteket (§7) vid varje v0.2-revision; återkörning av D-anomalin och E-rättegången.

**Fas 3 — C/G-labbet (parallellt, långsiktigt).** Gemensam källspecifikation, fysiska sanna positiva, degraderingssvep, disjunkta vittneskedjor för klass II-signaturernas strong-nivåer, F-aktiv- och M-protokollen i drift.

**Fas 4 — fältprogram med definierade mål.** H-kampanjplanering mot svagaste publicerade gränser i parameterrummet; A:s intensitetsinterferometri-spår med kontrastbudget och multiplexeringsdesign; övriga fältmål vilande tills måltavlan (§9) levererar.

**Fas 5 — teoriuppdraget.** Måltavlans frågor tilldelas, formuleras kvantitativt och besvaras eller begravs med siffror. Programmets nästa stora dokument efter denna syntes bör vara måltavlans första kvantitativa svar.

## 12. Programmets epistemiska självförståelse

Katalogen började i en fråga om determinism: vad saknas för att förutbestämma en händelse, och bryggan mellan klassisk deterministisk oförutsägbarhet och kvantmekanisk indeterminism. Nio rapporter senare kan programmet formulera sitt eget svar med ovanlig precision. Det som "saknas" är av tre slag, och katalogen mäter alla tre: information som är *utspädd* (golv av första sorten — den finns, men kontrasten är krossad), information som är *strukturellt oåtkomlig* (golv av andra sorten — fasen som medelvärdesbildats bort, paren som aldrig anländer, invarianten som inte kan skiljas från instrumentet), och information som är *omflyttad* (M:s domän — det förflutna lever i korrelationer och miljöns redundanta kopior, delvis återvinningsbart med intervention, aldrig en väg tillbaka). Kvantindeterminismen ligger ovanpå som det fjärde lagret: där klass I-vittnena slår ut finns ingen dold variabel att sakna — där är oförutsägbarheten inte informationsbrist utan natur.

Och programmets metod har visat sig vara dess innehåll. Varje signatur granskningen räddade räddades av samma rörelse: att ta den vackraste versionen av en idé och fråga vad som skulle kunna fejka den, tills det som återstod var antingen ingenting eller något som tål en motståndare. Det är inte en försiktighetsåtgärd ovanpå vetenskapen. Det är vetenskapen.

## 13. Slutsats

Kvantsignatur-katalogen är färdigrapporterad: nio signaturer, tre evidensklasser, två axlar, ett metodbibliotek, ett laboratorienav och en måltavla. Dess vattentäta vittnen vilar på olikheter som ingen klassisk modell kringgår; dess strukturella signaturer vet numera exakt vad de inte bevisar; dess golv är namngivna, dess bedragare katalogiserade och dess simuleringar ärligt bokförda som fundament snarare än fynd. Det som började som en fråga om huruvida något lämnar ett märke har blivit ett program som självt lämnar ett: en dokumenterad, falsifierbar, fientligt testad väg från intuition till protokoll. Katalogens viktigaste resultat hittills är inte en signatur — det är att den byggde en standard där ett framtida fynd, om det kommer, kommer att förtjäna att bli trott.
