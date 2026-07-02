import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';
import BookAppointmentForm from '../../components/patient/BookAppointmentForm';
import { Plus, Calendar, Clock, X as XIcon } from '../../components/ui/icons';
import { appointmentApi } from '../../api/appointments';
import { getErrorMessage } from '../../api/axios';

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookOpen, setBookOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = { limit: 50 };
      if (filter) params.status = filter;
      const res = await appointmentApi.getMy(params);
      setAppointments(res.data.appointments);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const handleCancel = async (id) => {
    setCancellingId(id);
    try {
      await appointmentApi.cancel(id);
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Patient Dashboard"
        title="Appointments"
        subtitle="Book new visits and manage your schedule."
        action={
          <Button icon={Plus} onClick={() => setBookOpen(true)}>
            Book appointment
          </Button>
        }
      />

      <div className="flex gap-2 mb-5">
        {['', 'Scheduled', 'Completed', 'Cancelled'].map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              filter === s
                ? 'bg-pine-600 text-white'
                : 'bg-white border border-pine-200 text-ink/60 hover:border-pine-400'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : appointments.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No appointments yet"
          message="Book your first appointment with one of our doctors to get started."
          action={<Button icon={Plus} onClick={() => setBookOpen(true)}>Book appointment</Button>}
        />
      ) : (
        <div className="space-y-3">
          {appointments.map((appt) => (
            <div key={appt._id} className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeUp">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mint text-pine-700 font-serif font-semibold">
                  {appt.doctor?.name?.charAt(0) || 'D'}
                </span>
                <div>
                  <p className="font-semibold text-ink">Dr. {appt.doctor?.name}</p>
                  <p className="text-sm text-ink/55">{appt.doctor?.specialization}</p>
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-ink/50">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> {new Date(appt.appointmentDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} /> {appt.timeSlot}
                    </span>
                  </div>
                  {appt.reason && <p className="mt-1.5 text-sm text-ink/65 max-w-md">{appt.reason}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                <StatusBadge status={appt.status} />
                {appt.status === 'Scheduled' && (
                  <button
                    onClick={() => handleCancel(appt._id)}
                    disabled={cancellingId === appt._id}
                    className="flex items-center gap-1 text-xs font-semibold text-clay-600 hover:text-clay-700 disabled:opacity-50"
                  >
                    {cancellingId === appt._id ? <Spinner size="sm" /> : <XIcon size={13} />}
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={bookOpen} onClose={() => setBookOpen(false)} title="Book an appointment">
        <BookAppointmentForm
          onSuccess={() => {
            setBookOpen(false);
            fetchAppointments();
          }}
        />
      </Modal>
    </DashboardLayout>
  );
}
