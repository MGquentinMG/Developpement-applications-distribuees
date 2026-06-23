"use client";

import React, { useState } from "react";
import { AdminDashboard } from "../../components/AdminPanel/AdminDashboard";
import { AdminReports } from "../../components/AdminPanel/AdminReports";

type Tab = "users" | "reports";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("users");

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#121212] p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#1A1A2E] dark:text-[#F9F9FB]">Panel d'Administration</h1>
          <p className="text-[#8B7BB5] mt-2">Gestion des comptes et modération des contenus</p>
        </div>

        <div className="flex gap-2 mb-8 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-5 py-3 text-[14px] font-bold transition-all border-b-2 -mb-[2px] ${
              activeTab === "users"
                ? "border-[#492775] text-[#492775] dark:text-[#A395DA] dark:border-[#A395DA]"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-[#492775] dark:hover:text-[#A395DA]"
            }`}
          >
            Utilisateurs
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-5 py-3 text-[14px] font-bold transition-all border-b-2 -mb-[2px] ${
              activeTab === "reports"
                ? "border-[#492775] text-[#492775] dark:text-[#A395DA] dark:border-[#A395DA]"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-[#492775] dark:hover:text-[#A395DA]"
            }`}
          >
            Signalements
          </button>
        </div>

        {activeTab === "users" && <AdminDashboard />}
        {activeTab === "reports" && <AdminReports />}
      </div>
    </main>
  );
}
