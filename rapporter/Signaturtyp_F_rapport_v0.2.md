# Signaturtyp F — Non-Markovianitet och minneseffekter i korrelationsdynamiken

## Fullständig rapport och protokollspecifikation, version 0.2

*Status: granskad och uppdaterad. v0.2 inarbetar det externa granskningsutlåtandet över v0.1 samt chattgranskningens bedömning av detsamma. Statusetikett (antagen från utlåtandet): **memory-structure-ready, quantum-active-only** — F-passiv får hitta och mäta minne; kvantanspråk reserveras för F-aktiv eller disjunkt icke-klassicitetsvittne.*

**Ändringslogg v0.1 → v0.2:** (Ä1) Semigrupptestet befordrat till huvudmetrik och formaliserat som Chapman–Kolmogorov-test med Δ-stege, parametrisk bootstrap-kalibrering och E v0.2:s dubbla biasvakt importerad (§3.2 S). (Ä2) S4 utökad från minnesfamilj + instrumentlager till minnesfamilj + instrumentlager + **urvalsmodell** (selektionsstress; §5.2). (Ä3) Klassningsnamnen skärpta: F-memory-suspect/F-memory-strong — klassnamnet säger vad som bevisats (§9). (Ä4) Ny beslutsregel: vid informationskriterie-oavgjort mellan F-modell och klassisk familj vinner alltid nollan (§5.2), plus röd flagga för flicker-likvärdig svansförklaring (§8). (Ä5) Kandidattuppeln formaliserad och admissibility-gaten G_F införd, harmoniserad med G_A/G_B/G_C (§3.3). (Ä6) p⁽²⁾-regeln back-porterad (§9). (Ä7) Statusetikett. Bokföring: utlåtandets §2 (klyvningen, med korrekt matchade BLP/RHP-referenser), §3 (kvantneutralitet), §4 (modellfamilj/flicker), §6 (S3-spektroskopin), §7 (fotonbudget), §8 (klassningsstruktur) och §10 (spec-ready-status) bekräftar v0.1 och bokförs som oberoende validering.

---

## 1. Sammanfattning

Signaturtyp F föreligger när korrelationsdynamiken i uppmätt data — g²(τ) eller Stokes-korrelationerna C_ij(τ) — uppvisar minneseffekter: återhämtningar (revivals), icke-exponentiella svansar eller brott mot Markov-komposition som inte förklaras av bästa medlem i en förregistrerad klassisk minnesfamilj. Där A och B mäter korrelationers värden och E deras kompressionsstruktur, mäter F deras tidsmässiga persistens.

Rapportens centrala slutsatser. För det första är klyvningen bindande: **F-passiv** (minne i räknestatistiken; mätbart på varje ström; kvantneutralt) och **F-aktiv** (BLP-backflow och CP-divisibilitetsbrott med preparerade probtillstånd; kvantmeningsfullt; laboratorium/C-labbet) — F-passiv kan visa att korrelationskurvor har minne, aldrig ensam att minnet är kvantmekaniskt. För det andra är nollhypotesen en modellklass, aldrig en punkt: den klassiska minnesfamiljen M_klass med obligatorisk flicker-medlem, plus instrumentlager, plus (nytt i v0.2) urvalsmodell — och vid oavgjort mellan F-modell och klassisk familj vinner alltid nollan. För det tredje befordras semigrupptestet till huvudmetrik i formaliserad form: Chapman–Kolmogorov-testet med Δ-stege utgör, tillsammans med S3-blockspektroskopin, två oberoende minnesskale-skattare vars samstämmighet är F:s starkaste interna konsistenskrav. För det fjärde är F-Astro målsökande med gate: ingen kampanj utan kandidattuppel och G_F ≥ 1.

## 2. Definition och scope

### 2.1 Kärnidé

En Markov-process saknar minne: framtiden beror endast på nuet, korrelationer klingar av som superpositioner av exponentialer, och propagatorn komponerar över tid. Ett system med minne — där information som läckt till omgivningen flödar tillbaka — bryter detta: korrelationsfunktioner kan återhämta sig, och kompositionsregeln fallerar.

### 2.2 De två moderna (bindande)

**F-passiv.** Mätobjekt: räknestatistikens minne. Tillämplig på varje fotonström inklusive astronomiskt ljus. Evidensklass: strukturell (kvantneutral) — en icke-exponentiell svans eller revival kan bero på klassisk oscillatorisk dynamik, flera relaxationstider, källrotation, periodisk modulering, scintillation, elektronisk drift, afterpulsing, flicker eller verkligt miljöminne, och F-passivens jobb är att skilja "klassiskt oförklarat minne" från alla utom det sista.

