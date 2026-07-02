export default function StatCard({ icon: Icon, label, value, accent = 'pine', sublabel }) {
  const accents = {
    pine: 'bg-pine-50 text-pine-600',
    amber: 'bg-amber-50 text-amber-600',
    clay: 'bg-clay-50 text-clay-600',
  };

  return (
    <div className="card px-5 py-5 flex items-start justify-between animate-fadeUp">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">{label}</p>
        <p className="mt-2 font-serif text-3xl font-semibold text-ink">{value}</p>
        {sublabel && <p className="mt-1 text-xs text-ink/45">{sublabel}</p>}
      </div>
      {Icon && (
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${accents[accent]}`}>
          <Icon size={18} strokeWidth={2} />
        </span>
      )}
    </div>
  );
}
