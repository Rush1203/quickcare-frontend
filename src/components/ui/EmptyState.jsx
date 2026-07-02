import PulseLine from './PulseLine';

export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-14 text-center">
      {Icon && (
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-mint text-pine-600">
          <Icon size={22} strokeWidth={1.8} />
        </span>
      )}
      <h3 className="font-serif text-lg font-semibold text-ink">{title}</h3>
      {message && <p className="mt-1.5 max-w-sm text-sm text-ink/55">{message}</p>}
      <PulseLine className="h-3 w-28 mt-5" color="#BCD5CD" animate={false} />
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
