/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { DocumentItem } from '../../types';
import { X, Download, FileText, ShieldCheck } from 'lucide-react';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentItem | null;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  document,
}) => {
  if (!isOpen || !document) return null;

  const latestVersion = document.versions[document.versions.length - 1];

  const handleDownload = () => {
    // Generate a downloadable text/blob representation
    const content = `DOKUMEN RESMI SEKOLAH - SCHOOLVAULT
==================================================
Judul: ${document.title}
Jenis: ${document.docType}
Identifier: ${document.id}
Versi: V${document.currentVersion}
Hak Akses: ${document.visibility}
Tanggal Pengesahan: ${document.updatedAt}
Diunggah oleh: ${document.uploadedBy}

DESKRIPSI:
${document.description}

RIWAYAT REVISI:
${document.versions.map((v) => `- Versi ${v.versionNumber} (${v.uploadedAt}): ${v.changeNote}`).join('\n')}

Catatan Kearsipan: Dokumen ini telah divalidasi dan diarsipkan secara digital dalam SchoolVault SMK Informatika Utama.
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = latestVersion ? latestVersion.fileName : `${document.title}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top bar */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-xs font-mono font-medium text-slate-300">
              {latestVersion?.fileName || 'Dokumen.pdf'}
            </span>
            <span className="text-xs bg-slate-800 text-indigo-300 px-2 py-0.5 rounded font-mono">
              V{document.currentVersion}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Berkas</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Simulation Sheet */}
        <div className="p-8 sm:p-12 overflow-y-auto bg-slate-100 flex justify-center">
          <div className="max-w-2xl w-full bg-white shadow-md border border-slate-200 rounded-sm p-8 sm:p-12 space-y-6 text-slate-900 font-sans">
            {/* School Letterhead */}
            <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
              <div className="text-xs tracking-widest font-semibold uppercase text-slate-600">
                Pemerintah Daerah Provinsi Jawa Barat · Dinas Pendidikan
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold uppercase tracking-tight text-slate-900">
                SMK INFORMATIKA UTAMA
              </h2>
              <div className="text-[11px] text-slate-500">
                Jl. Cendekia No. 45, Kota Pendidikan · Telp: (021) 7890-1234 · Website: sekolah.sch.id
              </div>
            </div>

            {/* Document Header */}
            <div className="text-center py-2 space-y-1">
              <span className="text-[11px] font-mono font-bold text-slate-500 tracking-wider uppercase">
                {document.docType} RESMI INSTITUSI
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {document.title}
              </h3>
              <div className="text-xs text-slate-500 font-mono">
                Nomor Register: {document.id}/SV-ARCHIVE/{document.currentVersion}
              </div>
            </div>

            {/* Simulated Body Content */}
            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <p>
                <strong>I. LATAR BELAKANG & TUJUAN</strong><br />
                {document.description} Dokumen ini disusun dan diajukan sebagai pedoman pelaksanaan, legalitas perizinan, dan laporan pertanggungjawaban kegiatan resmi sekolah yang diselenggarakan oleh unit kesiswaan/organisasi terkait.
              </p>

              <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-800">Spesifikasi Metadata Berkas:</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>Tingkat Kerahasiaan: <span className="font-semibold">{document.visibility}</span></div>
                  <div>Versi Resmi: <span className="font-semibold font-mono">Versi {document.currentVersion}</span></div>
                  <div>Penanggung Jawab Unggah: <span className="font-semibold">{document.uploadedBy}</span></div>
                  <div>Ukuran Berkas: <span className="font-semibold">{latestVersion?.fileSize || '2 MB'}</span></div>
                </div>
              </div>

              <p>
                <strong>II. CATATAN PENGESAHAN DOKUMEN</strong><br />
                Seluruh klausul, rincian anggaran, dan susunan kepanitiaan dalam dokumen ini telah melalui proses verifikasi kearsipan internal dan disahkan sebagai arsip memori digital permanen sekolah.
              </p>
            </div>

            {/* Official Signature Blocks */}
            <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-6 text-center text-xs">
              <div>
                <div className="text-slate-500">Mengetahui,</div>
                <div className="font-semibold text-slate-800">Pembina Kearsipan / Guru</div>
                <div className="h-14 flex items-center justify-center">
                  <span className="font-serif italic text-indigo-700 text-sm font-bold">[Tanda Tangan Terverifikasi]</span>
                </div>
                <div className="font-bold text-slate-900">Dra. Rahmawati</div>
                <div className="text-[10px] text-slate-400 font-mono">NIP. 19780512 200501 2 004</div>
              </div>

              <div>
                <div className="text-slate-500">Penanggung Jawab Pelaksana,</div>
                <div className="font-semibold text-slate-800">Ketua Panitia Kegiatan</div>
                <div className="h-14 flex items-center justify-center">
                  <span className="font-serif italic text-indigo-700 text-sm font-bold">[Tanda Tangan Terverifikasi]</span>
                </div>
                <div className="font-bold text-slate-900">{document.uploadedBy}</div>
                <div className="text-[10px] text-slate-400 font-mono">NIS. 2024100452</div>
              </div>
            </div>

            {/* Digital Stamp / Verification seal */}
            <div className="p-3 bg-emerald-50 rounded border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold block">Tervalidasi Digital oleh SchoolVault</span>
                  <span className="text-[11px] text-emerald-700">Checksum SHA-256 Valid · Terintegrasi pada Sistem Memori Digital</span>
                </div>
              </div>
              <div className="text-[11px] font-mono text-emerald-900 font-semibold">
                SEAL-VERIFIED
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
