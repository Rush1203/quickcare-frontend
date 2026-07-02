import { useState } from 'react';
import StatusBadge from '../ui/StatusBadge';
import Spinner from '../ui/Spinner';
import { Calendar, Clock, ChevronRight, FileText } from '../ui/icons';

const STATUS_OPTIONS = ['Scheduled', 'Completed', 'Cancelled'];

export default function DoctorAppointmentCard({ appointment, onStatusChange, onViewPatient, onPrescribe }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === appointment.status) return;
    setIsUpdating(true);
    await onStatusChange(appointment._id, newStatus);
    setIsUpdating(false);
  };

  return (
    <div className="card p-5 animate-fadeUp">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => onViewPatient(appointment.patient)}
          className="flex items-start gap-4 text-left group flex-1 min-w-0"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mint text-pine-700 font-serif font-semibold">
            {appointment.patient?.name?.charAt(0) || 'P'}
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-ink group-hover:text-pine-700 transition-colors flex items-center gap-1">
              {appointment.patient?.name}
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
            <p className="text-sm text-ink/55">
              {appointment.patient?.gender}{appointment.patient?.gender ? ' · ' : ''}
              {appointment.patient?.phone}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-ink/50">
              <span className="flex items-center gap-1">
                <Calendar size={13} /> {new Date(appointment.appointmentDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={13} /> {appointment.timeSlot}
              </span>
            </div>
            {appointment.reason && (
              <p className="mt-1.5 text-sm text-ink/65 max-w-md truncate">{appointment.reason}</p>
            )}
          </div>
        </button>

        <div className="flex items-center gap-2.5 shrink-0">
          {isUpdating ? (
            <Spinner size="sm" />
          ) : (
            <select
              value={appointment.status}
              onChange={handleStatusChange}
              className="text-xs font-semibold rounded-full border border-pine-200 bg-white px-3 py-1.5 outline-none focus:border-pine-500 cursor-pointer"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          )}
          <StatusBadge status={appointment.status} />
        </div>
      </div>

      {appointment.status !== 'Cancelled' && (
        <div className="mt-4 pt-4 border-t border-pine-100 flex justify-end">
          <button
            onClick={() => onPrescribe(appointment)}
            className="flex items-center gap-1.5 text-xs font-semibold text-pine-700 hover:text-pine-800"
          >
            <FileText size={14} /> Write prescription
          </button>
        </div>
      )}
    </div>
  );
}
