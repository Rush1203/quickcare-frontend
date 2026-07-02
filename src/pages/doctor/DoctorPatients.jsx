import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';
import PatientProfileViewer from '../../components/doctor/PatientProfileViewer';
import { Search, Users, ChevronRight } from '../../components/ui/icons';
import { userApi } from '../../api/users';
import { prescriptionApi } from '../../api/prescriptions';
import { getErrorMessage } from '../../api/axios';

export default function DoctorPatients() {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [profileModal, setProfileModal] = useState({ open: false, profile: null, loading: false });

  const fetchPatients = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await userApi.getPatients({ search, page, limit: 10 });
      setPatients(res.data.patients);
      setTotalPages(res.data.pages);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const timer = setTimeout(fetchPatients, 300);
    return () => clearTimeout(timer);
  }, [fetchPatients]);

  const handleViewPatient = async (patient) => {
    setProfileModal({ open: true, profile: null, loading: true });
    try {
      const res = await prescriptionApi.getPatientMedicalProfile(patient._id);
      setProfileModal({ open: true, profile: res.data.medicalProfile, loading: false });
    } catch (err) {
      toast.error(getErrorMessage(err));
      setProfileModal({ open: false, profile: null, loading: false });
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Doctor Dashboard"
        title="Patients"
        subtitle="Search and review patient medical profiles."
      />

      <div className="relative mb-5 max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/35" />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input-field pl-10"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : patients.length === 0 ? (
        <EmptyState icon={Users} title="No patients found" message="Try a different search term." />
      ) : (
        <div className="card divide-y divide-pine-100 overflow-hidden">
          {patients.map((p) => (
            <button
              key={p._id}
              onClick={() => handleViewPatient(p)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-mint/40 transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint text-pine-700 font-serif font-semibold">
                  {p.name?.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-ink truncate">{p.name}</p>
                  <p className="text-xs text-ink/50 truncate">{p.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="hidden sm:block text-xs text-ink/45">{p.gender || '—'}</span>
                <ChevronRight size={16} className="text-ink/30" />
              </div>
            </button>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-8 w-8 rounded-full text-xs font-semibold transition-colors ${
                page === p ? 'bg-pine-600 text-white' : 'bg-white border border-pine-200 text-ink/60 hover:border-pine-400'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <Modal
        isOpen={profileModal.open}
        onClose={() => setProfileModal({ open: false, profile: null, loading: false })}
        title="Patient medical profile"
        maxWidth="max-w-2xl"
      >
        <PatientProfileViewer profile={profileModal.profile} isLoading={profileModal.loading} />
      </Modal>
    </DashboardLayout>
  );
}
