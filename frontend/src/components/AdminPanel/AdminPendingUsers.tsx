"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../services/api";

interface PendingUser {
  _id: string;
  username: string;
  email: string;
  age: number;
  createdAt: string;
}

export function AdminPendingUsers() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<PendingUser[]>("/api/users/pending")
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    setProcessing(id);
    try {
      await api.patch(`/api/users/${id}/approve`, {});
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {}
    setProcessing(null);
  };

  const handleReject = async (id: string) => {
    setProcessing(id);
    try {
      await api.delete(`/api/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {}
    setProcessing(null);
  };

  if (loading) {
    return <p className="text-center text-gray-400 mt-10 text-sm">{t("admin.loading", "Chargement...")}</p>;
  }

  return (
    <div className="w-full">
      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-600">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4 opacity-40">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-medium text-lg">{t("admin.noPending", "Aucune demande en attente")}</p>
          <p className="text-sm mt-1">{t("admin.noPendingDesc", "Toutes les inscriptions ont été traitées.")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-[#8B7BB5] font-semibold mb-4 uppercase tracking-wider">
            {users.length} {users.length > 1
              ? t("admin.pendingRequests", "demandes en attente")
              : t("admin.pendingRequest", "demande en attente")}
          </p>
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white dark:bg-[#1A1A2E] rounded-2xl border border-gray-100 dark:border-gray-800 px-5 py-4 flex items-center gap-4 shadow-sm transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-[#EAE6F3] dark:bg-[#2A2438] flex items-center justify-center shrink-0">
                <span className="text-[#492775] dark:text-[#A395DA] font-bold text-[15px]">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-[14px] text-[#1A1A2E] dark:text-[#F9F9FB] truncate">
                  @{user.username}
                </p>
                <p className="text-[12px] text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-600 mt-0.5">
                  {t("admin.registeredOn", "Inscrit le")} {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                  {user.age ? ` · ${user.age} ${t("admin.years", "ans")}` : ""}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleApprove(user._id)}
                  disabled={processing === user._id}
                  title={t("admin.approve", "Approuver")}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 transition-colors disabled:opacity-50"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  {t("admin.approve", "Approuver")}
                </button>
                <button
                  onClick={() => handleReject(user._id)}
                  disabled={processing === user._id}
                  title={t("admin.reject", "Refuser")}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 transition-colors disabled:opacity-50"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  {t("admin.reject", "Refuser")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
