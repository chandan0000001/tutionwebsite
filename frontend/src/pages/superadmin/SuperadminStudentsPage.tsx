import React, { useEffect, useState, useCallback } from 'react';
import {
  Users,
  Search,
  PlusCircle,
  FileSpreadsheet,
  Download,
  Upload,
  Edit,
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/apiConfig';
import { SuperadminHeader } from '../../components/superadmin/SuperadminHeader';
import { CredentialsModal } from '../../components/common/CredentialsModal';

interface StudentItem {
  _id: string;
  name: string;
  username: string;
  phone: string;
  dateOfBirth: string;
  email?: string;
  college?: string;
  fatherName?: string;
  motherName?: string;
  address?: { street?: string };
  batch: string;
  batchCode: string;
  isActive: boolean;
  createdAt: string;
}

interface BatchOption {
  code: string;
  name: string;
}

export const SuperadminStudentsPage: React.FC = () => {
  const { token } = useAuth();

  const [batches, setBatches] = useState<BatchOption[]>([]);
  const [selectedBatchFilter, setSelectedBatchFilter] = useState<string>('');
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentItem | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);

  // One-time credentials popup
  const [credentialsPopup, setCredentialsPopup] = useState<{
    username: string;
    temporaryPassword: string;
    note?: string;
  } | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dateOfBirth: '',
    email: '',
    address: '',
    college: '',
    fatherName: '',
    motherName: '',
    batchCode: '',
  });

  // Excel import
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importBatchCode, setImportBatchCode] = useState<string>('');
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    summary: {
      totalRows: number;
      importedCount: number;
      skippedCount: number;
      invalidCount: number;
      duplicateCount: number;
    };
    createdAccounts: Array<{
      name: string;
      username: string;
      phone: string;
      temporaryPassword: string;
    }>;
    invalidRows: Array<{ rowNumber: number; reason: string }>;
  } | null>(null);

  // 1. Load Batches
  useEffect(() => {
    async function loadBatches() {
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/superadmin/batches`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.success && data.data.length > 0) {
          setBatches(data.data);
          setImportBatchCode(data.data[0].code);
          setFormData((prev) => ({ ...prev, batchCode: data.data[0].code }));
        }
      } catch {
        setErrorMessage('Failed to load batch list.');
      }
    }
    loadBatches();
  }, [token]);

  // 2. Fetch Students
  const fetchStudents = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const url = new URL(`${API_BASE_URL}/superadmin/students`);
      url.searchParams.set('page', String(page));
      url.searchParams.set('limit', '20');
      if (selectedBatchFilter) {
        url.searchParams.set('batchCode', selectedBatchFilter);
      }
      if (searchQuery.trim()) {
        url.searchParams.set('search', searchQuery.trim());
      }

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStudents(data.data || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
          setTotalRecords(data.pagination.totalRecords || 0);
        }
      } else {
        setErrorMessage(data.message || 'Could not fetch students.');
      }
    } catch {
      setErrorMessage('Network error while loading students.');
    } finally {
      setIsLoading(false);
    }
  }, [token, page, selectedBatchFilter, searchQuery]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchStudents();
  };

  // Create Student
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const res = await fetch(`${API_BASE_URL}/superadmin/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setShowAddModal(false);
        setCredentialsPopup(data.oneTimeCredentials);
        setSuccessMessage('Student registered successfully.');
        fetchStudents();
      } else {
        setErrorMessage(data.message || 'Failed to register student.');
      }
    } catch {
      setErrorMessage('Network error while enrolling student.');
    }
  };

  // Open Edit
  const openEdit = (s: StudentItem) => {
    setEditingStudent(s);
    setFormData({
      name: s.name,
      phone: s.phone,
      dateOfBirth: s.dateOfBirth,
      email: s.email || '',
      address: s.address?.street || '',
      college: s.college || '',
      fatherName: s.fatherName || '',
      motherName: s.motherName || '',
      batchCode: s.batchCode,
    });
    setShowEditModal(true);
  };

  // Update Student
  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setErrorMessage(null);

    try {
      const res = await fetch(`${API_BASE_URL}/superadmin/students/${editingStudent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setShowEditModal(false);
        setEditingStudent(null);
        setSuccessMessage('Student details updated successfully.');
        fetchStudents();
      } else {
        setErrorMessage(data.message || 'Failed to update student.');
      }
    } catch {
      setErrorMessage('Network error while updating student.');
    }
  };

  // Toggle Status
  const handleToggleStatus = async (s: StudentItem) => {
    const action = s.isActive ? 'deactivate' : 'reactivate';
    if (!window.confirm(`Are you sure you want to ${action} student "${s.name}"?`)) return;

    try {
      const res = await fetch(`${API_BASE_URL}/superadmin/students/${s._id}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage(data.message);
        fetchStudents();
      } else {
        setErrorMessage(data.message || 'Failed to update status.');
      }
    } catch {
      setErrorMessage('Network error while toggling status.');
    }
  };

  // Download Excel Template
  const handleDownloadTemplate = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/superadmin/students/template`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Antariksh_Students_Import_Template.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      setErrorMessage('Failed to download Excel template.');
    }
  };

  // Bulk Excel Import
  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFile || !importBatchCode) return;

    setIsImporting(true);
    setErrorMessage(null);
    setImportResult(null);

    const bodyData = new FormData();
    bodyData.append('file', importFile);
    bodyData.append('batchCode', importBatchCode);

    try {
      const res = await fetch(`${API_BASE_URL}/superadmin/students/import`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: bodyData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setImportResult(data);
        fetchStudents();
      } else {
        setErrorMessage(data.message || 'Excel import failed.');
      }
    } catch {
      setErrorMessage('Network error during Excel upload.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="w-full min-h-[85vh] bg-[#F8FAFC] dark:bg-[#070B14] pb-12 transition-colors duration-200">
      <SuperadminHeader />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Student Master Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Cross-batch student account administration, manual enrollments, status controls, and bulk Excel data ingest.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                setImportResult(null);
                setImportFile(null);
                setShowImportModal(true);
              }}
              className="py-2 px-3.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white bg-white dark:bg-[#151F33] border border-slate-300 dark:border-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Bulk Excel Import</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="py-2 px-3.5 rounded-xl text-xs font-extrabold text-[#0B1120] bg-gradient-to-r from-[#C6922E] via-[#F4C76B] to-[#C6922E] hover:brightness-105 active:scale-[0.99] transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Enroll Student</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white dark:bg-[#0E1524] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedBatchFilter}
              onChange={(e) => {
                setSelectedBatchFilter(e.target.value);
                setPage(1);
              }}
              className="w-full md:w-auto py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#151F33] text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#C6922E]"
            >
              <option value="">All Cohort Batches</option>
              {batches.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSearchSubmit} className="w-full md:w-80 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, phone, username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#151F33] text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#C6922E]"
              />
            </div>
            <button
              type="submit"
              className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              Search
            </button>
          </form>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mb-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Error</p>
              <p>{errorMessage}</p>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-3 text-emerald-700 dark:text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Success</p>
              <p>{successMessage}</p>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Credentials Modal */}
        {credentialsPopup && (
          <CredentialsModal
            isOpen={true}
            onClose={() => setCredentialsPopup(null)}
            title="Student Account Enrolled"
            roleName="Student"
            username={credentialsPopup.username}
            temporaryPassword={credentialsPopup.temporaryPassword}
            note={credentialsPopup.note}
          />
        )}

        {/* Students Table */}
        <div className="bg-white dark:bg-[#0E1524] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#151F33] border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="py-3 px-4">Student Details</th>
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Batch</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">DOB</th>
                  <th className="py-3 px-4">College</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      <div className="w-7 h-7 mx-auto border-3 border-slate-200 border-t-[#C6922E] rounded-full animate-spin"></div>
                      <p className="mt-2 text-xs">Loading student records...</p>
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      <Users className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        No students found
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {searchQuery ? 'Try a different search term.' : 'No students found.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  students.map((s) => (
                    <tr
                      key={s._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-[#151F33]/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{s.name}</div>
                        {s.email && (
                          <div className="text-[11px] text-slate-400 truncate max-w-[170px]">
                            {s.email}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                        {s.username}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-amber-500/10 text-[#C6922E] dark:text-[#F4C76B] border border-amber-500/20">
                          {s.batchCode}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                        {s.phone}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{s.dateOfBirth}</td>
                      <td className="py-3 px-4 text-slate-500 truncate max-w-[140px]">
                        {s.college || '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            s.isActive
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {s.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openEdit(s)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit Student"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(s)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              s.isActive
                                ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                                : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                            }`}
                            title={s.isActive ? 'Deactivate Account' : 'Reactivate Account'}
                          >
                            {s.isActive ? (
                              <UserX className="w-3.5 h-3.5" />
                            ) : (
                              <UserCheck className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
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
                Page {page} of {totalPages} ({totalRecords} students total)
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

        {/* Add Student Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
                <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
                  Enroll Student
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateStudent} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Select Batch Cohort *
                  </label>
                  <select
                    required
                    value={formData.batchCode}
                    onChange={(e) => setFormData({ ...formData, batchCode: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs font-bold focus:ring-2 focus:ring-[#C6922E]"
                  >
                    {batches.map((b) => (
                      <option key={b.code} value={b.code}>
                        {b.name} ({b.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dipti Ranjan"
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number (10 digits) *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value.replace(/[^0-9]/g, ''),
                        })
                      }
                      placeholder="9876543210"
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Date of Birth * (DD/MM/YYYY)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      placeholder="20/05/2007"
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      College / School
                    </label>
                    <input
                      type="text"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      City / Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl text-xs font-extrabold text-[#0B1120] bg-gradient-to-r from-[#C6922E] via-[#F4C76B] to-[#C6922E] shadow-sm hover:brightness-105"
                  >
                    Enroll Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Student Modal */}
        {showEditModal && editingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
                <div>
                  <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
                    Edit Student: {editingStudent.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">@{editingStudent.username}</p>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateStudent} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Batch Allocation
                  </label>
                  <select
                    value={formData.batchCode}
                    onChange={(e) => setFormData({ ...formData, batchCode: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs font-bold focus:ring-2 focus:ring-[#C6922E]"
                  >
                    {batches.map((b) => (
                      <option key={b.code} value={b.code}>
                        {b.name} ({b.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value.replace(/[^0-9]/g, ''),
                        })
                      }
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Date of Birth * (DD/MM/YYYY)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl text-xs font-extrabold text-[#0B1120] bg-gradient-to-r from-[#C6922E] via-[#F4C76B] to-[#C6922E] shadow-sm hover:brightness-105"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bulk Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
                <div>
                  <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
                    Bulk Student Import via Excel
                  </h3>
                  <p className="text-xs text-slate-500">
                    Import multiple registrations simultaneously.
                  </p>
                </div>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!importResult ? (
                <div className="space-y-6">
                  {/* Step 1: Download Template */}
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-xs text-amber-900 dark:text-amber-200">
                        Step 1: Download Excel Template
                      </h4>
                      <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                        Download standard headers (.xlsx) for student enrollment.
                      </p>
                    </div>
                    <button
                      onClick={handleDownloadTemplate}
                      className="py-2 px-3.5 rounded-xl bg-[#C6922E] hover:bg-[#A3741E] text-white text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .xlsx</span>
                    </button>
                  </div>

                  {/* Step 2: Form */}
                  <form onSubmit={handleBulkImport} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                        Select Target Batch Cohort *
                      </label>
                      <select
                        required
                        value={importBatchCode}
                        onChange={(e) => setImportBatchCode(e.target.value)}
                        className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs font-bold focus:ring-2 focus:ring-[#C6922E]"
                      >
                        {batches.map((b) => (
                          <option key={b.code} value={b.code}>
                            {b.name} ({b.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                        Choose Excel File (.xlsx) *
                      </label>
                      <input
                        type="file"
                        accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        required
                        onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                        className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#17365D] file:text-white hover:file:bg-[#1E4273] cursor-pointer"
                      />
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowImportModal(false)}
                        className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!importFile || isImporting}
                        className="py-2.5 px-6 rounded-xl text-xs font-extrabold text-[#0B1120] bg-gradient-to-r from-[#C6922E] via-[#F4C76B] to-[#C6922E] shadow-sm disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                      >
                        {isImporting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-[#0B1120] border-t-transparent rounded-full animate-spin"></div>
                            <span>Importing Data...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span>Upload & Enroll</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#151F33] border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500">Total Rows</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white">
                        {importResult.summary.totalRows}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-emerald-600">Imported</p>
                      <p className="text-xl font-black text-emerald-600">
                        {importResult.summary.importedCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-amber-600">Skipped/Dup</p>
                      <p className="text-xl font-black text-amber-600">
                        {importResult.summary.skippedCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-rose-600">Invalid</p>
                      <p className="text-xl font-black text-rose-600">
                        {importResult.summary.invalidCount}
                      </p>
                    </div>
                  </div>

                  {importResult.createdAccounts.length > 0 && (
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-2">
                        Provisioned Accounts ({importResult.createdAccounts.length}):
                      </h4>
                      <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 dark:bg-slate-800 font-bold text-[11px] text-slate-500">
                            <tr>
                              <th className="p-2">Name</th>
                              <th className="p-2">Username</th>
                              <th className="p-2">Temp Password</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {importResult.createdAccounts.map((acc, i) => (
                              <tr key={i}>
                                <td className="p-2 font-medium">{acc.name}</td>
                                <td className="p-2 font-mono text-amber-600">{acc.username}</td>
                                <td className="p-2 font-mono font-bold text-emerald-600 select-all">
                                  {acc.temporaryPassword}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button
                      onClick={() => setShowImportModal(false)}
                      className="py-2.5 px-6 rounded-xl text-xs font-bold bg-[#17365D] text-white hover:bg-[#1E4273]"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperadminStudentsPage;
