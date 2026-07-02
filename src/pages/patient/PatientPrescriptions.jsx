import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';
import PulseLine from '../../components/ui/PulseLine';
import { FileText, Pill, Calendar } from '../../components/ui/icons';
import { prescriptionApi } from '../../api/prescriptions';
import { getErrorMessage } from '../../api/axios';

export default function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await prescriptionApi.getMy({ limit: 50 });
        setPrescriptions(res.data.prescriptions);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Patient Dashboard"
        title="Prescriptions"
        subtitle="Diagnoses and medications prescribed by your doctors."
      />

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : prescriptions.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No prescriptions yet"
          message="Prescriptions from your doctor will appear here after your appointments."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prescriptions.map((rx) => (
            <div key={rx._id} className="card p-5 animate-fadeUp">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-ink">Dr. {rx.doctor?.name}</p>
                  <p className="text-xs text-ink/50">{rx.doctor?.specialization}</p>
                </div>
                <span className="flex items-center gap-1 text-xs text-ink/45 shrink-0">
                  <Calendar size={12} />
                  {new Date(rx.createdAt).toLocaleDateString()}
                </span>
              </div>

              <PulseLine className="h-2.5 w-16 mb-3" color="#BCD5CD" animate={false} />

              <div className="mb-3">
                <p className="text-xs font-semibold uppercase text-ink/40 mb-1">Diagnosis</p>
                <p className="text-sm text-ink/80 leading-relaxed">{rx.diagnosis}</p>
              </div>

              <div className="mb-3">
                <p className="text-xs font-semibold uppercase text-ink/40 mb-1.5 flex items-center gap-1">
                  <Pill size={12} /> Medications
                </p>
                <div className="space-y-1.5">
                  {rx.medications?.map((med, i) => (
                    <div key={i} className="rounded-[6px] bg-mint px-3 py-2 text-xs">
                      <p className="font-semibold text-pine-800">{med.name} — {med.dosage}</p>
                      <p className="text-pine-700/75 mt-0.5">{med.frequency}{med.duration ? ` · ${med.duration}` : ''}</p>
                      {med.instructions && <p className="text-pine-700/60 mt-0.5 italic">{med.instructions}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {rx.additionalInstructions && (
                <div className="mb-2">
                  <p className="text-xs font-semibold uppercase text-ink/40 mb-1">Additional notes</p>
                  <p className="text-sm text-ink/65">{rx.additionalInstructions}</p>
                </div>
              )}

              {rx.followUpDate && (
                <p className="text-xs text-amber-700 font-medium mt-2 flex items-center gap-1">
                  <Calendar size={12} /> Follow-up: {new Date(rx.followUpDate).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
