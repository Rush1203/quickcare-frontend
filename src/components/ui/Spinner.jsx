export default function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-9 w-9 border-[3px]',
  };

  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-pine-200 border-t-pine-600 ${sizes[size]} ${className}`}
    />
  );
}
