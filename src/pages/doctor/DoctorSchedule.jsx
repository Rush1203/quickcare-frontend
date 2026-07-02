import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import StatCard from '../../components/ui/StatCard';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';
import DoctorAppointmentCard from '../../components/doctor/DoctorAppointmentCard';
import PatientProfileViewer from '../../components/doctor/PatientProfileViewer';
import PrescriptionForm from '../../components/doctor/PrescriptionForm';
import { Calendar, CheckCircle, Clock } from '../../components/ui/icons';
import { appointmentApi } from '../../api/appointments';
import { prescriptionApi } from '../../api/prescriptions';
import { getErrorMessage } from '../../api/axios';

export default function DoctorSchedule() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const [profileModal, setProfileModal] = useState({ open: false, patient: null, profile: null, loading: false });
  const [prescribeModal, setPrescribeModal] = useState({ open: false, appointment: null });

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = { limit: 100 };
      if (filter) params.status = filter;
      const res = await appointmentApi.getDoctorSchedule(params);
      setAppointments(res.data.appointments);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const handleStatusChange = async (id, status) => {
    try {
      await appointmentApi.updateStatus(id, { status });
      toast.success(`Marked as ${status}`);
      fetchAppointments();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleViewPatient = async (patient) => {
    setProfileModal({ open: true, patient, profile: null, loading: true });
    try {
      const res = await prescriptionApi.getPatientMedicalProfile(patient._id);
      setProfileModal((s) => ({ ...s, profile: res.data.medicalProfile, loading: false }));
    } catch (err) {
      toast.error(getErrorMessage(err));
      setProfileModal((s) => ({ ...s, loading: false }));
    }
  };

  const todayCount = appointments.filter(
    (a) => new Date(a.appointmentDate).toDateString() === new Date().toDateString()
  ).length;
  const scheduledCount = appointments.filter((a) => a.status === 'Scheduled').length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Doctor Dashboard"
        title="Your schedule"
        subtitle="Manage appointments and patient records."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={Calendar} label="Today's appointments" value={todayCount} accent="pine" />
        <StatCard icon={Clock} label="Scheduled" value={scheduledCount} accent="amber" />
        <StatCard icon={CheckCircle} label="Completed" value={completedCount} accent="pine" />
      </div>

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
        <EmptyState icon={Calendar} title="No appointments" message="You have no appointments matching this filter." />
      ) : (
        <div className="space-y-3">
          {appointments.map((appt) => (
            <DoctorAppointmentCard
              key={appt._id}
              appointment={appt}
              onStatusChange={handleStatusChange}
              onViewPatient={handleViewPatient}
              onPrescribe={(a) => setPrescribeModal({ open: true, appointment: a })}
            />
          ))}
        </div>
      )}

      {/* Patient profile modal */}
      <Modal
        isOpen={profileModal.open}
        onClose={() => setProfileModal({ open: false, patient: null, profile: null, loading: false })}
        title="Patient medical profile"
        maxWidth="max-w-2xl"
      >
        <PatientProfileViewer profile={profileModal.profile} isLoading={profileModal.loading} />
      </Modal>

      {/* Prescribe modal */}
      <Modal
        isOpen={prescribeModal.open}
        onClose={() => setPrescribeModal({ open: false, appointment: null })}
        title="Write prescription"
        maxWidth="max-w-xl"
      >
        {prescribeModal.appointment && (
          <PrescriptionForm
            appointment={prescribeModal.appointment}
            onSuccess={() => {
              setPrescribeModal({ open: false, appointment: null });
              fetchAppointments();
            }}
          />
        )}
      </Modal>
    </DashboardLayout>
  );
}
