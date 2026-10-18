import React, { useEffect, useState } from 'react';
import {
  GraduationCap,
  PlusCircle,
  Edit,
  KeyRound,
  UserCheck,
  UserX,
  AlertCircle,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/apiConfig';
import { SuperadminHeader } from '../../components/superadmin/SuperadminHeader';
import { CredentialsModal } from '../../components/common/CredentialsModal';
import { ConfirmModal, type ConfirmVariant } from '../../components/common/ConfirmModal';
import { LoadingButton } from '../../components/common/LoadingButton';
import { TableSkeleton, CardSkeleton } from '../../components/common/SkeletonLoader';
import { NotificationBanner } from '../../components/common/NotificationBanner';

interface TeacherItem {
  _id: string;
  name: string;
  username: string;
  qualification?: string;
  dateOfBirth?: string;
  phone: string;
  email?: string;
  assignedBatches: string[];
  isActive: boolean;
  createdAt: string;
}

interface BatchOption {
  code: string;
  name: string;
}

export const SuperadminTeachersPage: React.FC = () => {
  const { token } = useAuth();
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [batches, setBatches] = useState<BatchOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Confirmation modal state
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

  // Modals & Action States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreatingTeacher, setIsCreatingTeacher] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdatingTeacher, setIsUpdatingTeacher] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<TeacherItem | null>(null);

  // One-time credentials popup
  const [credentialsPopup, setCredentialsPopup] = useState<{
    title: string;
    username: string;
    temporaryPassword: string;
    note?: string;
  } | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    qualification: '',
    dateOfBirth: '',
    phone: '',
    email: '',
    assignedBatches: [] as string[],
  });

  const loadData = async () => {
    if (!token) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [teaRes, batRes] = await Promise.all([
        fetch(`${API_BASE_URL}/superadmin/teachers`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/superadmin/batches`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [teaData, batData] = await Promise.all([teaRes.json(), batRes.json()]);

      if (teaRes.ok && teaData.success) {
        setTeachers(teaData.data || []);
      }
      if (batRes.ok && batData.success) {
        setBatches(batData.data || []);
      }
    } catch {
      setErrorMessage('Unable to load teachers and batches.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  // Create Teacher
  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setErrorMessage(null);

    if (!formData.name.trim()) {
      setModalError('Teacher name is required.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length !== 10) {
      setModalError('Mobile phone must be exactly 10 digits.');
      return;
    }

    setIsCreatingTeacher(true);
    try {
      const res = await fetch(`${API_BASE_URL}/superadmin/teachers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setShowCreateModal(false);
        setFormData({
          name: '',
          qualification: '',
          dateOfBirth: '',
          phone: '',
          email: '',
          assignedBatches: [],
        });
        setCredentialsPopup({
          title: 'Teacher Profile Created Successfully',
          username: data.oneTimeCredentials.username,
          temporaryPassword: data.oneTimeCredentials.temporaryPassword,
          note: data.oneTimeCredentials.note,
        });
        loadData();
      } else {
        setModalError(data.message || 'Failed to create teacher profile.');
      }
    } catch {
      setModalError('Network error while registering teacher. Please try again.');
    } finally {
      setIsCreatingTeacher(false);
    }
  };

  // Open Edit
  const openEdit = (t: TeacherItem) => {
    setModalError(null);
    setEditingTeacher(t);
    setFormData({
      name: t.name,
      qualification: t.qualification || '',
      dateOfBirth: t.dateOfBirth || '',
      phone: t.phone,
      email: t.email || '',
      assignedBatches: t.assignedBatches || [],
    });
    setShowEditModal(true);
  };

  // Update Teacher
  const handleUpdateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;
    setModalError(null);
    setErrorMessage(null);

    if (!formData.name.trim()) {
      setModalError('Teacher name is required.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length !== 10) {
      setModalError('Mobile phone must be exactly 10 digits.');
      return;
    }

    setIsUpdatingTeacher(true);
    try {
      const res = await fetch(`${API_BASE_URL}/superadmin/teachers/${editingTeacher._id}`, {
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
        setEditingTeacher(null);
        setSuccessMessage('Teacher profile updated successfully.');
        loadData();
      } else {
        setModalError(data.message || 'Failed to update teacher.');
      }
    } catch {
      setModalError('Network error while updating teacher. Please try again.');
    } finally {
      setIsUpdatingTeacher(false);
    }
  };

  // Execute Toggle Active Status
  const executeToggleStatus = async (t: TeacherItem) => {
    setConfirmState((prev) => ({ ...prev, isLoading: true }));
    try {
      const res = await fetch(`${API_BASE_URL}/superadmin/teachers/${t._id}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage(data.message);
        loadData();
      } else {
        setErrorMessage(data.message || 'Failed to update teacher status.');
      }
    } catch {
      setErrorMessage('Network error while updating status.');
    } finally {
      setConfirmState((prev) => ({ ...prev, isOpen: false, isLoading: false }));
    }
  };

  const handleToggleStatus = (t: TeacherItem) => {
    const isActivating = !t.isActive;
    setConfirmState({
      isOpen: true,
      title: `${isActivating ? 'Reactivate' : 'Deactivate'} Faculty Account`,
      message: (
        <span>
          Are you sure you want to <strong>{isActivating ? 'reactivate' : 'deactivate'}</strong> the faculty account for <strong>{t.name}</strong> (@{t.username})? {isActivating ? 'This will re-enable their portal access immediately.' : 'The teacher will no longer be able to log in until reactivated.'}
        </span>
      ),
      confirmText: isActivating ? 'Reactivate Account' : 'Deactivate Account',
      variant: isActivating ? 'warning' : 'danger',
      onConfirm: () => executeToggleStatus(t),
    });
  };

  // Execute Reset Password
  const executeResetPassword = async (t: TeacherItem) => {
    setConfirmState((prev) => ({ ...prev, isLoading: true }));
    try {
      const res = await fetch(`${API_BASE_URL}/superadmin/teachers/${t._id}/reset-password`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCredentialsPopup({
          title: 'Teacher Password Reset Successfully',
          username: data.oneTimeCredentials.username,
          temporaryPassword: data.oneTimeCredentials.temporaryPassword,
          note: data.oneTimeCredentials.note,
        });
      } else {
        setErrorMessage(data.message || 'Password reset failed.');
      }
    } catch {
      setErrorMessage('Network error while resetting password.');
    } finally {
      setConfirmState((prev) => ({ ...prev, isOpen: false, isLoading: false }));
    }
  };

  const handleResetPassword = (t: TeacherItem) => {
    setConfirmState({
      isOpen: true,
      title: 'Reset Faculty Password',
      message: (
        <span>
          Generate a new temporary password for <strong>{t.name}</strong> (@{t.username})? The new password will be valid for <strong>1 hour only</strong>.
        </span>
      ),
      confirmText: 'Generate Password',
      variant: 'primary',
      onConfirm: () => executeResetPassword(t),
    });
  };

  const toggleBatchCheckbox = (code: string) => {
    setFormData((prev) => {
      const exists = prev.assignedBatches.includes(code);
      return {
        ...prev,
        assignedBatches: exists
          ? prev.assignedBatches.filter((b) => b !== code)
          : [...prev.assignedBatches, code],
      };
    });
  };

  return (
    <div className="w-full min-h-[85vh] bg-[#F8FAFC] dark:bg-[#070B14] pb-12 transition-colors duration-200">
      <SuperadminHeader />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Title & Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Faculty & Teacher Administration
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Create teacher profiles, allocate batch responsibilities, manage access privileges, and perform secure password resets.
            </p>
          </div>

          <button
            onClick={() => {
              setFormData({
                name: '',
                qualification: '',
                dateOfBirth: '',
                phone: '',
                email: '',
                assignedBatches: [],
              });
              setShowCreateModal(true);
            }}
            className="py-2.5 px-4 rounded-xl text-xs font-extrabold text-[#0B1120] bg-gradient-to-r from-[#C6922E] via-[#F4C76B] to-[#C6922E] hover:brightness-105 active:scale-[0.99] transition-all shadow-md flex items-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Teacher Profile</span>
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <NotificationBanner
            type="error"
            title="Error"
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

        {/* Credentials Modal */}
        {credentialsPopup && (
          <CredentialsModal
            isOpen={true}
            onClose={() => setCredentialsPopup(null)}
            title={credentialsPopup.title}
            roleName="Teacher"
            username={credentialsPopup.username}
            temporaryPassword={credentialsPopup.temporaryPassword}
            note={credentialsPopup.note}
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

        {/* Teachers Table */}
        {/* Teachers Container */}
        <div className="bg-white dark:bg-[#0E1524] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#151F33] border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="py-3.5 px-4">Teacher Name & Username</th>
                  <th className="py-3.5 px-4">Qualification</th>
                  <th className="py-3.5 px-4">Contact Details</th>
                  <th className="py-3.5 px-4">Assigned Batches</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {isLoading ? (
                  <TableSkeleton rows={5} cols={6} />
                ) : teachers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      <GraduationCap className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        No teachers registered yet
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Create teacher profiles to grant faculty admin access.
                      </p>
                    </td>
                  </tr>
                ) : (
                  teachers.map((t) => (
                    <tr
                      key={t._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-[#151F33]/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{t.name}</div>
                        <div className="font-mono text-[11px] text-amber-700 dark:text-amber-400">
                          @{t.username}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {t.qualification || '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-medium text-slate-700 dark:text-slate-300">
                          {t.phone}
                        </div>
                        {t.email && (
                          <div className="text-[11px] text-slate-400 truncate max-w-[170px]">
                            {t.email}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {t.assignedBatches && t.assignedBatches.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {t.assignedBatches.map((b) => (
                              <span
                                key={b}
                                className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-amber-500/10 text-[#C6922E] dark:text-[#F4C76B] border border-amber-500/20"
                              >
                                {b}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">None assigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            t.isActive
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {t.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openEdit(t)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit Teacher"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleResetPassword(t)}
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                            title="Reset Password"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(t)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              t.isActive
                                ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                                : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                            }`}
                            title={t.isActive ? 'Deactivate Teacher' : 'Activate Teacher'}
                          >
                            {t.isActive ? (
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

          {/* Dedicated Mobile Cards View */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800/80">
            {isLoading ? (
              <div className="p-4">
                <CardSkeleton count={3} />
              </div>
            ) : teachers.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <GraduationCap className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="font-bold text-slate-800 dark:text-slate-200">No teachers registered yet</p>
                <p className="text-xs text-slate-400 mt-0.5">Create teacher profiles to grant faculty admin access.</p>
              </div>
            ) : (
              teachers.map((t) => (
                <div key={t._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{t.name}</div>
                      <div className="font-mono text-xs text-amber-700 dark:text-amber-400 mt-0.5">@{t.username}</div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shrink-0 ${
                        t.isActive
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {t.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Phone</span>
                      <a href={`tel:${t.phone}`} className="font-mono font-bold text-slate-800 dark:text-slate-200 hover:text-amber-600">
                        {t.phone}
                      </a>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Qualification</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate block">
                        {t.qualification || '—'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Assigned Batches</span>
                    {t.assignedBatches && t.assignedBatches.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {t.assignedBatches.map((b) => (
                          <span
                            key={b}
                            className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-800 dark:text-[#F4C76B] border border-amber-500/20"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">None assigned</span>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => openEdit(t)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleResetPassword(t)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 flex items-center gap-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Reset Key</span>
                    </button>
                    <button
                      onClick={() => handleToggleStatus(t)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                        t.isActive
                          ? 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40'
                          : 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40'
                      }`}
                    >
                      {t.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                      <span>{t.isActive ? 'Deactivate' : 'Activate'}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Create Teacher Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
                <div>
                  <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
                    Create Teacher Profile
                  </h3>
                  <p className="text-xs text-slate-500">
                    Generates a unique faculty username and temporary 8-digit password.
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  disabled={isCreatingTeacher}
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

              <form onSubmit={handleCreateTeacher} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Teacher Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isCreatingTeacher}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Subrat Tripathy"
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E] disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Mobile Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={14}
                      disabled={isCreatingTeacher}
                      value={formData.phone}
                      onChange={(e) => {
                        let val = e.target.value.replace(/[^0-9]/g, '');
                        if (val.length === 12 && val.startsWith('91')) val = val.slice(2);
                        else if (val.length === 11 && val.startsWith('0')) val = val.slice(1);
                        if (val.length > 10) val = val.slice(-10);
                        setFormData({ ...formData, phone: val });
                      }}
                      placeholder="e.g. 8763654489 (or +91...)"
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E] disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Academic Qualification
                    </label>
                    <input
                      type="text"
                      disabled={isCreatingTeacher}
                      value={formData.qualification}
                      onChange={(e) =>
                        setFormData({ ...formData, qualification: e.target.value })
                      }
                      placeholder="M.Sc. Physics (Utkal University)"
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E] disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Date of Birth (DD/MM/YYYY)
                    </label>
                    <input
                      type="text"
                      disabled={isCreatingTeacher}
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      placeholder="12/04/1988"
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E] disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled={isCreatingTeacher}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="teacher@antariksh.edu.in"
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E] disabled:opacity-50"
                  />
                </div>

                {/* Batch Assignments */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-2">
                    Assign Batches (Teacher can manage students & lectures for selected batches):
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 max-h-36 overflow-y-auto">
                    {batches.map((b) => {
                      const checked = formData.assignedBatches.includes(b.code);
                      return (
                        <label
                          key={b.code}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs"
                        >
                          <input
                            type="checkbox"
                            disabled={isCreatingTeacher}
                            checked={checked}
                            onChange={() => toggleBatchCheckbox(b.code)}
                            className="w-4 h-4 rounded text-[#C6922E]"
                          />
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {b.code}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    disabled={isCreatingTeacher}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 disabled:opacity-40"
                  >
                    Cancel
                  </button>
                  <LoadingButton
                    type="submit"
                    isLoading={isCreatingTeacher}
                    loadingText="Creating Teacher..."
                    className="py-2.5 px-6 rounded-xl text-xs font-extrabold text-[#0B1120] bg-gradient-to-r from-[#C6922E] via-[#F4C76B] to-[#C6922E] shadow-sm hover:brightness-105"
                  >
                    Create Teacher
                  </LoadingButton>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Teacher Modal */}
        {showEditModal && editingTeacher && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
                <div>
                  <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
                    Edit Teacher: {editingTeacher.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">@{editingTeacher.username}</p>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  disabled={isUpdatingTeacher}
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

              <form onSubmit={handleUpdateTeacher} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isUpdatingTeacher}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E] disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Mobile Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={14}
                      disabled={isUpdatingTeacher}
                      value={formData.phone}
                      onChange={(e) => {
                        let val = e.target.value.replace(/[^0-9]/g, '');
                        if (val.length === 12 && val.startsWith('91')) val = val.slice(2);
                        else if (val.length === 11 && val.startsWith('0')) val = val.slice(1);
                        if (val.length > 10) val = val.slice(-10);
                        setFormData({ ...formData, phone: val });
                      }}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E] disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Qualification
                    </label>
                    <input
                      type="text"
                      disabled={isUpdatingTeacher}
                      value={formData.qualification}
                      onChange={(e) =>
                        setFormData({ ...formData, qualification: e.target.value })
                      }
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E] disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="text"
                      disabled={isUpdatingTeacher}
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E] disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled={isUpdatingTeacher}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-2">
                    Assigned Batches:
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 max-h-36 overflow-y-auto">
                    {batches.map((b) => {
                      const checked = formData.assignedBatches.includes(b.code);
                      return (
                        <label
                          key={b.code}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs"
                        >
                          <input
                            type="checkbox"
                            disabled={isUpdatingTeacher}
                            checked={checked}
                            onChange={() => toggleBatchCheckbox(b.code)}
                            className="w-4 h-4 rounded text-[#C6922E]"
                          />
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {b.code}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    disabled={isUpdatingTeacher}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 disabled:opacity-40"
                  >
                    Cancel
                  </button>
                  <LoadingButton
                    type="submit"
                    isLoading={isUpdatingTeacher}
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
      </div>
    </div>
  );
};

export default SuperadminTeachersPage;
