import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Activity, Calendar, FileText, Users, LogOut, Menu, X,
  Stethoscope, MessageCircle, User as UserIcon,
} from '../ui/icons';
import PulseLine from '../ui/PulseLine';

const NAV_CONFIG = {
  patient: [
    { to: '/patient', label: 'Overview', icon: Activity, end: true },
    { to: '/patient/appointments', label: 'Appointments', icon: Calendar },
    { to: '/patient/prescriptions', label: 'Prescriptions', icon: FileText },
    { to: '/patient/assistant', label: 'AI Assistant', icon: MessageCircle },
  ],
  doctor: [
    { to: '/doctor', label: 'Schedule', icon: Calendar, end: true },
    { to: '/doctor/patients', label: 'Patients', icon: Users },
  ],
  admin: [
    { to: '/admin', label: 'Overview', icon: Activity, end: true },
    { to: '/admin/doctors', label: 'Doctors', icon: Stethoscope },
    { to: '/admin/patients', label: 'Patients', icon: Users },
  ],
};

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = NAV_CONFIG[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabel = { patient: 'Patient', doctor: 'Doctor', admin: 'Administrator' }[user?.role];

  return (
    <div className="min-h-screen bg-paper flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 z-40 h-screen w-[260px] shrink-0 border-r border-pine-100 bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-6 pt-6 pb-5">
            <a href={`/${user?.role}`} className="flex items-center gap-2.5 group">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pine-600 text-white">
                <Activity size={16} strokeWidth={2.25} />
              </span>
              <span className="font-serif text-[19px] font-semibold tracking-tight text-ink">
                Hospital 
              </span>
            </a>
            <button
              className="lg:hidden text-ink/50 hover:text-ink"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          <div className="px-6">
            <PulseLine className="h-3 w-full" animate={false} />
          </div>

          <nav className="flex-1 overflow-y-auto px-3.5 py-5 space-y-1">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-pine-600 text-white shadow-sm'
                      : 'text-ink/65 hover:bg-mint hover:text-ink'
                  }`
                }
              >
                <Icon size={17} strokeWidth={2} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-pine-100 px-4 py-4">
            <div className="flex items-center gap-3 rounded-[8px] px-2 py-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint text-pine-700 font-serif font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || <UserIcon size={16} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{user?.name}</p>
                <p className="truncate text-xs text-ink/45">{roleLabel}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-2 flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-sm font-medium text-ink/55 hover:bg-clay-50 hover:text-clay-600 transition-colors"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-pine-100 bg-paper/90 backdrop-blur px-4 sm:px-8 py-4 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-ink/60 hover:text-ink"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <span className="font-serif text-base font-semibold">Hospital</span>
          <span className="w-[22px]" />
        </header>

        <main className="px-4 sm:px-8 py-7 sm:py-9 max-w-6xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
