"use client";

import React from "react";
import { AdminDashboard } from "../../components/AdminPanel/AdminDashboard";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#121212] p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* EN-TÊTE PANEL */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1A1A2E] dark:text-[#F9F9FB]">Panel d'Administration</h1>
          <p className="text-[#8B7BB5] mt-2">Gestion des comptes et modération des contenus</p>
        </div>

        {/* COMPOSANT DASHBOARD */}
        <AdminDashboard />

      </div>
    </main>
  );
}