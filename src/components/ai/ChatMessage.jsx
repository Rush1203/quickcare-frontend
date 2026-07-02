import { Sparkles, User as UserIcon } from '../ui/icons';

export default function ChatMessage({ role, content, isError }) {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-fadeUp`}>
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? 'bg-pine-600 text-white' : 'bg-amber-50 text-amber-600'
        }`}
      >
        {isUser ? <UserIcon size={15} /> : <Sparkles size={15} />}
      </span>
      <div
        className={`max-w-[78%] rounded-[14px] px-4 py-3 text-[14px] leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-pine-600 text-white rounded-tr-sm'
            : isError
            ? 'bg-clay-50 text-clay-700 rounded-tl-sm'
            : 'bg-white border border-pine-100 text-ink rounded-tl-sm shadow-soft'
        }`}
      >
        {content}
      </div>
    </div>
  );
}
