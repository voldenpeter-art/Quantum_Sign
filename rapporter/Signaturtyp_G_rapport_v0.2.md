# Signaturtyp G — Squeezing: kvadraturvarians under vakuumnivån

## Fullständig rapport och protokollspecifikation, version 0.2

*Status: granskad och uppdaterad. v0.2 inarbetar det externa granskningsutlåtandet över v0.1 samt chattgranskningens bedömning av detsamma. Statusetikett (antagen från utlåtandet): **lab-strong, link-capable, sky-blind (quadrature) / sky-gated (twin).** Fasmedelvärdesteoremet (V + 1/V)/2 ≥ 1 är externt verifierat.*

**Ändringslogg v0.1 → v0.2:** (Ä1) Kalibreringsbudgeten formaliserad som admissibility-gate G_G, harmoniserad med G_A/G_B/G_C/G_F — gate-familjen därmed komplett (§5.2). (Ä2) Interfolieringsfrekvens-krav: chopper-frekvensen förregistreras över detektionskedjans uppmätta 1/f-driftknä (§6.1). (Ä3) Heisenberg-konsistensen kvantifierad som (V, η, excess)-modellfit på paret (V̂_min, V̂_max) — RF_pair_consistency — i stället för råproduktband, som saknar fysikalisk grund för blandade tillstånd (§7). (Ä4) Ny giltighetsklass G-cal-fail, skild från utfallsklassen G-none (§9). (Ä5) Metodbiblioteksexport köad till syntes v1.1: mätbar-null-principen och omöjlighetsdetektor-familjen (RF_heisenberg + RF_stokes_bound) (§10). (Ä6) Statusetikett. Bokföring: utlåtandets §2 (treformsklyvningen, G-pol ≡ D-Q-ansvarsdelningen), §3 (fasteoremet, verifierat), §4 (förlustgolvet), §5 (mätbar null och linearitetstest som guldstandard), §6 (RF_heisenberg) och §8 (C/G-labbet) bekräftar v0.1 och bokförs som oberoende validering.

---

## 1. Sammanfattning

Signaturtyp G föreligger när uppmätt brus i en fältkvadratur — eller i en tvåmods-kombination såsom intensitetsdifferensen mellan tvillingstrålar — ligger statistiskt signifikant under vakuumnivån (skottbrusgränsen), efter kalibrerad referensmätning och med Heisenberg-konsistent antisqueezing i den konjugerade storheten. G tillhör katalogens vattentäta vittnesfamilj: varje klassiskt fält är en blandning av koherenta tillstånd med positiv P-funktion, och ingen sådan blandning kan underskrida vakuumbruset.

Rapportens centrala slutsatser. För det första klyvs G i tre former: G-kvadratur (homodyn, kräver fasreferens), G-twin (intensitetsdifferens, LO-fri) och G-pol (polarisationssqueezing, identisk med D_Q; D äger invariansfrågan över sessioner, G äger vittnesdefinition och kalibreringskedja). För det andra är G-kvadratur strukturellt omätbar på passivt ljus: fasmedelvärdet av en squeezad varians är (V + 1/V)/2 ≥ 1 — antisqueezingen dominerar alltid och signaturen raderas matematiskt; G-twin bär de passiva tillämpningarna och ärver A:s teckenbevarande förlustlogik. För det tredje är G:s risklandskap kalibreringstekniskt, och v0.2 sluter kedjan: mätbar interfolierad vakuumnull med chopper-frekvens över driftknät, linearitetsvaliderad skottbrusgräns, kvantifierad Heisenberg-konsistens via modellfit, giltighetsklassen G-cal-fail — och admissionsgaten G_G som gör kalibreringsbudgeten till samma sorts ärliga grind som katalogens övriga målsökande signaturer bär.

## 2. Fysikalisk grund

### 2.1 Kvadraturer och vakuumgränsen

Kvadraturoperatorerna X_θ med kanonisk kommutation; vakuum och koherenta tillstånd har Var(X_θ) = 1 (normerad skottbrusgräns, SNL) för alla θ. Ett squeezat tillstånd har Var(X_{θ₀}) = V < 1 för någon vinkel; Heisenberg kräver V_min · V_max ≥ 1, med likhet för rena minimum-osäkerhetstillstånd.

