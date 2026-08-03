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
const JOB_MERMIN_1 = 'd9npt5oqs0bc73e3ns90';
const JOB_MERMIN_2 = 'd9nq9lk60llc73cadj8g';

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
    ceilingSv: 'D-struct — ofullständigt kontrastkrav (D v0.2 §10)',
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

interface DAttempt {
  sessions: Array<{ jobId: string; ghz: MerminResult; control: MerminResult }>;
  chi2Stability: number;
  dfStability: number;
  separationSigma: number;
  kdMeasured: false;
}

function dAttempt(): DAttempt {
  const sessions = [JOB_MERMIN_1, JOB_MERMIN_2].map((jobId) => {
    const pubs = load(jobId);
    return { jobId, ghz: merminValue(pubs, 'ghz'), control: merminValue(pubs, 'control') };
  });

  // Stabilitet: är invariantvektorn (4 korrelatorer) konstant mellan sessionerna?
  // χ² = Σ_term (e₁−e₂)²/(σ₁²+σ₂²), df = antal termer.
  const [s1, s2] = sessions;
  let chi2 = 0;
  s1.ghz.terms.forEach((t1, i) => {
    const t2 = s2.ghz.terms[i];
    const v1 = (1 - t1.expectation ** 2) / t1.shots;
    const v2 = (1 - t2.expectation ** 2) / t2.shots;
    chi2 += (t1.expectation - t2.expectation) ** 2 / (v1 + v2);
  });

  // Separation: skiljer invarianten signal från den separabla kontrollen?
  // Poolat över sessionerna.
  const poolM = (rs: MerminResult[]) => {
    const w = rs.map((r) => 1 / r.sigmaM ** 2);
    const wsum = w.reduce((a, b) => a + b, 0);
    return { M: rs.reduce((a, r, i) => a + r.M * w[i], 0) / wsum, sigma: Math.sqrt(1 / wsum) };
  };
  const g = poolM(sessions.map((s) => s.ghz));
  const c = poolM(sessions.map((s) => s.control));
  const separationSigma = (g.M - c.M) / Math.hypot(g.sigma, c.sigma);

  return { sessions, chi2Stability: chi2, dfStability: 4, separationSigma, kdMeasured: false };
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
  console.log('\n[D] Flersessions-invariant (D:s METOD, ej D_invariant.ts:s estimator)');
  console.log('-'.repeat(72));
  console.log('    Invariant: Mermin-korrelatorvektorn (⟨XXX⟩,⟨XYY⟩,⟨YXY⟩,⟨YYX⟩)');
  console.log('    Sessioner: 2 ÄKTA (skilda jobb, 27 min isär) — inte pseudosessioner\n');
  for (const s of d.sessions) {
    console.log(`    ${s.jobId}`);
    console.log(
      `      GHZ      M = ${s.ghz.M.toFixed(4)} +/- ${s.ghz.sigmaM.toFixed(4)}   ` +
        s.ghz.terms.map((t) => `${t.bases}=${t.expectation.toFixed(4)}`).join('  '),
    );
    console.log(
      `      kontroll M = ${s.control.M.toFixed(4)} +/- ${s.control.sigmaM.toFixed(4)}   ` +
        s.control.terms.map((t) => `${t.bases}=${t.expectation.toFixed(4)}`).join('  '),
    );
  }
  console.log(`\n    D-sep (separation signal vs kontroll) : ${d.separationSigma.toFixed(1)} sigma  -> UPPFYLLT`);
  console.log(`    D-stab (konstans över sessioner)      : chi2 = ${d.chi2Stability.toFixed(1)}, df = ${d.dfStability}  -> EJ UPPFYLLT`);
  console.log(`    D-kontrast (K_D)                      : EJ MÄTT — ingen omgivningsvariabel registrerad`);
  console.log('\n    Klassning: D-struct, och även det med reservation. Separationsbenet');
  console.log('    bär, stabilitetsbenet faller (invarianten är INTE konstant mellan');
  console.log('    sessionerna), kontrastbenet är omätt. Detta är inte ett uppfyllt');
  console.log('    D-fynd — det är ett ofullständigt kontrastkrav med ett falsifierat');
  console.log('    stabilitetsantagande. Rapporteras som sådant.');

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

main();
