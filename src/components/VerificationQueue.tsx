/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import type { EventItem } from '../types';
import { CheckCircle, AlertCircle, Clock, FileText, Image as ImageIcon, Check, X, ShieldCheck } from 'lucide-react';

interface VerificationQueueProps {
  events: EventItem[];

  onApproveEvent: (eventId: string) => void;
  onRejectEventWithReason: (eventId: string, reason: string) => void;
  onSelectEvent: (event: EventItem) => void;
}

export const VerificationQueue: React.FC<VerificationQueueProps> = ({
  events,
  onApproveEvent,
  onRejectEventWithReason,
  onSelectEvent,
}) => {
  const [rejectingEventId, setRejectingEventId] = useState<string | null>(null);
  const [reasonInput, setReasonInput] = useState('');

  const pendingEvents = events.filter((e) => e.status === 'PENDING_REVIEW' && !e.isDeleted);
  const revisedEvents = events.filter((e) => e.status === 'REVISION' && !e.isDeleted);

  const handleConfirmReject = () => {
    if (!rejectingEventId) return;
    if (!reasonInput.trim()) {
      return;
    }
    onRejectEventWithReason(rejectingEventId, reasonInput.trim());
    setRejectingEventId(null);
    setReasonInput('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Workflow Pengarsipan Resmi</span>
        </div>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Antrean Verifikasi Arsip (Verification Queue)
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Sebagai Admin Arsip / Operator TU, periksa kelengkapan metadata, validitas berkas, dan kepatuhan administrasi sebelum dokumen disahkan sebagai arsip permanen sekolah.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>{pendingEvents.length} Pengajuan Menunggu Review</span>
          </div>
        </div>
      </div>

      {/* Pending Items List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span>Menunggu Persetujuan Anda</span>
          <span className="text-xs font-medium text-slate-400 tabular-nums">
            ({pendingEvents.length})
          </span>
        </h3>

        {pendingEvents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-800">Semua Pengajuan Telah Ditinjau</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Tidak ada draf kegiatan yang menunggu verifikasi saat ini. Seluruh berkas telah masuk ke arsip resmi.
            </p>
          </div>
        ) : (
          pendingEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-5 hover:border-slate-300 transition-colors shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap mb-1">
                    <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {evt.id}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-slate-700">{evt.categoryName}</span>
                    <span aria-hidden="true">·</span>
                    <span>Tahun {evt.year}</span>
                    <span aria-hidden="true">·</span>
                    <span>Diajukan oleh {evt.createdBy} ({evt.createdAt})</span>
                  </div>
                  <h4
                    onClick={() => onSelectEvent(evt)}
                    className="text-lg font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors"
                  >
                    {evt.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {evt.description}
                  </p>
                </div>

                <button
                  onClick={() => onSelectEvent(evt)}
                  className="shrink-0 text-xs font-semibold text-indigo-600 hover:text-indigo-800 self-start py-1"
                >
                  Buka Rincian Lengkap &rarr;
                </button>
              </div>

              {/* Inspection Checklist (§19) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-lg text-xs border border-slate-200/80">
                <div>
                  <div className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Metadata & Penanggung Jawab</span>
                  </div>
                  <ul className="text-slate-500 space-y-0.5 pl-4 list-disc text-[11px]">
                    <li>Lokasi: {evt.location}</li>
                    <li>Jadwal: {evt.startDate} s/d {evt.endDate}</li>
                    <li>PJ: {evt.responsiblePerson}</li>
                  </ul>
                </div>

                <div>
                  <div className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Dokumen Lampiran ({evt.documents.length})</span>
                  </div>
                  <ul className="text-slate-500 space-y-0.5 pl-4 list-disc text-[11px]">
                    {evt.documents.length === 0 ? (
                      <li className="text-amber-600 font-medium">Belum ada berkas dokumen</li>
                    ) : (
                      evt.documents.map((d) => (
                        <li key={d.id} className="truncate">
                          {d.docType}: {d.title} (V{d.currentVersion})
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                <div>
                  <div className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Media Dokumentasi ({evt.media.length})</span>
                  </div>
                  <ul className="text-slate-500 space-y-0.5 pl-4 list-disc text-[11px]">
                    {evt.media.length === 0 ? (
                      <li className="text-slate-400">Belum ada dokumentasi media</li>
                    ) : (
                      evt.media.map((m) => (
                        <li key={m.id} className="truncate">
                          {m.type === 'video' ? 'Video' : 'Foto'}: {m.title}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>

              {/* Action Buttons: Setujui vs Kembalikan */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    setRejectingEventId(evt.id);
                    setReasonInput('');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Kembalikan untuk Revisi</span>
                </button>

                <button
                  onClick={() => onApproveEvent(evt.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Setujui Arsip Resmi</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Revised Items list */}
      {revisedEvents.length > 0 && (
        <div className="space-y-3 pt-4">
          <h3 className="text-sm font-bold text-slate-800">
            Sedang Dalam Proses Revisi oleh Panitia ({revisedEvents.length})
          </h3>
          <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
            {revisedEvents.map((rev) => (
              <div
                key={rev.id}
                onClick={() => onSelectEvent(rev)}
                className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-rose-700 font-semibold mb-0.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Catatan Revisi: {rev.rejectionReason}</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900">{rev.title}</h5>
                </div>
                <span className="text-xs text-slate-400">Lihat Draf &rarr;</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectingEventId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="max-w-md w-full bg-white rounded-2xl p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-base">
              <AlertCircle className="w-5 h-5" />
              <span>Kembalikan Kegiatan untuk Revisi</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tuliskan instruksi atau alasan perbaikan secara spesifik kepada panitia/contributor agar mereka dapat memperbaiki dokumen sebelum disahkan.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alasan / Catatan Revisi (Wajib Diisi):
              </label>
              <textarea
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder="Contoh: Laporan akhir belum dilampirkan, dan presensi panitia belum bertandatangan pembina..."
                rows={4}
                className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingEventId(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                disabled={!reasonInput.trim()}
                onClick={handleConfirmReject}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 disabled:opacity-50"
              >
                Kirim Catatan Revisi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};