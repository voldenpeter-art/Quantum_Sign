import type { SignatureId } from '../types/signatures';
import type { SignatureResult } from '../analysis/types';
import { SIGNATURE_CATALOG } from '../types/signatures';
import { SignatureCard } from './SignatureCard';

export function SignatureDashboard({
  results,
  loading,
}: {
  results: Partial<Record<SignatureId, SignatureResult>>;
  loading: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {SIGNATURE_CATALOG.map((meta) => (
        <SignatureCard key={meta.id} meta={meta} result={results[meta.id]} loading={loading && meta.implemented} />
      ))}
    </div>
  );
}
