import { useState } from 'react';
import { X } from './icons';

/**
 * A simple "type and press Enter" tag input for array fields
 * (allergies, chronic conditions, etc.)
 */
export default function TagInput({ label, values, onChange, placeholder, hint }) {
  const [draft, setDraft] = useState('');

  const addTag = () => {
    const trimmed = draft.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setDraft('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !draft && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  const removeTag = (idx) => onChange(values.filter((_, i) => i !== idx));

  return (
    <div>
      {label && <label className="label-text">{label}</label>}
      <div className="input-field flex flex-wrap items-center gap-1.5 py-2 min-h-[44px]">
        {values.map((tag, idx) => (
          <span
            key={idx}
            className="flex items-center gap-1 rounded-full bg-mint px-2.5 py-1 text-xs font-medium text-pine-700"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(idx)}
              aria-label={`Remove ${tag}`}
              className="hover:text-clay-600"
            >
              <X size={12} strokeWidth={2.5} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={values.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-ink/35"
        />
      </div>
      {hint && <p className="mt-1 text-xs text-ink/45">{hint}</p>}
    </div>
  );
}
