/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { EventItem, User } from '../types';
import { Trash2, RotateCcw } from 'lucide-react';

interface RecycleBinViewProps {
  events: EventItem[];
  currentUser: User;
  onRestoreEvent: (eventId: string) => void;
  onPermanentDelete: (eventId: string) => void;
}

export const RecycleBinView: React.FC<RecycleBinViewProps> = ({
  events,
  currentUser,
  onRestoreEvent,
  onPermanentDelete,
}) => {
  const trashedEvents = events.filter((e) => e.isDeleted);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 uppercase tracking-wider">
          <Trash2 className="w-4 h-4" />
          <span>Sistem Penghapusan Bertingkat (§29)</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Recycle Bin & Pemulihan Arsip
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          SchoolVault menerapkan prinsip <em>Soft Delete</em> (Active &rarr; Archived &rarr; Trash &rarr; Permanent Delete). Dokumen yang tidak sengaja terhapus dapat dipulihkan kembali oleh Super Admin tanpa kehilangan relasi data.
        </p>
      </div>

      {/* Trashed Items List */}
      <div className="space-y-4">
        {trashedEvents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8">
            <Trash2 className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-800">Recycle Bin Kosong</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Tidak ada arsip kegiatan yang berada di tempat sampah. Semua data aktif dan tersimpan aman di basis data.
            </p>
          </div>
        ) : (
          trashedEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white border border-rose-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-rose-600 font-semibold mb-1">
                  <span>Dihapus pada {evt.deletedAt || 'Baru saja'}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-slate-500">{evt.id}</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">{evt.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{evt.description}</p>
                <div className="text-[11px] text-slate-400 mt-1">
                  Kategori: {evt.categoryName} · Tahun {evt.year} · Pembuat: {evt.createdBy}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => onRestoreEvent(evt.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Pulihkan (Restore)</span>
                </button>

                {currentUser.role === 'super_admin' && (
                  <button
                    onClick={() => {
                      if (confirm(`Yakin ingin menghapus permanen ${evt.title}? Tindakan ini tidak dapat dibatalkan.`)) {
                        onPermanentDelete(evt.id);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-white border border-rose-300 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Permanen</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};