# Signaturkandidat MOM — Momentmatris-/enande icke-klassicitetssignatur

## Kandidatprotokoll version 0.0 — upprättat efter rättelse av inlämnat förslag

*Status: **kandidat, ej katalogmedlem.** Kandidaten prövas mot inträdesprovet (K1–K3) i §8. Plattformen är antagningsnämnd; beslutsgång i §11. Kandidaterna QFD, ETR och MOM utgör antagningskön och prövas oberoende.*

---

**Härkomstnot (2026-08-08)**

Kandidaten härrör från Del 3 i det externa granskningsdokumentet *"Kvantsignatur-katalogen: faktaverifiering, förslagsbedömning och v0.3-utveckling"*, där den föreslogs som **signatur K (momentmatris/enande icke-klassicitet)**. Förslagets kärnidé — att flera av katalogens vittnen är principalminorer i en gemensam momentmatris — **bekräftas och behålls**. Fem fel i det inlämnade förslaget är rättade före upprättandet av detta protokoll; se rättelseloggen nedan.

**Bokstaven K är förkastad.** K är den mest överbelastade versalen i katalogen: kopplingskonstanterna K_i (H), kontrastkravet K_D (D), K_min, metrikfamiljen (K) i E:s rapport — och granskningsdokumentet använder själv ⟨K⟩ ≤ 1 för Leggett–Garg-olikheten på samma sida som det föreslår signatur K. Kandidaten bär i stället namnrymdskoden **MOM** (momentmatris), som har noll förekomster i katalogens dokument.

---

## Rättelselogg mot det inlämnade förslaget

**R1 — Referensrättelse (bärande).**
Förslaget åberopar Shchukin & Vogel, *Phys. Rev. Lett.* **95**, 230502 (2005) för determinanthierarkin och kopplar den till A:s g²(0), B-2:s Cauchy–Schwarz-kvot och G:s kvadraturvarians. Det är fel artikel. PRL 95, 230502 är *"Inseparability criteria for continuous bipartite quantum states"* — separabilitetshierarkin för **bipartita** tillstånd. Katalogens vittnen är **enmods icke-klassicitet**, och den hierarkin ligger i två andra artiklar:

- Shchukin, Richter & Vogel, *"Nonclassicality criteria in terms of moments"*, **Phys. Rev. A 71, 011802(R) (2005)** — kriterier för icke-klassicitet hos en harmonisk oscillators tillstånd, formulerade i normalordnade kvadraturmoment.
- Shchukin & Vogel, *"Nonclassical moments and their measurement"*, **Phys. Rev. A 72, 043808 (2005)** — hierarkin av villkor på **matriser av moment** för optisk icke-klassicitet.

MOM:s teoretiska grund är PRA 71/PRA 72. PRL 95 är relevant först om kandidaten senare utökas till tvåmodsfallet, och då som separat spår.

**R2 — Siffran 31 är tvåmods och överförs inte.**
Förslaget skriver att det "redan upp till andra ordningen finns 31 NPT-kriterier (submatriser av M₅, härlett som Σ C(5,r) = 2⁵−1; 18 av dem innehåller båda moderna)". Räkningen 2⁵ − 1 = 31 är aritmetiskt korrekt, men gäller M₅ i **NPT-/bipartitfallet** — förslagets egen formulering "18 av dem innehåller båda moderna" bekräftar att det är ett tvåmodsproblem.

Det statistiska **maskineriet** överförs däremot legitimt: Kanari-Naish, Clarke, Qvarfort & Vanner (arXiv:2502.19624, 2025) anger uttryckligen att deras ramverk gäller varje hermitisk matris konstruerad av observabla moment. Det som överförs är alltså delta-metodens standardfel Δdet[A] = Γ/√M_tot och konfidensmåttet Φ(det[A]·√M_tot / Γ) — **inte** kriterieantalet. MOM måste räkna sin egen minormängd i enmodsfallet och redovisa den i v0.1.

**R3 — Bryggan är A/B/G, inte A/B/D/G.**
Förslaget listar "D:s Stokes-varians ↔ Stokes-operator-minor" som en fjärde förenad signatur. Det håller inte mot D-rapporten v0.2:

