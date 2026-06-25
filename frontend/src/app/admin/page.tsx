"use client";
import React, { useState } from "react";
import { AdminDashboard } from "../../components/AdminPanel/AdminDashboard";
import { AdminReports } from "../../components/AdminPanel/AdminReports";
import Navbar from "../../components/Navbar/Navbar";
type Tab = "users" | "reports";
export default function AdminPage() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("users");
  return (
    <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-300">
      <aside className="hidden lg:block w-[350px] shrink-0" />

      <div className="flex-1 flex justify-center w-full min-h-screen p-4 md:p-6">
        <main className="w-full max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#1A1A2E] dark:text-[#F9F9FB] transition-colors duration-300">Panel Administration</h1>
            <p className="text-[#8B7BB5] dark:text-[#A395DA] mt-2 transition-colors duration-300">Gestion des comptes et modération des contenus</p>
          </div>
          <div className="flex gap-2 mb-8 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-5 py-3 text-[14px] font-bold transition-all border-b-2 -mb-[2px] cursor-pointer ${
                activeTab === "users"
                  ? "border-[#492775] text-[#492775] dark:text-[#A395DA] dark:border-[#A395DA]"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-[#492775] dark:hover:text-[#A395DA]"
              }`}
            >
              Utilisateurs
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`px-5 py-3 text-[14px] font-bold transition-all border-b-2 -mb-[2px] cursor-pointer ${
                activeTab === "reports"
                  ? "border-[#492775] text-[#492775] dark:text-[#A395DA] dark:border-[#A395DA]"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-[#492775] dark:hover:text-[#A395DA]"
              }`}
            >
              Signalements
            </button>
          </div>
          <div className="bg-white dark:bg-[#1A1A2E] rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300">
            {activeTab === "users" && <AdminDashboard />}
            {activeTab === "reports" && <AdminReports />}
          </div>
        </main>
      </div>

      <Navbar />
    </div>
  );
}