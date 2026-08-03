// Kartläggning: vilka signaturer i katalogen A–M går att köra på IBM:s
// gate-model-shotdata, och vilka gör det inte — med skäl.
//
// De omöjliga är lika viktiga som de möjliga. Att A, B, F och G inte går på
// data utan tidsstämplar är ett resultat om KATALOGENS RÄCKVIDD, inte en brist
// i experimentet. Skriv aldrig om det till "ännu ej implementerat".
//
// Körs:  npx tsx scripts/ibmSignatureMap.ts

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { readIbmResult } from './lib/ibmBitArray';
import { merminValue, xParityExpectation, type MerminResult } from './lib/ibmMerminBridge';

const FIX = join(process.cwd(), 'fixtures/ibm');
const load = (jobId: string) =>
  readIbmResult(JSON.parse(readFileSync(join(FIX, `sanitized_job-${jobId}-result.json`), 'utf-8')));

const JOB_CHSH = 'd9ndf7gqs0bc73e3adu0';
const JOB_GHZ = 'd9nimlk60llc73ca58e0';
/** Mermin-replikat, kronologiskt. Tiderna är UTC ur jobbens info-filer. */
const JOBS_MERMIN = [
  'd9npt5oqs0bc73e3ns90', // 2026-08-02 19:46
  'd9nq9lk60llc73cadj8g', // 2026-08-02 20:13
  'd9nv3nssfqic73argcq0', // 2026-08-03 01:41
  'd9nvi6mij12s73fuc1ig', // 2026-08-03 02:12
  'd9o3kmk60llc73canv90', // 2026-08-03 06:51
];

/**
 * Post hoc-gräns för nivåskiftet. Söndagskörningarna (index < 2) ligger lågt,
 * måndagskörningarna högt. Gränsen är vald EFTER att datan setts och är därmed
 * EXPLORATIV — den får inte behandlas som ett förregistrerat test. Redovisas
 * enbart som en beskrivning av formen, aldrig som ett p-värde att luta sig mot.
 */
const POST_HOC_SPLIT = 2;

type Feasibility = 'går' | 'går delvis' | 'går inte';

interface Row {
  id: string;
  nameSv: string;
  feasibility: Feasibility;
  /** Vad datatypen saknar, eller vad som faktiskt kunde köras. */
  reasonSv: string;
  /** Högsta klassning datan kan bära, oavsett utfall. */
  ceilingSv: string;
}

// ---------------------------------------------------------------------------
// Kartan. Ordnad efter katalogen, inte efter utfall.
// ---------------------------------------------------------------------------

