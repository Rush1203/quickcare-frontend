import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import StatCard from '../../components/ui/StatCard';
import Spinner from '../../components/ui/Spinner';
import PulseLine from '../../components/ui/PulseLine';
import StatusBadge from '../../components/ui/StatusBadge';
import { Users, Stethoscope, Calendar, Activity } from '../../components/ui/icons';
import { userApi } from '../../api/users';
import { appointmentApi } from '../../api/appointments';
import { getErrorMessage } from '../../api/axios';

export default function AdminOverview() {
  const [stats, setStats] = useState({ patients: 0, doctors: 0, today: 0, scheduled: 0 });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
          userApi.getPatients({ limit: 1 }),
          userApi.getDoctors({ limit: 1 }),
          appointmentApi.getAll({ limit: 8 }),
        ]);

        const todayCount = appointmentsRes.data.appointments.filter(
          (a) => new Date(a.appointmentDate).toDateString() === new Date().toDateString()
        ).length;
        const scheduledCount = appointmentsRes.data.appointments.filter(
          (a) => a.status === 'Scheduled'
        ).length;

        setStats({
          patients: patientsRes.data.total,
          doctors: doctorsRes.data.total,
          today: todayCount,
          scheduled: scheduledCount,
        });
        setRecentAppointments(appointmentsRes.data.appointments);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Admin Dashboard"
        title="System overview"
        subtitle="A snapshot of activity across Meridian Health."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total patients" value={isLoading ? '—' : stats.patients} accent="pine" />
        <StatCard icon={Stethoscope} label="Active doctors" value={isLoading ? '—' : stats.doctors} accent="amber" />
        <StatCard icon={Calendar} label="Today's appointments" value={isLoading ? '—' : stats.today} accent="pine" />
        <StatCard icon={Activity} label="Scheduled (recent)" value={isLoading ? '—' : stats.scheduled} accent="amber" />
      </div>

      <div className="card p-6">
        <h2 className="font-serif text-lg font-semibold text-ink mb-1">Recent appointments</h2>
        <PulseLine className="h-3 w-24 mb-5" color="#BCD5CD" animate={false} />

        {isLoading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : recentAppointments.length === 0 ? (
          <p className="text-sm text-ink/45 italic py-6 text-center">No appointments recorded yet.</p>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase text-ink/40">
                  <th className="px-2 pb-3">Patient</th>
                  <th className="px-2 pb-3">Doctor</th>
                  <th className="px-2 pb-3">Date</th>
                  <th className="px-2 pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pine-50">
                {recentAppointments.map((a) => (
                  <tr key={a._id}>
                    <td className="px-2 py-3 font-medium text-ink">{a.patient?.name}</td>
                    <td className="px-2 py-3 text-ink/65">{a.doctor?.name}</td>
                    <td className="px-2 py-3 text-ink/55">{new Date(a.appointmentDate).toLocaleDateString()}</td>
                    <td className="px-2 py-3"><StatusBadge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
