import { Shield } from '../ui/icons';

export default function DisclaimerBanner() {
  return (
    <div className="flex items-start gap-2.5 rounded-[8px] border border-amber-300/60 bg-amber-50 px-4 py-3 text-xs text-amber-800 leading-relaxed">
      <Shield size={15} className="shrink-0 mt-0.5" />
      <p>
        <strong className="font-semibold">AI assistant responses are for informational purposes only.</strong>{' '}
        Please consult a real doctor for medical advice.
      </p>
    </div>
  );
}