- D:s kvantvittne är D_Q = λ_min(Σ_cal)/V_shot < 1, och rapporten säger uttryckligen att detta är **identiskt med G-pol**. D bidrar därmed inget separat att förena — dess vittne *är* G:s.
- Trace-testet J₁ = tr(Σ) mot 2⟨Ŝ₀⟩ degraderades i v0.2 från vittne till lögndetektorn RF_stokes_bound, eftersom ΣVar(S_i) < 2⟨Ŝ₀⟩ är fysikaliskt omöjligt för varje kvanttillstånd. Ett degraderat test kan inte bära en bryggpelare.
- Dessutom: ett villkor på **minsta egenvärdet** är inte trivialt ett principalminor-determinantvillkor. Ekvivalensen kräver bevis, inte påstående, och lämnas som öppen fråga i §10.

Bryggan formuleras därför genomgående som **A / B-2 / G**.

**R4 — Notationsrättelse.**
Förslaget skriver "vid deterministisk förlust (transmittans η = √T)", vilket blandar amplitudtransmission med transmittans. I detta protokoll gäller: **η är transmittansen** (effektandel som passerar, 0 ≤ η ≤ 1); amplitudtransmissionen är √η. Förlustskalningen anges i η.

**R5 — Bokstaven K ersatt av MOM.** Se härkomstnoten.

---

## 1. Sammanfattning

Signaturkandidat MOM prövar om ett optiskt fälts **momentmatris** har en negativ principalminor. Icke-klassicitet i Glauber–Sudarshans mening — att P-funktionen inte är en sannolikhetstäthet — implicerar att vissa hermitiska matriser av normalordnade moment förlorar sin positiva semidefinithet. Villkoret det[A] < 0 för någon principalminor A är då ett vittne.

Kandidatens värde ligger **inte** i att ersätta fyra tester med ett. Under arvsregeln delar MOM rådatakedja med A, B-2 och G och kan därför aldrig räknas som oberoende bekräftelse av dem. Värdet ligger i en annan egenskap: **antibunching är tillräckligt men inte nödvändigt för icke-klassicitet.** Det finns tillstånd som är icke-klassiska utan att g²(0) < 1, utan sub-vakuumvarians och utan Cauchy–Schwarz-brott. Momentmatrisen kan fånga dem. Det — och endast det — är MOM:s unika spår.

Kandidaten prövas därför på en enda avgörande fråga i inträdesprovet: **kan MOM demonstrera ett fall där den fyrar och inget enskilt katalogvittne gör det?** Faller den frågan, saknar MOM unikt spår och ska avvisas — på samma grund som merminspåret föll när det visade sig vara C i flerpartsform.

Kärnmening (bindande): *MOM mäter inte en ny fysikalisk storhet; MOM mäter om katalogens befintliga vittnen tillsammans uttömmer den icke-klassicitet som finns i rådatan.*

---

## 2. Fysikalisk grund

### 2.1 Icke-klassicitet som P-funktionsvillkor

Ett tillstånd kallas klassiskt om det kan skrivas som en statistisk blandning av koherenta tillstånd, det vill säga om Glauber–Sudarshans P-funktion är en äkta sannolikhetstäthet (icke-negativ, ej mer singulär än en delta-funktion). Icke-klassicitet är negationen. Detta är den enda demarkation MOM använder; ingen annan kvantighetsdefinition åberopas.

### 2.2 Momentmatrisen och determinanthierarkin

För en operatorfamilj {f̂_k} bildar man matrisen A med element A_{jk} = ⟨:f̂_j† f̂_k:⟩, där :·: betecknar normalordning. För varje klassiskt tillstånd är A positiv semidefinit, eftersom väntevärdet då är ett P-viktat medelvärde av en positiv semidefinit form. Följaktligen:

> **det[A_S] ≥ 0 för varje principalminor A_S, för varje klassiskt tillstånd.**

En observerad **det[A_S] < 0** är därmed oförenlig med varje klassisk P-funktion. Hierarkin genereras genom att välja olika delmängder S av operatorfamiljen och olika momentordningar (Shchukin, Richter & Vogel, PRA 71, 011802(R); Shchukin & Vogel, PRA 72, 043808).

### 2.3 Vilka katalogvittnen som faktiskt är minorer

