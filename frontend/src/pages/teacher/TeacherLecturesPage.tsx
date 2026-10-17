import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Video,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  X,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/apiConfig';
import { TeacherHeader } from '../../components/teacher/TeacherHeader';
import { ConfirmModal, type ConfirmVariant } from '../../components/common/ConfirmModal';

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

export const TeacherLecturesPage: React.FC = () => {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [batches, setBatches] = useState<BatchOption[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [lectures, setLectures] = useState<LectureItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLecture, setEditingLecture] = useState<LectureItem | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    slNo: '',
    topicName: '',
    ytVideoLink: '',
    subject: 'Physics',
    description: '',
    isPublished: true,
  });

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

  // 2. Fetch Lectures for Selected Batch
  const fetchLectures = useCallback(async () => {
    if (!token || !selectedBatch) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(
        `${API_BASE_URL}/teacher/batches/${selectedBatch}/lectures`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setLectures(data.data || []);
      } else {
        setErrorMessage(data.message || 'Could not fetch lectures.');
      }
    } catch {
      setErrorMessage('Network error while fetching lectures.');
    } finally {
      setIsLoading(false);
    }
  }, [token, selectedBatch]);

  useEffect(() => {
    if (selectedBatch) {
      fetchLectures();
    }
  }, [selectedBatch, fetchLectures]);

  const handleBatchChange = (code: string) => {
    setSelectedBatch(code);
    setSearchParams({ batch: code });
  };

  // Create Lecture
  const handleCreateLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const res = await fetch(
        `${API_BASE_URL}/teacher/batches/${selectedBatch}/lectures`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            slNo: Number(formData.slNo),
          }),
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        setShowAddModal(false);
        setFormData({
          slNo: '',
          topicName: '',
          ytVideoLink: '',
          subject: 'Physics',
          description: '',
          isPublished: true,
        });
        setSuccessMessage('Lecture added and published successfully.');
        fetchLectures();
      } else {
        setErrorMessage(data.message || 'Failed to create lecture.');
      }
    } catch {
      setErrorMessage('Network error while saving lecture.');
    }
  };

  // Open Edit
  const openEdit = (lec: LectureItem) => {
    setEditingLecture(lec);
    setFormData({
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
    setErrorMessage(null);

    try {
      const res = await fetch(
        `${API_BASE_URL}/teacher/batches/${selectedBatch}/lectures/${editingLecture._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            slNo: Number(formData.slNo),
          }),
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        setShowEditModal(false);
        setEditingLecture(null);
        setSuccessMessage('Lecture details updated successfully.');
        fetchLectures();
      } else {
        setErrorMessage(data.message || 'Failed to update lecture.');
      }
    } catch {
      setErrorMessage('Network error while updating lecture.');
    }
  };

  // Toggle Publish
  const handleTogglePublish = async (lec: LectureItem) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/teacher/batches/${selectedBatch}/lectures/${lec._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isPublished: !lec.isPublished,
          }),
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage(
          `Lecture has been ${!lec.isPublished ? 'published for students' : 'unpublished'}.`
        );
        fetchLectures();
      } else {
        setErrorMessage(data.message || 'Failed to toggle publish status.');
      }
    } catch {
      setErrorMessage('Network error while toggling publish state.');
    }
  };

  // Delete Lecture
  const executeDeleteLecture = async (lec: LectureItem) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/teacher/batches/${selectedBatch}/lectures/${lec._id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage('Lecture deleted successfully.');
        fetchLectures();
      } else {
        setErrorMessage(data.message || 'Failed to delete lecture.');
      }
    } catch {
      setErrorMessage('Network error while removing lecture.');
    } finally {
      setConfirmState((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleDeleteLecture = (lec: LectureItem) => {
    setConfirmState({
      isOpen: true,
      title: 'Delete Lecture',
      message: (
        <span>
          Are you sure you want to delete lecture <strong>"{lec.topicName}"</strong> (#{lec.slNo}) from batch <strong>{lec.batchCode}</strong>? This action cannot be undone.
        </span>
      ),
      confirmText: 'Delete Lecture',
      variant: 'danger',
      onConfirm: () => executeDeleteLecture(lec),
    });
  };

  const previewYtId = getYouTubeId(formData.ytVideoLink);

  return (
    <div className="w-full min-h-[85vh] bg-[#F8FAFC] dark:bg-[#0B1120] pb-12 transition-colors duration-200">
      <TeacherHeader />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Page Title & CTAs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-[#17365D] dark:text-white">
              Recorded Lectures & Video Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Add class recordings, edit topics, manage sequence numbering, and control student publishing.
            </p>
          </div>

          <button
            onClick={() => {
              // Pre-fill next serial number
              const nextSlNo = lectures.length > 0 ? Math.max(...lectures.map((l) => l.slNo)) + 1 : 1;
              setFormData({
                slNo: String(nextSlNo),
                topicName: '',
                ytVideoLink: '',
                subject: 'Physics',
                description: '',
                isPublished: true,
              });
              setShowAddModal(true);
            }}
            className="py-2.5 px-4 rounded-xl text-xs font-extrabold text-[#0B1120] bg-gradient-to-r from-[#C6922E] via-[#F4C76B] to-[#C6922E] hover:brightness-105 active:scale-[0.99] transition-all shadow-md flex items-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Lecture</span>
          </button>
        </div>

        {/* Batch Selection */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 w-full sm:w-auto min-w-0">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">
              Batch Selection:
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => handleBatchChange(e.target.value)}
              className="w-full sm:w-auto max-w-full truncate py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#C6922E]"
            >
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
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#1E293B]/70 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="py-3 px-4 w-16 text-center"># Sl</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Topic Name & Description</th>
                  <th className="py-3 px-4">YouTube Video</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      <div className="w-7 h-7 mx-auto border-3 border-slate-200 border-t-[#C6922E] rounded-full animate-spin"></div>
                      <p className="mt-2 text-xs">Loading lectures...</p>
                    </td>
                  </tr>
                ) : lectures.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      <Video className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        No lectures found in this batch
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Click "Add New Lecture" above to publish class video recordings.
                      </p>
                    </td>
                  </tr>
                ) : (
                  lectures.map((lec) => (
                    <tr
                      key={lec._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-[#1E293B]/40 transition-colors"
                    >
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                        #{lec.slNo}
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
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                            lec.isPublished
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-rose-50 hover:text-rose-600'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'
                          }`}
                          title="Click to toggle published status"
                        >
                          {lec.isPublished ? (
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
                            className="p-1.5 rounded-lg text-slate-600 hover:text-[#17365D] dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit Lecture"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteLecture(lec)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
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
              <div className="py-12 text-center text-slate-500">
                <div className="w-7 h-7 mx-auto border-3 border-slate-200 border-t-[#C6922E] rounded-full animate-spin"></div>
                <p className="mt-2 text-xs">Loading lectures...</p>
              </div>
            ) : lectures.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <Video className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="font-bold text-slate-800 dark:text-slate-200">No lectures in this batch</p>
                <p className="text-xs text-slate-400 mt-0.5">Click "Add New Lecture" above to publish recordings.</p>
              </div>
            ) : (
              lectures.map((lec) => (
                <div key={lec._id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-500 dark:text-slate-400">
                        #{lec.slNo}
                      </span>
                      <span className="whitespace-nowrap px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {lec.subject}
                      </span>
                    </div>
                    <button
                      onClick={() => handleTogglePublish(lec)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                        lec.isPublished
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
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
                  <h3 className="font-display font-black text-xl text-[#17365D] dark:text-white">
                    Add Lecture to {selectedBatch}
                  </h3>
                  <p className="text-xs text-slate-500">Provide topic details and YouTube link.</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateLecture} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Serial # *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.slNo}
                      onChange={(e) => setFormData({ ...formData, slNo: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E]"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Subject *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs font-bold focus:ring-2 focus:ring-[#C6922E]"
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
                    Topic / Lecture Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.topicName}
                    onChange={(e) => setFormData({ ...formData, topicName: e.target.value })}
                    placeholder="e.g. Electromagnetic Induction - Lenz's Law & Self Inductance"
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    YouTube Video URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.ytVideoLink}
                    onChange={(e) => setFormData({ ...formData, ytVideoLink: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E]"
                  />
                  {previewYtId && (
                    <div className="mt-2 p-2 rounded-xl bg-slate-100 dark:bg-[#1E293B] flex items-center gap-3">
                      <img
                        src={`https://img.youtube.com/vi/${previewYtId}/mqdefault.jpg`}
                        alt="Thumbnail"
                        className="w-20 h-12 object-cover rounded-lg border border-slate-300 dark:border-slate-700"
                      />
                      <span className="text-[11px] text-emerald-600 font-bold">
                        Valid YouTube Video ID: {previewYtId}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Lecture Description / Key Topics
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of chapters or problems covered..."
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-[#C6922E] focus:ring-[#C6922E]"
                  />
                  <label
                    htmlFor="isPublished"
                    className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Publish immediately for enrolled students in {selectedBatch}
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl text-xs font-extrabold text-[#0B1120] bg-gradient-to-r from-[#C6922E] via-[#F4C76B] to-[#C6922E] shadow-sm hover:brightness-105"
                  >
                    Add Lecture
                  </button>
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
                  <h3 className="font-display font-black text-xl text-[#17365D] dark:text-white">
                    Edit Lecture #{editingLecture.slNo}
                  </h3>
                  <p className="text-xs text-slate-500">{editingLecture.topicName}</p>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateLecture} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Serial # *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.slNo}
                      onChange={(e) => setFormData({ ...formData, slNo: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E]"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Subject *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs font-bold focus:ring-2 focus:ring-[#C6922E]"
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
                    Topic / Lecture Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.topicName}
                    onChange={(e) => setFormData({ ...formData, topicName: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    YouTube Video URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.ytVideoLink}
                    onChange={(e) => setFormData({ ...formData, ytVideoLink: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Lecture Description / Key Topics
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editIsPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-[#C6922E] focus:ring-[#C6922E]"
                  />
                  <label
                    htmlFor="editIsPublished"
                    className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Published for enrolled students in {selectedBatch}
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300"
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
      </div>
    </div>
  );
};

export default TeacherLecturesPage;
