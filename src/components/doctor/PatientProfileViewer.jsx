import PulseLine from '../ui/PulseLine';
import Spinner from '../ui/Spinner';
import { Pill, FileText, Calendar, Phone, Mail } from '../ui/icons';

export default function PatientProfileViewer({ profile, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-14">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!profile) return null;

  const { patientInfo, medicalHistory, prescriptionHistory } = profile;
  const mh = medicalHistory || {};

  return (
    <div className="space-y-6">
      {/* Basic info */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mint text-pine-700 font-serif font-semibold text-lg">
            {patientInfo.name?.charAt(0)}
          </span>
          <div>
            <p className="font-serif text-lg font-semibold text-ink">{patientInfo.name}</p>
            <p className="text-xs text-ink/50">
              {patientInfo.gender}{patientInfo.gender ? ' · ' : ''}
              {patientInfo.dateOfBirth ? `Born ${new Date(patientInfo.dateOfBirth).toLocaleDateString()}` : ''}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-ink/55">
          {patientInfo.email && <span className="flex items-center gap-1"><Mail size={12} /> {patientInfo.email}</span>}
          {patientInfo.phone && <span className="flex items-center gap-1"><Phone size={12} /> {patientInfo.phone}</span>}
        </div>
      </div>

      <PulseLine className="h-3 w-full" color="#BCD5CD" animate={false} />

      {/* Medical history */}
      <div>
        <h3 className="flex items-center gap-1.5 font-serif text-base font-semibold text-ink mb-3">
          <Pill size={15} className="text-pine-600" /> Medical history
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <HistoryBlock label="Blood type" value={mh.bloodType || '—'} />
          <HistoryTags label="Allergies" items={mh.allergies} />
          <HistoryTags label="Chronic conditions" items={mh.chronicConditions} />
          <HistoryTags label="Past surgeries" items={mh.pastSurgeries} />
          <HistoryTags label="Current medications" items={mh.currentMedications} />
        </div>
      </div>

      <PulseLine className="h-3 w-full" color="#BCD5CD" animate={false} />

      {/* Prescription timeline */}
      <div>
        <h3 className="flex items-center gap-1.5 font-serif text-base font-semibold text-ink mb-4">
          <FileText size={15} className="text-pine-600" /> Prescription history
          <span className="text-xs font-sans font-medium text-ink/40">({prescriptionHistory?.length || 0})</span>
        </h3>

        {!prescriptionHistory?.length ? (
          <p className="text-sm text-ink/45 italic">No prior prescriptions on record.</p>
        ) : (
          <div className="space-y-4 relative pl-5 border-l-2 border-pine-100">
            {prescriptionHistory.map((rx) => (
              <div key={rx._id} className="relative">
                <span className="absolute -left-[26px] top-1 h-3 w-3 rounded-full bg-pine-500 ring-4 ring-white" />
                <div className="rounded-[8px] border border-pine-100 bg-mint/30 p-3.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-semibold text-pine-700 flex items-center gap-1">
                      <Calendar size={11} /> {new Date(rx.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-ink/40">Dr. {rx.doctor?.name}</p>
                  </div>
                  <p className="text-sm font-medium text-ink mb-2">{rx.diagnosis}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {rx.medications?.map((med, i) => (
                      <span key={i} className="rounded-full bg-white border border-pine-200 px-2.5 py-1 text-xs text-pine-700">
                        {med.name} ({med.dosage})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryBlock({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-ink/40 mb-1">{label}</p>
      <p className="text-sm text-ink font-medium">{value}</p>
    </div>
  );
}

function HistoryTags({ label, items = [] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-ink/40 mb-1">{label}</p>
      {items?.length ? (
        <div className="flex flex-wrap gap-1">
          {items.map((item, i) => (
            <span key={i} className="rounded-full bg-mint px-2 py-0.5 text-xs text-pine-700">{item}</span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-ink/35 italic">None recorded</p>
      )}
    </div>
  );
}
