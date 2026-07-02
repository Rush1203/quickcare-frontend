import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import TagInput from '../../components/ui/TagInput';
import PulseLine from '../../components/ui/PulseLine';
import Spinner from '../../components/ui/Spinner';
import { Calendar, FileText, Pill, Edit, Activity } from '../../components/ui/icons';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../api/users';
import { appointmentApi } from '../../api/appointments';
import { prescriptionApi } from '../../api/prescriptions';
import { getErrorMessage } from '../../api/axios';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function PatientOverview() {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState({ upcoming: 0, prescriptions: 0 });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [apptRes, presRes] = await Promise.all([
          appointmentApi.getMy({ status: 'Scheduled', limit: 100 }),
          prescriptionApi.getMy({ limit: 1 }),
        ]);
        setStats({
          upcoming: apptRes.data.total,
          prescriptions: presRes.data.total,
        });
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setIsLoadingStats(false);
      }
    };
    loadStats();
  }, []);

  const mh = user?.medicalHistory || {};

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Patient Dashboard"
        title={`Hello, ${user?.name?.split(' ')[0]}`}
        subtitle="Here's an overview of your health record."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <StatCard
          icon={Calendar}
          label="Upcoming appointments"
          value={isLoadingStats ? '—' : stats.upcoming}
          accent="pine"
        />
        <StatCard
          icon={FileText}
          label="Total prescriptions"
          value={isLoadingStats ? '—' : stats.prescriptions}
          accent="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile card */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-serif text-lg font-semibold text-ink">Profile</h2>
            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-pine-700 hover:text-pine-800"
            >
              <Edit size={14} /> Edit
            </button>
          </div>
          <PulseLine className="h-3 w-24 mb-5" color="#BCD5CD" animate={false} />

          <dl className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase text-ink/40 mb-0.5">Name</dt>
              <dd className="text-ink font-medium">{user?.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-ink/40 mb-0.5">Email</dt>
              <dd className="text-ink font-medium truncate">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-ink/40 mb-0.5">Phone</dt>
              <dd className="text-ink font-medium">{user?.phone || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-ink/40 mb-0.5">Gender</dt>
              <dd className="text-ink font-medium">{user?.gender || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-ink/40 mb-0.5">Date of birth</dt>
              <dd className="text-ink font-medium">
                {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-ink/40 mb-0.5">Blood type</dt>
              <dd className="text-ink font-medium">{mh.bloodType || '—'}</dd>
            </div>
          </dl>
        </div>

        {/* Medical history card */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-1">
            <Pill size={16} className="text-pine-600" />
            <h2 className="font-serif text-lg font-semibold text-ink">Medical history</h2>
          </div>
          <PulseLine className="h-3 w-24 mb-5" color="#BCD5CD" animate={false} />

          <HistorySection label="Allergies" items={mh.allergies} emptyText="No known allergies" />
          <HistorySection label="Chronic conditions" items={mh.chronicConditions} emptyText="None recorded" />
          <HistorySection label="Past surgeries" items={mh.pastSurgeries} emptyText="None recorded" />
          <HistorySection label="Current medications" items={mh.currentMedications} emptyText="None recorded" last />
        </div>
      </div>

      <EditProfileModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        user={user}
        onSaved={(updated) => {
          updateUser(updated);
          setEditOpen(false);
          toast.success('Profile updated');
        }}
      />
    </DashboardLayout>
  );
}

function HistorySection({ label, items = [], emptyText, last }) {
  return (
    <div className={!last ? 'mb-4' : ''}>
      <p className="text-xs font-semibold uppercase text-ink/40 mb-1.5">{label}</p>
      {items?.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <span key={i} className="rounded-full bg-mint px-2.5 py-1 text-xs font-medium text-pine-700">
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-ink/40 italic">{emptyText}</p>
      )}
    </div>
  );
}

function EditProfileModal({ isOpen, onClose, user, onSaved }) {
  const [form, setForm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        gender: user.gender || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        bloodType: user.medicalHistory?.bloodType || '',
        allergies: user.medicalHistory?.allergies || [],
        chronicConditions: user.medicalHistory?.chronicConditions || [],
        pastSurgeries: user.medicalHistory?.pastSurgeries || [],
        currentMedications: user.medicalHistory?.currentMedications || [],
      });
    }
  }, [user, isOpen]);

  if (!form) return isOpen ? (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit profile">
      <div className="flex justify-center py-10"><Spinner /></div>
    </Modal>
  ) : null;

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await userApi.updateProfile({
        name: form.name,
        phone: form.phone,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth || undefined,
        medicalHistory: {
          bloodType: form.bloodType,
          allergies: form.allergies,
          chronicConditions: form.chronicConditions,
          pastSurgeries: form.pastSurgeries,
          currentMedications: form.currentMedications,
        },
      });
      onSaved(res.data.user);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit profile" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input id="edit-name" label="Full name" value={form.name} onChange={(e) => update('name', e.target.value)} />
          <Input id="edit-phone" label="Phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
          <Select id="edit-gender" label="Gender" value={form.gender} onChange={(e) => update('gender', e.target.value)}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Select>
          <Input id="edit-dob" type="date" label="Date of birth" value={form.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} />
        </div>
        <Select id="edit-blood" label="Blood type" value={form.bloodType} onChange={(e) => update('bloodType', e.target.value)}>
          <option value="">Select blood type</option>
          {BLOOD_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
        </Select>
        <TagInput label="Allergies" values={form.allergies} onChange={(v) => update('allergies', v)} placeholder="Type and press Enter" />
        <TagInput label="Chronic conditions" values={form.chronicConditions} onChange={(v) => update('chronicConditions', v)} placeholder="Type and press Enter" />
        <TagInput label="Past surgeries" values={form.pastSurgeries} onChange={(v) => update('pastSurgeries', v)} placeholder="Type and press Enter" />
        <TagInput label="Current medications" values={form.currentMedications} onChange={(v) => update('currentMedications', v)} placeholder="Type and press Enter" />

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" isLoading={isSaving} className="flex-1">Save changes</Button>
        </div>
      </form>
    </Modal>
  );
}