| Katalogvittne | Minorform | Status |
|---|---|---|
| A: g²(0) − 1 < 0 (sub-Poisson/antibunching) | 2×2-minor i normalordnade fotontalsmoment | **Etablerad** |
| B-2: Cauchy–Schwarz-kvot > 1 | korsmomentminor mellan två kanaler | **Etablerad** |
| G-kvadratur: ⟨(Δx̂)²⟩ < vakuumnivå | minor innehållande kvadraturvariansen | **Etablerad** |
| D: λ_min(Σ_cal)/V_shot < 1 | — | **Utgår (R3)**: identisk med G-pol; ekvivalens med minorform obevisad |

### 2.4 Konventionslåsning (bindande redan i kandidatstadiet)

Innan data ses låses: (i) normalordningskonvention och operatorfamilj {f̂_k}; (ii) momentordning n och matrisdimension d; (iii) vakuumnormering; (iv) definitionen av V_shot. Låsningen dokumenteras i förregistreringen. Detta är MOM:s motsvarighet till A:s fiducialfönster-låsning och QFD:s mätordningslås.

---

## 3. Vittnesdefinition

### 3.1 Primärobservabel: MOM-det

Primärobservabeln är **det[A_S*]** för en **enda förregistrerad principalminor A_S\***, skattad som plug-in-skattare ur mätta moment. Standardfelet ges av delta-metoden:

> Δdet[A] = Γ / √M_tot

där Γ uttrycks i adjungatmatrisen adj[A] och momentens kovariansmatris, och M_tot är totalt antal mätningar. Konfidensen beräknas som ett ensidigt normaltest:

> konfidens = Φ( −det[A_S*] · √M_tot / Γ ),  tröskel 95 %

(Kanari-Naish et al., arXiv:2502.19624; ramverket är av författarna angivet som giltigt för varje hermitisk momentmatris.)

### 3.2 Minorvalet — bindande metodregel

Detta är protokollets viktigaste metodpunkt och en skärpning av det inlämnade förslaget.

Förslaget noterar korrekt att multipel-test-problemet i litteraturen "löses" genom att **välja en optimal minor** i stället för att simultantesta alla. Men ett val som görs **efter** att mätdatan setts är inte en lösning på multipel-testning — det *är* multipel-testning, utförd informellt. Katalogens förregistreringsprincip och regeln om ingen opportunistisk omkörning gäller därför fullt ut:

> **(MOM-lås)** Minoren A_S* ska väljas före mätdata, på grundval av kalibreringsdata, simulering eller pilotdata från en **disjunkt** datamängd, och skrivas in i förregistreringen. Väljs minoren i efterhand rapporteras utfallet som **exploratoriskt** och kan aldrig bära primärutfallet.

Praktisk vägledning för valet: låg momentordning n och låg dimension d ger genomgående högst konfidens; höga ordningar drunknar i skattningsfel (bekräftat oberoende i arXiv:0812.3015, som noterar att felen för matriser av hög ordning blir stora och kan dölja de sökta effekterna).

Om flera minorer ändå ska rapporteras: förregistrera antalet, använd p⁽²⁾-regeln, och redovisa trial-korrektion explicit.

### 3.3 Demarkationer (bindande)

- **Mot A:** A äger fotonstatistikens andraordningskorrelation som självständigt vittne. MOM äger frågan om huruvida A:s vittne uttömmer rådatans icke-klassicitet. Vid delad rådatakedja gäller arvsregeln — aldrig oberoende bekräftelse.
- **Mot B-2:** samma förhållande; B-2:s Cauchy–Schwarz-vittne är en minor i MOM:s matris.
- **Mot G:** G äger konstruerad sub-vakuumvarians med eget vittne. MOM äger den bredare frågan. G:s vittne är en minor.
- **Mot QFD:** QFD mäter jämviktens fluktuation–respons-konsistens och kräver oberoende mätning av dissipationen χ″. MOM mäter enbart fältets moment och rör aldrig dissipationen. Spåren är disjunkta.
- **Mot D:** ingen demarkation krävs — D:s kvantvittne är identiskt med G-pol (R3).

---

## 4. Bedragare