**F-aktiv.** Mätobjekt: den dynamiska avbildningens CP-divisibilitet och informationsåterflöde med preparerade par av probtillstånd — BLP-måttet (spårdistansdynamik) och RHP-klassens divisibilitetskriterier, vilka båda förutsätter preparation och tillståndsföljning och därför är operationellt tomma i passivt läge. F-aktiv är den enda F-mod som bär kvantanspråk på egen hand; hemvist C-labbet (tredje uppdraget, C v0.2 §11).

### 2.3 Avgränsningar och relationer

Ingen genväg förbi ljusrestid (programstandard). Mot E: E mäter kompressionsstruktur i feature-rummet, F temporal persistens i korrelationsdynamiken. Mot M: M äger interventionell återvinning (eko, miljörekonstruktion), F äger observationell minnesdynamik samt divisibilitetsmåtten i aktiv form (demarkationen M v0.1 §3). Arvsregeln: F-passiv bygger på B-kedjans objekt och räknas aldrig som oberoende bekräftelse av B/D/E på delad rådata.

## 3. Mätobjekt, metrics och budget (F-passiv)

### 3.1 Minneskärnan som referensram

Nakajima–Zwanzig-formen dρ/dt = ∫₀ᵗ K(t−τ)ρ(τ)dτ med Markov-gränsen K → delta; F-passivens observabler är projektioner på mätbara korrelationsobjekt, med kärnans effektiva räckvidd skattad via avvikelse från referensfamiljens förutsägelser.

### 3.2 Primärmetriker — omviktade i v0.2 (Ä1)

**S — Chapman–Kolmogorov-testet (huvudmetrik, formaliserad).** För Markov-dynamik komponerar övergångskärnan: P(2Δ) = P(Δ)·P(Δ). Operationalisering: (i) förregistrera en grov tillståndsindelning (binnade intensitets-/räknenivåer per tidsbin, K_s tillstånd); (ii) skatta övergångsmatriserna P̂(Δ) och P̂(2Δ) ur tidsserien; (iii) teststatistika D_CK(Δ) = ‖P̂(2Δ) − P̂(Δ)²‖_F; (iv) null via parametrisk bootstrap ur bästa M_klass-medlem med identisk estimatorkedja (samma tillståndsindelning, samma N); (v) **Δ-stegen**: D_CK över logaritmiskt Δ-grid ger en kompositionsbaserad minnesspektroskopi — skalan där CK-brottet dör skattar T_mem oberoende av S3-spektroskopin, och de två skattningarna ska vara samstämmiga (§5.3). **Dubbel biasvakt (importerad från E v0.2 §4.3):** övergångsmatrisskattning är sampelstorleksbiasad med |K_s|² celler; Miller–Madow-korrektion eller motsvarande, matchat övergångsantal mellan observation och null (subsampling), och rapporterad N_transitions per Δ-nivå är obligatoriska. Utan vakten producerar Δ-stegen mekaniska "brott" vid stora Δ av ren cellgleshet — samma metodfel katalogen nu korrigerat tre gånger (E-transitioner, Kolmogorov-modulen, CK).

**R — residualstruktur (arbetshäst).** Korrelationskurvan fittas mot referensfamiljens bästa medlem; residualens matchade-filter-svar mot förregistrerade revival-mallar (dämpade oscillationer, fritt period/fas-grid) med max-statistik och null med identisk maxtagning — A-maskineriet i temporal form.

**V — revival-räkning (sekundär).** Antal lokala maxima med per-revival-signifikans (k·σ, förregistrerat k) inom fiducialfönstret och global trial-korrektion via surrogatnull på samma räknestatistika. Utan båda villkoren är räknaren toppletning.

### 3.3 Fotonbudget, kandidattuppel och G_F (Ä5)

Minnessignaturer bor i svansen (T_max ≈ 10³·T_decay) där koincidensstatistiken är magrast — A:s kontrastbudget i temporal form. Varje F-Astro-kandidat dokumenteras som tuppeln {T_mem, A_revival, R_γ, T_obs, Δτ, N_channels} med SNR-beräkning för svansregimen (matchat filter: SNR ≈ A_revival·R_γ·√(τ_eff·T_obs·N) i tillämplig form). Admissibility-gaten, harmoniserad med G_A/G_B/G_C:

G_F = SNR_pred(svansregim) / SNR_min,

med banden < 1 ej målbar; 1–3 svag; > 3 möjlig; > 10 prioriterad. Ingen F-Astro-kampanj utan beräknad G_F. F-passiv är mer realistisk än C-Astro (inga par krävs) men lika målsökande: utan kandidatprocess med förutsagd minnesskala och amplitud är F ett protokoll, inte ett observationsprogram.

## 4. Kvantstatus