const MAP: Row[] = [
  {
    id: 'A',
    nameSv: 'g²(0) — icke-klassisk fotonstatistik',
    feasibility: 'går inte',
    reasonSv:
      'g²(τ) är per definition en KOINCIDENSSTATISTIK över en tidsaxel: ' +
      'g²(0) = ⟨n₁(t)n₂(t)⟩/⟨n₁⟩⟨n₂⟩ kräver att man kan säga vilka detektionshändelser ' +
      'som inföll inom samma koincidensfönster. Gate-model-shots har ingen ' +
      'tidsstämpel alls — ett shot är ett odelbart mätutfall, inte en ström av ' +
      'ankomsttider. Dessutom finns ingen fotonantalsfrihetsgrad: en qubitmätning ' +
      'ger en bit, inte ett klick från en fotondetektor med dödtid och efterpulsning. ' +
      'A:s hela golvmönster (kontrastgolv, modutspädning ε~1/M) saknar motsvarighet.',
    ceilingSv: 'Ej tillämplig (notApplicable)',
  },
  {
    id: 'B',
    nameSv: 'Polarisation–tid (rådata för D/E/F)',
    feasibility: 'går inte',
    reasonSv:
      'B:s estimator bygger på g²_ab-matrisen och Stokes-kovariansen C_ij, båda ' +
      'beräknade ur tidsupplösta polarisationsmärkta detektioner i tre baser ' +
      '(HV/DA/RL). IBM-datan har ingen tidsaxel och ingen polarisationsfrihetsgrad. ' +
      'Basrotationerna X/Y/Z är visserligen en formell analogi till HV/DA/RL, men ' +
      'R_CS-vittnet mäter förhållandet mellan koincidens- och singelrater — en ' +
      'ratio av RATER, som inte existerar utan en mättid att dividera med. ' +
      'B-2-blockeringen i rapporten gäller dessutom oberoende av datakälla.',
    ceilingSv: 'Ej tillämplig (notApplicable)',
  },
  {
    id: 'C',
    nameSv: 'CHSH / Bell',
    feasibility: 'går',
    reasonSv:
      'Kör pardirekt via computeS(). Paret existerar per konstruktion i varje shot ' +
      '(båda qubitarna mäts samtidigt), så koincidensfönstret behövs inte — det är ' +
      'därför C är den enda A–F-signatur som överlever översättningen orörd. ' +
      'Se scripts/importIbmChsh.ts för reproduktionskravet.',
    ceilingSv: 'C-hardware-consistent — locality/freedom-of-choice/detection öppna',
  },
  {
    id: 'D',
    nameSv: 'Stabil invariant',
    feasibility: 'går delvis',
    reasonSv:
      'D:s KODADE estimator (analysis/D_invariant.ts) går inte — den invarianten är ' +
      'egenvärdena hos Stokes-kovariansen, som ärver B:s rådata (arvsregeln) och ' +
      'därmed faller med B. Men D:s METOD går: en basoberoende invariant mätt vid ' +
      'S ≥ 2 OBEROENDE observationstillfällen, testad för separation + stabilitet + ' +
      'kontrast. Mermin-korrelatorvektorn i två skilda jobb ger exakt det — och till ' +
      'skillnad från plattformens pseudosessioner (D-RF-PSEUDOSESSION) är sessionerna ' +
      'här ÄKTA. Kontrastkravet K_D är däremot inte mätt: ingen omgivningsvariabel ' +
      'registrerades, så vi kan inte visa att omgivningen varierade mer än invarianten.',
    ceilingSv:
      'D-none (D v0.2 §10: konstantmodellen förkastad ⇒ D-none). ' +
      'Redovisas hellre som D-INSPIRERAD LONGITUDINELL MERMIN-DIAGNOSTIK, ' +
      'ej klassificerbar som signatur D.',
  },
  {
    id: 'E',
    nameSv: 'Lågdim / kod-likhet',
    feasibility: 'går inte',
    reasonSv:
      'E:s deltagarkvot beräknas på ett 6-kanalers räknefeature BINNAT I TID ' +
      '(n_H,n_V,n_D,n_A,n_R,n_L per tidsbin). Med 8 PUB:ar × 4096 shots finns det ' +
      'ingen tidsaxel att binna längs — bara ett shot-index, och shot-index är ' +
      'utbytbart (i.i.d. per konstruktion). En kovariansmatris över utbytbara ' +
      'observationer har ingen meningsfull effektiv dimension: varje struktur man ' +
      'ser är shot noise. Att binna på shot-index vore att uppfinna en tidsaxel, ' +
      'vilket BRYGGSPEC §0 uttryckligen förbjuder.',
    ceilingSv: 'Ej tillämplig (notApplicable)',
  },
  {
    id: 'F',
    nameSv: 'Non-Markovianitet / minne',
    feasibility: 'går inte',
    reasonSv:
      'F letar en revival-topp i g²(τ)-svansen mot en monotont avklingande ' +
      'Markov-baslinje. Hela observabeln ÄR en funktion av τ. Utan tidsaxel finns ' +
      'ingen τ, ingen svans och ingen baslinje. Detta är den renaste omöjligheten i ' +
      'listan: det saknas inte statistik, det saknas den axel observabeln lever på. ' +
      'F på gate-model-data skulle kräva ett helt annat protokoll (processtomografi ' +
      'över varierande väntetid), vilket är en annan simuleringsklass (CLAUDE.md §6.1).',
    ceilingSv: 'Ej tillämplig (notApplicable)',
  },
  {
    id: 'G',
    nameSv: 'Kvadratursqueezing',
    feasibility: 'går inte',
    reasonSv:
      'G är en kontinuerlig-variabel-egenskap: fältkvadraturerna X̂,P̂ mätta med ' +
      'homodyndetektion, där vittnet är Var(X̂_θ) < 1/2 mot vakuumnivån. IBM ger ' +
      'projektiva mätningar på DISKRETA qubitar — utfallsrummet är {0,1}, inte ℝ. ' +
      'Det finns ingen kvadratur att mäta variansen hos. Detta är samma gräns som ' +
      'gör G till en stubbe i simuleringen (CLAUDE.md §6.1) och den gäller lika hårt ' +
      'åt hårdvaruhållet: en gate-model-processor är fel instrumentklass, inte fel ' +
      'kalibrering.',
    ceilingSv: 'Ej tillämplig (notApplicable)',
  },
  {
    id: 'H',
    nameSv: 'Sensornätverk (fältavtryck)',
    feasibility: 'går inte',
    reasonSv:
      'H kräver GEOGRAFISKT SEPARERADE sensorer med synkroniserad absolut tid, och ' +
      'letar korrelerade avvikelser som färdas mellan noder. Alla våra qubitar sitter ' +
      'i samma kryostat på ibm_marrakesh, millimeter isär, och shots har ingen ' +
      'absolut tid. Ingen del av H:s geometri finns i datan. (Att köra samma krets på ' +
      'två backends vore inte H heller — det saknas fortfarande tidsupplösning för ' +
      'att se en avvikelse propagera.)',
    ceilingSv: 'Ej tillämplig (notApplicable)',
  },
  {
    id: 'M',
    nameSv: 'Eko / minne (interventionsprotokoll)',
    feasibility: 'går inte',
    reasonSv:
      'M kräver en INTERVENTION mitt i utvecklingen — en störning appliceras, och ' +
      'ekot söks i systemets senare svar. Våra kretsar är rena prepare-and-measure ' +
      'utan mellanliggande operation eller väntetid. Datan innehåller alltså ingen ' +
      'intervention att söka eko efter. Detta är den enda posten i listan som är ' +
      'omöjlig av EXPERIMENTDESIGN snarare än av datatyp: M skulle gå att köra på ' +
      'IBM med en annan krets (delay + mid-circuit-operation), men inte på denna data.',
    ceilingSv: 'Ej tillämplig — men åtkomlig med ny kretsdesign',
  },
];