**Bedragare 1 — skattningsbias vid hög ordning.** Determinanter av högordningsmatriser har stora skattningsfel; delta-metoden arbetar till första ordningen och försummar bias per konstruktion. En negativ determinantskattning kan vara ren skattningsartefakt. Motmedel: låg ordning enligt §3.2, plus bootstrap-kontroll av skattarens fördelning.

**Bedragare 2 — efterhandsvalet av minor.** Behandlas i §3.2 (MOM-lås). Flaggas som `RF_posthoc_minor` om förregistreringen saknar minorspecifikation.

**Bedragare 3 — kalibreringsfel i vakuumnormeringen.** Fel vakuumnivå förskjuter samtliga normalordnade moment och kan skapa falsk negativitet. Motmedel: vakuumreferens mätt i samma körning, samt lögndetektorn i §5.

**Bedragare 4 — fluktuerande förlust.** Vid fluktuerande transmittans adderas en positiv term ∝ Γ⁽ᵏ⁾ till determinanten (Bohmann, Sperling, Semenov & Vogel, PRA 95, 012324, 2017). Denna bedragare är **konservativ**: den kan dölja äkta icke-klassicitet men inte skapa falsk. Den ska ändå dokumenteras, eftersom den påverkar gate-beräkningen i §6.

**Bedragare 5 — deterministisk förlust.** Vid deterministisk transmittans η bevaras determinantens tecken alltid; negativiteten skalar multiplikativt med en potens av η (andra ordningen ~η, fjärde ~η²) och byter aldrig tecken utom vid total förlust η = 0. Deterministisk förlust är alltså **ingen** bedragare för teckenutfallet — endast för styrkan. (R4: η är transmittansen, √η amplitudtransmissionen.)

---

## 5. Nollfamilj och lögndetektor

| Null | Innehåll | Roll |
|---|---|---|
| **N0** | Koherent tillstånd, ideal detektion | Kalibrering; det[A] ≥ 0 krävs |
| **N1** | Termiskt tillstånd, godtycklig temperatur | Klassisk gaussisk motståndare |
| **N2** | Klassisk blandning konstruerad att maximera |det[A]| mot noll underifrån | Hårdaste klassiska motståndaren |
| **N3** | Tekniskt brusgolv (detektorbrus, elektronik) | Instrumentell null |
| **N4** | Fluktuerande förlust med mätt Γ⁽ᵏ⁾ | Konservativ; se bedragare 4 |

**RF_moment_psd (omöjlighetsdetektor).** Momentmatrisen i **symmetriserad, icke-normalordnad** form måste vara positiv semidefinit för varje fysikaliskt tillstånd, klassiskt som kvantmekaniskt. Ett brott där är inte ett vittne utan ett bevis på kalibrerings- eller skattningsfel. Utfallet blir `MOM-cal-fail` — ogiltig mätning, inte nollresultat. Detektorn ansluter till katalogens befintliga familj RF_heisenberg, RF_stokes_bound, RF_negative_occupation och RF_energy_balance.

**Inferens.** Tvådelad enligt katalogens regel: primärtestet mäter avstånd från det[A_S*] = 0 i σ-enheter via §3.1. Nollfamiljen N0–N4 har separat roll: att visa att pipelinen inte klassiskt kan nå under noll. Vid informationskriterie-oavgjort vinner den klassiska modellen.

---

## 6. Mätarkitektur och gate G_MOM

**Minimikrav:** balanserad homodyn- eller fotonräknande detektion med (i) mätt vakuumreferens, (ii) känd och stabil transmittans η, (iii) tillräcklig statistik M_tot för att Γ/√M_tot ska ligga under förväntad |det|, (iv) disjunkt kalibrerings- eller pilotdatamängd för minorvalet enligt §3.2.

**Tomografi krävs inte.** Determinanten kan mätas direkt: multikopieobservabler vars väntevärde sammanfaller med determinanten av momentmatrisen realiseras med linjär optik och fotontalsdetektorer (Arnhem, Griffet & Cerf, PRA 106, 043705, 2022). Detta sänker kandidatens infrastrukturtröskel avsevärt och gör den körbar på C/G-labbets befintliga kedja.

**Admissibility-gate:**

> **G_MOM = |det[A_S*]|_förväntad · √M_tot / Γ**

