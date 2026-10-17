import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/apiConfig';
import { TeacherHeader } from '../../components/teacher/TeacherHeader';
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
  address?: {
    street?: string;
  };
  batch: string;
  batchCode: string;
  isActive: boolean;
  createdAt: string;
}

interface BatchOption {
  code: string;
  name: string;
  academicYear: string;
}

export const TeacherStudentsPage: React.FC = () => {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [batches, setBatches] = useState<BatchOption[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentItem | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);

  // One-time credentials popup
  const [createdCredentials, setCreatedCredentials] = useState<{
    username: string;
    temporaryPassword: string;
    note?: string;
  } | null>(null);

  // Single student form data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dateOfBirth: '',
    email: '',
    address: '',
    college: '',
    fatherName: '',
    motherName: '',
  });

  // Excel import state
  const [importFile, setImportFile] = useState<File | null>(null);
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

  // 1. Fetch Teacher Batches
  useEffect(() => {
    async function loadBatches() {
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/teacher/batches`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.success && data.data.length > 0) {
          setBatches(data.data);
          const initialBatch = searchParams.get('batch') || data.data[0].code;
          setSelectedBatch(initialBatch);
        }
      } catch {
        setErrorMessage('Failed to load assigned batches.');
      }
    }
    loadBatches();
  }, [token, searchParams]);

  // 2. Fetch Students for Selected Batch
  const fetchStudents = useCallback(async () => {
    if (!token || !selectedBatch) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const url = new URL(`${API_BASE_URL}/teacher/batches/${selectedBatch}/students`);
      url.searchParams.set('page', String(page));
      url.searchParams.set('limit', '15');
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
      setErrorMessage('Unable to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  }, [token, selectedBatch, page, searchQuery]);

  useEffect(() => {
    if (selectedBatch) {
      fetchStudents();
    }
  }, [selectedBatch, page, fetchStudents]);

  const handleBatchChange = (code: string) => {
    setSelectedBatch(code);
    setPage(1);
    setSearchParams({ batch: code });
  };

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
      const res = await fetch(`${API_BASE_URL}/teacher/batches/${selectedBatch}/students`, {
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
        setFormData({
          name: '',
          phone: '',
          dateOfBirth: '',
          email: '',
          address: '',
          college: '',
          fatherName: '',
          motherName: '',
        });
        setCreatedCredentials(data.oneTimeCredentials);
        setSuccessMessage('Student enrolled successfully!');
        fetchStudents();
      } else {
        setErrorMessage(data.message || 'Failed to enroll student.');
      }
    } catch {
      setErrorMessage('Network error during student registration.');
    }
  };

  // Open Edit Modal
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
    });
    setShowEditModal(true);
  };

  // Update Student
  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setErrorMessage(null);

    try {
      const res = await fetch(
        `${API_BASE_URL}/teacher/batches/${selectedBatch}/students/${editingStudent._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        setShowEditModal(false);
        setEditingStudent(null);
        setSuccessMessage('Student record updated successfully.');
        fetchStudents();
      } else {
        setErrorMessage(data.message || 'Failed to update student.');
      }
    } catch {
      setErrorMessage('Network error while saving changes.');
    }
  };

  // Toggle Status
  const handleToggleStatus = async (s: StudentItem) => {
    const action = s.isActive ? 'deactivate' : 'reactivate';
    if (!window.confirm(`Are you sure you want to ${action} student "${s.name}"?`)) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/teacher/batches/${selectedBatch}/students/${s._id}/status`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
      const res = await fetch(
        `${API_BASE_URL}/teacher/batches/${selectedBatch}/students/template`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error('Template download failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Antariksh_Students_Import_${selectedBatch}.xlsx`;
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
    if (!importFile) return;

    setIsImporting(true);
    setErrorMessage(null);
    setImportResult(null);

    const bodyData = new FormData();
    bodyData.append('file', importFile);

    try {
      const res = await fetch(
        `${API_BASE_URL}/teacher/batches/${selectedBatch}/students/import`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: bodyData,
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        setImportResult(data);
        fetchStudents();
      } else {
        setErrorMessage(data.message || 'Excel import failed.');
      }
    } catch {
      setErrorMessage('Network error while uploading Excel file.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="w-full min-h-[85vh] bg-[#F8FAFC] dark:bg-[#0B1120] pb-12 transition-colors duration-200">
      <TeacherHeader />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Page Title & Batch Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-[#17365D] dark:text-white">
              Student Cohort Roster
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Enroll individual students, update academic profiles, or import registrations via Excel.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                setImportResult(null);
                setImportFile(null);
                setShowImportModal(true);
              }}
              className="py-2 px-3.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white bg-white dark:bg-[#1E293B] border border-slate-300 dark:border-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
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

        {/* Batch Selection & Search Bar */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">
              Select Batch:
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => handleBatchChange(e.target.value)}
              className="w-full md:w-auto py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#C6922E]"
            >
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
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#C6922E]"
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
            <button onClick={() => setErrorMessage(null)} className="text-slate-400 hover:text-slate-600">
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
            <button onClick={() => setSuccessMessage(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Students Table */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#1E293B]/70 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="py-3 px-4">Student Details</th>
                  <th className="py-3 px-4">Portal Username</th>
                  <th className="py-3 px-4">Phone / Contact</th>
                  <th className="py-3 px-4">DOB</th>
                  <th className="py-3 px-4">College / School</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <div className="w-7 h-7 mx-auto border-3 border-slate-200 border-t-[#C6922E] rounded-full animate-spin"></div>
                      <p className="mt-2 text-xs">Loading students...</p>
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <Users className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        No students found
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {searchQuery
                          ? 'Try adjusting your search criteria.'
                          : 'No students have been enrolled in this batch yet.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  students.map((s) => (
                    <tr
                      key={s._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-[#1E293B]/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{s.name}</div>
                        {s.email && (
                          <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                            {s.email}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-700 dark:text-amber-400">
                        {s.username}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                        {s.phone}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {s.dateOfBirth}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 truncate max-w-[160px]">
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
                          {s.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openEdit(s)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-[#17365D] dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>
                Showing Page {page} of {totalPages} ({totalRecords} students total)
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

        {/* Credentials Popup Modal */}
        {createdCredentials && (
          <CredentialsModal
            isOpen={true}
            onClose={() => setCreatedCredentials(null)}
            title="Student Enrolled Successfully"
            roleName="Student"
            username={createdCredentials.username}
            temporaryPassword={createdCredentials.temporaryPassword}
            note={createdCredentials.note}
          />
        )}

        {/* Add Student Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
                <div>
                  <h3 className="font-display font-black text-xl text-[#17365D] dark:text-white">
                    Enroll Student in {selectedBatch}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Generates a unique username and 8-digit temporary password.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateStudent} className="space-y-4">
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
                      placeholder="e.g. Aarav Patnaik"
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Mobile Phone (10 digits) *
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
                      placeholder="e.g. 9876543210"
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
                      placeholder="15/08/2007"
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
                      placeholder="student@example.com"
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
                      placeholder="Khallikote Higher Secondary"
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
                      placeholder="Brahmapur, Ganjam"
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Father's Name
                    </label>
                    <input
                      type="text"
                      value={formData.fatherName}
                      onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Mother's Name
                    </label>
                    <input
                      type="text"
                      value={formData.motherName}
                      onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl text-xs font-extrabold text-[#0B1120] bg-gradient-to-r from-[#C6922E] via-[#F4C76B] to-[#C6922E] shadow-sm hover:brightness-105"
                  >
                    Save & Generate Credentials
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
                  <h3 className="font-display font-black text-xl text-[#17365D] dark:text-white">
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
                      Mobile Phone (10 digits) *
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Father's Name
                    </label>
                    <input
                      type="text"
                      value={formData.fatherName}
                      onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Mother's Name
                    </label>
                    <input
                      type="text"
                      value={formData.motherName}
                      onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300"
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

        {/* Excel Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
                <div>
                  <h3 className="font-display font-black text-xl text-[#17365D] dark:text-white">
                    Bulk Student Import via Excel (.xlsx)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Target cohort: <strong>{selectedBatch}</strong>
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
                        Step 1: Download Standard Excel Template
                      </h4>
                      <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                        Includes predefined headers: Name, Phone, DateOfBirth, Email, Address, College, FatherName, MotherName.
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

                  {/* Step 2: Upload File */}
                  <form onSubmit={handleBulkImport} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                        Step 2: Choose Populated Excel File (.xlsx)
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
                            <span>Parsing & Enrolling...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span>Upload & Import</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* Import Result Summary View */
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
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

                  {/* Created Accounts list with passwords */}
                  {importResult.createdAccounts.length > 0 && (
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-2">
                        Newly Provisioned Accounts ({importResult.createdAccounts.length}):
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

                  {/* Invalid Rows list */}
                  {importResult.invalidRows.length > 0 && (
                    <div>
                      <h4 className="font-bold text-xs text-rose-600 mb-1">
                        Errors Encountered:
                      </h4>
                      <div className="max-h-36 overflow-y-auto rounded-xl p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs space-y-1">
                        {importResult.invalidRows.map((inv, i) => (
                          <p key={i}>
                            <strong>Row {inv.rowNumber}:</strong> {inv.reason}
                          </p>
                        ))}
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

export default TeacherStudentsPage;