### 2.2 Den klassiska gränsen

Varje klassiskt fält är en blandning av koherenta tillstånd (positiv Glauber–Sudarshan-P-funktion); blandning kan bara addera varians: Var_klassisk(X_θ) ≥ 1 för alla θ och alla klassiska modeller. V < 1 kräver icke-positiv P-funktion och är ett binärt icke-klassicitetsvittne av A-klass. G, A (g² < 1), B-2 (R_CS > 1) och D_Q utgör katalogens vattentäta vittnesfamilj — fyra projektioner av samma matematiska faktum genom fyra instrumentkedjor.

### 2.3 Gränsdragning mot A (bindande)

Talstatistik-squeezing (sub-Poisson, F < 1, Q < 0) ingår i A:s S_A och förblir A:s egendom. G:s unika innehåll är det fas-/kontinuumssensitiva: kvadraturvarians, tvåmods-kombinationer, Stokes-varians.

## 3. De tre formerna

### 3.1 G-kvadratur

Homodyn-detektion: signal + stark lokaloscillator (LO) på 50/50-delare; differensfotoströmmen mäter X_θ med θ = LO-fas. Kräver faslås, modmatchning (effektiv effektivitet skalar som synligheten i kvadrat), balanserad detektion med hög common-mode-undertryckning. Mätobjekt: variansspektrum V(θ, Ω) i förregistrerade sidbandsband.

### 3.2 G-twin

Tvåmods-squeezing (OPO över tröskel, fyrvågsblandning) ger tvillingstrålar med brusreduktionsfaktor NRF = Var(I₁ − I₂)/⟨I₁ + I₂⟩ < 1 — klassiskt omöjligt (klassisk uppdelning ger minst partitionsbrus). Direkt detektion, ingen LO, ingen fasreferens. Släktskap på tillståndsnivå: tvåmods-squeezade tillstånd bryter Cauchy–Schwarz, så G-twin och B-2 belyser överlappande fysik genom olika estimatorer — korsvalidering i labb, aldrig oberoende evidens på delad rådata (arvsregeln).

### 3.3 G-pol

Polarisationssqueezing: minsta kalibrerade Stokes-egenvarians under skottbrusnivån — identisk med det korrigerade D_Q-vittnet (D v0.2 §6.3: λ_min(Σ_cal)/V_shot < 1 med redovisad anti-squeezing). Ansvarsdelning bekräftad av extern granskning: D äger invariansfrågan över sessioner, G äger vittnesdefinition och kalibreringskedja. Trace-summan kan per operatorteorem aldrig underskrida 2⟨S₀⟩ — uppmätt underskridande är omöjlighetsflaggan RF_stokes_bound (D v0.2 §6.2), medlem i samma detektorfamilj som RF_heisenberg.

## 4. Fasproblemet (externt verifierat)

För ljus utan fasreferens medelvärdesbildas homodynmätningen över θ:

⟨V⟩_θ = (V_min + V_max)/2 ≥ (V + 1/V)/2 ≥ 1,

med likhet endast för V = 1. En fasmedelvärdesbildad squeezad stråle ser ut som brus över vakuumnivån. Detta är inte ett kontrastgolv utan en radering: ingen multiplexering, integrationstid eller statistik återvinner en signatur som medelvärdesbildats till fel tecken. G-kvadratur är strukturellt vilande för passivt ljus (sky-blind); tillämplig endast med fasreferens — egna källor, länkar med pilotton, heterodyn mot känd bärvåg. G-twin och G-pol bär de passiva tillämpningarna.

## 5. Förlustgolvet och gaten

### 5.1 Förlustformeln

Transmission η (väg × teleskop × modmatchning² × kvanteffektivitet) blandar in vakuum: V′ = ηV + (1 − η). Tecknet bevaras (V′ < 1 så länge V < 1, η > 0 — A:s teckenlogik), men avståndet till gränsen krymper linjärt: V′ − 1 = η(V − 1). G:s kontrastbudget är därmed en kalibreringsbudget: kravet är inte fler fotoner utan en SNL-referens med relativ noggrannhet ≪ η(1 − V).