Även äkta, artefaktfria revivals bevisar inte kvantdynamik — klassiska oscillatorer ringer, klassiska miljöer bär minne. F-passiv delar evidensklass med D och E. Bindande språk: **F-memory-strong betyder "starkt klassiskt-oförklarat minne"; F-strong-Q kräver F-aktiv (BLP/CP-divisibilitet med prober) eller F-memory-strong plus oberoende A/B-2/C-vittne från disjunkt detektorkedja.** Hålls strikt.

## 5. Nollhypotes och motståndare

### 5.1 Ensam OU är underkänd (bekräftad)

Klassiskt 1/f-flicker är allestädes närvarande, klassiskt och långminnesbärande per definition; en detektion mot ensam OU är en flickerdetektion med fin titel.

### 5.2 Referensfamiljen med tre lager (Ä2, Ä4)

S4 = **M_klass + instrumentmodell + urvalsmodell**, samtliga aktivt trimmade:

- **M_klass:** summor av 2–4 OU-komponenter, ARMA(p,q) med förregistrerade maxordningar, samt obligatorisk långminnesmedlem (fGn/flicker med skattad Hurst-parameter), fittade till observerad data.
- **Instrumentlager:** dödtid, afterpulsing, jitter, crosstalk, mättnad/pile-up enligt B v0.2-standard.
- **Urvalsmodell (ny):** koincidensfönster-variation, binningval, fiducialfönstrets känslighet, kvalitetsklipp — C-lärdomens selektionsstress i F-form; "minne" som uppstår eller försvinner med analysval är analysens minne, inte ljusets.

Inferensen är modelljämförelse med förregistrerat informationskriterium eller surrogatkalibrerad likelihood-kvot. **Bindande beslutsregel (Ä4): vid oavgjort tillfaller segern den klassiska familjen** — en F-kandidat som inte slår flicker-medlemmen tydligt har detekterat elektronik, och tveksamhet är inte evidens.

### 5.3 Surrogaten och de två spektroskopierna

**S1** label-shuffle; **S2** relativa time-slides (B v0.2-villkoret); **S3** minnesbrytande blockpermutation med förregistrerad blockstege — spektroskopi nr 1 (vid vilken blockstorlek dör signaturen?). **CK-Δ-stegen (§3.2)** är spektroskopi nr 2. **Konsistenskrav (nytt):** T_mem-skattningarna från S3-stegen och CK-stegen ska vara samstämmiga inom osäkerheter; divergens är röd flagga för artefakt (instrumentperiod fångas ofta av den ena men inte den andra). S3-spektroskopin förs till katalogens metodbibliotek (syntesens §7) med E och M som deklarerade avnämare.

## 6. Instrumentkrav

Jitter ≪ minnesskalan; klockstabilitet över hela T_max (klockdrift imiterar minne); korrelationsregistrering till T_max ≈ 10³·T_decay med budget enligt §3.3; B v0.2:s fulla kalibrerings- och rå-kanalstandard; samt F-specifikt: komplett förregistrerad exklusionslista över periodiska instrumentmekanismer (klockcykler, gating, buffertlatens, temperaturcykling) för revival-analysen. F-aktiv tillägger C-labbets prepararbara probtillstånd och tillståndsrekonstruktion.

## 7. Dataformat

B-eventtabellen oförändrad, med F-metadatakrav per run: klockreferens och driftmodell, lista över periodiska instrumentfrekvenser, T_decay-skattning från förmätning, förregistrerade T_max, fiducialfönster, mallgrid, tillståndsindelning för CK, blockstege för S3 och Δ-grid för CK-stegen. F-aktiv loggar probtillståndsschema och rekonstruktionsmetod.

## 8. Röda flaggor (blockerande; Ä4-tillägget markerat)

Samma revival i dark/blank; toppar vid TDC-/gating-/buffertfrekvenser (rf_clock_peak_check: FFT av residualen mot känd frekvenslista); afterpulsing-fönster sammanfallande med signaturen; signaturen följer det_id snarare än källa; S3- eller CK-minnesskala sammanfallande med känd instrumentperiod; signaturen försvinner vid liten ändring av binning/fiducialfönster; divergens mellan S3- och CK-spektroskopiernas T_mem; **flicker-modellen förklarar svansen likvärdigt (Ä4)** — informationskriterie-oavgjort ger F-none per §5.2.

## 9. Klassning (v0.2; Ä3, Ä6)

**F-none.** Bästa medlem i den kompletta trelagersnullen förklarar data (inklusive oavgjort), eller ingen metric överlever surrogaten, eller röd flagga.

