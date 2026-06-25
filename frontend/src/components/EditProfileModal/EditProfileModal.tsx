"use client";

import React, { useState, useRef } from "react";
import { X, Camera } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { user, updateUser } = useAuth();
  const [editBio, setEditBio] = useState(user?.bio ?? "");
  const [editUsername, setEditUsername] = useState(user?.username ?? "");
  const [editAvatarPreview, setEditAvatarPreview] = useState<string | null>(null);
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarSrc = user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`;

  const handleOpen = () => {
    setEditBio(user?.bio ?? "");
    setEditUsername(user?.username ?? "");
    setEditAvatarPreview(null);
    setEditAvatarFile(null);
    setSaveError("");
  };

  React.useEffect(() => {
    if (isOpen) handleOpen();
  }, [isOpen]);

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditAvatarFile(file);
    setEditAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      let avatarUrl: string | undefined;
      if (editAvatarFile) {
        avatarUrl = await api.uploadImage(editAvatarFile);
      }
      const payload: { bio: string; username: string; avatar?: string } = {
        bio: editBio,
        username: editUsername,
      };
      if (avatarUrl) payload.avatar = avatarUrl;
      await api.patch("/api/users/me", payload);
      updateUser({
        bio: editBio,
        username: editUsername,
        ...(avatarUrl ? { avatar: avatarUrl } : {}),
      });
      onClose();
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-[#1A1A2E] rounded-3xl p-6 w-full max-w-sm shadow-2xl transition-colors">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-[17px] text-[#1E1E40] dark:text-[#F9F9FB]">
            Modifier le profil
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#2A2438] flex items-center justify-center text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#3A304D] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-700 bg-gray-200 dark:bg-gray-700">
              <img
                src={editAvatarPreview ?? avatarSrc}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#492775] text-white flex items-center justify-center hover:bg-[#3a1f5d] transition-colors shadow-md"
            >
              <Camera size={14} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarFile}
            />
          </div>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2">
            Appuie sur l&apos;appareil photo pour changer
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-[12px] font-semibold text-[#492775] dark:text-[#A395DA] mb-2">
            Nom d&apos;utilisateur
          </label>
          <input
            type="text"
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
            maxLength={30}
            placeholder="Ton pseudo..."
            className="w-full bg-[#F4F2F9] dark:bg-[#2A2438] text-[#1E1E40] dark:text-[#F9F9FB] rounded-2xl px-4 py-3 text-[13px] outline-none placeholder-gray-400 dark:placeholder-gray-600 transition-colors"
          />
        </div>

        <div className="mb-6">
          <label className="block text-[12px] font-semibold text-[#492775] dark:text-[#A395DA] mb-2">
            Bio
          </label>
          <textarea
            value={editBio}
            onChange={(e) => setEditBio(e.target.value)}
            maxLength={160}
            rows={3}
            placeholder="Parle de toi en quelques mots..."
            className="w-full bg-[#F4F2F9] dark:bg-[#2A2438] text-[#1E1E40] dark:text-[#F9F9FB] rounded-2xl px-4 py-3 text-[13px] outline-none resize-none placeholder-gray-400 dark:placeholder-gray-600 transition-colors"
          />
          <p className="text-[10px] text-gray-400 dark:text-gray-600 text-right mt-1">
            {editBio.length}/160
          </p>
        </div>

        {saveError && (
          <p className="text-red-500 text-[12px] text-center mb-2">{saveError}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full text-[13px] font-semibold bg-[#F4F2F9] dark:bg-[#2A2A40] text-[#5A4B81] dark:text-[#D0C9E8] hover:bg-[#e4dff0] dark:hover:bg-[#3A3A55] transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !editUsername.trim()}
            className="flex-1 py-2.5 rounded-full text-[13px] font-semibold bg-[#492775] text-white hover:bg-[#3a1f5d] disabled:opacity-60 transition-colors"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}
