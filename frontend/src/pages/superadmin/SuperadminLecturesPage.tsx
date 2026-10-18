import React, { useEffect, useState, useCallback } from 'react';
import {
  Video,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  X,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/apiConfig';
import { SuperadminHeader } from '../../components/superadmin/SuperadminHeader';
import { ConfirmModal, type ConfirmVariant } from '../../components/common/ConfirmModal';
import { LoadingButton } from '../../components/common/LoadingButton';
import { TableSkeleton, CardSkeleton } from '../../components/common/SkeletonLoader';
import { NotificationBanner } from '../../components/common/NotificationBanner';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

interface LectureItem {
  _id: string;
  slNo: number;
  topicName: string;
  ytVideoLink: string;
  subject: string;
  description?: string;
  batch: string;
  batchCode: string;
  isPublished: boolean;
  createdBy?: string;
  lastUpdatedBy?: string;
  createdAt: string;
}

interface BatchOption {
  code: string;
  name: string;
}

function getYouTubeId(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export const SuperadminLecturesPage: React.FC = () => {
  const { token } = useAuth();

  const [batches, setBatches] = useState<BatchOption[]>([]);
  const [selectedBatchFilter, setSelectedBatchFilter] = useState<string>('');
  const [lectures, setLectures] = useState<LectureItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  // Modals & Action States
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAddingLecture, setIsAddingLecture] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdatingLecture, setIsUpdatingLecture] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [togglingLectureId, setTogglingLectureId] = useState<string | null>(null);
  const [editingLecture, setEditingLecture] = useState<LectureItem | null>(null);

  // Form
  const [formData, setFormData] = useState({
    batchCode: '',
    slNo: '',
    topicName: '',
    ytVideoLink: '',
    subject: 'Physics',
    description: '',
    isPublished: true,
  });

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
          setFormData((prev) => ({ ...prev, batchCode: data.data[0].code }));
        }
      } catch {
        setErrorMessage('Failed to load batch list.');
      }
    }
    loadBatches();
  }, [token]);

  // 2. Fetch Lectures
  const fetchLectures = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const url = new URL(`${API_BASE_URL}/superadmin/lectures`);
      if (selectedBatchFilter) {
        url.searchParams.set('batchCode', selectedBatchFilter);
      }

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setLectures(data.data || []);
      } else {
        setErrorMessage(data.message || 'Could not fetch lectures.');
      }
    } catch {
      setErrorMessage('Network error while loading lectures.');
    } finally {
      setIsLoading(false);
    }
  }, [token, selectedBatchFilter]);

  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  // Create Lecture
  const handleCreateLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setErrorMessage(null);

    if (!formData.batchCode) {
      setModalError('Please select a batch cohort.');
      return;
    }
    if (!formData.slNo || Number(formData.slNo) < 1) {
      setModalError('Serial number must be 1 or higher.');
      return;
    }
    if (!formData.topicName.trim()) {
      setModalError('Topic name / title is required.');
      return;
    }
    if (!formData.ytVideoLink.trim()) {
      setModalError('YouTube URL is required.');
      return;
    }
    if (!getYouTubeId(formData.ytVideoLink)) {
      setModalError('Invalid YouTube URL. Please provide a valid YouTube watch or share link.');
      return;
    }

    setIsAddingLecture(true);
    try {
      const res = await fetch(`${API_BASE_URL}/superadmin/lectures`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          slNo: Number(formData.slNo),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setShowAddModal(false);
        setFormData({
          batchCode: batches[0]?.code || '',
          slNo: '',
          topicName: '',
          ytVideoLink: '',
          subject: 'Physics',
          description: '',
          isPublished: true,
        });
        setSuccessMessage('Lecture published successfully.');
        fetchLectures();
      } else {
        setModalError(data.message || 'Failed to create lecture.');
      }
    } catch {
      setModalError('Network error while saving lecture. Please try again.');
    } finally {
      setIsAddingLecture(false);
    }
  };

  // Open Edit
  const openEdit = (lec: LectureItem) => {
    setModalError(null);
    setEditingLecture(lec);
    setFormData({
      batchCode: lec.batchCode,
      slNo: String(lec.slNo),
      topicName: lec.topicName,
      ytVideoLink: lec.ytVideoLink,
      subject: lec.subject,
      description: lec.description || '',
      isPublished: lec.isPublished,
    });
    setShowEditModal(true);
  };

  // Update Lecture
  const handleUpdateLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLecture) return;
    setModalError(null);
    setErrorMessage(null);

    if (!formData.slNo || Number(formData.slNo) < 1) {
      setModalError('Serial number must be 1 or higher.');
      return;
    }
    if (!formData.topicName.trim()) {
      setModalError('Topic name / title is required.');
      return;
    }
    if (!formData.ytVideoLink.trim()) {
      setModalError('YouTube URL is required.');
      return;
    }
    if (!getYouTubeId(formData.ytVideoLink)) {
      setModalError('Invalid YouTube URL. Please provide a valid YouTube watch or share link.');
      return;
    }

    setIsUpdatingLecture(true);
    try {
      const res = await fetch(`${API_BASE_URL}/superadmin/lectures/${editingLecture._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          slNo: Number(formData.slNo),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setShowEditModal(false);
        setEditingLecture(null);
        setSuccessMessage('Lecture updated successfully.');
        fetchLectures();
      } else {
        setModalError(data.message || 'Failed to update lecture.');
      }
    } catch {
      setModalError('Network error while updating lecture. Please try again.');
    } finally {
      setIsUpdatingLecture(false);
    }
  };

  // Toggle Publish
  const handleTogglePublish = async (lec: LectureItem) => {
    setTogglingLectureId(lec._id);
    setErrorMessage(null);
    try {
      const res = await fetch(`${API_BASE_URL}/superadmin/lectures/${lec._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isPublished: !lec.isPublished,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage(
          `Lecture has been ${!lec.isPublished ? 'published for students' : 'unpublished'}.`
        );
        fetchLectures();
      } else {
        setErrorMessage(data.message || 'Failed to toggle status.');
      }
    } catch {
      setErrorMessage('Network error while updating status.');
    } finally {
      setTogglingLectureId(null);
    }
  };

  // Delete Lecture
  const executeDeleteLecture = async (lec: LectureItem) => {
    setConfirmState((prev) => ({ ...prev, isLoading: true }));
    try {
      const res = await fetch(`${API_BASE_URL}/superadmin/lectures/${lec._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage('Lecture removed successfully.');
        fetchLectures();
      } else {
        setErrorMessage(data.message || 'Failed to delete lecture.');
      }
    } catch {
      setErrorMessage('Network error while deleting lecture.');
    } finally {
      setConfirmState((prev) => ({ ...prev, isOpen: false, isLoading: false }));
    }
  };

  const handleDeleteLecture = (lec: LectureItem) => {
    setConfirmState({
      isOpen: true,
      title: 'Delete Lecture',
      message: (
        <span>
          Are you sure you want to delete lecture <strong>"{lec.topicName}"</strong> (#{lec.slNo}) from <strong>{lec.batchCode}</strong>? This action cannot be undone.
        </span>
      ),
      confirmText: 'Delete Lecture',
      variant: 'danger',
      onConfirm: () => executeDeleteLecture(lec),
    });
  };

  const previewYtId = getYouTubeId(formData.ytVideoLink);

  return (
    <div className="w-full min-h-[85vh] bg-[#F8FAFC] dark:bg-[#070B14] pb-12 transition-colors duration-200">
      <SuperadminHeader />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Title & Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Recorded Lectures & Video Library
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Cross-batch recorded video repository, metadata management, YouTube streaming links, and publishing controls.
            </p>
          </div>

          <button
            onClick={() => {
              setShowAddModal(true);
            }}
            className="py-2.5 px-4 rounded-xl text-xs font-extrabold text-[#0B1120] bg-gradient-to-r from-[#C6922E] via-[#F4C76B] to-[#C6922E] hover:brightness-105 active:scale-[0.99] transition-all shadow-md flex items-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Class Lecture</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-[#0E1524] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 w-full sm:w-auto min-w-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedBatchFilter}
              onChange={(e) => setSelectedBatchFilter(e.target.value)}
              className="w-full sm:w-auto max-w-full truncate py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#151F33] text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#C6922E]"
            >
              <option value="">All Academic Cohorts</option>
              {batches.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs text-slate-400 shrink-0">
            {lectures.length} {lectures.length === 1 ? 'class recorded' : 'classes recorded'}
          </span>
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

        {/* Lectures Table & Mobile Cards */}
        <div className="bg-white dark:bg-[#0E1524] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#151F33] border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="py-3 px-4 w-16 text-center"># Sl</th>
                  <th className="py-3 px-4">Cohort</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Topic Name & Description</th>
                  <th className="py-3 px-4">YouTube Video</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {isLoading ? (
                  <TableSkeleton rows={5} cols={7} />
                ) : lectures.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <Video className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        No lectures found
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Add a lecture to provide video materials to students.
                      </p>
                    </td>
                  </tr>
                ) : (
                  lectures.map((lec) => (
                    <tr
                      key={lec._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-[#151F33]/40 transition-colors"
                    >
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                        #{lec.slNo}
                      </td>
                      <td className="py-3 px-4">
                        <span className="whitespace-nowrap inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-amber-500/10 text-[#C6922E] dark:text-[#F4C76B] border border-amber-500/20">
                          {lec.batchCode}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="whitespace-nowrap inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          {lec.subject}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-sm">
                        <p className="font-bold text-slate-900 dark:text-white">{lec.topicName}</p>
                        {lec.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {lec.description}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <a
                          href={lec.ytVideoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] shadow-xs transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>YouTube ↗</span>
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleTogglePublish(lec)}
                          disabled={togglingLectureId === lec._id}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50 ${
                            lec.isPublished
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-rose-50 hover:text-rose-600'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'
                          }`}
                        >
                          {togglingLectureId === lec._id ? (
                            <>
                              <LoadingSpinner size="xs" color="current" />
                              <span>Updating...</span>
                            </>
                          ) : lec.isPublished ? (
                            <>
                              <Eye className="w-3 h-3" />
                              <span>Published</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              <span>Unpublished</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openEdit(lec)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit Lecture"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteLecture(lec)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            title="Delete Lecture"
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
              <div className="p-4">
                <CardSkeleton count={3} />
              </div>
            ) : lectures.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <Video className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="font-bold text-slate-800 dark:text-slate-200">No lectures found</p>
                <p className="text-xs text-slate-400 mt-0.5">Add a lecture to provide video materials to students.</p>
              </div>
            ) : (
              lectures.map((lec) => (
                <div key={lec._id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono font-bold text-xs text-slate-500 dark:text-slate-400">
                        #{lec.slNo}
                      </span>
                      <span className="whitespace-nowrap px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-amber-500/10 text-[#C6922E] dark:text-[#F4C76B] border border-amber-500/20">
                        {lec.batchCode}
                      </span>
                      <span className="whitespace-nowrap px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {lec.subject}
                      </span>
                    </div>
                    <button
                      onClick={() => handleTogglePublish(lec)}
                      disabled={togglingLectureId === lec._id}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 transition-opacity ${
                        togglingLectureId === lec._id ? 'opacity-70 cursor-not-allowed' : ''
                      } ${
                        lec.isPublished
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {togglingLectureId === lec._id && (
                        <LoadingSpinner size="xs" color="current" />
                      )}
                      {lec.isPublished ? 'Published' : 'Unpublished'}
                    </button>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm leading-snug">
                      {lec.topicName}
                    </h3>
                    {lec.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {lec.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <a
                      href={lec.ytVideoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700 flex items-center gap-1 shadow-xs"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>YouTube ↗</span>
                    </a>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEdit(lec)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800"
                        title="Edit Lecture"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteLecture(lec)}
                        className="p-1.5 rounded-lg text-rose-600 bg-rose-50 dark:bg-rose-950/40"
                        title="Delete Lecture"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Lecture Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
                <div>
                  <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
                    Add Recorded Lecture
                  </h3>
                  <p className="text-xs text-slate-500">Provide cohort, topic, and YouTube link.</p>
                </div>
                <button
                  onClick={() => !isAddingLecture && setShowAddModal(false)}
                  disabled={isAddingLecture}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {modalError && (
                <div className="mb-4">
                  <NotificationBanner
                    type="error"
                    message={modalError}
                    onClose={() => setModalError(null)}
                  />
                </div>
              )}

              <form onSubmit={handleCreateLecture} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Select Batch Cohort *
                  </label>
                  <select
                    required
                    disabled={isAddingLecture}
                    value={formData.batchCode}
                    onChange={(e) => setFormData({ ...formData, batchCode: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs font-bold focus:ring-2 focus:ring-[#C6922E] disabled:opacity-60"
                  >
                    {batches.map((b) => (
                      <option key={b.code} value={b.code}>
                        {b.name} ({b.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Serial # *
                    </label>
                    <input
                      type="number"
                      required
                      disabled={isAddingLecture}
                      min={1}
                      value={formData.slNo}
                      onChange={(e) => setFormData({ ...formData, slNo: e.target.value })}
                      placeholder="1"
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E] disabled:opacity-60"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Subject *
                    </label>
                    <select
                      disabled={isAddingLecture}
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs font-bold focus:ring-2 focus:ring-[#C6922E] disabled:opacity-60"
                    >
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Biology">Biology</option>
                      <option value="English">English</option>
                      <option value="General Studies">General Studies</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Lecture Title / Topic *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isAddingLecture}
                    value={formData.topicName}
                    onChange={(e) => setFormData({ ...formData, topicName: e.target.value })}
                    placeholder="e.g. Chemical Kinetics - Rate of Reactions & Arrhenius Equation"
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E] disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    YouTube URL *
                  </label>
                  <input
                    type="url"
                    required
                    disabled={isAddingLecture}
                    value={formData.ytVideoLink}
                    onChange={(e) => setFormData({ ...formData, ytVideoLink: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E] disabled:opacity-60"
                  />
                  {previewYtId && (
                    <div className="mt-2 p-2 rounded-xl bg-slate-100 dark:bg-[#1E293B] flex items-center gap-3">
                      <img
                        src={`https://img.youtube.com/vi/${previewYtId}/mqdefault.jpg`}
                        alt="Thumbnail"
                        className="w-20 h-12 object-cover rounded-lg border border-slate-300 dark:border-slate-700"
                      />
                      <span className="text-[11px] text-emerald-600 font-bold">
                        Valid YouTube Video: {previewYtId}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    disabled={isAddingLecture}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E] disabled:opacity-60"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPub"
                    disabled={isAddingLecture}
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-[#C6922E] disabled:opacity-60"
                  />
                  <label htmlFor="isPub" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Publish immediately for enrolled students
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    disabled={isAddingLecture}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <LoadingButton
                    type="submit"
                    isLoading={isAddingLecture}
                    loadingText="Saving Lecture..."
                    className="py-2.5 px-6 rounded-xl text-xs font-extrabold text-[#0B1120] bg-gradient-to-r from-[#C6922E] via-[#F4C76B] to-[#C6922E] shadow-sm hover:brightness-105"
                  >
                    Save Lecture
                  </LoadingButton>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Lecture Modal */}
        {showEditModal && editingLecture && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
                <div>
                  <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
                    Edit Lecture #{editingLecture.slNo}
                  </h3>
                  <p className="text-xs text-slate-500">{editingLecture.topicName}</p>
                </div>
                <button
                  onClick={() => !isUpdatingLecture && setShowEditModal(false)}
                  disabled={isUpdatingLecture}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {modalError && (
                <div className="mb-4">
                  <NotificationBanner
                    type="error"
                    message={modalError}
                    onClose={() => setModalError(null)}
                  />
                </div>
              )}

              <form onSubmit={handleUpdateLecture} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Batch Cohort
                  </label>
                  <select
                    disabled={isUpdatingLecture}
                    value={formData.batchCode}
                    onChange={(e) => setFormData({ ...formData, batchCode: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs font-bold focus:ring-2 focus:ring-[#C6922E] disabled:opacity-60"
                  >
                    {batches.map((b) => (
                      <option key={b.code} value={b.code}>
                        {b.name} ({b.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Serial # *
                    </label>
                    <input
                      type="number"
                      required
                      disabled={isUpdatingLecture}
                      min={1}
                      value={formData.slNo}
                      onChange={(e) => setFormData({ ...formData, slNo: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E] disabled:opacity-60"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Subject *
                    </label>
                    <select
                      disabled={isUpdatingLecture}
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs font-bold focus:ring-2 focus:ring-[#C6922E] disabled:opacity-60"
                    >
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Biology">Biology</option>
                      <option value="English">English</option>
                      <option value="General Studies">General Studies</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Lecture Title *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isUpdatingLecture}
                    value={formData.topicName}
                    onChange={(e) => setFormData({ ...formData, topicName: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E] disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    YouTube URL *
                  </label>
                  <input
                    type="url"
                    required
                    disabled={isUpdatingLecture}
                    value={formData.ytVideoLink}
                    onChange={(e) => setFormData({ ...formData, ytVideoLink: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E] disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    disabled={isUpdatingLecture}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E] disabled:opacity-60"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editPub"
                    disabled={isUpdatingLecture}
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-[#C6922E] disabled:opacity-60"
                  />
                  <label htmlFor="editPub" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Published for enrolled students
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    disabled={isUpdatingLecture}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <LoadingButton
                    type="submit"
                    isLoading={isUpdatingLecture}
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

export default SuperadminLecturesPage;
