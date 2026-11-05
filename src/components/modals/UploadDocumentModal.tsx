/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import type { DocumentType, Visibility } from '../../types';
import { X, Upload, FileText } from 'lucide-react';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  onUpload: (docData: {
    title: string;
    docType: DocumentType;
    description: string;
    changeNote: string;
    visibility: Visibility;
    fileName: string;
    fileSize: string;
  }) => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  onUpload,
}) => {
  const [docType, setDocType] = useState<DocumentType>('Proposal');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [changeNote, setChangeNote] = useState('Draf awal diajukan panitia');
  const [visibility, setVisibility] = useState<Visibility>('PUBLIC');
  const [fileName, setFileName] = useState('Berkas_Dokumen.pdf');
  const [fileSize, setFileSize] = useState('2.4 MB');

  if (!isOpen) return null;

  const docTypes: DocumentType[] = [
    'Proposal',
    'Surat Izin',
    'SK Panitia',
    'Susunan Panitia',
    'Jadwal',
    'Laporan Akhir',
    'Sertifikat',
    'Lainnya',
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFileName(f.name);
      const sizeMb = (f.size / (1024 * 1024)).toFixed(1);
      setFileSize(`${sizeMb} MB`);
      if (!title) {
        setTitle(f.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onUpload({
      title: title.trim(),
      docType,
      description: description.trim() || `Dokumen ${docType} untuk kegiatan ${eventTitle}`,
      changeNote: changeNote.trim() || 'Versi awal',
      visibility,
      fileName,
      fileSize,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-600" />
              <span>Unggah Dokumen Arsip</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-sm">
              Terkait: {eventId} · {eventTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Pilih Berkas File (PDF, DOCX, XLSX, ZIP)
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-4 text-center cursor-pointer bg-slate-50 relative">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xlsx,.xls,.zip"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <FileText className="w-8 h-8 text-indigo-500 mx-auto mb-1" />
              <div className="font-semibold text-slate-800">{fileName}</div>
              <div className="text-[11px] text-slate-400">Ukuran: {fileSize} · Klik untuk ganti berkas</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jenis Dokumen <span className="text-rose-500">*</span>
              </label>
              <select
                aria-label="Pilih Jenis Dokumen"
                value={docType}
                onChange={(e) => setDocType(e.target.value as DocumentType)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {docTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Hak Akses Dokumen
              </label>
              <select
                aria-label="Pilih Hak Akses Dokumen"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as Visibility)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="PUBLIC">Publik (Warga Sekolah)</option>
                <option value="INTERNAL">Internal Terbatas (Panitia & Guru)</option>
                <option value="RESTRICTED">Restricted (TU / Pimpinan)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Judul Dokumen Resmi <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Proposal Kegiatan Classmeeting Semester Ganjil 2026"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Deskripsi Singkat Dokumen
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan isi pokok dokumen ini..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Catatan Perubahan Versi 1
            </label>
            <input
              type="text"
              value={changeNote}
              onChange={(e) => setChangeNote(e.target.value)}
              placeholder="Contoh: Draf pertama diajukan untuk verifikasi anggaran..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm"
            >
              Simpan Dokumen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};