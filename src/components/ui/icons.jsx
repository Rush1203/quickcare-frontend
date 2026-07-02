/**
 * Minimal hand-rolled icon set. Stroke-based, 1.75-2px weight, consistent with
 * the clinical/precise aesthetic. Avoids pulling in a full icon library.
 */
const base = ({ size, strokeWidth, ...rest }) => ({
  width: size ?? 18,
  height: size ?? 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: strokeWidth ?? 1.9,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  ...rest,
});

export const Activity = (p) => (
  <svg {...base(p)}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
);
export const User = (p) => (
  <svg {...base(p)}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" /></svg>
);
export const Users = (p) => (
  <svg {...base(p)}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 21c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" /><path d="M16.5 8a3.5 3.5 0 1 1 0 7" /><path d="M15.5 14.6c2.6.5 4.5 2.7 4.5 5.4" /></svg>
);
export const Calendar = (p) => (
  <svg {...base(p)}><rect x="3" y="5" width="18" height="16" rx="2.5" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>
);
export const Clock = (p) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>
);
export const FileText = (p) => (
  <svg {...base(p)}><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" /><path d="M14 3v5h5M9 13h6M9 17h6M9 9h2" /></svg>
);
export const Pill = (p) => (
  <svg {...base(p)}><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" /><path d="m8.5 8.5 7 7" /></svg>
);
export const Plus = (p) => (
  <svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>
);
export const X = (p) => (
  <svg {...base(p)}><path d="M18 6 6 18M6 6l12 12" /></svg>
);
export const ChevronDown = (p) => (
  <svg {...base(p)}><path d="m6 9 6 6 6-6" /></svg>
);
export const ChevronRight = (p) => (
  <svg {...base(p)}><path d="m9 6 6 6-6 6" /></svg>
);
export const LogOut = (p) => (
  <svg {...base(p)}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></svg>
);
export const Menu = (p) => (
  <svg {...base(p)}><path d="M3 6h18M3 12h18M3 18h18" /></svg>
);
export const Send = (p) => (
  <svg {...base(p)}><path d="m3 11 18-8-8 18-2-8-8-2z" /></svg>
);
export const MessageCircle = (p) => (
  <svg {...base(p)}><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.4 0-2.7-.3-3.9-.9L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5Z" /></svg>
);
export const Search = (p) => (
  <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
);
export const Stethoscope = (p) => (
  <svg {...base(p)}><path d="M5 3v6a4 4 0 0 0 8 0V3" /><path d="M9 15a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-2" /><circle cx="20" cy="6" r="2" /></svg>
);
export const Shield = (p) => (
  <svg {...base(p)}><path d="M12 3 4.5 5.5v6c0 5 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.5 7.5-9.5v-6L12 3Z" /></svg>
);
export const AlertCircle = (p) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></svg>
);
export const CheckCircle = (p) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="m8.5 12.5 2.5 2.5 5-5.5" /></svg>
);
export const Edit = (p) => (
  <svg {...base(p)}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
);
export const ArrowLeft = (p) => (
  <svg {...base(p)}><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
);
export const Trash = (p) => (
  <svg {...base(p)}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" /></svg>
);
export const Eye = (p) => (
  <svg {...base(p)}><path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z" /><circle cx="12" cy="12" r="3" /></svg>
);
export const Bell = (p) => (
  <svg {...base(p)}><path d="M6 8a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6" /><path d="M9.5 21a2.5 2.5 0 0 0 5 0" /></svg>
);
export const Sparkles = (p) => (
  <svg {...base(p)}><path d="M12 3v4M12 17v4M5 12H1M23 12h-4M6 6l2 2M18 6l-2 2M6 18l2-2M18 18l-2-2" /><circle cx="12" cy="12" r="3" /></svg>
);
export const Phone = (p) => (
  <svg {...base(p)}><path d="M5 4h4l1.5 5L8 11a13 13 0 0 0 5 5l2-2.5 5 1.5v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>
);
export const Mail = (p) => (
  <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>
);
export const Lock = (p) => (
  <svg {...base(p)}><rect x="4" y="11" width="16" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
);