Gaten är alltså identisk med konfidensargumentets exponent och anger hur många σ uppställningen *kan* nå under den förregistrerade hypotesen. G_MOM < 2 innebär att uppställningen inte kan avgöra frågan; körningen ska då inte räknas som nollresultat utan som otillräcklig.

---

## 7. Klassning

| Klass | Villkor |
|---|---|
| `MOM-cal-fail` | RF_moment_psd fyrar, eller G_MOM < 2, eller vakuumreferens saknas. **Ogiltig mätning — inte nollresultat.** |
| `MOM-none` | det[A_S*] ≥ 0 inom felmarginal |
| `MOM-classical-consistent` | det[A_S*] ≥ 0 och nollfamiljen N0–N4 förklarar data lika bra eller bättre |
| `MOM-nonclassical` | det[A_S*] < 0 med ≥ 95 % konfidens, förregistrerad minor, N0–N4 uteslutna, RF_moment_psd tyst |
| `MOM-nonclassical-unique` | som ovan, **och** inget enskilt katalogvittne (A, B-2, G) fyrar på samma rådata |

`MOM-nonclassical-unique` är kandidatens enda klass som bär ny information. `MOM-nonclassical` utan unique-tillägget är per arvsregeln en omformulering av ett redan befintligt vittne och får inte redovisas som oberoende bekräftelse.

Ordet "quantum" används inte i klassnamnen. MOM:s vittne är ett P-funktionsvittne, vilket är en icke-klassicitetsutsaga; förtjänad nomenklatur kräver att den formuleringen behålls exakt.

---

## 8. Inträdesprovet

### K1 — utfallsmatrisen (nio injektioner)

Varje injektion körs genom fyra pipelines: MOM, A, B-2, G. Krävd utfallsmatris:

| # | Injektion | MOM | A | B-2 | G |
|---|---|---|---|---|---|
| 1 | Koherent tillstånd | none | none | none | none |
| 2 | Termiskt tillstånd | none | none | none | none |
| 3 | Enfotontillstånd | nonclassical | fyrar | — | — |
| 4 | Squeezat vakuum | nonclassical | — | — | fyrar |
| 5 | Tvillingstrålar (korskorrelerade) | nonclassical | — | fyrar | — |
| 6 | **Icke-klassiskt tillstånd med g²(0) ≥ 1, ingen sub-vakuumvarians, inget CS-brott** | **nonclassical-unique** | **none** | **none** | **none** |
| 7 | Klassisk blandning konstruerad att efterlikna rad 6 | none/N2 | none | none | none |
| 8 | Enfoton med deterministisk förlust η = 0,3 | nonclassical (svagare) | fyrar svagt | — | — |
| 9 | Enfoton med fluktuerande förlust | none/maskerad | maskerad | — | — |

**Rad 6 är provet.** Om ingen realiserbar injektion kan konstrueras där MOM fyrar och samtliga tre enskilda vittnen tiger, saknar kandidaten unikt spår och **ska avvisas**. Rad 7 är dess spegel: den klassiska imitationen av rad 6 måste ge `none`, annars är vittnet inte diskriminerande.

Rad 1 och 2 får aldrig ge `nonclassical`. Ett sådant utfall underkänner hela protokollet, inte bara körningen.

### K2 — fyra kanariefåglar (obligatoriska)

1. **Vakuumkanariefågeln.** Ren vakuumreferens ska ge det[A] = 0 inom felmarginal. Avvikelse → `MOM-cal-fail`.
2. **PSD-kanariefågeln.** RF_moment_psd får inte fyra på någon giltig kalibreringskörning.
3. **Blindvalskanariefågeln.** En oberoende operatör väljer minoren utan att se mätdata. Om det förregistrerade valet och blindvalet skiljer sig ska avvikelsen dokumenteras före upplåsning.
4. **Ordningskanariefågeln.** Samma data analyserad vid n och n+1: om konfidensen ökar monotont med ordningen är det ett tecken på skattningsartefakt, inte på starkare vittne.

### K3 — protokollkravet

Förregistreringen ska innehålla: operatorfamilj {f̂_k}, momentordning n, dimension d, den valda minoren A_S*, M_tot, förväntat |det|, G_MOM, nollfamiljens parametrar och trial-regeln vid flera minorer. Saknas minorspecifikationen är körningen exploratorisk per definition.

---

## 9. Relation till katalogen

