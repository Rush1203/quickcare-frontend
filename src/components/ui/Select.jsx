export default function Select({ label, id, error, children, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="label-text">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`input-field appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%2323544A%22><path d=%22M5.5 7.5l4.5 4.5 4.5-4.5z%22/></svg>')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:18px] pr-9 ${error ? 'border-clay-400' : ''}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-clay-600 font-medium">{error}</p>}
    </div>
  );
}
