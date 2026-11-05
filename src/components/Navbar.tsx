
import React from 'react';
import type { User, UserRole } from '../types';
import { Plus, UserCheck, BookOpen } from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  users: User[];
  onSelectUser: (user: User) => void;
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  onCreateEventClick: () => void;
  onOpenGuideClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  users,
  onSelectUser,
  activeTab,
  onNavigateTab,
  onCreateEventClick,
  onOpenGuideClick,
}) => {
  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin (TU)';
      case 'admin_arsip':
        return 'Admin Arsip';
      case 'contributor':
        return 'Contributor (OSIS)';
      case 'viewer':
        return 'Viewer (Publik)';
      default:
        return 'Pengguna';
    }
  };

  const canCreate = [
    'super_admin',
    'admin_arsip',
    'contributor',
  ].includes(currentUser.role);

  const navigation = [
    { id: 'dashboard', label: 'Semua Arsip' },
    { id: 'timeline', label: 'Timeline Sekolah' },
    { id: 'verification', label: 'Verifikasi' },
    { id: 'documents', label: 'Dokumen' },
    { id: 'statistics', label: 'Statistik' },
  ];

  return (
    <header className="sv-navbar sticky top-0 z-30">
      <div className="sv-navbar-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sv-navbar-content">

          {/* BRAND */}
          <button
            type="button"
            onClick={() => onNavigateTab('dashboard')}
            className="sv-brand"
            aria-label="SchoolVault - kembali ke semua arsip"
          >
            
            <img
            src="/logo-sekolah.png"
            alt="Logo resmi SMK Informatika Utama"
            className="sv-brand-logo"
            width="52"
            height="52"
            />


            <span className="sv-brand-copy">
              <span className="sv-brand-name">
                SchoolVault
              </span>

              <span className="sv-brand-caption">
                INSTITUTIONAL ARCHIVE
              </span>
            </span>
          </button>

          {/* MAIN NAVIGATION */}
          <nav
            className="sv-top-navigation"
            aria-label="Navigasi utama"
          >
            {navigation.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigateTab(item.id)}
                className={
                  activeTab === item.id
                    ? 'sv-top-link active'
                    : 'sv-top-link'
                }
              >
                {item.label}
              </button>
            ))}

            <button
              type="button"
              onClick={onOpenGuideClick}
              className={
                activeTab === 'guide'
                  ? 'sv-top-link sv-guide-link active'
                  : 'sv-top-link sv-guide-link'
              }
            >
              <BookOpen size={15} />
              Panduan
            </button>
          </nav>

          {/* ACCOUNT AND ACTIONS */}
          <div className="sv-navbar-actions">

            <label className="sv-role-label">
              <span>Mode demo</span>

              <select
                aria-label="Pilih akun simulasi"
                value={currentUser.id}
                onChange={(e) => {
                  const target = users.find(
                    (user) => user.id === e.target.value
                  );

                  if (target) {
                    onSelectUser(target);
                  }
                }}
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({getRoleLabel(user.role)})
                  </option>
                ))}
              </select>
            </label>

            {canCreate ? (
              <button
                type="button"
                onClick={onCreateEventClick}
                className="sv-create-button"
              >
                <Plus size={17} strokeWidth={2} />
                <span>Buat Kegiatan</span>
              </button>
            ) : (
              <div className="sv-viewer-indicator">
                <UserCheck size={15} />
                <span>Mode Baca</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};