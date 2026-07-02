import { useState } from 'react';
import Spinner from '../ui/Spinner';
import { Search } from '../ui/icons';

export default function UserManagementTable({
  users,
  columns,
  isLoading,
  search,
  onSearchChange,
  page,
  totalPages,
  onPageChange,
  onToggleStatus,
  searchPlaceholder = 'Search by name or email…',
}) {
  const [togglingId, setTogglingId] = useState(null);

  const handleToggle = async (id) => {
    setTogglingId(id);
    await onToggleStatus(id);
    setTogglingId(null);
  };

  return (
    <div>
      <div className="relative mb-5 max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/35" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : users.length === 0 ? (
        <div className="card px-6 py-14 text-center">
          <p className="text-sm text-ink/45 italic">No results found.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-mint/50">
                <tr className="text-left text-xs font-semibold uppercase text-ink/45">
                  {columns.map((col) => (
                    <th key={col.key} className="px-5 py-3">{col.label}</th>
                  ))}
                  <th className="px-5 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pine-50">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-mint/20 transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className="px-5 py-3.5 text-ink/80">
                        {col.render ? col.render(u) : (u[col.key] ?? '—')}
                      </td>
                    ))}
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleToggle(u._id)}
                        disabled={togglingId === u._id}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${
                          u.isActive !== false
                            ? 'bg-pine-100 text-pine-700 hover:bg-clay-50 hover:text-clay-600'
                            : 'bg-clay-50 text-clay-600 hover:bg-pine-100 hover:text-pine-700'
                        }`}
                      >
                        {togglingId === u._id ? (
                          <Spinner size="sm" />
                        ) : (
                          <>
                            <span className={`h-1.5 w-1.5 rounded-full ${u.isActive !== false ? 'bg-pine-600' : 'bg-clay-500'}`} />
                            {u.isActive !== false ? 'Active' : 'Inactive'}
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`h-8 w-8 rounded-full text-xs font-semibold transition-colors ${
                page === p ? 'bg-pine-600 text-white' : 'bg-white border border-pine-200 text-ink/60 hover:border-pine-400'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
