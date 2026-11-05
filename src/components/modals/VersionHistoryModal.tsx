/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import type { DocumentItem } from '../../types';
import { X, History, FileText, Download, Upload, CheckCircle2, Clock } from 'lucide-react';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentItem | null;
  onAddVersion: (docId: string, newVersion: {
    fileName: string;
    fileSize: string;
    changeNote: string;
  }) => void;
  onPreviewVersion: (fileName: string) => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  document,
  onAddVersion,
  onPreviewVersion,
}) => {
  const [isUploadingNew, setIsUploadingNew] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newFileName, setNewFileName] = useState(() =>
    document
      ? `${document.title.replace(/\s+/g, '_')}_v${document.versions.length + 1}.pdf`
      : 'dokumen_v2.pdf'
  );

  const newFileSize = '2.3 MB';

  if (!isOpen || !document) return null;

  const handleAddNewVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    onAddVersion(document.id, {
      fileName: newFileName,
      fileSize: newFileSize,
      changeNote: newNote.trim(),
    });

    setIsUploadingNew(false);
    setNewNote('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-600" />
              <span>Riwayat Versi Dokumen (Version History)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {document.title} · Versi Aktif: V{document.currentVersion}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Versions Timeline List */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-indigo-900 text-xs">
            <span className="font-bold">Prinsip Kearsipan Institusi:</span> File lama tidak ditimpa (overwritten), melainkan diarsipkan sebagai riwayat revisi berurutan untuk audit akuntabilitas.
          </div>

          <div className="relative pl-6 border-l-2 border-indigo-200 space-y-6">
            {document.versions.slice().reverse().map((ver, idx) => {
              const isLatest = idx === 0;
              return (
                <div key={ver.id} className="relative group">
                  {/* Dot */}
                  <div
                    className={`absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 ${
                      isLatest
                        ? 'bg-indigo-600 border-indigo-200'
                        : 'bg-white border-slate-400'
                    }`}
                  />

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 font-mono text-xs bg-white px-2 py-0.5 rounded border border-slate-200">
                          Versi {ver.versionNumber}
                        </span>
                        {isLatest && (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Versi Resmi Saat Ini</span>
                          </span>
                        )}
                        <span className="text-slate-400 tabular-nums">· {ver.fileSize}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{ver.uploadedAt} oleh {ver.uploadedBy}</span>
                      </div>
                    </div>

                    <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{ver.fileName}</span>
                    </div>

                    {ver.changeNote && (
                      <div className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/60 text-xs italic">
                        "{ver.changeNote}"
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => onPreviewVersion(ver.fileName)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Unduh Versi Ini</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Upload New Version Form Toggle */}
          <div className="pt-4 border-t border-slate-200">
            {!isUploadingNew ? (
              <button
                onClick={() => setIsUploadingNew(true)}
                className="w-full py-2.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>+ Unggah Revisi Baru (Versi {document.versions.length + 1})</span>
              </button>
            ) : (
              <form onSubmit={handleAddNewVersion} className="bg-slate-50 border border-indigo-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs">
                    Form Unggah Revisi (Versi {document.versions.length + 1})
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsUploadingNew(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                  >
                    Batal
                  </button>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama File Baru:
                  </label>
                  <input
                    type="text"
                    required
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Catatan Perubahan (Wajib diisi untuk audit):
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Contoh: Perubahan anggaran babak final futsal dan pergantian ketua pelaksana..."
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsUploadingNew(false)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                  >
                    Simpan Revisi V{document.versions.length + 1}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
