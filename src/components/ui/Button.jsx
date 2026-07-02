import Spinner from './Spinner';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  danger: 'btn-danger',
  ghost: 'btn-ghost',
};

export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  type = 'button',
  className = '',
  icon: Icon,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Spinner size="sm" className="border-white/30 border-t-white" />
      ) : (
        Icon && <Icon size={16} strokeWidth={2.25} />
      )}
      {children}
    </button>
  );
}
