/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import type { EventItem, DocumentItem, DocumentType } from '../types';
import { FileText, Search, Download, Eye, History } from 'lucide-react';

interface DocumentsViewProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onPreviewDocument: (doc: DocumentItem) => void;
  onOpenVersionHistory: (doc: DocumentItem) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  events,
  onSelectEvent,
  onPreviewDocument,
  onOpenVersionHistory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedVisibility, setSelectedVisibility] = useState<string>('ALL');

  // Flatten all documents with their event context
  const allDocs = events.flatMap((event) =>
    event.documents.map((doc) => ({
      ...doc,
      eventTitle: event.title,
      eventYear: event.year,
      academicYear: event.academicYear,
      eventCategory: event.categoryName,
      event,
    }))
  );

  const docTypes: DocumentType[] = [
    'Proposal',
    'Surat Izin',
    'SK Panitia',
    'Laporan Akhir',
    'Sertifikat',
  ];

  const filteredDocs = allDocs.filter((item) => {
    if (selectedType !== 'ALL' && item.docType !== selectedType) return false;
    if (selectedYear !== 'ALL' && item.eventYear.toString() !== selectedYear) return false;
    if (selectedVisibility !== 'ALL' && item.visibility !== selectedVisibility) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchEvent = item.eventTitle.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchType = item.docType.toLowerCase().includes(q);
      if (!matchTitle && !matchEvent && !matchDesc && !matchType) return false;
    }

    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Explorer Dokumen Sekolah
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Pusat penelusuran seluruh proposal, surat keputusan (SK), izin, laporan pertanggungjawaban (LPJ), dan sertifikat kegiatan dari tahun ke tahun.
          </p>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama dokumen / kegiatan..."
              className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Doc Type Selector */}
          <div>
            <select
              aria-label="Filter Jenis Dokumen"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">Semua Jenis Dokumen</option>
              {docTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Year Selector */}
          <div>
            <select
              aria-label="Filter Tahun Arsip"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">Semua Tahun (2024–2026)</option>
              <option value="2026">Tahun 2026</option>
              <option value="2025">Tahun 2025</option>
              <option value="2024">Tahun 2024</option>
            </select>
          </div>

          {/* Visibility Selector */}
          <div>
            <select
              aria-label="Filter Hak Akses"
              value={selectedVisibility}
              onChange={(e) => setSelectedVisibility(e.target.value)}
              className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">Semua Tingkat Akses</option>
              <option value="PUBLIC">Publik (Warga Sekolah)</option>
              <option value="INTERNAL">Internal Terbatas</option>
              <option value="RESTRICTED">Restricted (TU & Pimpinan)</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-xs text-slate-500 pt-1 flex items-center justify-between">
          <span className="tabular-nums">Menampilkan {filteredDocs.length} berkas dokumen</span>
          {(searchQuery || selectedType !== 'ALL' || selectedYear !== 'ALL' || selectedVisibility !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('ALL');
                setSelectedYear('ALL');
                setSelectedVisibility('ALL');
              }}
              className="text-xs text-indigo-600 hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Documents Table/List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 shadow-xs">
        {filteredDocs.length === 0 ? (
          <div className="text-center py-12 p-8">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-800">Dokumen Tidak Ditemukan</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Coba sesuaikan kata kunci pencarian atau bersihkan filter yang aktif.
            </p>
          </div>
        ) : (
          filteredDocs.map((doc) => {
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
                      <span className="tabular-nums">{latestVer?.fileSize || '2 MB'}</span>
                      <span aria-hidden="true">·</span>
                      <span>Tahun {doc.eventYear}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mt-1">
                      {doc.title}
                    </h4>

                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
                      <span>Kegiatan:</span>
                      <button
                        onClick={() => onSelectEvent(doc.event)}
                        className="font-semibold text-slate-700 hover:text-indigo-600 hover:underline"
                      >
                        {doc.eventTitle}
                      </button>
                    </div>

                    {latestVer?.changeNote && (
                      <div className="text-[11px] text-slate-400 italic mt-0.5">
                        "{latestVer.changeNote}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onOpenVersionHistory(doc)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 hover:border-indigo-300 transition-colors"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>Versi (V{doc.versions.length})</span>
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
          })
        )}
      </div>
    </div>
  );
};