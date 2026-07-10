// S3 — blockpermutation. Tidsaxeln delas i block av bredd blockWidthS;
// blockens INBÖRDES ORDNING permuteras men innehållet inom varje block (och
// därmed korttidsstruktur/klustring — INKLUSIVE parkorrelation mellan armar/
// kanaler inom blocket) bevaras. Bryter struktur MELLAN block (t.ex. långsam
// drift eller icke-stationaritet över blockskalan) — testar alltså något
// annat och svagare än S1 (som förstör korrelationen helt): "är den
// observerade strukturen bara ett artefakt av att systemet driver över tid,
// snarare än en stabil, upprepad egenskap?".
//
// GRANSKNINGSFYND (bindande, bevarat här som varning): en tidigare version
// permuterade blockordningen OBEROENDE per detektornyckel (arm/kanal). Det
// bryter parningen mellan armar på ETT sätt som ser ut som "korrelation
// förstörd" i medel — men två OBEROENDE slumppermutationer av samma
// blockmängd råkar statistiskt (Poisson(1)-fördelat antal "fixpunkter",
// oberoende av blockantal) matcha varandra på minst ett block i ~63 % av
// dragen. När det händer återskapas den GENUINA parningen för just det
// blocket fullständigt — vilket i en verifiering av en C-körning med S=2.97
// gav enskilda "null"-drag på S=3.6, dvs HÖGRE än den observerade signalen,
// i vad som skulle vara en korrelationsförstörande null. Att göra blocken
// finare hjälpte INTE (verifierat empiriskt) — det bytte bara ut "enstaka
// stora kontaminerade block" mot "många nästan tomma träffar med extremt
// brusiga par-antal", lika opålitligt. Roten till felet var en missuppfattning
// av S3:s definition: S3 ska inte förstöra korrelation (det är S1:s roll) —
// den ska bara permutera BLOCKORDNING, med EN GEMENSAM permutation som
// omfattar alla nycklar, så att allt som händer INOM ett block (inklusive
// äkta parkorrelation) förblir intakt. Fixad genom att dela blockordningen
// mellan alla detektornycklar istället för att låta varje nyckel få sin egen.

import type { EventStream, PhotonEvent } from '../types/events';
import type { Rng } from '../sim/rng';

function shuffle<T>(arr: T[], rng: Rng): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rng.uniformInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function blockBootstrapS3(
  stream: EventStream,
  rng: Rng,
  blockWidthS = 1,
): EventStream {
  const { duration } = stream;
  const numBlocks = Math.max(1, Math.ceil(duration / blockWidthS));

  // EN delad blockordning för hela strömmen — bevarar allt som händer INOM
  // ett block (inklusive parkorrelation mellan armar/kanaler), permuterar
  // bara i vilken ORDNING blocken kommer.
  const blockOrder = shuffle(
    Array.from({ length: numBlocks }, (_, i) => i),
    rng,
  );

  const result: PhotonEvent[] = stream.events.flatMap((e): PhotonEvent[] => {
    const originalBlock = Math.min(numBlocks - 1, Math.floor(e.detectedT / blockWidthS));
    const withinBlockOffset = e.detectedT - originalBlock * blockWidthS;
    const newBlock = blockOrder[originalBlock];
    const newT = newBlock * blockWidthS + withinBlockOffset;
    return newT < duration ? [{ ...e, detectedT: newT }] : [];
  });

  return { ...stream, events: result.sort((a, b) => a.detectedT - b.detectedT) };
}
