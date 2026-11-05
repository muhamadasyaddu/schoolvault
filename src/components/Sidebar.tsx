/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  FolderArchive,
  Calendar,
  FileText,
  Image as ImageIcon,
  Tag,
  BarChart3,
  ShieldAlert,
  Trash2,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import type { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  pendingCount: number;
  trashCount: number;
  userRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onNavigateTab,
  pendingCount,
  trashCount,
  userRole,
}) => {
  const isSuperAdmin = userRole === 'super_admin';
  const isAdminArsip = userRole === 'admin_arsip' || isSuperAdmin;

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Navigation Group 1: Inti Arsip */}
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Manajemen Arsip
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => onNavigateTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FolderArchive className="w-4 h-4 text-slate-500" />
              <span>Semua Arsip</span>
            </button>

            <button
              onClick={() => onNavigateTab('timeline')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${
                activeTab === 'timeline'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Timeline Sekolah</span>
            </button>

            {isAdminArsip && (
              <button
                onClick={() => onNavigateTab('verification')}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${
                  activeTab === 'verification'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-slate-500" />
                  <span>Antrean Verifikasi</span>
                </div>
                {pendingCount > 0 && (
                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 tabular-nums">
                    {pendingCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => onNavigateTab('documents')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${
                activeTab === 'documents'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Dokumen</span>
            </button>

            <button
              onClick={() => onNavigateTab('media')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${
                activeTab === 'media'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-slate-500" />
              <span>Media (Foto/Video)</span>
            </button>
          </nav>
        </div>

        {/* Navigation Group 2: Eksplorasi & Analisis */}
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Organisasi & Data
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => onNavigateTab('categories')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${
                activeTab === 'categories'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Tag className="w-4 h-4 text-slate-500" />
              <span>Kategori & Tag</span>
            </button>

            <button
              onClick={() => onNavigateTab('statistics')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${
                activeTab === 'statistics'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-slate-500" />
              <span>Statistik Arsip</span>
            </button>

            {isSuperAdmin && (
              <button
                onClick={() => onNavigateTab('audit')}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${
                  activeTab === 'audit'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-slate-500" />
                <span>Audit Log</span>
              </button>
            )}

            {isSuperAdmin && (
              <button
                onClick={() => onNavigateTab('trash')}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${
                  activeTab === 'trash'
                    ? 'bg-rose-50 text-rose-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Trash2 className="w-4 h-4 text-slate-500" />
                  <span>Recycle Bin</span>
                </div>
                {trashCount > 0 && (
                  <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 tabular-nums">
                    {trashCount}
                  </span>
                )}
              </button>
            )}
          </nav>
        </div>

        {/* Navigation Group 3: Panduan Ujian RPL */}
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Dokumentasi Teknis
          </div>
          <button
            onClick={() => onNavigateTab('guide')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left border ${
              activeTab === 'guide'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'border-indigo-100 bg-indigo-50/50 text-indigo-700 hover:bg-indigo-100/60'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <div className="truncate">
              <span className="font-semibold block leading-tight">Panduan</span>
              <span className="text-[11px] opacity-80 block">Langkah & Skema Database</span>
            </div>
          </button>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-1">
        <div className="font-medium text-slate-700">SMK Informatika Utama</div>
        <div>Sistem Memori Digital Sekolah</div>
        <div className="text-[11px] text-slate-400 tabular-nums">Arsip Aktif: 2024–2027</div>
      </div>
    </aside>
  );
};