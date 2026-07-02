export default function Input({ label, id, error, hint, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="label-text">
          {label}
        </label>
      )}
      <input id={id} className={`input-field ${error ? 'border-clay-400 focus:border-clay-500 focus:ring-clay-100' : ''}`} {...props} />
      {hint && !error && <p className="mt-1 text-xs text-ink/45">{hint}</p>}
      {error && <p className="mt-1 text-xs text-clay-600 font-medium">{error}</p>}
    </div>
  );
}
