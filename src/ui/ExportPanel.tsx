import type { ExportBundle } from '../export';
import { toJSON, toCSV, toMarkdown, downloadText } from '../export';

export function ExportPanel({ bundle }: { bundle: ExportBundle }) {
  return (
    <div className="flex gap-2">
      <button
        className="rounded-md border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800"
        onClick={() => downloadText('kvantsignaturrapport.json', toJSON(bundle), 'application/json')}
      >
        Exportera JSON
      </button>
      <button
        className="rounded-md border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800"
        onClick={() => downloadText('kvantsignaturrapport.csv', toCSV(bundle), 'text/csv')}
      >
        Exportera CSV
      </button>
      <button
        className="rounded-md border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800"
        onClick={() => downloadText('kvantsignaturrapport.md', toMarkdown(bundle), 'text/markdown')}
      >
        Exportera Markdown
      </button>
    </div>
  );
}
