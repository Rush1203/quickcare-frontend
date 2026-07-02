import PulseLine from '../ui/PulseLine';
import { Activity } from '../ui/icons';

export default function AuthShell({ children, eyebrow, title, subtitle }) {
  return (
    <div className="min-h-screen bg-paper flex items-start">
      {/* Branding panel - hidden on mobile, pinned to viewport so it never stretches/cuts off with tall form content */}
      <div className="hidden lg:flex lg:w-[44%] lg:sticky lg:top-0 lg:h-screen relative bg-pine-800 text-paper flex-col justify-between p-12 overflow-hidden shrink-0">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        <a href="/" className="relative flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper text-pine-700">
            <Activity size={18} strokeWidth={2.25} />
          </span>
          <span className="font-serif text-xl font-semibold tracking-tight">Hospital appointment</span>
        </a>

        <div className="relative max-w-sm">
          <PulseLine className="h-6 w-40 mb-6" color="#E8A23D" />
          <h2 className="font-serif text-[34px] leading-[1.15] font-semibold">
            Care, coordinated.
          </h2>
          <p className="mt-4 text-pine-100/80 text-[15px] leading-relaxed">
            One record for every visit, prescription, and conversation —
            shared securely between you and your care team.
          </p>
        </div>

        <p className="relative text-xs text-pine-200/50">
          © {new Date().getFullYear()} Doctor appointment app.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex-1 min-h-screen flex flex-col justify-center px-5 sm:px-10 lg:px-16 py-10">
        <div className="mx-auto w-full max-w-[420px] animate-fadeUp">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pine-600 text-white">
              <Activity size={16} strokeWidth={2.25} />
            </span>
            <span className="font-serif text-lg font-semibold tracking-tight text-ink">
              Meridian Health
            </span>
          </div>

          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-wider text-pine-600 mb-2">
              {eyebrow}
            </p>
          )}
          <h1 className="font-serif text-[28px] font-semibold text-ink">{title}</h1>
          {subtitle && <p className="mt-2 text-[15px] text-ink/55">{subtitle}</p>}

          <div className="mt-7">{children}</div>
        </div>
      </div>
    </div>
  );
}
