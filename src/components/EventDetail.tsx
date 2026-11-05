/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import type { EventItem, User, DocumentItem, MediaItem } from '../types';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User as UserIcon,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  History,
  Eye,
  Download,
  Trash2,
  Film,
  Send,
} from 'lucide-react';

interface EventDetailProps {
  event: EventItem;
  currentUser: User;
  onBack: () => void;
  onOpenUploadDocument: (eventId: string) => void;
  onOpenUploadMedia: (eventId: string) => void;
  onOpenVersionHistory: (doc: DocumentItem) => void;
  onPreviewDocument: (doc: DocumentItem) => void;
  onSubmitForReview: (eventId: string) => void;
  onApproveEvent: (eventId: string) => void;
  onRejectEvent: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onTagClick?: (tag: string) => void;
}

export const EventDetail: React.FC<EventDetailProps> = ({
  event,
  currentUser,
  onBack,
  onOpenUploadDocument,
  onOpenUploadMedia,
  onOpenVersionHistory,
  onPreviewDocument,
  onSubmitForReview,
  onApproveEvent,
  onRejectEvent,
  onDeleteEvent,
  onTagClick,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'documents' | 'media' | 'info' | 'history'>('documents');
  const [selectedPhoto, setSelectedPhoto] = useState<MediaItem | null>(null);

  const canEdit =
    currentUser.role === 'super_admin' ||
    currentUser.role === 'admin_arsip' ||
    (currentUser.role === 'contributor' && event.status !== 'APPROVED');

  const canReview = currentUser.role === 'super_admin' || currentUser.role === 'admin_arsip';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top back & actions bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Arsip</span>
        </button>

        <div className="flex items-center gap-2">
          {event.status === 'DRAFT' && canEdit && (
            <button
              onClick={() => onSubmitForReview(event.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ajukan ke Verifikasi</span>
            </button>
          )}

          {event.status === 'PENDING_REVIEW' && canReview && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onRejectEvent(event.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Kembalikan (Revisi)</span>
              </button>
              <button
                onClick={() => onApproveEvent(event.id)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Setujui Arsip Resmi</span>
              </button>
            </div>
          )}

          {currentUser.role === 'super_admin' && (
            <button
              onClick={() => onDeleteEvent(event.id)}
              title="Pindahkan ke Sampah"
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Revision Banner if status is REVISION */}
      {event.status === 'REVISION' && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-rose-900">Perlu Revisi dari Admin Arsip</h4>
              <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                {event.rejectionReason || 'Silakan lengkapi dokumen laporan akhir dan periksa kembali susunan panitia.'}
              </p>
            </div>
          </div>
          {canEdit && (
            <button
              onClick={() => onSubmitForReview(event.id)}
              className="shrink-0 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-white border border-rose-300 rounded-lg hover:bg-rose-100 transition-colors"
            >
              Submit Ulang Revisi
            </button>
          )}
        </div>
      )}

      {/* Main Event Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
              <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                {event.id}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-slate-700">{event.categoryName}</span>
              <span aria-hidden="true">·</span>
              <span>Tahun Ajaran {event.academicYear}</span>
              <span aria-hidden="true">·</span>
              <span className="text-xs text-slate-600">
                Akses: {event.visibility === 'PUBLIC' ? 'Publik' : event.visibility === 'INTERNAL' ? 'Internal' : 'Terbatas'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {event.title}
            </h1>
          </div>

          <div className="shrink-0">
            {event.status === 'APPROVED' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Arsip Resmi Sekolah</span>
              </div>
            )}
            {event.status === 'PENDING_REVIEW' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Menunggu Verifikasi</span>
              </div>
            )}
            {event.status === 'REVISION' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Dalam Masa Revisi</span>
              </div>
            )}
            {event.status === 'DRAFT' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                <span>Draf Panitia (Belum Terverifikasi)</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed border-l-2 border-indigo-200 pl-3">
          {event.description}
        </p>

        {/* Metadata Key-Value strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <div className="text-slate-400 font-medium mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Jadwal Pelaksanaan</span>
            </div>
            <div className="font-semibold text-slate-800">
              {event.startDate} s/d {event.endDate}
            </div>
          </div>

          <div>
            <div className="text-slate-400 font-medium mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Lokasi</span>
            </div>
            <div className="font-semibold text-slate-800">{event.location}</div>
          </div>

          <div>
            <div className="text-slate-400 font-medium mb-1 flex items-center gap-1">
              <UserIcon className="w-3.5 h-3.5" />
              <span>Penyelenggara</span>
            </div>
            <div className="font-semibold text-slate-800">
              {event.organizer}
            </div>
          </div>

          <div>
            <div className="text-slate-400 font-medium mb-1 flex items-center gap-1">
              <span>Penanggung Jawab</span>
            </div>
            <div className="font-semibold text-slate-800">
              {event.responsiblePerson}
            </div>
          </div>
        </div>

        {/* Tags */}
        {event.tags.length > 0 && (
          <div className="flex items-center gap-2 pt-2 flex-wrap">
            <span className="text-xs text-slate-400">Tag:</span>
            {event.tags.map((t) => (
              <button
                key={t}
                onClick={() => onTagClick && onTagClick(t)}
                className="text-xs text-indigo-700 hover:text-indigo-900 hover:underline"
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sub Tabs Bar */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('documents')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeSubTab === 'documents'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Dokumen Resmi</span>
            <span className="text-xs px-1.5 py-0.2 bg-slate-100 rounded text-slate-600 tabular-nums">
              {event.documents.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('media')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeSubTab === 'media'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Foto & Video</span>
            <span className="text-xs px-1.5 py-0.2 bg-slate-100 rounded text-slate-600 tabular-nums">
              {event.media.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('info')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeSubTab === 'info'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Informasi Teknis</span>
          </button>
        </div>

        {/* Tab Right Actions */}
        <div>
          {activeSubTab === 'documents' && canEdit && (
            <button
              onClick={() => onOpenUploadDocument(event.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Dokumen</span>
            </button>
          )}
          {activeSubTab === 'media' && canEdit && (
            <button
              onClick={() => onOpenUploadMedia(event.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Unggah Media</span>
            </button>
          )}
        </div>
      </div>

      {/* Subtab Content: DOCUMENTS */}
      {activeSubTab === 'documents' && (
        <div className="space-y-4">
          {event.documents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-800">Belum Ada Dokumen</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Unggah proposal, surat izin, SK panitia, atau laporan akhir untuk melengkapi arsip kegiatan ini.
              </p>
              {canEdit && (
                <button
                  onClick={() => onOpenUploadDocument(event.id)}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Unggah Dokumen Pertama
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {event.documents.map((doc) => {
                const latestVer = doc.versions[doc.versions.length - 1];
                return (
                  <div
                    key={doc.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                          <span className="font-semibold text-indigo-700">{doc.docType}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-slate-600 font-medium">
                            Versi {doc.currentVersion}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{latestVer?.fileSize || '1.8 MB'}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-400">Diunggah oleh {doc.uploadedBy}</span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 mt-1">
                          {doc.title}
                        </h4>

                        <p className="text-xs text-slate-600 mt-0.5">
                          {doc.description}
                        </p>

                        {latestVer?.changeNote && (
                          <div className="text-[11px] text-slate-500 italic mt-1">
                            Catatan versi terakhir: "{latestVer.changeNote}"
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => onOpenVersionHistory(doc)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 hover:border-indigo-300 transition-colors"
                        title="Lihat seluruh riwayat versi dokumen"
                      >
                        <History className="w-3.5 h-3.5" />
                        <span>Riwayat (V{doc.versions.length})</span>
                      </button>

                      <button
                        onClick={() => onPreviewDocument(doc)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 rounded-lg px-2.5 py-1.5 hover:bg-slate-200 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>

                      <button
                        onClick={() => onPreviewDocument(doc)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-2.5 py-1.5 hover:bg-indigo-100 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Subtab Content: MEDIA (PHOTOS & VIDEO) */}
      {activeSubTab === 'media' && (
        <div className="space-y-4">
          {event.media.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
              <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-800">Belum Ada Dokumentasi Media</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Dokumentasikan foto kegiatan lapangan dan tautan video dokumentasi.
              </p>
              {canEdit && (
                <button
                  onClick={() => onOpenUploadMedia(event.id)}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Unggah Foto Pertama
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.media.map((med) => (
                <div
                  key={med.id}
                  onClick={() => setSelectedPhoto(med)}
                  className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="aspect-video relative overflow-hidden bg-slate-100">
                    <img
                      src={med.thumbnailUrl}
                      alt={med.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-semibold flex items-center gap-1 backdrop-blur-xs">
                      {med.type === 'video' ? <Film className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                      <span>{med.type === 'video' ? 'Video' : 'Foto'}</span>
                    </div>
                    {med.duration && (
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[11px] font-mono tabular-nums">
                        {med.duration}
                      </div>
                    )}
                  </div>
                  <div className="p-3.5">
                    <h5 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {med.title}
                    </h5>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                      <span>{med.photographer || 'Dokumentasi OSIS'}</span>
                      <span className="tabular-nums text-slate-400">{med.capturedAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Subtab Content: TECHNICAL INFO */}
      {activeSubTab === 'info' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Spesifikasi Metadata Arsip</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs">
            <div>
              <dt className="text-slate-400">Identifier Arsip (Event ID)</dt>
              <dd className="font-mono font-bold text-slate-800">{event.id}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Tahun Ajaran</dt>
              <dd className="font-semibold text-slate-800">{event.academicYear}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Tanggal Dibuat</dt>
              <dd className="font-semibold text-slate-800">{event.createdAt} oleh {event.createdBy}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Status Validasi</dt>
              <dd className="font-semibold text-slate-800">
                {event.status === 'APPROVED'
                  ? `Disahkan pada ${event.approvedAt} oleh ${event.approvedBy}`
                  : event.status}
              </dd>
            </div>
            <div>
              <dt className="text-slate-400">Lokasi Penyimpanan Digital</dt>
              <dd className="font-mono text-slate-600">/storage/{event.year}/events/{event.id}/</dd>
            </div>
            <div>
              <dt className="text-slate-400">Tingkat Hak Akses</dt>
              <dd className="font-semibold text-slate-800">
                {event.visibility === 'PUBLIC'
                  ? 'Terbuka untuk Umum (Siswa, Guru, Alumni)'
                  : event.visibility === 'INTERNAL'
                  ? 'Internal Warga Sekolah Terverifikasi'
                  : 'Restricted (Khusus Manajemen & TU)'}
              </dd>
            </div>
          </dl>
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <img
                src={selectedPhoto.thumbnailUrl}
                alt={selectedPhoto.title}
                className="max-h-full max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-4 flex items-center justify-between text-white text-xs">
              <div>
                <h4 className="font-bold text-sm">{selectedPhoto.title}</h4>
                <div className="text-slate-400 mt-0.5">
                  Fotografer: {selectedPhoto.photographer} · {selectedPhoto.capturedAt} · {selectedPhoto.fileSize}
                </div>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};