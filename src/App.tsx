/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import type {
  EventItem,
  User,
  DocumentItem,
  MediaItem,
  Category,
  AuditLog,
  EventStatus,
} from './types';
import {
  INITIAL_USERS,
  INITIAL_CATEGORIES,
  INITIAL_EVENTS,
  INITIAL_AUDIT_LOGS,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { EventCard } from './components/EventCard';
import { EventDetail } from './components/EventDetail';
import { TimelineView } from './components/TimelineView';
import { VerificationQueue } from './components/VerificationQueue';
import { DocumentsView } from './components/DocumentsView';
import { StatisticsView } from './components/StatisticsView';
import { AuditLogView } from './components/AuditLogView';
import { RecycleBinView } from './components/RecycleBinView';
import { CategoriesView } from './components/CategoriesView';
import { CreateEventModal } from './components/modals/CreateEventModal';
import { UploadDocumentModal } from './components/modals/UploadDocumentModal';
import { VersionHistoryModal } from './components/modals/VersionHistoryModal';
import { MediaUploadModal } from './components/modals/MediaUploadModal';
import { DocumentPreviewModal } from './components/modals/DocumentPreviewModal';
import { Search, Plus, Sparkles } from 'lucide-react';

export default function App() {
  // Current user & data state
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('schoolvault_events');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_EVENTS;
      }
    }
    return INITIAL_EVENTS;
  });

  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('schoolvault_audit');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_AUDIT_LOGS;
      }
    }
    return INITIAL_AUDIT_LOGS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('schoolvault_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('schoolvault_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Navigation & view states
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [yearFilter, setYearFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [uploadDocEventId, setUploadDocEventId] = useState<string | null>(null);
  const [uploadMediaEventId, setUploadMediaEventId] = useState<string | null>(null);
  const [versionHistoryDoc, setVersionHistoryDoc] = useState<DocumentItem | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  // Feedback banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper to append audit log
  const recordAudit = (
    action: AuditLog['action'],
    entityType: AuditLog['entityType'],
    entityId: string,
    entityTitle: string,
    description: string
  ) => {
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newLog: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-5)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      entityType,
      entityId,
      entityTitle,
      description,
      ipAddress: '192.168.10.45',
      timestamp,
    };

    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Selected event object
  const selectedEvent = events.find((e) => e.id === selectedEventId) || null;

  // Actions
  const handleCreateEvent = (
    newEventData: Omit<EventItem, 'id' | 'createdAt' | 'documents' | 'media'>
  ) => {
    const nextNum = events.length + 1;
    const yearStr = newEventData.year.toString();
    const newId = `EVT-${yearStr}-${String(nextNum).padStart(5, '0')}`;

    const newEvent: EventItem = {
      ...newEventData,
      id: newId,
      createdAt: new Date().toISOString().slice(0, 10),
      documents: [],
      media: [],
    };

    setEvents((prev) => [newEvent, ...prev]);
    recordAudit('CREATE', 'EVENT', newId, newEvent.title, `Membuat kegiatan baru ${newId}`);
    showToast(`Kegiatan "${newEvent.title}" (${newId}) berhasil dibuat sebagai draf.`);
    setSelectedEventId(newId);
  };

  const handleUploadDocument = (docData: {
    title: string;
    docType: DocumentItem['docType'];
    description: string;
    changeNote: string;
    visibility: DocumentItem['visibility'];
    fileName: string;
    fileSize: string;
  }) => {
    if (!uploadDocEventId) return;
    const targetEvent = events.find((e) => e.id === uploadDocEventId);
    if (!targetEvent) return;

    const docId = `DOC-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString().slice(0, 10);
    const timeNow = `${now} ${new Date().toLocaleTimeString().slice(0, 5)}`;

    const newDoc: DocumentItem = {
      id: docId,
      eventId: uploadDocEventId,
      category: docData.docType,
      title: docData.title,
      docType: docData.docType,
      description: docData.description,
      currentVersion: 1,
      uploadedBy: currentUser.name,
      status: 'APPROVED',
      visibility: docData.visibility,
      createdAt: now,
      updatedAt: now,
      versions: [
        {
          id: `VER-${Date.now().toString().slice(-4)}`,
          documentId: docId,
          versionNumber: 1,
          fileName: docData.fileName,
          fileSize: docData.fileSize,
          uploadedBy: currentUser.name,
          uploadedAt: timeNow,
          changeNote: docData.changeNote,
        },
      ],
    };

    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === uploadDocEventId
          ? { ...evt, documents: [...evt.documents, newDoc] }
          : evt
      )
    );

    recordAudit(
      'UPLOAD',
      'DOCUMENT',
      docId,
      docData.title,
      `Mengunggah dokumen ${docData.docType} untuk kegiatan ${targetEvent.title}`
    );
    showToast(`Dokumen "${docData.title}" berhasil diunggah.`);
    setUploadDocEventId(null);
  };

  const handleAddVersion = (
    docId: string,
    newVer: { fileName: string; fileSize: string; changeNote: string }
  ) => {
    let updatedDocRef: DocumentItem | null = null;
    const now = new Date();
    const timeNow = `${now.toISOString().slice(0, 10)} ${String(now.getHours()).padStart(
      2,
      '0'
    )}:${String(now.getMinutes()).padStart(2, '0')}`;

    setEvents((prev) =>
      prev.map((evt) => {
        const docIndex = evt.documents.findIndex((d) => d.id === docId);
        if (docIndex === -1) return evt;

        const targetDoc = evt.documents[docIndex];
        const nextVersionNum = targetDoc.versions.length + 1;

        const newVersionItem = {
          id: `VER-${Date.now().toString().slice(-4)}`,
          documentId: docId,
          versionNumber: nextVersionNum,
          fileName: newVer.fileName,
          fileSize: newVer.fileSize,
          uploadedBy: currentUser.name,
          uploadedAt: timeNow,
          changeNote: newVer.changeNote,
        };

        const updatedDoc: DocumentItem = {
          ...targetDoc,
          currentVersion: nextVersionNum,
          updatedAt: now.toISOString().slice(0, 10),
          versions: [...targetDoc.versions, newVersionItem],
        };

        updatedDocRef = updatedDoc;

        const newDocs = [...evt.documents];
        newDocs[docIndex] = updatedDoc;
        return { ...evt, documents: newDocs };
      })
    );

    if (updatedDocRef) {
      setVersionHistoryDoc(updatedDocRef);
      recordAudit(
        'UPDATE',
        'DOCUMENT',
        docId,
        (updatedDocRef as DocumentItem).title,
        `Memperbarui versi dokumen ke V${(updatedDocRef as DocumentItem).currentVersion}: ${newVer.changeNote}`
      );
      showToast(`Versi baru (V${(updatedDocRef as DocumentItem).currentVersion}) berhasil disimpan.`);
    }
  };

  const handleUploadMedia = (
    mediaData: Omit<MediaItem, 'id' | 'eventId' | 'uploadedBy' | 'createdAt'>
  ) => {
    if (!uploadMediaEventId) return;
    const mediaId = `MED-${Date.now().toString().slice(-5)}`;
    const newMedia: MediaItem = {
      ...mediaData,
      id: mediaId,
      eventId: uploadMediaEventId,
      uploadedBy: currentUser.name,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === uploadMediaEventId ? { ...evt, media: [...evt.media, newMedia] } : evt
      )
    );

    recordAudit('UPLOAD', 'MEDIA', mediaId, mediaData.title, `Mengunggah media untuk kegiatan ${uploadMediaEventId}`);
    showToast(`Dokumentasi "${mediaData.title}" berhasil diunggah.`);
    setUploadMediaEventId(null);
  };

  const handleSubmitForReview = (eventId: string) => {
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === eventId
          ? { ...evt, status: 'PENDING_REVIEW' as EventStatus, rejectionReason: undefined }
          : evt
      )
    );
    const evt = events.find((e) => e.id === eventId);
    recordAudit('UPDATE', 'EVENT', eventId, evt?.title || eventId, 'Mengajukan kegiatan ke antrean verifikasi admin');
    showToast('Kegiatan berhasil diajukan untuk verifikasi pengarsipan resmi.');
  };

  const handleApproveEvent = (eventId: string) => {
    const now = new Date().toISOString().slice(0, 10);
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === eventId
          ? {
              ...evt,
              status: 'APPROVED' as EventStatus,
              approvedAt: now,
              approvedBy: currentUser.name,
              rejectionReason: undefined,
            }
          : evt
      )
    );
    const evt = events.find((e) => e.id === eventId);
    recordAudit(
      'VERIFY_APPROVE',
      'EVENT',
      eventId,
      evt?.title || eventId,
      'Menyetujui dan mengesahkan sebagai Arsip Resmi Sekolah'
    );
    showToast(`Kegiatan "${evt?.title || eventId}" resmi disahkan dan diarsipkan!`);
  };

  const handleRejectEventWithReason = (eventId: string, reason: string) => {
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === eventId
          ? { ...evt, status: 'REVISION' as EventStatus, rejectionReason: reason }
          : evt
      )
    );
    const evt = events.find((e) => e.id === eventId);
    recordAudit(
      'VERIFY_REJECT',
      'EVENT',
      eventId,
      evt?.title || eventId,
      `Mengembalikan kegiatan untuk revisi: "${reason}"`
    );
    showToast('Kegiatan dikembalikan ke panitia dengan catatan revisi.');
  };

  const handleDeleteEvent = (eventId: string) => {
    const now = new Date().toISOString().slice(0, 10);
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === eventId
          ? { ...evt, isDeleted: true, status: 'TRASH' as EventStatus, deletedAt: now }
          : evt
      )
    );
    const evt = events.find((e) => e.id === eventId);
    recordAudit('DELETE', 'EVENT', eventId, evt?.title || eventId, 'Memindahkan kegiatan ke Recycle Bin');
    showToast('Kegiatan dipindahkan ke Recycle Bin.');
    setSelectedEventId(null);
  };

  const handleRestoreEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === eventId
          ? { ...evt, isDeleted: false, status: 'APPROVED' as EventStatus, deletedAt: undefined }
          : evt
      )
    );
    const evt = events.find((e) => e.id === eventId);
    recordAudit('RESTORE', 'EVENT', eventId, evt?.title || eventId, 'Memulihkan arsip dari Recycle Bin');
    showToast('Kegiatan berhasil dipulihkan dari Recycle Bin.');
  };

  const handlePermanentDelete = (eventId: string) => {
    const evt = events.find((e) => e.id === eventId);
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    recordAudit(
      'DELETE',
      'EVENT',
      eventId,
      evt?.title || eventId,
      'Menghapus kegiatan secara permanen dari server'
    );
    showToast('Arsip telah dihapus permanen.');
  };

  // Filtered active events for the main dashboard
  const activeEvents = events.filter((e) => !e.isDeleted);
  const pendingCount = events.filter((e) => e.status === 'PENDING_REVIEW' && !e.isDeleted).length;
  const trashCount = events.filter((e) => e.isDeleted).length;

  const filteredDashboardEvents = activeEvents.filter((evt) => {
    if (statusFilter !== 'ALL' && evt.status !== statusFilter) return false;
    if (yearFilter !== 'ALL' && evt.year.toString() !== yearFilter) return false;
    if (categoryFilter !== 'ALL' && evt.categoryId !== categoryFilter) return false;
    if (selectedTag && !evt.tags.includes(selectedTag)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = evt.id.toLowerCase().includes(q);
      const matchTitle = evt.title.toLowerCase().includes(q);
      const matchDesc = evt.description.toLowerCase().includes(q);
      const matchOrg = evt.organizer.toLowerCase().includes(q);
      const matchResp = evt.responsiblePerson.toLowerCase().includes(q);
      const matchTags = evt.tags.some((t) => t.toLowerCase().includes(q));
      const matchDocs = evt.documents.some((d) => d.title.toLowerCase().includes(q));
      if (!matchId && !matchTitle && !matchDesc && !matchOrg && !matchResp && !matchTags && !matchDocs) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        users={INITIAL_USERS}
        onSelectUser={(u) => {
          setCurrentUser(u);
          showToast(`Beralih akun ke: ${u.name} (${u.role.replace('_', ' ')})`);
        }}
        activeTab={activeTab}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setSelectedEventId(null);
        }}
        onCreateEventClick={() => setIsCreateModalOpen(true)}
        onOpenGuideClick={() => {
          setActiveTab('guide');
          setSelectedEventId(null);
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl border border-slate-800 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onNavigateTab={(tab) => {
            setActiveTab(tab);
            setSelectedEventId(null);
          }}
          pendingCount={pendingCount}
          trashCount={trashCount}
          userRole={currentUser.role}
        />

        {/* Content Viewport */}
        <main className="flex-1 min-w-0">
          {selectedEvent ? (
            /* Event Detail View (§22) */
            <EventDetail
              event={selectedEvent}
              currentUser={currentUser}
              onBack={() => setSelectedEventId(null)}
              onOpenUploadDocument={(evtId) => setUploadDocEventId(evtId)}
              onOpenUploadMedia={(evtId) => setUploadMediaEventId(evtId)}
              onOpenVersionHistory={(doc) => setVersionHistoryDoc(doc)}
              onPreviewDocument={(doc) => setPreviewDoc(doc)}
              onSubmitForReview={handleSubmitForReview}
              onApproveEvent={handleApproveEvent}
              onRejectEvent={(evtId) => handleRejectEventWithReason(evtId, 'Mohon lengkapi laporan akhir dan berkas pendukung.')}
              onDeleteEvent={handleDeleteEvent}
              onTagClick={(t) => {
                setSelectedTag(t);
                setSelectedEventId(null);
                setActiveTab('dashboard');
              }}
            />
          ) : activeTab === 'timeline' ? (
            /* Digital Timeline (§32) */
            <TimelineView
              events={events}
              onSelectEvent={(evt) => setSelectedEventId(evt.id)}
            />
          ) : activeTab === 'verification' ? (
            /* Verification Queue (§18-20) */
            <VerificationQueue
              events={events}
              onApproveEvent={handleApproveEvent}
              onRejectEventWithReason={handleRejectEventWithReason}
              onSelectEvent={(evt) => setSelectedEventId(evt.id)}
            />
          ) : activeTab === 'documents' ? (
            /* Document Explorer */
            <DocumentsView
              events={activeEvents}
              onSelectEvent={(evt) => setSelectedEventId(evt.id)}
              onPreviewDocument={(doc) => setPreviewDoc(doc)}
              onOpenVersionHistory={(doc) => setVersionHistoryDoc(doc)}
            />
          ) : activeTab === 'media' ? (
            /* Media Explorer */
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-2">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Galeri Foto & Dokumentasi Liputan Sekolah
                </h2>
                <p className="text-sm text-slate-600">
                  Arsip visual resmi seluruh kegiatan, pekan olahraga, pameran P5, dan upacara sekolah.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeEvents.flatMap((evt) =>
                  evt.media.map((med) => (
                    <div
                      key={med.id}
                      onClick={() => setSelectedEventId(evt.id)}
                      className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-indigo-400 hover:shadow-sm cursor-pointer transition-all"
                    >
                      <div className="aspect-video relative overflow-hidden bg-slate-100">
                        <img
                          src={med.thumbnailUrl}
                          alt={med.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-semibold backdrop-blur-xs">
                          {evt.title}
                        </div>
                      </div>
                      <div className="p-3.5">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600">
                          {med.title}
                        </h4>
                        <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                          <span>{med.photographer}</span>
                          <span className="tabular-nums">{med.capturedAt}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : activeTab === 'categories' ? (
            /* Categories & Tags View (§26-27) */
            <CategoriesView
              categories={categories}
              events={activeEvents}
              onSelectEvent={(evt) => setSelectedEventId(evt.id)}
              onFilterByTag={(tag) => {
                setSelectedTag(tag);
                setActiveTab('dashboard');
              }}
            />
          ) : activeTab === 'statistics' ? (
            /* Statistics View (§31) */
            <StatisticsView events={events} categories={categories} />
          ) : activeTab === 'audit' ? (
            /* Audit Log View (§30) */
            <AuditLogView logs={auditLogs} />
          ) : activeTab === 'trash' ? (
            /* Recycle Bin View (§29) */
            <RecycleBinView
              events={events}
              currentUser={currentUser}
              onRestoreEvent={handleRestoreEvent}
              onPermanentDelete={handlePermanentDelete}
            />
          ) : (
            /* Default: Main Dashboard (§1-3: Event-Centric Archive List) */
            <div className="space-y-6">
              {/* Hero Banner with Clear Purpose */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
                      <span>Sistem Memori Digital & Arsip Institusi</span>
                      <span aria-hidden="true">·</span>
                      <span>SMK Informatika Utama</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Pusat Arsip Digital Sekolah
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                      Menyimpan, mengorganisasi, memvalidasi, mencari, dan melacak seluruh proposal, surat izin, SK panitia, laporan akhir, serta dokumentasi kegiatan sekolah lintas generasi.
                    </p>
                  </div>

                  {currentUser.role !== 'viewer' && (
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Buat Kegiatan Baru</span>
                    </button>
                  )}
                </div>

                {/* Filter & Search Bar (§23, §24, §25: Advanced Search) */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Search query */}
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari proposal, classmeeting, OSIS..."
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Status filter */}
                    <div>
                      <select
                        aria-label="Filter Status Arsip"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="ALL">Semua Status Arsip</option>
                        <option value="APPROVED">Resmi Disahkan (Approved)</option>
                        <option value="PENDING_REVIEW">Menunggu Review</option>
                        <option value="REVISION">Dalam Revisi</option>
                        <option value="DRAFT">Draf Panitia</option>
                      </select>
                    </div>

                    {/* Year filter */}
                    <div>
                      <select
                        aria-label="Filter Tahun Kegiatan"
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="ALL">Semua Tahun (2024–2026)</option>
                        <option value="2026">Tahun 2026</option>
                        <option value="2025">Tahun 2025</option>
                        <option value="2024">Tahun 2024</option>
                      </select>
                    </div>

                    {/* Category filter */}
                    <div>
                      <select
                        aria-label="Filter Kategori Kegiatan"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="ALL">Semua Kategori</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Active Tag filter pill strip if selected */}
                  {selectedTag && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500">Filter Tag Aktif:</span>
                      <span className="font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                        <span>{selectedTag}</span>
                        <button
                          onClick={() => setSelectedTag(null)}
                          className="hover:text-rose-600 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Segmented Tabs for Quick Access */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-lg text-xs">
                  <button
                    onClick={() => setStatusFilter('ALL')}
                    className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                      statusFilter === 'ALL'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Semua Kegiatan ({activeEvents.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('APPROVED')}
                    className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                      statusFilter === 'APPROVED'
                        ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Arsip Resmi ({activeEvents.filter((e) => e.status === 'APPROVED').length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('PENDING_REVIEW')}
                    className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                      statusFilter === 'PENDING_REVIEW'
                        ? 'bg-white text-amber-800 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Menunggu Review ({activeEvents.filter((e) => e.status === 'PENDING_REVIEW').length})
                  </button>
                </div>

                <div className="text-xs text-slate-500">
                  Menampilkan <span className="font-bold text-slate-800 tabular-nums">{filteredDashboardEvents.length}</span> kegiatan terarsip
                </div>
              </div>

              {/* Event Cards Grid */}
              {filteredDashboardEvents.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
                  <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-800">
                    Tidak Ada Arsip yang Sesuai
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                    Tidak ditemukan kegiatan yang cocok dengan kriteria filter atau pencarian Anda.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('ALL');
                      setYearFilter('ALL');
                      setCategoryFilter('ALL');
                      setSelectedTag(null);
                    }}
                    className="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100"
                  >
                    Reset Semua Filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDashboardEvents.map((evt) => (
                    <EventCard
                      key={evt.id}
                      event={evt}
                      onSelect={(e) => setSelectedEventId(e.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>SchoolVault</strong> · Sistem Manajemen Memori Digital & Arsip Institusi Sekolah
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Rekayasa Perangkat Lunak (RPL) Kelas 12</span>
            <span>·</span>
            <span>Tahun Ajaran 2026/2027</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        categories={categories}
        currentUser={currentUser}
        onCreateEvent={handleCreateEvent}
      />

      <UploadDocumentModal
      isOpen={!!uploadDocEventId}
      onClose={() => setUploadDocEventId(null)}
      eventId={uploadDocEventId || ''}
      eventTitle={events.find((e) => e.id === uploadDocEventId)?.title || ''}
      onUpload={handleUploadDocument}
      />

      <VersionHistoryModal
        isOpen={!!versionHistoryDoc}
        onClose={() => setVersionHistoryDoc(null)}
        document={versionHistoryDoc}
        onAddVersion={handleAddVersion}
        onPreviewVersion={(fileName) => {
          showToast(`Mengunduh berkas: ${fileName}`);
        }}
      />

      <MediaUploadModal
      isOpen={!!uploadMediaEventId}
      onClose={() => setUploadMediaEventId(null)}
      eventTitle={events.find((e) => e.id === uploadMediaEventId)?.title || ''}
      onUploadMedia={handleUploadMedia}
      />

      <DocumentPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        document={previewDoc}
      />
    </div>
  );
}