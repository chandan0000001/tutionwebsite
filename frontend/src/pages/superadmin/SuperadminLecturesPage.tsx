import React, { useEffect, useState, useCallback } from 'react';
import {
  Video,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Play,
  X,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/apiConfig';
import { SuperadminHeader } from '../../components/superadmin/SuperadminHeader';

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

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLecture, setEditingLecture] = useState<LectureItem | null>(null);
  const [previewVideo, setPreviewVideo] = useState<{ id: string; title: string } | null>(null);

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
    setErrorMessage(null);

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
    setErrorMessage(null);

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
        setErrorMessage(data.message || 'Failed to update lecture.');
      }
    } catch {
      setErrorMessage('Network error while updating lecture.');
    }
  };

  // Toggle Publish
  const handleTogglePublish = async (lec: LectureItem) => {
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
    }
  };

  // Delete Lecture
  const handleDeleteLecture = async (lec: LectureItem) => {
    if (!window.confirm(`Delete lecture "${lec.topicName}"? This action cannot be undone.`)) {
      return;
    }

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
    }
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
        <div className="bg-white dark:bg-[#0E1524] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedBatchFilter}
              onChange={(e) => setSelectedBatchFilter(e.target.value)}
              className="py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#151F33] text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#C6922E]"
            >
              <option value="">All Academic Cohorts</option>
              {batches.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs text-slate-400">
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

        {/* Lectures Table */}
        <div className="bg-white dark:bg-[#0E1524] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
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
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <div className="w-7 h-7 mx-auto border-3 border-slate-200 border-t-[#C6922E] rounded-full animate-spin"></div>
                      <p className="mt-2 text-xs">Loading lectures...</p>
                    </td>
                  </tr>
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
                  lectures.map((lec) => {
                    const ytId = getYouTubeId(lec.ytVideoLink);
                    return (
                      <tr
                        key={lec._id}
                        className="hover:bg-slate-50/80 dark:hover:bg-[#151F33]/40 transition-colors"
                      >
                        <td className="py-3 px-4 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                          #{lec.slNo}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-amber-500/10 text-[#C6922E] dark:text-[#F4C76B] border border-amber-500/20">
                            {lec.batchCode}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
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
                          {ytId ? (
                            <button
                              onClick={() => setPreviewVideo({ id: ytId, title: lec.topicName })}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-medium transition-colors"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>Preview Video</span>
                            </button>
                          ) : (
                            <a
                              href={lec.ytVideoLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-slate-600 inline-flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Open Link</span>
                            </a>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleTogglePublish(lec)}
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                              lec.isPublished
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-rose-50 hover:text-rose-600'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'
                            }`}
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
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Video Player Modal */}
        {previewVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-[#111827] rounded-3xl shadow-2xl border border-slate-800 max-w-3xl w-full p-4 sm:p-6 overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h3 className="font-bold text-sm text-white truncate max-w-[85%]">
                  {previewVideo.title}
                </h3>
                <button
                  onClick={() => setPreviewVideo(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg">
                <iframe
                  src={`https://www.youtube.com/embed/${previewVideo.id}?autoplay=1&rel=0`}
                  title={previewVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

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
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateLecture} className="space-y-4">
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
                      placeholder="1"
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
                    Lecture Title / Topic *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.topicName}
                    onChange={(e) => setFormData({ ...formData, topicName: e.target.value })}
                    placeholder="e.g. Chemical Kinetics - Rate of Reactions & Arrhenius Equation"
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    YouTube URL *
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
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPub"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-[#C6922E]"
                  />
                  <label htmlFor="isPub" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Publish immediately for enrolled students
                  </label>
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
                    Save Lecture
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
                  <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
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
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Batch Cohort
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
                    Lecture Title *
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
                    YouTube URL *
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
                    Description
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
                    id="editPub"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-[#C6922E]"
                  />
                  <label htmlFor="editPub" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Published for enrolled students
                  </label>
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
      </div>
    </div>
  );
};

export default SuperadminLecturesPage;
