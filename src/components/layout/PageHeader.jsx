export default function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="mb-7 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-fadeUp">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-wider text-pine-600 mb-1.5">
            {eyebrow}
          </p>
        )}
        <h1 className="font-serif text-[28px] sm:text-[32px] font-semibold text-ink leading-tight">
          {title}
        </h1>
        {subtitle && <p className="mt-1.5 text-[15px] text-ink/55">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
