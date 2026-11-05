/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'super_admin' | 'admin_arsip' | 'contributor' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarText: string;
  department: string;
}

export type EventStatus = 'DRAFT' | 'PENDING_REVIEW' | 'REVISION' | 'APPROVED' | 'ARCHIVED' | 'TRASH';

export type Visibility = 'PUBLIC' | 'INTERNAL' | 'RESTRICTED';

export type DocumentType =
  | 'Proposal'
  | 'Surat Izin'
  | 'SK Panitia'
  | 'Susunan Panitia'
  | 'Jadwal'
  | 'Laporan Akhir'
  | 'Sertifikat'
  | 'Lainnya';

export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number; // 1, 2, 3...
  fileName: string;
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  changeNote: string;
}

export interface DocumentItem {
  id: string;
  eventId: string;
  category: string;
  title: string;
  docType: DocumentType;
  description: string;
  currentVersion: number;
  versions: DocumentVersion[];
  uploadedBy: string;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  visibility: Visibility;
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  eventId: string;
  title: string;
  type: 'photo' | 'video';
  thumbnailUrl: string;
  description: string;
  capturedAt: string;
  photographer: string;
  uploadedBy: string;
  fileSize: string;
  dimensions?: string;
  duration?: string;
  createdAt?: string;
}

export interface EventItem {
  id: string; // e.g. "EVT-2026-00021"
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  academicYear: string; // "2026/2027", "2025/2026", "2024/2025"
  year: number; // 2026, 2025, 2024
  startDate: string;
  endDate: string;
  location: string;
  organizer: string; // "OSIS", "Pramuka", "Kesiswaan", "Kurikulum"
  responsiblePerson: string;
  status: EventStatus;
  rejectionReason?: string;
  visibility: Visibility;
  tags: string[];
  createdBy: string;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  documents: DocumentItem[];
  media: MediaItem[];
  isDeleted?: boolean;
  deletedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  group: 'Kegiatan Sekolah' | 'Organisasi' | 'Akademik' | 'Administrasi';
  count: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: 'CREATE' | 'UPDATE' | 'UPLOAD' | 'VERIFY_APPROVE' | 'VERIFY_REJECT' | 'RESTORE' | 'DELETE' | 'DOWNLOAD';
  entityType: 'EVENT' | 'DOCUMENT' | 'MEDIA' | 'SYSTEM';
  entityId: string;
  entityTitle: string;
  description: string;
  ipAddress: string;
  timestamp: string;
}
