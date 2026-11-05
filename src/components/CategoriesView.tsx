/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import type { Category, EventItem } from '../types';
import { Tag, Folder, Hash, ArrowRight } from 'lucide-react';

interface CategoriesViewProps {
  categories: Category[];
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onFilterByTag?: (tag: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  events,
  onSelectEvent,
  onFilterByTag,
}) => {
  const [selectedCatId, setSelectedCatId] = useState<string>('cat-1');

  // Extract all unique tags and their frequency
  const tagCountMap: Record<string, number> = {};
  events.forEach((evt) => {
    if (!evt.isDeleted) {
      evt.tags.forEach((t) => {
        tagCountMap[t] = (tagCountMap[t] || 0) + 1;
      });
    }
  });

  const allTags = Object.entries(tagCountMap).map(([tag, count]) => ({
    name: tag,
    count,
  })).sort((a, b) => b.count - a.count);

  const currentCategory = categories.find((c) => c.id === selectedCatId) || categories[0];
  const eventsInCat = events.filter((e) => e.categoryId === selectedCatId && !e.isDeleted);

  const groups: Array<Category['group']> = [
    'Kegiatan Sekolah',
    'Organisasi',
    'Akademik',
    'Administrasi',
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
          <Tag className="w-4 h-4" />
          <span>Taksonomi & Pengelompokan Arsip</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Kategori & Sistem Tag Sekolah
        </h2>
        <p className="text-sm text-slate-600">
          Struktur taksonomi terstandar memastikan setiap arsip kegiatan dan dokumen dapat diklasifikasikan dengan konsisten dan mudah ditemukan kembali.
        </p>
      </div>

      {/* Tags Cloud Strip (§26 in prompt: Tagging) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
          <Hash className="w-4 h-4 text-indigo-600" />
          <span>Sistem Tagging Cepat (Klik untuk melihat arsip terkait)</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {allTags.map((t) => (
            <button
              key={t.name}
              onClick={() => onFilterByTag && onFilterByTag(t.name)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 transition-colors flex items-center gap-1.5"
            >
              <span>{t.name}</span>
              <span className="text-[10px] font-mono bg-white px-1.5 py-0.2 rounded border border-slate-200 text-slate-500 tabular-nums">
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Categories Section (§27 in prompt) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Category Groups */}
        <div className="lg:col-span-5 space-y-4">
          {groups.map((group) => {
            const groupCats = categories.filter((c) => c.group === group);
            return (
              <div key={group} className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {group}
                </div>
                <div className="space-y-1">
                  {groupCats.map((cat) => {
                    const count = events.filter((e) => e.categoryId === cat.id && !e.isDeleted).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCatId(cat.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                          selectedCatId === cat.id
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Folder className="w-3.5 h-3.5 opacity-70" />
                          <span>{cat.name}</span>
                        </div>
                        <span className={`text-[10px] font-mono tabular-nums px-1.5 py-0.2 rounded ${
                          selectedCatId === cat.id ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Events in Selected Category */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">{currentCategory.name}</h3>
              <p className="text-xs text-slate-500">Kelompok: {currentCategory.group}</p>
            </div>
            <span className="text-xs font-semibold text-slate-500 font-mono tabular-nums">
              {eventsInCat.length} Arsip
            </span>
          </div>

          {eventsInCat.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Belum ada kegiatan dalam kategori ini.
            </div>
          ) : (
            <div className="space-y-3">
              {eventsInCat.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => onSelectEvent(evt)}
                  className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono font-bold text-indigo-700">{evt.id}</span>
                    <span className="tabular-nums">Tahun Ajaran {evt.academicYear}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {evt.title}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-1">{evt.description}</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>{evt.organizer} · {evt.responsiblePerson}</span>
                    <span className="text-indigo-600 font-semibold flex items-center gap-0.5">
                      Lihat Rincian <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};