"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { AdminDashboard } from "../../components/AdminPanel/AdminDashboard";
import { AdminReports } from "../../components/AdminPanel/AdminReports";
import { AdminPendingUsers } from "../../components/AdminPanel/AdminPendingUsers";
import { AdminCreateUser } from "../../components/AdminPanel/AdminCreateUser";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import "../../i18n";

type Tab = "users" | "pending" | "create" | "reports";

export default function AdminPage() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== "admin" && user.role !== "moderator"))) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    api
      .get<{ _id: string }[]>("/api/users/pending")
      .then((data) => setPendingCount(Array.isArray(data) ? data.length : 0))
      .catch(() => {});
  }, []);

  const isAdmin = user?.role === "admin";

  const tabs: { key: Tab; label: string; badge?: number }[] = [
    { key: "users", label: t("admin.tabs.users", "Utilisateurs") },
    { key: "pending", label: t("admin.tabs.pending", "Demandes"), badge: pendingCount },
    ...(isAdmin ? [{ key: "create" as Tab, label: t("admin.tabs.create", "Créer un compte") }] : []),
    { key: "reports", label: t("admin.tabs.reports", "Signalements") },
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#121212] p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#1A1A2E] dark:text-[#F9F9FB]">
            {t("admin.title", "Panel d'Administration")}
          </h1>
          <p className="text-[#8B7BB5] mt-2">
            {t("admin.subtitle", "Gestion des comptes et modération des contenus")}
          </p>
        </div>

        <div className="flex gap-2 mb-8 border-b border-gray-200 dark:border-gray-800 flex-wrap">
          {tabs.map(({ key, label, badge }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-5 py-3 text-[14px] font-bold transition-all border-b-2 -mb-[2px] flex items-center gap-2 ${
                activeTab === key
                  ? "border-[#492775] text-[#492775] dark:text-[#A395DA] dark:border-[#A395DA]"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-[#492775] dark:hover:text-[#A395DA]"
              }`}
            >
              {label}
              {badge !== undefined && badge > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === "users" && <AdminDashboard />}
        {activeTab === "pending" && <AdminPendingUsers />}
        {activeTab === "create" && isAdmin && <AdminCreateUser />}
        {activeTab === "reports" && <AdminReports />}
      </div>
    </main>
  );
}
