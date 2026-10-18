import React, { useEffect, useState } from 'react';
import {
  Layers,
  PlusCircle,
  Edit,
  GraduationCap,
  AlertCircle,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/apiConfig';
import { SuperadminHeader } from '../../components/superadmin/SuperadminHeader';
import { LoadingButton } from '../../components/common/LoadingButton';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import { NotificationBanner } from '../../components/common/NotificationBanner';

interface BatchItem {
  _id: string;
  name: string;
  code: string;
  academicYear: string;
  description?: string;
  isActive: boolean;
  studentCount: number;
  lectureCount: number;
  assignedTeachers: Array<{ _id: string; name: string; username: string }>;
  createdAt: string;
}

export const SuperadminBatchesPage: React.FC = () => {
  const { token } = useAuth();
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modals & Action States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreatingBatch, setIsCreatingBatch] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdatingBatch, setIsUpdatingBatch] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [editingBatch, setEditingBatch] = useState<BatchItem | null>(null);

  // Form
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    academicYear: '',
    description: '',
    isActive: true,
  });

  const loadBatches = async () => {
    if (!token) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${API_BASE_URL}/superadmin/batches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBatches(data.data || []);
      } else {
        setErrorMessage(data.message || 'Failed to load batches.');
      }
    } catch {
      setErrorMessage('Unable to connect to the backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBatches();
  }, [token]);

  // Create Batch
  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setErrorMessage(null);

    if (!formData.name.trim()) {
      setModalError('Batch name is required.');
      return;
    }
    if (!formData.code.trim()) {
      setModalError('Batch code is required.');
      return;
    }
    if (!formData.academicYear.trim()) {
      setModalError('Academic year is required.');
      return;
    }

    setIsCreatingBatch(true);
    try {
      const res = await fetch(`${API_BASE_URL}/superadmin/batches`, {
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
          code: '',
          academicYear: '',
          description: '',
          isActive: true,
        });
        setSuccessMessage('Batch created successfully.');
        loadBatches();
      } else {
        setModalError(data.message || 'Failed to create batch.');
      }
    } catch {
      setModalError('Network error while saving batch. Please try again.');
    } finally {
      setIsCreatingBatch(false);
    }
  };

  // Open Edit
  const openEdit = (b: BatchItem) => {
    setModalError(null);
    setEditingBatch(b);
    setFormData({
      name: b.name,
      code: b.code,
      academicYear: b.academicYear,
      description: b.description || '',
      isActive: b.isActive,
    });
    setShowEditModal(true);
  };

  // Update Batch
  const handleUpdateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch) return;
    setModalError(null);
    setErrorMessage(null);

    if (!formData.name.trim()) {
      setModalError('Batch name is required.');
      return;
    }
    if (!formData.academicYear.trim()) {
      setModalError('Academic year is required.');
      return;
    }

    setIsUpdatingBatch(true);
    try {
      const res = await fetch(`${API_BASE_URL}/superadmin/batches/${editingBatch._id}`, {
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
        setEditingBatch(null);
        setSuccessMessage('Batch updated successfully.');
        loadBatches();
      } else {
        setModalError(data.message || 'Failed to update batch.');
      }
    } catch {
      setModalError('Network error while updating batch. Please try again.');
    } finally {
      setIsUpdatingBatch(false);
    }
  };

  return (
    <div className="w-full min-h-[85vh] bg-[#F8FAFC] dark:bg-[#070B14] pb-12 transition-colors duration-200">
      <SuperadminHeader />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Title & Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Academic Batches & Cohorts
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Create and manage annual academic cohorts, supervise faculty allocations, and track cohort capacities.
            </p>
          </div>

          <button
            onClick={() => {
              setFormData({
                name: '',
                code: '',
                academicYear: '',
                description: '',
                isActive: true,
              });
              setShowCreateModal(true);
            }}
            className="py-2.5 px-4 rounded-xl text-xs font-extrabold text-[#0B1120] bg-gradient-to-r from-[#C6922E] via-[#F4C76B] to-[#C6922E] hover:brightness-105 active:scale-[0.99] transition-all shadow-md flex items-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Batch</span>
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

        {/* Batches Grid */}
        {isLoading ? (
          <CardSkeleton count={3} />
        ) : batches.length === 0 ? (
          <div className="p-10 text-center bg-white dark:bg-[#0E1524] rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <Layers className="w-10 h-10 mx-auto text-slate-400 mb-3" />
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
              No Batches Created
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Create your first academic batch to begin enrolling students and assigning recorded lectures.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.map((batch) => (
              <div
                key={batch._id}
                className="bg-white dark:bg-[#0E1524] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-amber-500/10 text-[#C6922E] dark:text-[#F4C76B] border border-amber-500/20">
                      {batch.code}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        batch.isActive
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {batch.isActive ? 'Active Cohort' : 'Archived'}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-lg text-slate-900 dark:text-white">
                    {batch.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                    Academic Year {batch.academicYear}
                  </p>

                  {batch.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                      {batch.description}
                    </p>
                  )}

                  {/* Counts */}
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-center">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#151F33]">
                      <p className="text-[10px] uppercase font-bold text-slate-500">Enrolled Students</p>
                      <p className="font-mono text-base font-black text-slate-900 dark:text-white">
                        {batch.studentCount}
                      </p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#151F33]">
                      <p className="text-[10px] uppercase font-bold text-slate-500">Lectures</p>
                      <p className="font-mono text-base font-black text-slate-900 dark:text-white">
                        {batch.lectureCount}
                      </p>
                    </div>
                  </div>

                  {/* Assigned Teachers */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Assigned Faculty:</span>
                    </p>
                    {batch.assignedTeachers && batch.assignedTeachers.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {batch.assignedTeachers.map((t) => (
                          <span
                            key={t._id}
                            className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            {t.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">None assigned</span>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                  <button
                    onClick={() => openEdit(batch)}
                    className="py-1.5 px-3 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Batch</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Batch Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
                <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
                  Create New Batch
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  disabled={isCreatingBatch}
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

              <form onSubmit={handleCreateBatch} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Batch Name *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isCreatingBatch}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Class 12 Science (2026 Batch)"
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E] disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Batch Code * (Unique)
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isCreatingBatch}
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value.toUpperCase() })
                      }
                      placeholder="e.g. BATCH-2026"
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs font-mono uppercase focus:ring-2 focus:ring-[#C6922E] disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Academic Year *
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isCreatingBatch}
                      value={formData.academicYear}
                      onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                      placeholder="e.g. 2026"
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E] disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Description / Academic Target
                  </label>
                  <textarea
                    rows={2}
                    disabled={isCreatingBatch}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="+2 CHSE Science, JEE Main & NEET-UG foundation batch"
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E] disabled:opacity-50"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    disabled={isCreatingBatch}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 disabled:opacity-40"
                  >
                    Cancel
                  </button>
                  <LoadingButton
                    type="submit"
                    isLoading={isCreatingBatch}
                    loadingText="Creating Batch..."
                    className="py-2.5 px-6 rounded-xl text-xs font-extrabold text-[#0B1120] bg-gradient-to-r from-[#C6922E] via-[#F4C76B] to-[#C6922E] shadow-sm hover:brightness-105"
                  >
                    Create Batch
                  </LoadingButton>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Batch Modal */}
        {showEditModal && editingBatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
                <div>
                  <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
                    Edit Batch: {editingBatch.code}
                  </h3>
                  <p className="text-xs text-slate-500">{editingBatch.name}</p>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  disabled={isUpdatingBatch}
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

              <form onSubmit={handleUpdateBatch} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Batch Name *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isUpdatingBatch}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Academic Year *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isUpdatingBatch}
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    disabled={isUpdatingBatch}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E] disabled:opacity-50"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    disabled={isUpdatingBatch}
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-[#C6922E] disabled:opacity-50"
                  />
                  <label htmlFor="isActive" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Cohort Active & Operational
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    disabled={isUpdatingBatch}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 disabled:opacity-40"
                  >
                    Cancel
                  </button>
                  <LoadingButton
                    type="submit"
                    isLoading={isUpdatingBatch}
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

export default SuperadminBatchesPage;