### 5.2 Admissibility-gaten G_G (Ä1)

G_G = η(1 − V)_pred / δ_SNL,min,

där täljaren är kandidatens förutsagda avvikelse under gränsen efter full förlustbudget och nämnaren är minsta upplösbara SNL-avvikelse givet kalibreringskedjans dokumenterade precision (linearitetstestets residual, elektronikgolvets osäkerhet, driftbudget över mätpasset). Förregistrerade band harmoniserade med G_A/G_B/G_C/G_F: < 1 ej målbar; 1–3 svag; > 3 möjlig; > 10 prioriterad. Ingen G-kampanj utanför laboratoriet planeras utan beräknad G_G; för astronomiska η är G_G ≪ 1 med känd metrologi — sky-gated är gatens ärliga utslag, inte ett antagande.

## 6. Mätarkitektur och den mätbara nullen

### 6.1 Interfolierad vakuumnull med frekvenskrav (Ä2)

G:s unika tillgång: nollhypotesen mäts — blockerad signalport ger äkta vakuum genom identisk kedja. Protokollet föreskriver interfolierad mätning (chopper-växling signal/vakuum), och v0.2 tillfogar det bindande frekvenskravet: **chopper-frekvensen ska ligga över detektionskedjans uppmätta 1/f-driftknä**, ty interfolierad referens delar endast drift som är långsammare än växlingsperioden. Driftknät mäts i kalibreringsfasen (spektrum av SNL-nivån över tid); chopper-frekvens och knäfrekvens loggas per session, och kvoten är kvalitetsparameter. Den mätbara nullen förblir primär; surrogaten (§8) kompletterar, ersätter aldrig.

### 6.2 SNL-valideringen

Linearitetstestet är obligatoriskt per session: vakuumbrusets effektspektrum skalar linjärt med LO-effekt (respektive total fotostöm), klassiskt tekniskt brus kvadratiskt; test över minst en dekad. Därtill: elektronikgolv (släckt LO) minst 10 dB under vakuumnivån i alla förregistrerade band; dokumenterad common-mode-undertryckning; mättnadsmarginal med avsiktligt överdrivningstest.

### 6.3 Instrumentkrav per form

G-kvadratur: faslåst LO, dokumenterad modmatchningssynlighet, balanserat detektorpar, spektralanalys i förregistrerade band. G-twin: kalibrerad gain-matchning (klassisk gemensam modulationston ska släckas i differensen till dokumenterad nivå); vid räknande detektion full dödtids-/afterpulsing-disciplin enligt A v0.2 — dödtid komprimerar räknevarians och fejkar sub-SNL. G-pol: D_Q-kedjan med koherent referens (D v0.2 §6.3, G äger kedjan).

## 7. Falska positiva, Heisenberg-bokföring och parkonsistens (Ä3)

Risklandskapet är kalibreringstekniskt. **Elektronikbrusavdrag:** avdragspolicyn förregistreras och tillämpas identiskt på signal och vakuum — asymmetriskt avdrag tillverkar squeezing ur bokföring. **SNL-drift:** interfoliering med frekvenskravet §6.1 plus effektloggning. **Mättnad/kompression:** falsk squeezing åt det farliga hållet; marginal dokumenteras och stresstestas. **Filteröverföring:** identiska kedjor för signal och referens, uppmätt överföring. **Gain-obalans (twin):** släckningstest. **Dödtid (räknande):** A-disciplinen; artefaktzoner exkluderas, instrumentlagret in i motståndaren.

**RF_heisenberg (hård, oförändrad):** konjugatstorheten mäts alltid; uppmätt V̂_min·V̂_max < 1 är fysikaliskt omöjligt och diskvalificerar sessionen (→ G-cal-fail).

