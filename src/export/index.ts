import type { RunConfig } from '../types/config';
import type { SignatureId } from '../types/signatures';
import type { SignatureResult } from '../analysis/types';

export interface ExportBundle {
  generatedAt: string;
  config: RunConfig;
  nullReplicates: number;
  results: Partial<Record<SignatureId, SignatureResult>>;
}

export function toJSON(bundle: ExportBundle): string {
  return JSON.stringify(bundle, null, 2);
}

export function toCSV(bundle: ExportBundle): string {
  const rows = [['signatur', 'verdict', 'komponent', 'värde', 'p_värde']];
  for (const result of Object.values(bundle.results)) {
    if (!result) continue;
    for (const c of result.components) {
      rows.push([
        result.id,
        result.verdict,
        c.labelSv,
        String(c.value),
        c.pValue !== undefined ? String(c.pValue) : '',
      ]);
    }
  }
  return rows.map((r) => r.map(csvEscape).join(',')).join('\n');
}

function csvEscape(v: string): string {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export function toMarkdown(bundle: ExportBundle): string {
  const lines: string[] = [];
  lines.push(`# Kvantsignaturrapport`);
  lines.push('');
  lines.push(`Genererad: ${bundle.generatedAt}`);
  lines.push('');
  lines.push('## Körningskonfiguration');
  lines.push('');
  lines.push('```json');
  lines.push(JSON.stringify({ ...bundle.config, nullReplicates: bundle.nullReplicates }, null, 2));
  lines.push('```');
  lines.push('');
  lines.push('## Resultat');
  lines.push('');
  for (const result of Object.values(bundle.results)) {
    if (!result) continue;
    lines.push(`### Signatur ${result.id} — ${result.verdictLabelSv}`);
    lines.push('');
    lines.push(result.summarySv);
    lines.push('');
    lines.push('| Komponent | Värde | p-värde |');
    lines.push('|---|---|---|');
    for (const c of result.components) {
      lines.push(`| ${c.labelSv} | ${c.value.toPrecision(4)} | ${c.pValue !== undefined ? c.pValue.toExponential(2) : '—'} |`);
    }
    lines.push('');
    const activeFlags = result.redFlags.filter((f) => f.triggered);
    if (activeFlags.length) {
      lines.push('**Rödflaggor:**');
      for (const f of activeFlags) lines.push(`- ${f.labelSv}: ${f.detailSv}`);
      lines.push('');
    }
    lines.push(`Golv: ${result.floorNoteSv}`);
    lines.push('');
  }
  return lines.join('\n');
}

export function downloadText(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
