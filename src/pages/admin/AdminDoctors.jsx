import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import UserManagementTable from '../../components/admin/UserManagementTable';
import { userApi } from '../../api/users';
import { getErrorMessage } from '../../api/axios';

const columns = [
  { key: 'name', label: 'Name', render: (u) => <span className="font-medium text-ink">{u.name}</span> },
  { key: 'email', label: 'Email' },
  { key: 'specialization', label: 'Specialization' },
  { key: 'experience', label: 'Experience', render: (u) => (u.experience != null ? `${u.experience} yrs` : '—') },
  { key: 'consultationFee', label: 'Fee', render: (u) => (u.consultationFee != null ? `$${u.consultationFee}` : '—') },
];

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDoctors = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await userApi.getDoctors({ search, page, limit: 10 });
      setDoctors(res.data.doctors);
      setTotalPages(res.data.pages);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const timer = setTimeout(fetchDoctors, 300);
    return () => clearTimeout(timer);
  }, [fetchDoctors]);

  const handleToggleStatus = async (id) => {
    try {
      await userApi.toggleStatus(id);
      toast.success('Status updated');
      fetchDoctors();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Admin Dashboard"
        title="Doctors"
        subtitle="View and manage registered doctors."
      />
      <UserManagementTable
        users={doctors}
        columns={columns}
        isLoading={isLoading}
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onToggleStatus={handleToggleStatus}
        searchPlaceholder="Search doctors by name or specialization…"
      />
    </DashboardLayout>
  );
}
