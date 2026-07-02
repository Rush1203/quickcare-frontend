const config = {
  Scheduled: { cls: 'badge-scheduled', dot: 'bg-amber-500' },
  Completed: { cls: 'badge-completed', dot: 'bg-pine-600' },
  Cancelled: { cls: 'badge-cancelled', dot: 'bg-clay-500' },
};

export default function StatusBadge({ status }) {
  const c = config[status] || config.Scheduled;
  return (
    <span className={c.cls}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}