### 9.1 Familjetillhörighet

MOM tillhör den **passiva optiska familjen** tillsammans med A, B och G, och delar mätkedja med C/G-labbet. Ingen ny infrastruktur krävs (§6). Kandidaten är därmed billig att pröva — vilket är ett argument för att pröva den, inte för att anta den.

### 9.2 Unikhetsrummet

A mäter andraordningskorrelationens sub-Poisson-karaktär. B-2 mäter korskorrelationens Cauchy–Schwarz-brott. G mäter kvadraturvariansen mot vakuumnivån. MOM mäter **den positiva semidefinitheten hos momentmatrisen som helhet** — alltså om det finns icke-klassicitet i rådatan som de tre projektionerna missar. Det spåret existerar därför att antibunching är tillräckligt men inte nödvändigt för icke-klassicitet.

### 9.3 Arvsregeln

MOM och A/B-2/G delar rådatakedja. De räknas **aldrig** som oberoende bekräftelse av varandra. En `MOM-nonclassical` som sammanfaller med ett fyrande A-vittne är en omformulering, inte en andra observation. Endast `MOM-nonclassical-unique` bär självständig information.

### 9.4 Kandidatens roll som strukturell botten

MOM är avsiktligt en **lågt liggande, brett förenande** kandidat snarare än ett starkt enskilt vittne. Katalogen tjänar på att ha både högt och lågt: en gemensam momentmatris-formalism ger framtida kandidater en definierad plats att ansluta till, och gör frågan "är detta ett nytt vittne eller en ny minor av ett gammalt?" mekaniskt prövbar. Det är ett arkitektoniskt värde skilt från kandidatens egen upptäcktspotential och ska inte förväxlas med den.

---

## 10. Öppna frågor

1. **Minormängdens storlek i enmodsfallet.** Antalet distinkta principalminorer vid ordning n och dimension d måste räknas explicit; siffran 31 från förslaget gäller tvåmodsfallet (R2).
2. **Är λ_min-villkoret en minorform?** D:s D_Q = λ_min(Σ_cal)/V_shot < 1 är ett minsta-egenvärde-villkor. Om det kan skrivas som principalminor-determinantvillkor återinträder D i bryggan; om inte, står R3 fast. Kräver bevis.
3. **Biasens storlek.** Delta-metoden försummar bias per konstruktion. Bias-formeln för determinantskattaren kunde inte verifieras i granskningsomgången och behöver egen härledning eller bootstrap-kvantifiering.
4. **Korrelation mellan minorer.** Om flera minorer rapporteras är de starkt korrelerade; korrekt trial-korrektion kräver deras kovariansstruktur, som inte är behandlad i den granskade litteraturen.
5. **Tvåmodsutökning.** PRL 95, 230502-hierarkin (NPT/separabilitet) är ett separat spår som eventuellt hör hemma nära C. Prövas inte i denna omgång.

---

## 11. Beslutsgång

(1) Protokollet granskas hårt till v0.1, i linje med hur QFD hanterades. (2) K1-matrisens nio injektioner implementeras, med rad 6 som avgörande. (3) K2:s fyra kanariefåglar körs. (4) Utfallsmatrisen prövas mot §8:s krav — rad 6 avgör. (5) Vid godkänt öppnas koden MOM som **Klass II-medlem** med rapport v0.1; vid underkänt arkiveras kandidaten med dokumenterade skäl. Ingen katalogdel refererar MOM som medlem före steg 5.

---

## 12. Slutsats

Momentmatris-kandidaten kommer till antagningsnämnden med sin kärnidé bekräftad och fem fel rättade. Dess ärliga anspråk är litet: den ger en trial-korrektion i stället för flera, styrkevinsten äts delvis av att en enda minor väljs, och under arvsregeln bekräftar den aldrig sina syskon. Men den ställer en fråga ingen befintlig signatur ställer — *finns det icke-klassicitet i rådatan som våra vittnen missar?* — och den frågan har ett entydigt svar för varje mätning.

Kandidaten faller eller står på rad 6 i utfallsmatrisen. Kan MOM inte visa ett enda fall där den ser vad A, B-2 och G inte ser, är den en omskrivning och inte en signatur. Det är samma prov merminspåret föll på, och det är rätt att MOM prövas mot det.
