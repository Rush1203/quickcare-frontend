export default function Textarea({ label, id, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="label-text">
          {label}
        </label>
      )}
      <textarea id={id} className={`input-field resize-none ${error ? 'border-clay-400' : ''}`} {...props} />
      {error && <p className="mt-1 text-xs text-clay-600 font-medium">{error}</p>}
    </div>
  );
}
