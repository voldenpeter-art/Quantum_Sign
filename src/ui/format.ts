export function fmtNum(v: number, digits = 3): string {
  if (!Number.isFinite(v)) return '—';
  if (Math.abs(v) !== 0 && (Math.abs(v) < 1e-4 || Math.abs(v) >= 1e5)) return v.toExponential(2);
  return v.toFixed(digits);
}

export function fmtP(p: number | undefined): string {
  if (p === undefined || !Number.isFinite(p)) return '—';
  if (p < 1e-4) return `p < 1e-4`;
  return `p ≈ ${p.toExponential(2)}`;
}

export const VERDICT_COLOR: Record<string, string> = {
  // notApplicable: dämpad/streckad känsla — "gäller inte här", skilt från none.
  notApplicable: 'bg-neutral-900 text-neutral-500 border-neutral-800 border-dashed',
  none: 'bg-neutral-800 text-neutral-400 border-neutral-700',
  classical: 'bg-sky-950 text-sky-300 border-sky-800',
  // 'structural' (kvantneutral struktur) ligger färgmässigt MELLAN classical
  // och suspect — teal signalerar "något överlevde surrogaten" utan att låna
  // suspects bärnstensfärgade kvantanspråk (förtjänad nomenklatur, se types.ts).
  structural: 'bg-teal-950 text-teal-300 border-teal-700',
  suspect: 'bg-amber-950 text-amber-300 border-amber-700',
  strong: 'bg-fuchsia-950 text-fuchsia-300 border-fuchsia-700',
};

export const VERDICT_DOT: Record<string, string> = {
  notApplicable: 'bg-neutral-700',
  none: 'bg-neutral-600',
  classical: 'bg-sky-400',
  structural: 'bg-teal-400',
  suspect: 'bg-amber-400',
  strong: 'bg-fuchsia-400',
};
