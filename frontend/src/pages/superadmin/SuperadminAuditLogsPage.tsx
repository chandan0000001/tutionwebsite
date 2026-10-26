import React, { useEffect, useState, useCallback } from 'react';
import {
  FileText,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/apiConfig';
import { SuperadminHeader } from '../../components/superadmin/SuperadminHeader';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import { NotificationBanner } from '../../components/common/NotificationBanner';

interface AuditLogItem {
  _id: string;
  action: string;
  actorId: string;
  actorUsername: string;
  actorRole: string;
  targetType: string;
  targetId?: string;
  ipAddress?: string;
  details?: Record<string, unknown>;
  createdAt: string;
}

export const SuperadminAuditLogsPage: React.FC = () => {
  const { token } = useAuth();

  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [actionFilter, setActionFilter] = useState('');
  const [actorSearch, setActorSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());

  // Inspector modal
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  const fetchLogs = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const url = new URL(`${API_BASE_URL}/superadmin/audit-logs`);
      url.searchParams.set('page', String(page));
      url.searchParams.set('limit', '25');
      url.searchParams.set('_t', String(Date.now()));
      if (actionFilter) url.searchParams.set('action', actionFilter);
      if (actorSearch.trim()) url.searchParams.set('actor', actorSearch.trim());

      const res = await fetch(url.toString(), {
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setLogs(data.data || []);
        setLastRefreshedAt(new Date());
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
          setTotalRecords(data.pagination.totalRecords || 0);
        }
      } else {
        setErrorMessage(data.message || 'Failed to load audit logs.');
      }
    } catch {
      setErrorMessage('Network error while retrieving audit logs.');
    } finally {
      setIsLoading(false);
    }
  }, [token, page, actionFilter, actorSearch]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  const getActionBadgeClass = (action: string) => {
    if (action.includes('ASSIGN') || action.includes('CREATE')) {
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    }
    if (action.includes('DELETE') || action.includes('DEACTIVATE')) {
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    }
    if (action.includes('REMOVE')) {
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    }
    if (action.includes('PASSWORD')) {
      return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
    }
    if (action.includes('IMPORT')) {
      return 'bg-amber-500/10 text-[#C6922E] dark:text-[#F4C76B] border-amber-500/20';
    }
    return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
  };

  return (
    <div className="w-full min-h-[85vh] bg-[#F8FAFC] dark:bg-[#070B14] pb-12 transition-colors duration-200">
      <SuperadminHeader />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Title and Live Status */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Administrative Audit Trail
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Immutable log of sensitive operations: student enrollments, faculty provisioning, password resets, and content updates.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Updates</span>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <span>
                {lastRefreshedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
            <button
              type="button"
              onClick={() => fetchLogs()}
              disabled={isLoading}
              className="py-1.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1524] hover:bg-slate-50 dark:hover:bg-[#151F33] text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer shadow-xs transition-all disabled:opacity-50"
              title="Refresh audit records"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#C6922E]' : 'text-slate-500'}`} />
              <span>{isLoading ? 'Updating...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="bg-white dark:bg-[#0E1524] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setPage(1);
              }}
              className="w-full md:w-auto py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#151F33] text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#C6922E]"
            >
              <option value="">All Action Types</option>
              <option value="STUDENT_CREATE">STUDENT_CREATE</option>
              <option value="STUDENT_UPDATE">STUDENT_UPDATE</option>
              <option value="STUDENT_DELETE">STUDENT_DELETE</option>
              <option value="STUDENT_DEACTIVATE">STUDENT_DEACTIVATE</option>
              <option value="STUDENT_REACTIVATE">STUDENT_REACTIVATE</option>
              <option value="STUDENT_BATCH_ASSIGN">STUDENT_BATCH_ASSIGN</option>
              <option value="STUDENT_BATCH_REMOVE">STUDENT_BATCH_REMOVE</option>
              <option value="TEACHER_CREATE">TEACHER_CREATE</option>
              <option value="TEACHER_UPDATE">TEACHER_UPDATE</option>
              <option value="TEACHER_DEACTIVATE">TEACHER_DEACTIVATE</option>
              <option value="TEACHER_REACTIVATE">TEACHER_REACTIVATE</option>
              <option value="PASSWORD_RESET">PASSWORD_RESET</option>
              <option value="PASSWORD_CHANGE">PASSWORD_CHANGE</option>
              <option value="EXCEL_IMPORT">EXCEL_IMPORT</option>
              <option value="BATCH_CREATE">BATCH_CREATE</option>
              <option value="BATCH_UPDATE">BATCH_UPDATE</option>
              <option value="LECTURE_CREATE">LECTURE_CREATE</option>
              <option value="LECTURE_UPDATE">LECTURE_UPDATE</option>
              <option value="LECTURE_DELETE">LECTURE_DELETE</option>
            </select>
          </div>

          <form onSubmit={handleSearchSubmit} className="w-full md:w-72 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search actor username..."
                value={actorSearch}
                onChange={(e) => setActorSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#151F33] text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#C6922E]"
              />
            </div>
            <button
              type="submit"
              className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              Filter
            </button>
          </form>
        </div>

        {/* Error */}
        {errorMessage && (
          <div className="mb-4">
            <NotificationBanner
              type="error"
              message={errorMessage}
              onClose={() => setErrorMessage(null)}
            />
          </div>
        )}

        {/* Audit Log Table */}
        <div className="bg-white dark:bg-[#0E1524] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#151F33] border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="py-3 px-4">Timestamp (IST)</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Type</th>
                  <th className="py-3 px-4">Target ID / Context</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {isLoading ? (
                  <TableSkeleton rows={5} cols={7} />
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <FileText className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        No audit records match the current filters
                      </p>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr
                      key={log._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-[#151F33]/40 transition-colors"
                    >
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          @{log.actorUsername}
                        </span>
                        <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {log.actorRole}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border ${getActionBadgeClass(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        {log.targetType}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 truncate max-w-[160px]">
                        {log.targetId || '—'}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        {log.ipAddress || '127.0.0.1'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Inspect Metadata"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>
                Page {page} of {totalPages} ({totalRecords} audit events logged)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="py-1 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="py-1 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Audit Details Modal */}
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Audit Event Details
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400">ID: {selectedLog._id}</p>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#1E293B]">
                  <span className="font-bold text-slate-500">Action:</span>
                  <span className="font-mono font-bold text-amber-600">
                    {selectedLog.action}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#1E293B]">
                  <span className="font-bold text-slate-500">Actor:</span>
                  <span className="font-mono">
                    @{selectedLog.actorUsername} ({selectedLog.actorRole})
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#1E293B]">
                  <span className="font-bold text-slate-500">Target Type & ID:</span>
                  <span className="font-mono">
                    {selectedLog.targetType} / {selectedLog.targetId || 'N/A'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#1E293B]">
                  <span className="font-bold text-slate-500">Origin IP:</span>
                  <span className="font-mono">{selectedLog.ipAddress || '127.0.0.1'}</span>
                </div>

                <div>
                  <span className="block font-bold text-slate-500 mb-1">
                    Event Metadata Payload:
                  </span>
                  <pre className="p-3 rounded-xl bg-slate-900 text-amber-300 font-mono text-[11px] overflow-x-auto max-h-48">
                    {JSON.stringify(selectedLog.details || {}, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end mt-4">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperadminAuditLogsPage;