// ---------------------------------------------------------------------------
// D-försöket. Kör D:s METOD på Mermin-korrelatorvektorn över två äkta sessioner.
// ---------------------------------------------------------------------------

export interface ConstantModelFit {
  /** Viktat medelvärde under konstanthypotesen. */
  mBar: number;
  sigmaBar: number;
  /** χ² = Σ w_i (M_i − M̄)², w_i = 1/σ_i². */
  chi2: number;
  df: number;
}

/**
 * Konstantmodelltest: är serien av M-värden förenlig med ETT konstant värde?
 *
 * Detta ersätter den parvisa jämförelsen som var allt två punkter tillät. Med
 * S ≥ 3 sessioner testar man hela serien mot en modell istället för att jaga
 * enskilda steg — samma storhet D-rapporten kallar stabilitetsbenet, och den
 * enda formuleringen som inte får fler frihetsgrader varje gång man lägger
 * till en punkt.
 */
export function constantModelFit(values: Array<{ M: number; sigmaM: number }>): ConstantModelFit {
  if (values.length < 2) throw new Error('Konstantmodelltestet kräver minst 2 punkter');
  const w = values.map((v) => 1 / v.sigmaM ** 2);
  const W = w.reduce((a, b) => a + b, 0);
  const mBar = values.reduce((a, v, i) => a + v.M * w[i], 0) / W;
  const chi2 = values.reduce((a, v, i) => a + w[i] * (v.M - mBar) ** 2, 0);
  return { mBar, sigmaBar: Math.sqrt(1 / W), chi2, df: values.length - 1 };
}

/**
 * Vektortest: konstantmodell PER KORRELATOR, summerad.
 *
 * Skalär-M är en summa där kompenserande termförändringar tar ut varandra — en
 * term kan röra sig signifikant utan att synas i M. Vektortestet är därför det
 * strängare stabilitetstestet och det som ligger närmast D:s invariantbegrepp
 * (en invariant är en VEKTOR, inte ett tal).
 */
export interface VectorFitResult {
  perTerm: Array<{ bases: string; chi2: number; eBar: number }>;
  chi2: number;
  df: number;
}

export function vectorConstantFit(sessions: MerminResult[]): VectorFitResult {
  const nTerms = sessions[0].terms.length;
  const perTerm: VectorFitResult['perTerm'] = [];
  let chi2 = 0;
  for (let k = 0; k < nTerms; k++) {
    const pts = sessions.map((s) => {
      const t = s.terms[k];
      return { M: t.expectation, sigmaM: Math.sqrt((1 - t.expectation ** 2) / t.shots) };
    });
    const fit = constantModelFit(pts);
    perTerm.push({ bases: sessions[0].terms[k].bases, chi2: fit.chi2, eBar: fit.mBar });
    chi2 += fit.chi2;
  }
  return { perTerm, chi2, df: nTerms * (sessions.length - 1) };
}

