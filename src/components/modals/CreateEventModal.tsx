
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import type { Category, EventItem, User, Visibility } from '../../types';
import { X } from 'lucide-react';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  currentUser: User;
  onCreateEvent: (
    newEvent: Omit<EventItem, 'id' | 'createdAt' | 'documents' | 'media'>
  ) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  categories,
  currentUser,
  onCreateEvent,
}) => {
  // Form states
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(
    categories[0]?.id || 'cat-1'
  );
  const [startDate, setStartDate] = useState('2026-09-10');
  const [endDate, setEndDate] = useState('2026-09-12');
  const [location, setLocation] = useState(
    'Lapangan Utama & Aula Sekolah'
  );
  const [organizer, setOrganizer] = useState('OSIS');
  const [responsiblePerson, setResponsiblePerson] = useState(
    currentUser.name
  );
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('PUBLIC');
  const [tagInput, setTagInput] = useState('#OSIS, #Kegiatan2026');

  // Semua Hooks harus dipanggil sebelum conditional return.
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    // Ambil kategori yang dipilih.
    const selectedCat = categories.find(
      (category) => category.id === categoryId
    );

    // Bersihkan dan format tag.
    const tags = tagInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
      .map((tag) =>
        tag.startsWith('#') ? tag : `#${tag}`
      );

    // Tentukan tahun kegiatan berdasarkan tanggal mulai.
    const year = parseInt(startDate.slice(0, 4), 10) || 2026;
    const academicYear = `${year}/${year + 1}`;

    // Kirim data kegiatan ke komponen utama.
    onCreateEvent({
      title: title.trim(),
      description:
        description.trim() ||
        'Dokumentasi kegiatan resmi sekolah.',
      categoryId,
      categoryName: selectedCat
        ? selectedCat.name
        : 'Kegiatan Sekolah',
      academicYear,
      year,
      startDate,
      endDate,
      location: location.trim(),
      organizer: organizer.trim(),
      responsiblePerson: responsiblePerson.trim(),
      status: 'DRAFT',
      visibility,
      tags,
      createdBy: currentUser.name,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>+ Buat Kegiatan / Event Baru</span>
            </h3>

            <p className="text-xs text-slate-500">
              Isi informasi inti kegiatan. Dokumen & media dapat diunggah setelah kegiatan disimpan.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup formulir"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto text-xs"
        >
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Kegiatan <span className="text-rose-500">*</span>
            </label>

            <input
              type="text"
              required
              maxLength={150}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Classmeeting Semester Ganjil 2026"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kategori Kegiatan
              </label>

              <select
                aria-label="Kategori Kegiatan"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.group})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Hak Akses Dokumen (Visibility)
              </label>

              <select
                aria-label="Tingkat Hak Akses"
                value={visibility}
                onChange={(e) =>
                  setVisibility(e.target.value as Visibility)
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
              >
                <option value="PUBLIC">
                  Public (Seluruh Warga Sekolah)
                </option>
                <option value="INTERNAL">
                  Internal Terbatas (Guru & Panitia)
                </option>
                <option value="RESTRICTED">
                  Restricted (TU & Kepala Sekolah)
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tanggal Mulai
              </label>

              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tanggal Selesai
              </label>

              <input
                type="date"
                required
                min={startDate}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Lokasi Pelaksanaan
              </label>

              <input
                type="text"
                maxLength={200}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Lapangan Utama / Aula / GOR"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Penyelenggara
              </label>

              <input
                type="text"
                maxLength={150}
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder="OSIS / Pramuka / Kurikulum"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Penanggung Jawab (PJ)
            </label>

            <input
              type="text"
              maxLength={150}
              value={responsiblePerson}
              onChange={(e) =>
                setResponsiblePerson(e.target.value)
              }
              placeholder="Nama penanggung jawab kegiatan..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Deskripsi Singkat
            </label>

            <textarea
              rows={3}
              maxLength={2000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan tujuan dan lingkup kegiatan..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tag / Label (Pisahkan dengan koma)
            </label>

            <input
              type="text"
              maxLength={500}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="#OSIS, #Classmeeting, #Futsal"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Buttons */}
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
              Simpan & Buat Kegiatan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};