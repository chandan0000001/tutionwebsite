import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Video,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  AlertCircle,
  RefreshCw,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/apiConfig';

interface LectureItem {
  _id: string;
  slNo: number;
  topicName: string;
  ytVideoLink: string;
  batch: string;
  subject: string;
  description?: string;
  isPublished: boolean;
  videoId?: string | null;
  embedUrl?: string | null;
  createdAt?: string;
}

interface PaginationMeta {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const RecordedLecturesPage: React.FC = () => {
  const { student, token, logout } = useAuth();

  const [lectures, setLectures] = useState<LectureItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    totalRecords: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active playing video modal state
  const [activeVideo, setActiveVideo] = useState<LectureItem | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 1 on subject change
  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    setCurrentPage(1);
  };

  // Fetch distinct batch subjects once
  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE_URL}/lectures/subjects`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setAvailableSubjects(data.data);
        }
      })
      .catch(() => {});
  }, [token]);

  // Fetch paginated lectures
  const fetchLectures = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setErrorMessage(null);

    const queryParams = new URLSearchParams();
    queryParams.set('page', `${currentPage}`);
    queryParams.set('limit', '10');

    if (selectedSubject !== 'All') {
      queryParams.set('subject', selectedSubject);
    }
    if (debouncedSearch.trim() !== '') {
      queryParams.set('search', debouncedSearch.trim());
    }

    try {
      const response = await fetch(`${API_BASE_URL}/lectures?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          logout();
          return;
        }
        throw new Error('Could not retrieve lectures from server.');
      }

      const data = await response.json();
      if (data.success) {
        setLectures(data.data || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      } else {
        throw new Error(data.message || 'Failed to load batch lectures.');
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Unable to connect to the lecture repository. Please verify your connection.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [token, currentPage, selectedSubject, debouncedSearch, logout]);

  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  // Keyboard escape listener to close video modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveVideo(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getSubjectColorBadge = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'physics':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'chemistry':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'mathematics':
      case 'maths':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'biology':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="w-full min-h-[85vh] bg-[#F8FAFC] dark:bg-[#0B1120] py-8 sm:py-12 transition-colors duration-200">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <Link
            to="/student/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#17365D] dark:text-slate-400 dark:hover:text-[#F4C76B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Student Dashboard</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#17365D] text-white dark:bg-[#1E293B] dark:text-[#F4C76B] border border-[#C6922E]/40">
              Batch {student?.batch || '2026'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Enrolled: <strong className="text-slate-800 dark:text-white">{student?.name}</strong>
            </span>
          </div>
        </div>

        {/* Page Title & Intro */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-[#C6922E] dark:text-[#F4C76B]">
              <Video className="w-5 h-5" />
            </span>
            <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#17365D] dark:text-white tracking-tight">
              Recorded <span className="gold-gradient-text">Class Lectures</span>
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
            Watch recorded classroom lectures, concept revisions, and entrance problem-solving sessions curated specifically for your academic batch year. All lectures stream in high-definition via secure embedded playback.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Subject Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Streams:
            </span>
            {['All', ...(availableSubjects.length > 0 ? availableSubjects : ['Physics', 'Chemistry', 'Mathematics', 'Biology'])].map(
              (subj) => {
                const isActive = selectedSubject === subj;
                return (
                  <button
                    key={subj}
                    onClick={() => handleSubjectChange(subj)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#17365D] text-white dark:bg-[#F4C76B] dark:text-[#0B1120] shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {subj}
                  </button>
                );
              }
            )}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px] sm:min-w-[300px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lectures by topic name..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C6922E] dark:focus:ring-[#F4C76B]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Error State */}
        {errorMessage && (
          <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-rose-700 dark:text-rose-300 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => fetchLectures()}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Loading</span>
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 animate-pulse flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
                  <div className="space-y-2">
                    <div className="w-48 sm:w-80 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    <div className="w-24 h-3 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  </div>
                </div>
                <div className="w-24 h-8 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !errorMessage && lectures.length === 0 && (
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm max-w-xl mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-[#C6922E] dark:text-[#F4C76B] flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h2 className="font-display font-black text-xl text-[#17365D] dark:text-white">
              No Lectures Found
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
              {debouncedSearch || selectedSubject !== 'All'
                ? `No published recordings matched your search filter "${debouncedSearch || selectedSubject}". Try clearing the search or choosing another subject.`
                : `No recorded lectures are currently published for Batch ${student?.batch}. Lectures will appear here once released by the academic team.`}
            </p>
            {(debouncedSearch || selectedSubject !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSubject('All');
                }}
                className="mt-6 px-5 py-2.5 rounded-xl text-xs font-extrabold bg-[#17365D] text-white dark:bg-[#F4C76B] dark:text-[#0B1120] transition-transform active:scale-95 cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
        )}

        {/* Lectures List */}
        {!isLoading && !errorMessage && lectures.length > 0 && (
          <div className="space-y-3">
            {lectures.map((lecture) => (
              <div
                key={lecture._id}
                className="bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 hover:border-[#C6922E]/40 dark:hover:border-[#F4C76B]/40 transition-all shadow-xs hover:shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                {/* Serial Badge + Title & Description */}
                <div className="flex items-start gap-3.5 sm:gap-4 flex-1">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-black text-xs sm:text-sm flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 group-hover:bg-[#17365D] group-hover:text-white dark:group-hover:bg-[#F4C76B] dark:group-hover:text-[#0B1120] transition-colors">
                    #{lecture.slNo}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${getSubjectColorBadge(
                          lecture.subject
                        )}`}
                      >
                        {lecture.subject}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Batch {lecture.batch}
                      </span>
                    </div>

                    <h2 className="font-display font-black text-sm sm:text-base text-[#17365D] dark:text-white group-hover:text-[#C6922E] dark:group-hover:text-[#F4C76B] transition-colors leading-snug">
                      {lecture.topicName}
                    </h2>

                    {lecture.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {lecture.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Watch Action Button */}
                <button
                  type="button"
                  onClick={() => setActiveVideo(lecture)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-[#17365D] to-[#1E4273] dark:from-[#F4C76B] dark:to-[#E5B555] dark:text-[#0B1120] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 shadow-sm cursor-pointer"
                  aria-label={`Watch ${lecture.topicName}`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch Class</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Navigation Controls (10 Per Page) */}
        {!isLoading && !errorMessage && pagination.totalRecords > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Showing <strong className="text-slate-900 dark:text-white">{(pagination.currentPage - 1) * pagination.pageSize + 1}</strong> to{' '}
              <strong className="text-slate-900 dark:text-white">
                {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalRecords)}
              </strong>{' '}
              of <strong className="text-slate-900 dark:text-white">{pagination.totalRecords}</strong> lectures (Page{' '}
              {pagination.currentPage} of {pagination.totalPages})
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrevPage}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#1E293B] text-xs font-extrabold text-[#17365D] dark:text-[#F4C76B] font-mono">
                {pagination.currentPage} / {pagination.totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={!pagination.hasNextPage}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Embedded Video Player Modal */}
        {activeVideo && (
          <div
            className="fixed inset-0 z-[9999999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="video-modal-title"
          >
            <div className="w-full max-w-4xl bg-[#0F172A] rounded-2xl sm:rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shrink-0 border ${getSubjectColorBadge(
                      activeVideo.subject
                    )}`}
                  >
                    {activeVideo.subject}
                  </span>
                  <h3
                    id="video-modal-title"
                    className="font-display font-black text-sm sm:text-base text-white truncate"
                  >
                    #{activeVideo.slNo} - {activeVideo.topicName}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                  aria-label="Close video player"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* YouTube Embed Player */}
              <div className="relative w-full aspect-video bg-black">
                {activeVideo.embedUrl ? (
                  <iframe
                    src={`${activeVideo.embedUrl}&autoplay=1`}
                    title={activeVideo.topicName}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                    <Video className="w-12 h-12 mb-3 text-slate-600" />
                    <p className="text-sm font-bold">Video URL could not be resolved.</p>
                    <a
                      href={activeVideo.ytVideoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 text-xs text-amber-400 underline"
                    >
                      Open directly on YouTube →
                    </a>
                  </div>
                )}
              </div>

              {/* Modal Footer Description */}
              {activeVideo.description && (
                <div className="p-4 sm:p-5 bg-slate-900/90 border-t border-slate-800/80">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeVideo.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Batch {activeVideo.batch} • Antariksh Academy Academic Portal</span>
                    <button
                      onClick={() => setActiveVideo(null)}
                      className="text-amber-400 hover:underline font-bold cursor-pointer"
                    >
                      Close Player
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

export default RecordedLecturesPage;