interface DAttempt {
  sessions: Array<{ jobId: string; utc: string; ghz: MerminResult; control: MerminResult }>;
  signalFit: ConstantModelFit;
  controlFit: ConstantModelFit;
  vectorFit: VectorFitResult;
  /** Post hoc-uppdelning: nivå före/efter, och plateaufit på den senare gruppen. */
  earlyFit: ConstantModelFit;
  lateFit: ConstantModelFit;
  lateControlFit: ConstantModelFit;
  lateVectorFit: VectorFitResult;
  levelShiftSigma: number;
  /** GHZ-armen mot kontrollarmen. Detta är INTE D-sep (se MAP-posten för D). */
  armSeparationSigma: number;
  steps: Array<{ delta: number; sigma: number }>;
  kdMeasured: false;
}

function dAttempt(): DAttempt {
  const sessions = JOBS_MERMIN.map((jobId) => {
    const pubs = load(jobId);
    const info = JSON.parse(
      readFileSync(join(FIX, `sanitized_job-${jobId}-info.json`), 'utf-8'),
    );
    return {
      jobId,
      utc: String(info.created).slice(0, 16).replace('T', ' '),
      ghz: merminValue(pubs, 'ghz'),
      control: merminValue(pubs, 'control'),
    };
  });

  // Stabilitetsbenet: konstantmodell för signal OCH kontroll. Kontrollen är
  // referensen — den kör samma analyskedja på ett separabelt tillstånd, så en
  // instabilitet som syns i båda vore analysartefakt, inte fysik.
  const signalFit = constantModelFit(sessions.map((s) => s.ghz));
  const controlFit = constantModelFit(sessions.map((s) => s.control));

  const vectorFit = vectorConstantFit(sessions.map((s) => s.ghz));

  // Post hoc-uppdelning (EXPLORATIV, se POST_HOC_SPLIT).
  const early = sessions.slice(0, POST_HOC_SPLIT);
  const late = sessions.slice(POST_HOC_SPLIT);
  const earlyFit = constantModelFit(early.map((s) => s.ghz));
  const lateFit = constantModelFit(late.map((s) => s.ghz));
  const lateControlFit = constantModelFit(late.map((s) => s.control));
  const lateVectorFit = vectorConstantFit(late.map((s) => s.ghz));
  const levelShiftSigma =
    (lateFit.mBar - earlyFit.mBar) / Math.hypot(lateFit.sigmaBar, earlyFit.sigmaBar);

  // ARMSEPARATION — GHZ-armen mot kontrollarmen. Detta är INTE D-sep: D-sep är
  // ett Mahalanobis-avstånd mot empiriska surrogatfördelningar (D v0.2 §9.3).
  const armSeparationSigma =
    (signalFit.mBar - controlFit.mBar) / Math.hypot(signalFit.sigmaBar, controlFit.sigmaBar);

  const steps = sessions.slice(1).map((s, i) => {
    const prev = sessions[i].ghz;
    const delta = s.ghz.M - prev.M;
    return { delta, sigma: delta / Math.hypot(prev.sigmaM, s.ghz.sigmaM) };
  });

  return {
    sessions, signalFit, controlFit, vectorFit,
    earlyFit, lateFit, lateControlFit, lateVectorFit, levelShiftSigma,
    armSeparationSigma, steps, kdMeasured: false,
  };
}

// ---------------------------------------------------------------------------

