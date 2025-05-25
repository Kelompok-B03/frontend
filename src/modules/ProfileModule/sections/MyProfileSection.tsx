'use client';

import React, { useState, useEffect, FormEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { appColors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import axiosInstance from '@/utils/axiosInstance';
import { UserCircleIcon, PencilSquareIcon, CheckIcon, XMarkIcon as XMarkIconOutline } from '@heroicons/react/24/outline';
import UpdateUserDataRequest from '@/types/requests/UpdateUserDataRequest';

interface FormErrors {
  name?: string;
  phoneNumber?: string;
  bio?: string;
  profilePictureUrl?: string;
  general?: string;
}


const isValidHttpUrl = (string: string | undefined | null): boolean => {
  if (!string || !string.trim()) return false;
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;  
  }
};

const ProfileDisplayField = ({ label, value }: { label: string; value: string | number | undefined | null }) => (
  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium" style={{ color: appColors.textDarkMuted }}>{label}</dt>
    <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2 whitespace-pre-wrap break-words" style={{ color: appColors.textDark }}>{value || '-'}</dd>
  </div>
);

// Props untuk ModalEditField
interface ModalEditFieldProps {
  label: string;
  name: keyof UpdateUserDataRequest;
  type?: string;
  value?: string;
  error?: string;
  rows?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  disabled?: boolean;
  placeholder?: string;
}

const ModalEditField: React.FC<ModalEditFieldProps> = React.memo(({ label, name, type = 'text', value, error, rows, onChange, disabled, placeholder }) => {
  return (
    <div>
      <label htmlFor={`modal-${name}`} className="block text-sm font-medium mb-1" style={{ color: appColors.textDarkMuted }}>
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={`modal-${name}`}
          name={name}
          rows={rows || 3}
          className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm ${error ? 'border-red-500 ring-red-500' : 'focus:ring-babyTurquoiseAccent focus:border-babyTurquoiseAccent'}`}
          style={{ borderColor: error ? appColors.babyPinkAccent : appColors.lightGrayBg, color: appColors.textDark }}
          value={value || ''}
          onChange={onChange}
          disabled={disabled}
        />
      ) : (
        <input
          id={`modal-${name}`}
          name={name}
          type={type}
          className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm ${error ? 'border-red-500 ring-red-500' : 'focus:ring-babyTurquoiseAccent focus:border-babyTurquoiseAccent'}`}
          style={{ borderColor: error ? appColors.babyPinkAccent : appColors.lightGrayBg, color: appColors.textDark }}
          value={value || ''}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder || (name === 'profilePictureUrl' ? 'https://example.com/image.jpg' : '')}
        />
      )}
      {error && <p className="text-xs mt-1" style={{ color: appColors.babyPinkAccent }}>{error}</p>}
    </div>
  );
});
ModalEditField.displayName = 'ModalEditField';


