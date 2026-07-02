import { Sparkles } from '../ui/icons';

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fadeUp">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
        <Sparkles size={15} />
      </span>
      <div className="flex items-center gap-1.5 rounded-[14px] rounded-tl-sm border border-pine-100 bg-white px-4 py-3.5 shadow-soft">
        <span className="h-1.5 w-1.5 rounded-full bg-pine-400 animate-dotBounce [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 rounded-full bg-pine-400 animate-dotBounce [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 rounded-full bg-pine-400 animate-dotBounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}
