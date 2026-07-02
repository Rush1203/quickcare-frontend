import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { userApi } from '../../api/users';
import { appointmentApi } from '../../api/appointments';
import { getErrorMessage } from '../../api/axios';

export default function BookAppointmentForm({ onSuccess }) {
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    doctorId: '',
    appointmentDate: '',
    timeSlot: '',
    reason: '',
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await userApi.getDoctors({ limit: 100 });
        setDoctors(res.data.doctors);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  const selectedDoctor = doctors.find((d) => d._id === form.doctorId);
  const timeSlots = selectedDoctor?.availableTimeSlots?.length
    ? selectedDoctor.availableTimeSlots
    : ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.doctorId) errs.doctorId = 'Choose a doctor';
    if (!form.appointmentDate) errs.appointmentDate = 'Choose a date';
    if (!form.timeSlot) errs.timeSlot = 'Choose a time slot';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await appointmentApi.book(form);
      toast.success('Appointment booked successfully');
      setForm({ doctorId: '', appointmentDate: '', timeSlot: '', reason: '' });
      onSuccess?.();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  if (loadingDoctors) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Select
        id="doctorId"
        label="Choose a doctor"
        value={form.doctorId}
        onChange={(e) => update('doctorId', e.target.value)}
        error={errors.doctorId}
      >
        <option value="">Select a doctor</option>
        {doctors.map((doc) => (
          <option key={doc._id} value={doc._id}>
            Dr. {doc.name} — {doc.specialization || 'General Medicine'}
          </option>
        ))}
      </Select>

      {selectedDoctor && (
        <div className="rounded-[8px] bg-mint border border-pine-100 px-3.5 py-2.5 text-xs text-pine-800">
          {selectedDoctor.experience != null && <span>{selectedDoctor.experience} yrs experience</span>}
          {selectedDoctor.consultationFee != null && (
            <span> · ${selectedDoctor.consultationFee} consultation fee</span>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Input
          id="appointmentDate"
          type="date"
          label="Date"
          min={todayStr}
          value={form.appointmentDate}
          onChange={(e) => update('appointmentDate', e.target.value)}
          error={errors.appointmentDate}
        />
        <Select
          id="timeSlot"
          label="Time slot"
          value={form.timeSlot}
          onChange={(e) => update('timeSlot', e.target.value)}
          error={errors.timeSlot}
        >
          <option value="">Select time</option>
          {timeSlots.map((slot) => (
            <option key={slot} value={slot}>{slot}</option>
          ))}
        </Select>
      </div>

      <Textarea
        id="reason"
        label="Reason for visit (optional)"
        rows={3}
        placeholder="Briefly describe your symptoms or reason for the visit"
        value={form.reason}
        onChange={(e) => update('reason', e.target.value)}
      />

      <Button type="submit" isLoading={isSubmitting} className="w-full mt-2">
        Confirm appointment
      </Button>
    </form>
  );
}
