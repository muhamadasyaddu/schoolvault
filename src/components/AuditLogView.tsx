/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import type { AuditLog } from '../types';
import { ShieldAlert, Search, CheckCircle, AlertTriangle, FileUp, PlusCircle } from 'lucide-react';

interface AuditLogViewProps {
  logs: AuditLog[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs }) => {
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter((log) => {
    if (filterAction !== 'ALL' && log.action !== filterAction) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchUser = log.userName.toLowerCase().includes(q);
      const matchTitle = log.entityTitle.toLowerCase().includes(q);
      const matchDesc = log.description.toLowerCase().includes(q);
      const matchIp = log.ipAddress.includes(q);
      if (!matchUser && !matchTitle && !matchDesc && !matchIp) return false;
    }
    return true;
  });

  const getActionBadge = (action: AuditLog['action']) => {
    switch (action) {
      case 'CREATE':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
            <PlusCircle className="w-3 h-3" />
            <span>CREATE</span>
          </span>
        );
      case 'UPLOAD':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
            <FileUp className="w-3 h-3" />
            <span>UPLOAD</span>
          </span>
        );
      case 'VERIFY_APPROVE':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            <CheckCircle className="w-3 h-3" />
            <span>APPROVE</span>
          </span>
        );
      case 'VERIFY_REJECT':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
            <AlertTriangle className="w-3 h-3" />
            <span>REJECT / REVISI</span>
          </span>
        );
      case 'DELETE':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
            <span>SOFT DELETE</span>
          </span>
        );
      case 'RESTORE':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
            <span>RESTORE</span>
          </span>
        );
      default:
        return (
          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            {action}
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>Fitur Signature: Audit Trail & Integritas Data</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Audit Log Sistem Kearsipan
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Semua aktivitas pencatatan, perubahan draf, unggahan berkas, verifikasi persetujuan, dan penghapusan arsip dicatat secara kronologis untuk menjamin akuntabilitas institusi.
        </p>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama pengguna, dokumen, IP..."
              className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              aria-label="Filter Jenis Aksi"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">Semua Jenis Aksi</option>
              <option value="CREATE">Pembuatan Baru (CREATE)</option>
              <option value="UPLOAD">Unggah File (UPLOAD)</option>
              <option value="VERIFY_APPROVE">Disetujui (APPROVE)</option>
              <option value="VERIFY_REJECT">Kembali Revisi (REJECT)</option>
              <option value="DELETE">Penghapusan (DELETE)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Waktu & IP</th>
                <th className="px-5 py-3.5">Pengguna</th>
                <th className="px-5 py-3.5">Aksi</th>
                <th className="px-5 py-3.5">Target Entitas</th>
                <th className="px-5 py-3.5">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="font-semibold text-slate-800 tabular-nums">
                      {log.timestamp}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      IP: {log.ipAddress}
                    </div>
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="font-bold text-slate-900">{log.userName}</div>
                    <div className="text-[11px] text-slate-400 capitalize">
                      {log.userRole.replace('_', ' ')}
                    </div>
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap">
                    {getActionBadge(log.action)}
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-800 line-clamp-1">
                      {log.entityTitle}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      {log.entityType} ({log.entityId})
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate">
                    {log.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};