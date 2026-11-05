/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { EventItem } from '../types';
import { Calendar, MapPin, FileText, Image as ImageIcon, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface EventCardProps {
  event: EventItem;
  onSelect: (event: EventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelect }) => {
  const getStatusDisplay = () => {
    switch (event.status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Arsip Resmi</span>
          </span>
        );
      case 'PENDING_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
            <Clock className="w-3.5 h-3.5" />
            <span>Menunggu Review</span>
          </span>
        );
      case 'REVISION':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Perlu Revisi</span>
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
            <span>Draf Panitia</span>
          </span>
        );
      case 'ARCHIVED':
        return <span className="text-xs font-medium text-slate-500">Diarsipkan</span>;
      default:
        return null;
    }
  };

  const getVisibilityDisplay = () => {
    if (event.visibility === 'PUBLIC') return 'Publik';
    if (event.visibility === 'INTERNAL') return 'Internal Sekolah';
    return 'Terbatas';
  };

  return (
    <div
      onClick={() => onSelect(event)}
      className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
    >
      <div>
        {/* Top unboxed metadata line */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono text-[11px] text-slate-400 font-semibold">{event.id}</span>
            <span aria-hidden="true">·</span>
            <span>{event.categoryName}</span>
            <span aria-hidden="true">·</span>
            <span>{getVisibilityDisplay()}</span>
          </div>
          <div>{getStatusDisplay()}</div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {event.description}
        </p>
      </div>

      <div className="space-y-3 pt-3 border-t border-slate-100">
        {/* Date & Location */}
        <div className="flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{event.startDate} — {event.endDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate max-w-[140px]">{event.location}</span>
          </div>
        </div>

        {/* Organizer & Files Count */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <div className="font-medium text-slate-700">
            {event.organizer} <span className="font-normal text-slate-400">({event.responsiblePerson})</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 tabular-nums">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              {event.documents.length} Dokumen
            </span>
            <span className="inline-flex items-center gap-1 tabular-nums">
              <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
              {event.media.length} Media
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};