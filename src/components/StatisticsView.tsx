/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { EventItem, Category } from '../types';
import { BarChart3, CheckCircle } from 'lucide-react';

interface StatisticsViewProps {
  events: EventItem[];
  categories: Category[];
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({ events, categories }) => {
  const activeEvents = events.filter((e) => !e.isDeleted);

  const totalDocuments = activeEvents.reduce((acc, e) => acc + e.documents.length, 0);
  const totalPhotos = activeEvents.reduce(
    (acc, e) => acc + e.media.filter((m) => m.type === 'photo').length,
    0
  );
  const totalVideos = activeEvents.reduce(
    (acc, e) => acc + e.media.filter((m) => m.type === 'video').length,
    0
  );
  const totalArchives = activeEvents.length + totalDocuments + totalPhotos + totalVideos;

  // By Year
  const yearStats = [
    { year: 2026, count: activeEvents.filter((e) => e.year === 2026).length, max: 10 },
    { year: 2025, count: activeEvents.filter((e) => e.year === 2025).length, max: 10 },
    { year: 2024, count: activeEvents.filter((e) => e.year === 2024).length, max: 10 },
  ];

  // By Category
  const categoryStats = categories.map((cat) => {
    const count = activeEvents.filter((e) => e.categoryId === cat.id).length;
    return { name: cat.name, count, group: cat.group };
  }).sort((a, b) => b.count - a.count);

  const approvedCount = activeEvents.filter((e) => e.status === 'APPROVED').length;
  const pendingCount = activeEvents.filter((e) => e.status === 'PENDING_REVIEW').length;
  const draftCount = activeEvents.filter((e) => e.status === 'DRAFT').length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
          <BarChart3 className="w-4 h-4" />
          <span>Statistik Memori Institusi</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Ringkasan & Analisis Data SchoolVault
        </h2>
        <p className="text-sm text-slate-600">
          Metrik pertumbuhan arsip digital sekolah yang mencerminkan kesinambungan dokumentasi kegiatan lintas tahun ajaran.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <div className="text-xs text-slate-400 font-medium">Total Item Arsip</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {totalArchives}
          </div>
          <div className="text-[11px] text-slate-500">Berkas & media terindeks</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <div className="text-xs text-slate-400 font-medium">Kegiatan / Event</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 font-mono tabular-nums">
            {activeEvents.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>{approvedCount} Resmi disahkan</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <div className="text-xs text-slate-400 font-medium">Dokumen (PDF/DOC)</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {totalDocuments}
          </div>
          <div className="text-[11px] text-slate-500">Proposal, SK, LPJ, Izin</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <div className="text-xs text-slate-400 font-medium">Foto Dokumentasi</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {totalPhotos}
          </div>
          <div className="text-[11px] text-slate-500">Dengan nama fotografer</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 col-span-2 lg:col-span-1">
          <div className="text-xs text-slate-400 font-medium">Video Liputan</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {totalVideos}
          </div>
          <div className="text-[11px] text-slate-500">High definition preview</div>
        </div>
      </div>

      {/* Two Column Visual Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Arsip Per Tahun Bar Section */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Arsip Berdasarkan Tahun</h3>
            <span className="text-xs text-slate-400">2024 - 2026</span>
          </div>
          <div className="space-y-4 pt-2">
            {yearStats.map((item) => {
              const percentage = Math.round((item.count / 10) * 100);
              return (
                <div key={item.year} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Tahun Ajaran {item.year}</span>
                    <span className="font-mono tabular-nums">{item.count} Kegiatan</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 15)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Arsip Per Kategori */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Arsip Berdasarkan Kategori</h3>
            <span className="text-xs text-slate-400">Distribusi Bidang</span>
          </div>
          <div className="space-y-3 pt-2">
            {categoryStats.slice(0, 6).map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                <div>
                  <span className="font-semibold text-slate-800">{cat.name}</span>
                  <span className="text-slate-400 text-[11px] ml-2">({cat.group})</span>
                </div>
                <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded tabular-nums">
                  {cat.count} Kegiatan
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verification Health Status */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Status Pipeline Pengarsipan</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="text-emerald-800 font-bold mb-1">Arsip Resmi (Approved)</div>
            <div className="text-2xl font-extrabold text-emerald-900 font-mono tabular-nums">{approvedCount}</div>
            <p className="text-[11px] text-emerald-700 mt-1">Lengkap dokumen & telah divalidasi admin arsip.</p>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="text-amber-800 font-bold mb-1">Menunggu Review (Pending)</div>
            <div className="text-2xl font-extrabold text-amber-900 font-mono tabular-nums">{pendingCount}</div>
            <p className="text-[11px] text-amber-700 mt-1">Draf selesai diajukan oleh panitia/OSIS.</p>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="text-slate-700 font-bold mb-1">Draf Aktif (Penyusunan)</div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">{draftCount}</div>
            <p className="text-[11px] text-slate-500 mt-1">Sedang dilengkapi berkas pendukungnya.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
