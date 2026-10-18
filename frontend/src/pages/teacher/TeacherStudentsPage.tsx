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
  Trash2,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/apiConfig';
import { TeacherHeader } from '../../components/teacher/TeacherHeader';
import { CredentialsModal } from '../../components/common/CredentialsModal';
import { ConfirmModal, type ConfirmVariant } from '../../components/common/ConfirmModal';
import { LoadingButton } from '../../components/common/LoadingButton';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { NotificationBanner } from '../../components/common/NotificationBanner';

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
  batchIds?: string[];
  batchCodes?: string[];
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
  const [modalError, setModalError] = useState<string | null>(null);

  // Operation specific loading states
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [importStage, setImportStage] = useState<'idle' | 'uploading' | 'validating' | 'importing'>('idle');
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentItem | null>(null);
  const [editingStudentBatches, setEditingStudentBatches] = useState<string[]>([]);
  const [newBatchToAssign, setNewBatchToAssign] = useState<string>('');
  const [batchActionLoading, setBatchActionLoading] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // One-time credentials popup
  const [createdCredentials, setCreatedCredentials] = useState<{
    username: string;
    temporaryPassword: string;
    note?: string;
  } | null>(null);

  // Custom confirmation modal state
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: ConfirmVariant;
    onConfirm: () => void;
    isLoading?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

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
    if (isEnrolling) return;
    setModalError(null);
    setErrorMessage(null);

    // 1. Client-side Form Validation
    const trimmedName = formData.name.trim();
    const cleanPhone = formData.phone.trim();
    const dob = formData.dateOfBirth.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setModalError('Please enter a valid student full name (at least 2 characters).');
      return;
    }
    if (!cleanPhone || cleanPhone.length !== 10 || !/^\d{10}$/.test(cleanPhone)) {
      setModalError('Please enter a valid 10-digit mobile phone number.');
      return;
    }
    if (!dob) {
      setModalError('Please enter date of birth (e.g. DD/MM/YYYY).');
      return;
    }

    setIsEnrolling(true);

    try {
      const res = await fetch(`${API_BASE_URL}/teacher/batches/${selectedBatch}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          name: trimmedName,
          phone: cleanPhone,
          dateOfBirth: dob,
        }),
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
        setModalError(data.message || 'Failed to enroll student. Please check the entered details.');
      }
    } catch {
      setModalError('Network error during student registration. Please try again.');
    } finally {
      setIsEnrolling(false);
    }
  };

  // Open Edit Modal
  const openEdit = (s: StudentItem) => {
    setEditingStudent(s);
    setEditingStudentBatches(
      (s.batchCodes && s.batchCodes.length > 0 ? s.batchCodes : [s.batchCode || selectedBatch]).filter(Boolean)
    );
    setNewBatchToAssign('');
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

  // Assign batch handler (scoped to teacher's authorized batches)
  const handleAssignBatch = async (batchCode: string) => {
    if (!editingStudent || !batchCode) return;
    setBatchActionLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`${API_BASE_URL}/students/${editingStudent._id}/batches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ batchCode }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const updatedCodes = data.student?.batchCodes || [...editingStudentBatches, batchCode];
        setEditingStudentBatches(Array.from(new Set(updatedCodes)));
        setNewBatchToAssign('');
        setSuccessMessage(data.message || `Student enrolled in ${batchCode}`);
        fetchStudents();
      } else {
        setErrorMessage(data.message || 'Failed to assign batch.');
      }
    } catch {
      setErrorMessage('Network error while assigning batch.');
    } finally {
      setBatchActionLoading(false);
    }
  };

  // Remove batch handler (scoped to teacher's authorized batches)
  const handleRemoveBatch = async (batchCode: string) => {
    if (!editingStudent || !batchCode) return;
    setBatchActionLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`${API_BASE_URL}/students/${editingStudent._id}/batches/${batchCode}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const remaining = editingStudentBatches.filter((b) => b !== batchCode);
        setEditingStudentBatches(remaining);
        setSuccessMessage(data.message || `Removed from ${batchCode}`);
        fetchStudents();
      } else {
        setErrorMessage(data.message || 'Failed to remove batch.');
      }
    } catch {
      setErrorMessage('Network error while removing batch.');
    } finally {
      setBatchActionLoading(false);
    }
  };

  // Update Student
  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || isUpdating) return;
    setModalError(null);
    setErrorMessage(null);

    const trimmedName = formData.name.trim();
    const cleanPhone = formData.phone.trim();
    if (!trimmedName) {
      setModalError('Student full name cannot be blank.');
      return;
    }
    if (!cleanPhone || cleanPhone.length !== 10) {
      setModalError('Valid 10-digit phone number is required.');
      return;
    }

    setIsUpdating(true);

    try {
      const res = await fetch(
        `${API_BASE_URL}/teacher/batches/${selectedBatch}/students/${editingStudent._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            name: trimmedName,
            phone: cleanPhone,
          }),
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        setShowEditModal(false);
        setEditingStudent(null);
        setSuccessMessage('Student record updated successfully.');
        fetchStudents();
      } else {
        setModalError(data.message || 'Failed to update student.');
      }
    } catch {
      setModalError('Network error while saving changes.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Execute Toggle Status
  const executeToggleStatus = async (s: StudentItem) => {
    setConfirmState((prev) => ({ ...prev, isLoading: true }));
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
    } finally {
      setConfirmState((prev) => ({ ...prev, isOpen: false, isLoading: false }));
    }
  };

  const handleToggleStatus = (s: StudentItem) => {
    const isActivating = !s.isActive;
    setConfirmState({
      isOpen: true,
      title: `${isActivating ? 'Reactivate' : 'Deactivate'} Student Account`,
      message: (
        <span>
          Are you sure you want to <strong>{isActivating ? 'reactivate' : 'deactivate'}</strong> student account for <strong>{s.name}</strong> (@{s.username}) in this batch? {isActivating ? 'Their portal access will be restored.' : 'They will not be able to log in while deactivated.'}
        </span>
      ),
      confirmText: isActivating ? 'Reactivate Student' : 'Deactivate Student',
      variant: isActivating ? 'warning' : 'danger',
      onConfirm: () => executeToggleStatus(s),
    });
  };

  // Delete Student Directly from Database
  const executeDeleteStudent = async (s: StudentItem) => {
    setConfirmState((prev) => ({ ...prev, isLoading: true }));
    try {
      const res = await fetch(
        `${API_BASE_URL}/teacher/batches/${selectedBatch}/students/${s._id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage(data.message || `Student '${s.name}' deleted successfully.`);
        fetchStudents();
      } else {
        setErrorMessage(data.message || 'Failed to delete student.');
      }
    } catch {
      setErrorMessage('Network error while deleting student.');
    } finally {
      setConfirmState((prev) => ({ ...prev, isOpen: false, isLoading: false }));
    }
  };

  const handleDeleteStudent = (s: StudentItem) => {
    setConfirmState({
      isOpen: true,
      title: 'Delete Student from Database',
      message: (
        <span>
          Are you sure you want to permanently delete <strong>{s.name}</strong> (@{s.username}) from this batch? This action deletes their record directly from the database.
        </span>
      ),
      confirmText: 'Delete Permanently',
      variant: 'danger',
      onConfirm: () => executeDeleteStudent(s),
    });
  };

  // Download Excel Template
  const handleDownloadTemplate = async () => {
    if (isDownloadingTemplate) return;
    setIsDownloadingTemplate(true);
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
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  // Bulk Excel Import
  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFile || isImporting) return;

    setIsImporting(true);
    setImportStage('uploading');
    setErrorMessage(null);
    setImportResult(null);

    const bodyData = new FormData();
    bodyData.append('file', importFile);

    try {
      setImportStage('validating');
      const res = await fetch(
        `${API_BASE_URL}/teacher/batches/${selectedBatch}/students/import`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: bodyData,
        }
      );

      setImportStage('importing');
      const data = await res.json();
      if (res.ok && data.success) {
        setImportResult(data);
        const imported = data.summary?.importedCount || 0;
        const invalid = data.summary?.invalidCount || 0;
        setSuccessMessage(`Excel import completed: ${imported} enrolled successfully${invalid > 0 ? `, ${invalid} invalid rows` : ''}.`);
        fetchStudents();
      } else {
        setErrorMessage(data.message || 'Excel import failed.');
      }
    } catch {
      setErrorMessage('Network error while uploading Excel file.');
    } finally {
      setIsImporting(false);
      setImportStage('idle');
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
          <NotificationBanner
            type="error"
            title="Action Error"
            message={errorMessage}
            onDismiss={() => setErrorMessage(null)}
            className="mb-4"
          />
        )}

        {successMessage && (
          <NotificationBanner
            type="success"
            title="Success"
            message={successMessage}
            onDismiss={() => setSuccessMessage(null)}
            autoDismissMs={5000}
            className="mb-4"
          />
        )}

        {/* Students Table & Mobile Cards */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
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
                  Array.from({ length: 6 }).map((_, rIdx) => (
                    <tr key={rIdx} className="animate-pulse">
                      <td className="py-3.5 px-4">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32 mb-1" />
                        <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-20" />
                      </td>
                      <td className="py-3.5 px-4"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" /></td>
                      <td className="py-3.5 px-4"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-28" /></td>
                      <td className="py-3.5 px-4"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20" /></td>
                      <td className="py-3.5 px-4"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-28" /></td>
                      <td className="py-3.5 px-4"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-16" /></td>
                      <td className="py-3.5 px-4 text-right"><div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-20 ml-auto" /></td>
                    </tr>
                  ))
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
                          <button
                            onClick={() => handleDeleteStudent(s)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            title="Delete Student Directly from Database"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Dedicated Mobile Cards View */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800/80">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-28" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-14" />
                    </div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-20" />
                    <div className="h-10 bg-slate-100 dark:bg-slate-800/40 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : students.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <Users className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="font-bold text-slate-800 dark:text-slate-200">No students found</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {searchQuery ? 'Try adjusting your search criteria.' : 'No students enrolled in this batch yet.'}
                </p>
              </div>
            ) : (
              students.map((s) => (
                <div key={s._id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{s.name}</div>
                      <div className="font-mono text-xs text-amber-700 dark:text-amber-400 mt-0.5">@{s.username}</div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shrink-0 ${
                        s.isActive
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {s.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Phone</span>
                      <a href={`tel:${s.phone}`} className="font-mono font-bold text-slate-800 dark:text-slate-200 hover:text-amber-600">
                        {s.phone}
                      </a>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">College</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate block">
                        {s.college || '—'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>DOB: {s.dateOfBirth || '—'}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEdit(s)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleToggleStatus(s)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                          s.isActive
                            ? 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40'
                            : 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40'
                        }`}
                      >
                        {s.isActive ? <UserX className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                        <span>{s.isActive ? 'Deactivate' : 'Activate'}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(s)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 flex items-center gap-1 cursor-pointer"
                        title="Delete Student Directly from Database"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
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

        {/* Custom Confirmation Modal */}
        <ConfirmModal
          isOpen={confirmState.isOpen}
          onClose={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
          onConfirm={confirmState.onConfirm}
          title={confirmState.title}
          message={confirmState.message}
          confirmText={confirmState.confirmText}
          cancelText={confirmState.cancelText}
          variant={confirmState.variant}
          isLoading={confirmState.isLoading}
        />

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
                  disabled={isEnrolling}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg disabled:opacity-40"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {modalError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                  <span>{modalError}</span>
                </div>
              )}

              {isEnrolling && (
                <div className="mb-4 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 font-medium flex items-center gap-2 animate-pulse">
                  <LoadingSpinner size="xs" color="gold" />
                  <span>Enrolling student into {selectedBatch} & generating portal credentials...</span>
                </div>
              )}

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
                    disabled={isEnrolling}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <LoadingButton
                    type="submit"
                    isLoading={isEnrolling}
                    loadingText="Enrolling..."
                    variant="gold"
                    className="w-full sm:w-auto"
                  >
                    Save & Generate Credentials
                  </LoadingButton>
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
                  disabled={isUpdating || batchActionLoading}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg disabled:opacity-40"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {modalError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                  <span>{modalError}</span>
                </div>
              )}

              <form onSubmit={handleUpdateStudent} className="space-y-4">
                {/* Multi-Batch Management Section */}
                <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                      Enrolled Batches ({editingStudentBatches.length})
                    </label>
                    {batchActionLoading && (
                      <span className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium animate-pulse">
                        <LoadingSpinner size="xs" color="gold" /> Updating assignments...
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {editingStudentBatches.map((bc) => {
                      const isTeacherAuthorized = batches.some((b) => b.code === bc);
                      return (
                        <span
                          key={bc}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-[#C6922E] dark:text-[#F4C76B] border border-amber-500/20 shadow-xs"
                        >
                          <span>{bc}</span>
                          {editingStudentBatches.length > 1 && isTeacherAuthorized && (
                            <button
                              type="button"
                              disabled={batchActionLoading || isUpdating}
                              onClick={() => handleRemoveBatch(bc)}
                              className="text-rose-500 hover:text-rose-700 ml-1 font-black cursor-pointer leading-none text-sm disabled:opacity-40"
                              title={`Remove student from ${bc}`}
                            >
                              &times;
                            </button>
                          )}
                        </span>
                      );
                    })}
                  </div>

                  {/* Add to authorized batch */}
                  <div className="flex items-center gap-2 pt-1">
                    <select
                      value={newBatchToAssign}
                      disabled={batchActionLoading || isUpdating}
                      onChange={(e) => setNewBatchToAssign(e.target.value)}
                      className="flex-1 py-1.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-xs font-semibold focus:ring-2 focus:ring-[#C6922E] disabled:opacity-50"
                    >
                      <option value="">Enroll in another of your authorized batches...</option>
                      {batches
                        .filter((b) => !editingStudentBatches.includes(b.code))
                        .map((b) => (
                          <option key={b.code} value={b.code}>
                            {b.name} ({b.code})
                          </option>
                        ))}
                    </select>
                    <LoadingButton
                      type="button"
                      size="sm"
                      isLoading={batchActionLoading}
                      loadingText="Adding..."
                      variant="primary"
                      disabled={!newBatchToAssign || batchActionLoading || isUpdating}
                      onClick={() => handleAssignBatch(newBatchToAssign)}
                      className="shrink-0"
                    >
                      + Add Batch
                    </LoadingButton>
                  </div>
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
                    disabled={isUpdating}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <LoadingButton
                    type="submit"
                    isLoading={isUpdating}
                    loadingText="Saving Changes..."
                    className="py-2.5 px-6 rounded-xl text-xs font-extrabold text-[#0B1120] bg-gradient-to-r from-[#C6922E] via-[#F4C76B] to-[#C6922E] shadow-sm hover:brightness-105"
                  >
                    Save Changes
                  </LoadingButton>
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
                  disabled={isImporting}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg disabled:opacity-40"
                  aria-label="Close import modal"
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
                      disabled={isDownloadingTemplate}
                      className="py-2 px-3.5 rounded-xl bg-[#C6922E] hover:bg-[#A3741E] text-white text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                    >
                      {isDownloadingTemplate ? (
                        <>
                          <LoadingSpinner size="xs" color="white" />
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Download .xlsx</span>
                        </>
                      )}
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
                        disabled={isImporting}
                        onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                        className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#17365D] file:text-white hover:file:bg-[#1E4273] cursor-pointer disabled:opacity-50"
                      />
                    </div>

                    {/* Stage feedback if importing */}
                    {isImporting && (
                      <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs animate-in fade-in">
                        <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200 mb-2">
                          <LoadingSpinner size="xs" color="gold" />
                          <span>
                            {importStage === 'uploading' && 'Step 1/3: Uploading Excel spreadsheet...'}
                            {importStage === 'validating' && 'Step 2/3: Validating format, phone & email records...'}
                            {importStage === 'importing' && 'Step 3/3: Enrolling students and generating credentials...'}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#C6922E] h-full transition-all duration-500 rounded-full"
                            style={{
                              width:
                                importStage === 'uploading'
                                  ? '35%'
                                  : importStage === 'validating'
                                  ? '70%'
                                  : '95%',
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowImportModal(false)}
                        disabled={isImporting}
                        className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 disabled:opacity-40"
                      >
                        Cancel
                      </button>
                      <LoadingButton
                        type="submit"
                        isLoading={isImporting}
                        loadingText={
                          importStage === 'uploading'
                            ? 'Uploading...'
                            : importStage === 'validating'
                            ? 'Validating...'
                            : 'Enrolling...'
                        }
                        icon={<Upload className="w-4 h-4" />}
                        disabled={!importFile || isImporting}
                        className="py-2.5 px-6 rounded-xl text-xs font-extrabold text-[#0B1120] bg-gradient-to-r from-[#C6922E] via-[#F4C76B] to-[#C6922E] shadow-sm"
                      >
                        Upload & Import
                      </LoadingButton>
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
