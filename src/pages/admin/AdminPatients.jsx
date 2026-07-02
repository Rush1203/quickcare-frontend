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
  { key: 'gender', label: 'Gender' },
  {
    key: 'dateOfBirth',
    label: 'Date of birth',
    render: (u) => (u.dateOfBirth ? new Date(u.dateOfBirth).toLocaleDateString() : '—'),
  },
  { key: 'phone', label: 'Phone' },
];

export default function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  const handleToggleStatus = async (id) => {
    try {
      await userApi.toggleStatus(id);
      toast.success('Status updated');
      fetchPatients();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Admin Dashboard"
        title="Patients"
        subtitle="View and manage registered patients."
      />
      <UserManagementTable
        users={patients}
        columns={columns}
        isLoading={isLoading}
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onToggleStatus={handleToggleStatus}
        searchPlaceholder="Search patients by name or email…"
      />
    </DashboardLayout>
  );
}