function main(): void {
  console.log('Signaturkartläggning — IBM gate-model-shotdata');
  console.log('='.repeat(72));
  console.log('Material: 4 jobb på ibm_marrakesh, 2026-08-02, sanerade fixturer.');
  console.log('Datatyp: shots utan tidsstämpel, diskreta utfall, ingen fotonantalsbas.\n');

  const width = { id: 3, feas: 11 };
  console.log('ÖVERSIKT');
  console.log('-'.repeat(72));
  for (const r of MAP) {
    console.log(
      `${r.id.padEnd(width.id)} ${r.feasibility.padEnd(width.feas)} ${r.nameSv}`,
    );
  }

  console.log('\n\nSKÄL PER SIGNATUR');
  console.log('='.repeat(72));
  for (const r of MAP) {
    console.log(`\n[${r.id}] ${r.nameSv} — ${r.feasibility.toUpperCase()}`);
    console.log('-'.repeat(72));
    for (const line of wrap(r.reasonSv, 72)) console.log(line);
    console.log(`  Tak: ${r.ceilingSv}`);
  }

  // --- Faktiska körningar --------------------------------------------------
  console.log('\n\nFAKTISKA KÖRNINGAR PÅ MATERIALET');
  console.log('='.repeat(72));

  const chshPubs = load(JOB_CHSH);
  console.log(`\n[C] CHSH-jobb ${JOB_CHSH}: ${chshPubs.length} PUB:ar × ${chshPubs[0].bitstrings.length} shots`);
  console.log('    Se scripts/importIbmChsh.ts — S = 2.5317383, sigma = 0.0241785 (21.99 sigma).');

  const d = dAttempt();
  console.log('\n[D] Longitudinell Mermin-diagnostik (D-INSPIRERAD, ej signatur D)');
  console.log('-'.repeat(72));
  console.log('    Observabel: Mermin-korrelatorvektorn (⟨XXX⟩,⟨XYY⟩,⟨YXY⟩,⟨YYX⟩)');
  console.log(`    Sessioner: ${d.sessions.length} ÄKTA (skilda jobb) — inte pseudosessioner\n`);
  console.log('    UTC               jobb                   M (GHZ)            M (kontroll)');
  for (const s of d.sessions) {
    console.log(
      `    ${s.utc}  ${s.jobId}  ` +
        `${s.ghz.M.toFixed(4)} +/- ${s.ghz.sigmaM.toFixed(4)}  ` +
        `${s.control.M.toFixed(4)} +/- ${s.control.sigmaM.toFixed(4)}`,
    );
  }

  console.log('\n    Steg för steg (GHZ):');
  d.steps.forEach((st, i) => {
    console.log(
      `      ${i + 1} -> ${i + 2}:  dM = ${st.delta >= 0 ? '+' : ''}${st.delta.toFixed(4)}   ` +
        `${st.sigma >= 0 ? '+' : ''}${st.sigma.toFixed(2)} sigma`,
    );
  });

  console.log('\n    Konstantmodelltest, SKALAR M (viktat chi2 mot gemensamt medelvarde):');
  console.log(
    `      signal   : chi2 = ${d.signalFit.chi2.toFixed(1)}, df = ${d.signalFit.df}   ` +
      `Mbar = ${d.signalFit.mBar.toFixed(4)} +/- ${d.signalFit.sigmaBar.toFixed(4)}  -> FORKASTAS`,
  );
  console.log(
    `      kontroll : chi2 = ${d.controlFit.chi2.toFixed(1)}, df = ${d.controlFit.df}   ` +
      `Mbar = ${d.controlFit.mBar.toFixed(4)} +/- ${d.controlFit.sigmaBar.toFixed(4)}  -> HALLER`,
  );

  console.log('\n    Konstantmodelltest, VEKTOR (per korrelator, summerad):');
  for (const t of d.vectorFit.perTerm) {
    console.log(`      ${t.bases}: chi2 = ${t.chi2.toFixed(2).padStart(6)}   ebar = ${t.eBar.toFixed(4)}`);
  }
  console.log(`      SUMMA  : chi2 = ${d.vectorFit.chi2.toFixed(1)}, df = ${d.vectorFit.df}`);
  console.log('      Skalar-M ar en SUMMA — kompenserande termforandringar tar ut');
  console.log('      varandra och syns inte i M. Vektortestet ar det strangare, och');
  console.log('      ligger narmare D:s invariantbegrepp (en invariant ar en vektor).');

  console.log('\n    Post hoc-uppdelning (EXPLORATIV — gransen vald efter att datan setts):');
  console.log(
    `      tidiga ${d.earlyFit.df + 1} : Mbar = ${d.earlyFit.mBar.toFixed(4)} +/- ${d.earlyFit.sigmaBar.toFixed(4)}`,
  );
  console.log(
    `      senare ${d.lateFit.df + 1} : Mbar = ${d.lateFit.mBar.toFixed(4)} +/- ${d.lateFit.sigmaBar.toFixed(4)}   ` +
      `chi2 = ${d.lateFit.chi2.toFixed(2)}, df = ${d.lateFit.df}  -> platan haller`,
  );
  console.log(
    `      vektor senare: chi2 = ${d.lateVectorFit.chi2.toFixed(2)}, df = ${d.lateVectorFit.df}`,
  );
  console.log(`      nivaskifte   : ${d.levelShiftSigma.toFixed(2)} sigma`);
  console.log('      Bilden ar alltsa TIDIG NIVAFORANDRING + PLATA, inte fortlopande');
  console.log('      drift. Forandringspunkten ar post hoc och far inte behandlas som');
  console.log('      ett forregistrerat test.');

  console.log('\n    KLASSNING enligt D v0.2 §10:');
  console.log('    ------------------------------------------------------------------');
  console.log('    D-stab      : konstantmodellen FORKASTAS  -> §10 utloser D-none');
  console.log('    D-sep       : EJ MATT — D-sep ar Mahalanobis-avstand mot empiriska');
  console.log('                  surrogatfordelningar med p(2)-disciplin (§9.3). Det vi');
  console.log(`                  mater ar GHZ-arm mot kontrollarm: ${d.armSeparationSigma.toFixed(1)} sigma`);
  console.log('                  ARMSEPARATION — en annan storhet.');
  console.log('    D-kontrast  : EJ MATT — ingen omgivningsvariabel registrerad');
  console.log('');
  console.log('    => D-none. Redovisas hellre som D-INSPIRERAD LONGITUDINELL');
  console.log('       MERMIN-DIAGNOSTIK, ej klassificerbar som signatur D: vektorn');
  console.log('       har aldrig visats invariant under de passiva bastransformationer');
  console.log('       D kraver.');

  console.log('\n    VAD VARIATIONEN LOKALISERAS TILL:');
  console.log('    Armarna delar qubitar, jobb, shots, analyskedja, bitordning och');
  console.log('    teckenkonvention — men INTE kretsdjup: GHZ-armen har 2 tvaqubits-');
  console.log('    grindar och djup ~12, kontrollen har 0 och djup 1-4. Variationen');
  console.log('    lokaliseras darfor till ENTANGLING-KRETSENS PRESTANDA (tvaqubits-');
  console.log('    grindfidelitet, GHZ-preparation, trequbitskoherens) — inte till ett');
  console.log('    abstrakt "tillstand" isolerat fran grindkedjan.');
  console.log('');
  console.log('    Sprakgrans: sigma_M ar REN SHOT NOISE. Kontrollen ar "forenlig med');
  console.log('    konstantmodell inom shot-noise-osakerheten", inte "bevisligen');
  console.log('    konstant" — systematikbudgeten ar omatt.');

  const ghzPubs = load(JOB_GHZ);
  console.log('\n[koherensindikator] GHZ-jobb ' + JOB_GHZ);
  console.log('-'.repeat(72));
  const x3 = xParityExpectation(ghzPubs[1]);
  const x5 = xParityExpectation(ghzPubs[3]);
  console.log(`    <X^3> = ${x3.value.toFixed(4)} +/- ${x3.sigma.toFixed(4)}`);
  console.log(`    <X^5> = ${x5.value.toFixed(4)} +/- ${x5.sigma.toFixed(4)}`);
  console.log('    Ingen katalogsignatur — en enda paritetspunkt, inte ett');
  console.log('    stabilisatorvittne. Redovisas som indikator, inte som fynd.');

  console.log('\n\nSAMMANFATTNING');
  console.log('='.repeat(72));
  const go = MAP.filter((r) => r.feasibility === 'går').map((r) => r.id);
  const partial = MAP.filter((r) => r.feasibility === 'går delvis').map((r) => r.id);
  const no = MAP.filter((r) => r.feasibility === 'går inte').map((r) => r.id);
  console.log(`  Går:        ${go.join(', ')}`);
  console.log(`  Går delvis: ${partial.join(', ')}`);
  console.log(`  Går inte:   ${no.join(', ')}`);
  console.log('\n  Gemensam orsak för A, B, E, F: ingen tidsaxel. Fyra av katalogens');
  console.log('  åtta signaturer förutsätter tidsupplöst detektion, inte bara');
  console.log('  statistik. Det är en utsaga om katalogens räckvidd.');
  console.log('  G och H faller på instrumentklass (CV-fält respektive geografi),');
  console.log('  M på experimentdesign (ingen intervention i kretsen).');
}

function wrap(text: string, width: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = ' ';
  for (const w of words) {
    if (cur.length + w.length + 1 > width) {
      lines.push(cur);
      cur = ' ';
    }
    cur += (cur.length > 1 ? ' ' : ' ') + w;
  }
  if (cur.trim()) lines.push(cur);
  return lines;
}

// Kör bara när skriptet startas direkt. `constantModelFit` importeras av
// testsviten, och den ska inte trigga en hel utskriftskörning.
if (process.argv[1] && /ibmSignatureMap\.ts$/.test(process.argv[1])) {
  main();
}
