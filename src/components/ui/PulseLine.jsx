/**
 * PulseLine — the signature visual motif of Meridian Health.
 * An ECG/vitals-trace line used as a divider, loading indicator, or section accent.
 * Evokes the idea of "vital signs" — appropriate for a hospital product.
 */
export default function PulseLine({ className = '', color = '#2D6A5C', animate = true }) {
  return (
    <svg
      viewBox="0 0 400 24"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M0,12 L130,12 L145,12 L155,2 L165,22 L175,12 L190,12 L200,12 L210,4 L218,20 L226,12 L400,12"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={animate ? '240' : 'none'}
        className={animate ? 'animate-pulseLine' : ''}
        opacity="0.6"
      />
    </svg>
  );
}
