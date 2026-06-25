"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { AdminDashboard } from "../../components/AdminPanel/AdminDashboard";
import { AdminReports } from "../../components/AdminPanel/AdminReports";
import { AdminPendingUsers } from "../../components/AdminPanel/AdminPendingUsers";
import { AdminCreateUser } from "../../components/AdminPanel/AdminCreateUser";
import Navbar from "../../components/Navbar/Navbar";

type Tab = "users" | "pending" | "reports" | "create";

export default function AdminPage() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("users");

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== "admin" && user.role !== "moderator"))) {
      router.replace("/feed");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) return null;
  if (user.role !== "admin" && user.role !== "moderator") return null;

  const isAdmin = user.role === "admin";

  const tabClass = (tab: Tab) =>
    `px-5 py-3 text-[14px] font-bold transition-all border-b-2 -mb-[2px] cursor-pointer ${
      activeTab === tab
        ? "border-[#492775] text-[#492775] dark:text-[#A395DA] dark:border-[#A395DA]"
        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-[#492775] dark:hover:text-[#A395DA]"
    }`;

  return (
    <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-300">
      <aside className="hidden lg:block w-[350px] shrink-0" />

      <div className="flex-1 flex justify-center w-full min-h-screen p-4 md:p-6">
        <main className="w-full max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#1A1A2E] dark:text-[#F9F9FB] transition-colors duration-300">{t("admin.title")}</h1>
            <p className="text-[#8B7BB5] dark:text-[#A395DA] mt-2 transition-colors duration-300">{t("admin.subtitle")}</p>
          </div>
          <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <button onClick={() => setActiveTab("users")} className={tabClass("users")}>
              {t("admin.tabs.users")}
            </button>
            <button onClick={() => setActiveTab("pending")} className={tabClass("pending")}>
              {t("admin.tabs.pending")}
            </button>
            <button onClick={() => setActiveTab("reports")} className={tabClass("reports")}>
              {t("admin.tabs.reports")}
            </button>
            {isAdmin && (
              <button onClick={() => setActiveTab("create")} className={tabClass("create")}>
                {t("admin.tabs.create")}
              </button>
            )}
          </div>
          <div className="bg-white dark:bg-[#1A1A2E] rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300">
            {activeTab === "users" && <AdminDashboard />}
            {activeTab === "pending" && <AdminPendingUsers />}
            {activeTab === "reports" && <AdminReports />}
            {activeTab === "create" && isAdmin && <AdminCreateUser />}
          </div>
        </main>
      </div>

      <Navbar />
    </div>
  );
}
