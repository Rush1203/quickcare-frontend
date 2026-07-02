const ROLES = [
  { value: 'patient', label: 'Patient' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'admin', label: 'Admin' },
];

export default function RoleTabs({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-2 rounded-[10px] bg-mint p-1.5 mb-6" role="tablist">
      {ROLES.map((r) => (
        <button
          key={r.value}
          type="button"
          role="tab"
          aria-selected={value === r.value}
          onClick={() => onChange(r.value)}
          className={`rounded-[7px] py-2 text-sm font-semibold transition-all ${
            value === r.value
              ? 'bg-white text-pine-700 shadow-soft'
              : 'text-pine-700/55 hover:text-pine-700'
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