// ---------------- MY PROFILE SECTION COMPONENT ----------------
const MyProfileSection: React.FC = () => {
  const { user, fetchUser, isLoading: authIsLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [pageMessage, setPageMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [modalFormData, setModalFormData] = useState<UpdateUserDataRequest>({
    name: '',
    phoneNumber: '',
    bio: '',
    profilePictureUrl: '',
  });
  const [modalFormErrors, setModalFormErrors] = useState<FormErrors>({});
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!authIsLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/profile');
    }
  }, [authIsLoading, isAuthenticated, router]);

  const openEditModal = useCallback(() => {
    if (user) {
      setModalFormData({
        name: user.name || '',
        phoneNumber: user.phoneNumber || '',
        bio: user.bio || '',
        profilePictureUrl: user.profilePictureUrl || '',
      });
    }
    setModalFormErrors({});
    setPageMessage(null);
    setIsEditModalOpen(true);
  }, [user]); // Dependensi user agar formData diinisialisasi dengan benar

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  const handleModalInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setModalFormData(prev => ({ ...prev, [name]: value }));
    if (modalFormErrors[name as keyof FormErrors]) {
      setModalFormErrors(prev => ({ ...prev, [name as keyof FormErrors]: undefined }));
    }
  }, [modalFormErrors]); // Tambahkan modalFormErrors sebagai dependensi jika logikanya bergantung padanya

  const validateModalForm = (): FormErrors => {
    const errors: FormErrors = {};
    const { name, phoneNumber, bio, profilePictureUrl } = modalFormData;

    if (!name?.trim()) errors.name = 'Nama tidak boleh kosong.';
    else if (name.trim().length < 2) errors.name = 'Nama minimal 2 karakter.';
    else if (name.trim().length > 100) errors.name = 'Nama maksimal 100 karakter.';

    if (phoneNumber && phoneNumber.trim() && !/^\+?[0-9\s-()]{7,20}$/.test(phoneNumber.trim())) {
      errors.phoneNumber = 'Format nomor telepon tidak valid.';
    }

    if (bio && bio.length > 500) errors.bio = 'Bio maksimal 500 karakter.';

    if (profilePictureUrl && profilePictureUrl.trim()) {
      try {
        const url = new URL(profilePictureUrl);
        if (!['http:', 'https:'].includes(url.protocol)) {
            errors.profilePictureUrl = 'URL gambar profil harus menggunakan http atau https.';
        }
      } catch {
        errors.profilePictureUrl = 'URL gambar profil tidak valid.';
      }
    }
    return errors;
  };

  const handleModalUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    setModalFormErrors({});
    setPageMessage(null);

    const currentErrors = validateModalForm();
    if (Object.keys(currentErrors).length > 0) {
      setModalFormErrors(currentErrors);
      return;
    }

    setIsUpdating(true);
    try {
      const payload: UpdateUserDataRequest = {
        name: modalFormData.name,
        phoneNumber: modalFormData.phoneNumber?.trim() || undefined,
        bio: modalFormData.bio?.trim() || undefined,
        profilePictureUrl: modalFormData.profilePictureUrl?.trim() || undefined,
      };

      await axiosInstance.put('/api/users/profile/me', payload);
      await fetchUser();
      setPageMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
      closeEditModal();
    } catch (err: unknown) {
      let errorMessage = 'Gagal memperbarui profil.';
       if (err && typeof err === 'object' && 'response' in err) {
        const errorResponse = err.response as { data?: { message?: string } };
        if (errorResponse.data && errorResponse.data.message) {
          errorMessage = errorResponse.data.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setModalFormErrors({ general: errorMessage });
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (authIsLoading || (!user && isAuthenticated)) {
    return (
      <section style={{ backgroundColor: appColors.babyPinkLight }} className="min-h-screen flex items-center justify-center">
        <div style={{ color: appColors.textDark }} className="text-xl font-semibold">Memuat profil Anda...</div>
      </section>
    );
  }

  if (!isAuthenticated || !user) {
    return (
        <section style={{ backgroundColor: appColors.babyPinkLight }} className="min-h-screen flex items-center justify-center">
          <p style={{ color: appColors.textDarkMuted }}>Silakan <Link href="/login" className="font-medium" style={{color: appColors.babyTurquoiseAccent}}>masuk</Link> untuk melihat profil Anda.</p>
        </section>
    );
  }

  return (
    <>
      <section
        className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        style={{ backgroundColor: appColors.babyPinkLight }}
      >
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 rounded-full opacity-30 filter blur-3xl animate-blob-pulse" style={{ backgroundColor: appColors.babyTurquoiseLight }}></div>
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 rounded-full opacity-30 filter blur-3xl animate-blob-pulse-reverse" style={{ backgroundColor: appColors.babyPinkAccent }}></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-center text-3xl sm:text-4xl font-extrabold mb-6" style={{ color: appColors.textDark }}>
            Profil Saya
          </h2>

          {pageMessage && (
            <div className={`p-3 mb-6 rounded-md text-sm text-center ${ pageMessage.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}
                 style={{ color: pageMessage.type === 'success' ? appColors.successGreen : appColors.babyPinkAccent,
                          backgroundColor: pageMessage.type === 'success' ? appColors.successGreenLight : '#FEE2E2' }}>
                {pageMessage.text}
            </div>
          )}

          <div className="shadow-2xl rounded-xl p-6 sm:p-8 md:p-10" style={{ backgroundColor: appColors.white }}>
            <div className="flex justify-end mb-4">
                <button
                  onClick={openEditModal}
                  className="inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1"
                  style={{ color: appColors.babyTurquoiseAccent, borderColor: appColors.babyTurquoiseAccent }}
                >
                  <PencilSquareIcon className="h-5 w-5 mr-2" />
                  Ubah Profil
                </button>
            </div>

            <div className="flex flex-col items-center sm:flex-row sm:items-start sm:space-x-6">
              <div className="flex-shrink-0 mb-6 sm:mb-0 sm:w-1/3 flex justify-center sm:justify-start">
                {isValidHttpUrl(user.profilePictureUrl) ? (
                  <Image src={user.profilePictureUrl!} alt="Foto Profil" width={160} height={160} className="rounded-lg object-cover h-40 w-40" unoptimized/>
                ) : (
                  <UserCircleIcon className="h-40 w-40" style={{ color: appColors.lightGrayBg }} />
                )}
              </div>
              
              <div className="w-full sm:w-2/3">
                <dl className="divide-y" style={{borderColor: appColors.lightGrayBg}}>
                  <ProfileDisplayField label="Nama Lengkap" value={user.name} />
                  <ProfileDisplayField label="Email" value={user.email} />
                  <ProfileDisplayField label="Nomor Telepon" value={user.phoneNumber} />
                  <ProfileDisplayField label="Bio" value={user.bio} />
                  <ProfileDisplayField label="Status Akun" value={user.active ? 'Aktif' : 'Tidak Aktif'} />
                  <ProfileDisplayField label="Bergabung Sejak" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'} />
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal untuk Edit Profil */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out"
             onClick={closeEditModal}>
          <div 
            className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 md:p-10 max-w-xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold" style={{ color: appColors.textDark }}>Ubah Informasi Profil</h3>
                <button 
                    onClick={closeEditModal}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Tutup modal"
                >
                    <XMarkIconOutline className="h-6 w-6" />
                </button>
            </div>

            <form onSubmit={handleModalUpdateProfile} className="space-y-4">
              <div className="flex flex-col items-center mb-4">
                 {/* Menampilkan foto profil saat ini di modal edit */}
                 <div className="w-32 h-32 relative flex items-center justify-center rounded-lg mb-2" style={{backgroundColor: appColors.lightGrayBg}}>
                  {isValidHttpUrl(user.profilePictureUrl) ? (
                      <Image src={user.profilePictureUrl!} alt="Foto Profil Saat Ini" layout="fill" className="rounded-lg object-cover" unoptimized/>
                  ) : (
                      <UserCircleIcon className="h-20 w-20" style={{ color: appColors.textDarkMuted }} />
                  )}
                </div>
                <ModalEditField
                    label="URL Foto Profil Baru"
                    name="profilePictureUrl"
                    value={modalFormData.profilePictureUrl}
                    onChange={handleModalInputChange}
                    error={modalFormErrors.profilePictureUrl}
                    disabled={isUpdating}
                />
              </div>

              <ModalEditField label="Nama Lengkap" name="name" value={modalFormData.name} onChange={handleModalInputChange} error={modalFormErrors.name} disabled={isUpdating} />
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: appColors.textDarkMuted }}>Email</label>
                <input type="email" value={user.email} disabled className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-500 cursor-not-allowed" style={{borderColor: appColors.lightGrayBg}}/>
                <p className="mt-1 text-xs" style={{color: appColors.textDarkMuted}}>Email tidak dapat diubah.</p>
              </div>
              <ModalEditField label="Nomor Telepon" name="phoneNumber" type="tel" value={modalFormData.phoneNumber} onChange={handleModalInputChange} error={modalFormErrors.phoneNumber} disabled={isUpdating} />
              <ModalEditField label="Bio Singkat" name="bio" type="textarea" value={modalFormData.bio} onChange={handleModalInputChange} error={modalFormErrors.bio} disabled={isUpdating} />
              
              {modalFormErrors.general && (
                 <p className="text-sm text-center py-2 rounded-md" style={{ color: appColors.white, backgroundColor: appColors.babyPinkAccent }}>{modalFormErrors.general}</p>
              )}

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={isUpdating}
                  className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                  style={{ borderColor: appColors.textDarkMuted, color: appColors.textDarkMuted }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
                  style={{ backgroundColor: appColors.babyTurquoiseAccent, color: appColors.white }}
                >
                  {isUpdating ? (<>Menyimpan... <svg className="animate-spin ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></>) : (<>Simpan Perubahan <CheckIcon className="h-4 w-4 ml-2"/></>)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MyProfileSection;