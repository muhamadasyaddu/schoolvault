/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import type { EventItem } from '../types';
import { Calendar, ChevronRight, FileText, Image as ImageIcon, MapPin, Sparkles } from 'lucide-react';

interface TimelineViewProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ events, onSelectEvent }) => {
  const years = [2026, 2025, 2024];
  const [selectedYear, setSelectedYear] = useState<number | 'ALL'>(2026);

  const filteredEvents = events.filter((e) => {
    if (e.isDeleted) return false;
    if (selectedYear === 'ALL') return true;
    return e.year === selectedYear;
  });

  // Sort descending by startDate
  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Explainer */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Fitur Signature: Digital Institutional Memory</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Timeline Memori Digital Sekolah
        </h2>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Arsip institusi tidak boleh hilang ketika ketua OSIS atau panitia lulus. Telusuri seluruh rangkaian kegiatan, proposal, SK, dan dokumentasi sekolah dari tahun ke tahun.
        </p>

        {/* Year Selector Tabs */}
        <div className="flex items-center gap-2 pt-4">
          <button
            onClick={() => setSelectedYear('ALL')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              selectedYear === 'ALL'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Semua Tahun
          </button>
          {years.map((y) => {
            const count = events.filter((e) => e.year === y && !e.isDeleted).length;
            return (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  selectedYear === y
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>Tahun {y}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded font-mono tabular-nums ${
                  selectedYear === y ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vertical Timeline Nodes */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-indigo-200 space-y-8">
        {sortedEvents.map((evt) => (
          <div key={evt.id} className="relative group">
            {/* Timeline Dot Node */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-4 w-4 h-4 rounded-full bg-white border-4 border-indigo-600 group-hover:scale-125 transition-transform" />

            <div
              onClick={() => onSelectEvent(evt)}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between gap-2 text-xs text-slate-500 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {evt.id}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-slate-700">{evt.categoryName}</span>
                  <span aria-hidden="true">·</span>
                  <span>Tahun Ajaran {evt.academicYear}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{evt.startDate} — {evt.endDate}</span>
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {evt.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {evt.description}
                </p>
              </div>

              {/* Bottom Quick Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 flex-wrap gap-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{evt.location}</span>
                  </div>
                  <div className="text-slate-700 font-medium">
                    Penyelenggara: {evt.organizer}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 tabular-nums text-slate-600">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    {evt.documents.length} Dokumen
                  </span>
                  <span className="inline-flex items-center gap-1 tabular-nums text-slate-600">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                    {evt.media.length} Foto/Video
                  </span>
                  <span className="inline-flex items-center gap-0.5 font-semibold text-indigo-600">
                    <span>Lihat Detail</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};