**RF_pair_consistency (ny, kvantifierad mjuk flagga):** utlåtandets konsistensband antas i förfinad form. Ett rått produkttak saknar fysikalisk grund — blandade tillstånd får ha godtyckligt stor V_min·V_max. Det fysikaliska kravet är i stället modellkonsistens: paret (V̂_min, V̂_max) fittas mot förlust/excess-modellen V′_min = ηV + (1−η) + ξ, V′_max = η/V + (1−η) + ξ över fysikaliskt intervall (0 < V ≤ 1, 0 < η ≤ η_budget, ξ ≥ 0); passningens residual mot mätosäkerheterna är flaggstatistikan. Dålig passning betyder att det uppmätta paret inte beskriver något fysikaliskt tillstånd genom den dokumenterade kedjan — felkalibrering, oavsett att båda talen ser rimliga ut var för sig. Squeezing utan uppmätt antisqueezing är samma flagga i gränsform.

## 8. Surrogat, motståndare och inferens

Primär null: den interfolierade uppmätta vakuumreferensen. Sekundära surrogat: S2-fasrandomisering (spektrumbevarande), S3-blockpermutation (drift-null), S1-kanalshuffling (twin: bryter parkoppling). Motståndare S4 på detektor- och kalibreringsnivå: elektronikbrusfelbokföring, mättnadskompression, gain-obalans, LO-drift under knäfrekvensen, (räknande) dödtid — aktivt trimmade att maximera falsk sub-SNL i identisk pipeline. p⁽²⁾-regeln gäller: varje vittne slår minst två oberoende nullfamiljer, där den uppmätta vakuumnullen räknas som en.

Inferensen är C-lärdomens G-form: primärtest 1 − V̂ > k·σ_V (χ²-baserad eller bootstrap; k = 3 suspect, 5 strong); surrogat och motståndare bär den andra rollen — att visa att pipelinen inte klassiskt kan producera V̂ < 1.

## 9. Klassning (v0.2; Ä4)

**G-cal-fail (ny giltighetsklass).** Kalibreringsbatteriet ej godkänt: linearitetstest, elektronikgolv, mättnadsmarginal, chopper-/knäkrav, RF_heisenberg eller RF_pair_consistency fallerad. Betydelse: mätningen är ogiltig — varken evidens för eller emot squeezing. Skild från G-none (giltig mätning utan fynd); sessioner i G-cal-fail räknas aldrig i replikeringsstatistik åt något håll.

**G-none.** Giltig mätning; V̂ ≥ 1 i alla förregistrerade band, eller primärtest under suspect-nivå.

**G-suspect.** 1 − V̂ > 3σ_V i minst ett förregistrerat band mot interfolierad vakuumnull; Heisenberg- och parkonsistens; replikering i ≥2 runs; robusthet mot bandval och blockjackknife; inga röda flaggor.

**G-strong.** 1 − V̂ > 5σ_V replikerat över ≥2 oberoende sessioner; fullständig kalibreringskedja dokumenterad (linearitet, elektronikpolicy, gain-släckning, mättnadstest, chopper över knät); antisqueezing uppmätt med godkänd parkonsistensfit; S4 når inte under 1 i identisk pipeline; p⁽²⁾-disciplin. G-pol-strong följer därutöver D v0.2 §6.3; räknande G-twin följer A-dödtidsdisciplinen.

**Röda flaggor:** RF_heisenberg (→ G-cal-fail); RF_pair_consistency (→ G-cal-fail); sub-SNL som överlever med blockerad signalport (ren artefakt); effekt som följer LO-drift eller elektroniktemperatur; gain-släckning under specifikation; twin-effekt som följer detektor-ID vid kanalbyte.

## 10. G:s roll i katalogen

**Roll 1 — kalibreringslabbets andra ben.** OPO/OPA delar hårdvaruklass med C-labbets SPDC; det gemensamma C/G-labbet levererar äkta sanna positiva för hela vittnesfamiljen: par till C (p-svep-batteriet), squeezing till G, polarisationssqueezing till D_Q, tvillingstrålar till G-twin/B-2-korsvalidering, samt kontrollerade degraderingssvep (förlust, fas) för alla pipelines ROC.