**F-memory-suspect.** Minst en av S/R/V separerar med empiriskt p < 10⁻² mot komplett trelagersnull och mot S1–S3, med **p⁽²⁾-disciplin** (andra minsta p över nullfamiljerna bär beslutet); replikering i ≥2 oberoende runs; robusthet mot binning och fönsterval; samstämmiga S3/CK-spektroskopier med T_mem skild från instrumentperiodiciteter.

**F-memory-strong.** p < 10⁻³ mot samtliga nullklasser i ≥2 oberoende sessioner; passerad exklusionslista och fullständigt kontrollbatteri; betydelsen är uttryckligen *starkt klassiskt-oförklarat minne*.

**F-strong-Q.** F-aktiv: signifikant BLP-backflow eller CP-divisibilitetsbrott med preparerade prober i kontrollerad uppställning; alternativt F-memory-strong plus samtidigt icke-klassicitetsvittne från disjunkt detektorkedja (arvsregeln).

## 10. F:s roll i katalogen

**Roll 1 — miljö- och källkarakterisering:** kärnskattningar (T_mem, revival-frekvenser, långminnesexponent) är fysikaliskt informativa oavsett kvantstatus och blir features för D och E — med arvsregeln som markering. **Roll 2 — F-aktiv i C-labbet:** kvantmeningsfull non-Markovianitetsmätning med etablerade mått; kalibreringskälla för F-passivens metrics (injicera känt kvantminne, kartlägg överföringsfunktionen). **Roll 3 — metodexportör:** S3-spektroskopin och CK-testet till metodbiblioteket; M ärver maskineriet per demarkationen.

## 11. Kodstatus (spec-ready, ej implementation-ready)

Ingen körbar F-mall existerar; prioriterad implementationsordning (utlåtandets, antagen och kompletterad): (1) portera E:s ingest/windowing/two-pointer-motor; (2) M_klass-fittern: multi-OU, ARMA, fGn/flicker; (3) R med mallgrid och maxstatistik (A-portering); (4) V med per-revival-signifikans och global trial-korrektion; (5) S3-spektroskopin; (6) rf_clock_peak_check; (7) **CK-testet med Δ-stege och dubbel biasvakt** (uppgraderat från "experimentell modul" till huvudmetrik — implementeras med E:s transitionsinfrastruktur, som delar exakt samma matematik); (8) urvalsstress-lagret i S4; (9) injection tests: OU, multi-OU, flicker, dämpad klassisk oscillator (kanariefågeln — ska ge F-none eller F-memory med klassisk attribution, aldrig Q-antydan), syntetisk icke-Markoviansk kärna; (10) ROC: falsklarm mot klassisk minnesfamilj, detektionseffektivitet mot injicerat minne. Katalogens förebyggande regler gäller: inga spegelstubbar, relativa tidsskift, replikeringsgrindar från dag ett.

## 12. Öppna frågor och åtgärdslista

Utöver §11: (1) formulera F-aktiv-protokollet med C-labbet (valideringsplan, probtillståndsschema); (2) kandidatmatris för F-Astro med G_F-beräkning för minst två källklasser (miljöer med strukturerat minne på ms–s-skala: exempelvis magnetosfärisk dynamik, pulsarmiljöer — attributionen förblir klassisk tills F-aktiv eller disjunkt vittne säger annat); (3) fotonbudgetkalkyl för svansregimen för en småteleskop- och en multiplexerad konfiguration; (4) dokumentera S3+CK-dubbelspektroskopin som metodbiblioteksbidrag; (5) samordna CK-implementationen med E:s transitionsmetrik (gemensam kodbas för övergångsmatriser med biasvakt).

Öppen forskningsfråga (nu med gate): vilka astrofysikaliska källor bär minnesstruktur i fotonstatistiken på mätbara tidsskalor, med amplitud över G_F-golvet? F-aktiv har definierade mål i laboratoriet från dag ett; F-passiv väntar på sin kandidatmatris — protokollet är färdigt, målet är teoriuppdraget.

## 13. Slutsats

Signaturtyp F lämnar granskningsrundan med klyvningen bekräftad, nollan skärpt till tre lager och sin mest principiella metrik äntligen myndigförklarad: Chapman–Kolmogorov-testet ger F ett modellfritt huvudvittne, en andra minnesspektroskopi och ett inbyggt konsistenskrav — två oberoende vägar till T_mem som måste mötas. Namnen säger numera exakt vad som bevisats (memory, inte quantum), oavgjort tillfaller nollan, och kvantanspråken bor där de kan försvaras: i labbet, med prober i handen. F:s ärligaste sammanfattning är oförändrad sedan v0.1 men står nu på fastare grund — ljuset kan minnas, mätbart och robust; om minnet är kvantmekaniskt avgörs aldrig av kurvans skönhet utan av interventionens svar.
