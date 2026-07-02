import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthShell from '../components/layout/AuthShell';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import RoleTabs from '../components/ui/RoleTabs';
import TagInput from '../components/ui/TagInput';
import { authApi } from '../api/auth';
import { getErrorMessage } from '../api/axios';
import { useAuth } from '../context/AuthContext';

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const initialForm = {
  name: '', email: '', password: '', confirmPassword: '', phone: '',
  // Patient
  dateOfBirth: '', gender: '',
  allergies: [], chronicConditions: [], pastSurgeries: [], currentMedications: [], bloodType: '',
  // Doctor
  specialization: '', experience: '', consultationFee: '', availableDays: [],
};

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState('patient');
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleChange = (e) => update(e.target.name, e.target.value);

  const toggleDay = (day) => {
    setForm((f) => ({
      ...f,
      availableDays: f.availableDays.includes(day)
        ? f.availableDays.filter((d) => d !== day)
        : [...f.availableDays, day],
    }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (form.password.length < 6) errs.password = 'Use at least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords don't match";

    if (role === 'doctor') {
      if (!form.specialization.trim()) errs.specialization = 'Specialization is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the highlighted fields');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role,
        phone: form.phone,
      };

      if (role === 'patient') {
        Object.assign(payload, {
          dateOfBirth: form.dateOfBirth || undefined,
          gender: form.gender || undefined,
          medicalHistory: {
            allergies: form.allergies,
            chronicConditions: form.chronicConditions,
            pastSurgeries: form.pastSurgeries,
            currentMedications: form.currentMedications,
            bloodType: form.bloodType,
          },
        });
      }

      if (role === 'doctor') {
        Object.assign(payload, {
          specialization: form.specialization,
          experience: form.experience ? Number(form.experience) : undefined,
          consultationFee: form.consultationFee ? Number(form.consultationFee) : undefined,
          availableDays: form.availableDays,
          availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
        });
      }

      const res = await authApi.signup(payload);
      login(res.data.user, res.data.token);
      toast.success('Account created — welcome to Meridian Health');
      navigate(`/${res.data.user.role}`, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Get started"
      title="Create your account"
      subtitle="Tell us a little about yourself to set up your dashboard."
    >
      <RoleTabs value={role} onChange={setRole} />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <Input id="name" name="name" label="Full name" placeholder="Jane Smith" value={form.name} onChange={handleChange} error={errors.name} className="col-span-2" />
          <Input id="email" name="email" type="email" label="Email" placeholder="you@example.com" value={form.email} onChange={handleChange} error={errors.email} className="col-span-2" />
          <Input id="phone" name="phone" label="Phone (optional)" placeholder="9123456789" value={form.phone} onChange={handleChange} className="col-span-2" />
          <Input id="password" name="password" type="password" label="Password" placeholder="••••••••" value={form.password} onChange={handleChange} error={errors.password} />
          <Input id="confirmPassword" name="confirmPassword" type="password" label="Confirm password" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
        </div>

        {/* Patient-only fields */}
        {role === 'patient' && (
          <div className="space-y-4 pt-1 animate-fadeUp">
            <div className="h-px bg-pine-100" />
            <p className="text-xs font-semibold uppercase tracking-wider text-pine-600">
              Basic medical history
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Input id="dateOfBirth" name="dateOfBirth" type="date" label="Date of birth" value={form.dateOfBirth} onChange={handleChange} />
              <Select id="gender" name="gender" label="Gender" value={form.gender} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </div>
            <Select id="bloodType" name="bloodType" label="Blood type (optional)" value={form.bloodType} onChange={handleChange}>
              <option value="">Select blood type</option>
              {BLOOD_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
            </Select>
            <TagInput
              label="Allergies"
              values={form.allergies}
              onChange={(v) => update('allergies', v)}
              placeholder="Type an allergy and press Enter"
            />
            <TagInput
              label="Chronic conditions"
              values={form.chronicConditions}
              onChange={(v) => update('chronicConditions', v)}
              placeholder="e.g. Asthma, Diabetes"
            />
            <TagInput
              label="Past surgeries"
              values={form.pastSurgeries}
              onChange={(v) => update('pastSurgeries', v)}
              placeholder="e.g. Appendectomy 2019"
            />
            <TagInput
              label="Current medications"
              values={form.currentMedications}
              onChange={(v) => update('currentMedications', v)}
              placeholder="e.g. Metformin 500mg"
            />
          </div>
        )}

        {/* Doctor-only fields */}
        {role === 'doctor' && (
          <div className="space-y-4 pt-1 animate-fadeUp">
            <div className="h-px bg-pine-100" />
            <p className="text-xs font-semibold uppercase tracking-wider text-pine-600">
              Professional details
            </p>
            <Input id="specialization" name="specialization" label="Specialization" placeholder="e.g. Cardiology" value={form.specialization} onChange={handleChange} error={errors.specialization} />
            <div className="grid grid-cols-2 gap-3">
              <Input id="experience" name="experience" type="number" min="0" label="Years of experience" placeholder="5" value={form.experience} onChange={handleChange} />
              <Input id="consultationFee" name="consultationFee" type="number" min="0" label="Consultation fee ($)" placeholder="80" value={form.consultationFee} onChange={handleChange} />
            </div>
            <div>
              <label className="label-text">Available days</label>
              <div className="flex flex-wrap gap-2">
                {WEEKDAYS.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      form.availableDays.includes(day)
                        ? 'border-pine-600 bg-pine-600 text-white'
                        : 'border-pine-200 text-ink/60 hover:border-pine-400'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <Button type="submit" isLoading={isLoading} className="w-full mt-5">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/55">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-pine-700 hover:text-pine-800">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
