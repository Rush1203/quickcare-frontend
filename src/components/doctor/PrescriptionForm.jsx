import { useState } from 'react';
import toast from 'react-hot-toast';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { Plus, Trash, Pill } from '../ui/icons';
import { prescriptionApi } from '../../api/prescriptions';
import { getErrorMessage } from '../../api/axios';

const emptyMed = { name: '', dosage: '', frequency: '', duration: '', instructions: '' };

export default function PrescriptionForm({ appointment, onSuccess }) {
  const [diagnosis, setDiagnosis] = useState('');
  const [medications, setMedications] = useState([{ ...emptyMed }]);
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateMed = (idx, field, value) => {
    setMedications((meds) => meds.map((m, i) => (i === idx ? { ...m, [field]: value } : m)));
  };

  const addMed = () => setMedications((m) => [...m, { ...emptyMed }]);
  const removeMed = (idx) => setMedications((m) => m.filter((_, i) => i !== idx));

  const validate = () => {
    const errs = {};
    if (!diagnosis.trim()) errs.diagnosis = 'Diagnosis is required';
    medications.forEach((m, i) => {
      if (!m.name.trim() || !m.dosage.trim() || !m.frequency.trim()) {
        errs[`med-${i}`] = 'Name, dosage, and frequency are required';
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await prescriptionApi.create({
        appointmentId: appointment._id,
        diagnosis,
        medications,
        additionalInstructions,
        followUpDate: followUpDate || undefined,
      });
      toast.success('Prescription saved');
      onSuccess?.();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-[8px] bg-mint border border-pine-100 px-3.5 py-2.5 text-xs text-pine-800">
        For <strong>{appointment.patient?.name}</strong> · {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.timeSlot}
      </div>

      <Textarea
        id="diagnosis"
        label="Diagnosis"
        rows={2}
        placeholder="e.g. Acute bronchitis, viral in origin"
        value={diagnosis}
        onChange={(e) => setDiagnosis(e.target.value)}
        error={errors.diagnosis}
      />

      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="label-text mb-0 flex items-center gap-1.5">
            <Pill size={13} /> Medications
          </label>
          <button
            type="button"
            onClick={addMed}
            className="flex items-center gap-1 text-xs font-semibold text-pine-700 hover:text-pine-800"
          >
            <Plus size={13} /> Add medication
          </button>
        </div>

        <div className="space-y-3">
          {medications.map((med, idx) => (
            <div key={idx} className="rounded-[8px] border border-pine-100 bg-mint/40 p-3.5 relative">
              {medications.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMed(idx)}
                  aria-label="Remove medication"
                  className="absolute top-2.5 right-2.5 text-ink/35 hover:text-clay-600"
                >
                  <Trash size={14} />
                </button>
              )}
              <div className="grid grid-cols-2 gap-2.5 pr-6">
                <Input
                  placeholder="Medication name"
                  value={med.name}
                  onChange={(e) => updateMed(idx, 'name', e.target.value)}
                  className="col-span-2"
                />
                <Input
                  placeholder="Dosage (e.g. 500mg)"
                  value={med.dosage}
                  onChange={(e) => updateMed(idx, 'dosage', e.target.value)}
                />
                <Input
                  placeholder="Frequency (e.g. 2x daily)"
                  value={med.frequency}
                  onChange={(e) => updateMed(idx, 'frequency', e.target.value)}
                />
                <Input
                  placeholder="Duration (e.g. 7 days)"
                  value={med.duration}
                  onChange={(e) => updateMed(idx, 'duration', e.target.value)}
                />
                <Input
                  placeholder="Special instructions"
                  value={med.instructions}
                  onChange={(e) => updateMed(idx, 'instructions', e.target.value)}
                />
              </div>
              {errors[`med-${idx}`] && (
                <p className="mt-1.5 text-xs text-clay-600 font-medium">{errors[`med-${idx}`]}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <Textarea
        id="additionalInstructions"
        label="Additional instructions (optional)"
        rows={3}
        placeholder="Lifestyle advice, warning signs to watch for, etc."
        value={additionalInstructions}
        onChange={(e) => setAdditionalInstructions(e.target.value)}
      />

      <Input
        id="followUpDate"
        type="date"
        label="Follow-up date (optional)"
        value={followUpDate}
        onChange={(e) => setFollowUpDate(e.target.value)}
        min={new Date().toISOString().split('T')[0]}
      />

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        Save prescription
      </Button>
    </form>
  );
}