**Roll 2 — mognadsreferens.** G är katalogens enda signatur i rutinmässig storskalig drift (squeezad ljusinjektion i gravitationsvågsdetektorer, frekvensberoende squeezing i produktion); kraven i denna rapport är kalibrerade mot den praxisen.

**Roll 3 — metodexportör (Ä5).** Två principer köas för formalisering i syntes v1.1: **mätbar-null-principen** — där nollhypotesen kan mätas i stället för simuleras är den primär och surrogaten sekundära — och **omöjlighetsdetektor-familjen** — fysikaliska omöjlighetsrelationer (RF_heisenberg, RF_stokes_bound) ska identifieras och mätas som inbyggda lögndetektorer i varje signatur där fysiken erbjuder en.

**Roll 4 — vilande astronomiskt sökmål, dubbelt blockerad.** G-kvadratur strukturellt (sky-blind, §4); G-twin gated (G_G, §5.2) tills en astrofysikalisk tvillingstrålemekanism med beräknad NRF-budget föreslagits — frågan står på katalogens gemensamma måltavla.

**Broar:** G-pol ≡ D_Q (delat ansvar, bekräftat); G-twin ⇒ CS-brott ⇒ B-2-överlapp; talstatistikgränsen mot A; p⁽²⁾ från H; primärinferensens form från C.

## 11. Kodstatus

Ingen G-modul existerar; implementationskontrakt (uppdaterat): tidsseriependang till eventpipelinen (samplade differensfotoströmmar), interfolierad referenshantering med chopper-/knäfrekvenslogik (Ä2), spektralskattning i förregistrerade band med osäkerheter, linearitetstest-automatik, Heisenberg-bokföring med parkonsistensfit (Ä3), G-cal-fail-logik i klassningen (Ä4), S4 på detektor- och kalibreringsnivå, samt för räknande twin-läge A/B-kedjans koincidensmotor med dödtidslager. Katalogens förebyggande regler gäller: inga spegelstubbar, mätbar null primär, replikeringsgrindar från dag ett.

## 12. Öppna frågor och åtgärdslista

(1) C/G-labbets gemensamma specifikation (källa, degraderingssvep, valideringsprotokoll) — strategiskt blockerande för hela vittnesfamiljen; (2) G-modulens implementationskontrakt enligt §11; (3) G_G-kalkyl för en optimistisk astronomisk twin-geometri (dokumenterar sky-gated med siffror) och för en länkkonfiguration med pilotton (öppnar G-kvadratur för C-Link-klassen); (4) G-pol/D_Q-protokollsammanslagning med D (kalibreringskedja, antisqueezing-redovisning — D v0.2 §12 punkt 1 är samma beställning från andra hållet); (5) injection-program: kontrollerat förlust- och fassvep av känd squeezing, ROC per form, med avsiktlig kalibreringssabotage som kanariefågel (felbokfört elektronikavdrag ska fångas av RF_pair_consistency, inte ge G-suspect); (6) driftknä-karakterisering som standardmoment i kalibreringskedjan; (7) formulering av tvillingstrålefrågan till måltavlan.

Öppen forskningsfråga (oförändrad, nu gated): existerar astrofysikaliska processer som emitterar parvis intensitetskorrelerade strålar med NRF-budget som överlever propagation och insamling? Tills teorin levererar är G vad statusetiketten säger: laboratoriets skarpaste vittne, länkarnas kvalitetsmått, och himlens mest otillgängliga.

## 13. Slutsats

Signaturtyp G lämnar granskningsrundan med sitt fundament externt verifierat — fasteoremet står, klyvningen håller, den mätbara nullen är guldstandard — och med sina kalibreringskrav uppgraderade från principer till maskineri: gaten G_G gör budgeten till grind, chopper-kravet gör den delade driften till uppmätt egenskap i stället för antagande, parkonsistensfiten gör Heisenberg-bokföringen kvantitativ, och G-cal-fail ger ogiltiga mätningar en egen adress så att varken fynd eller nollresultat förorenas. G förblir katalogens mognadsreferens och dess mest paradoxala medlem: den enda signaturen som redan fungerar industriellt varje dag — och den enda vars himmelska version är matematiskt utraderad innan mätningen ens börjar.
