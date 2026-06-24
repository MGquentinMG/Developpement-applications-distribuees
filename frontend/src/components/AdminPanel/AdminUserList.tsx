"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { InputField } from "../Auth/InputField";
import { AdminUserListProps } from "../../types/AdminType";

export function AdminUserList({ users, searchTerm, onSearchChange, selectedUserId, onSelectUser }: AdminUserListProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full lg:w-1/3 bg-white dark:bg-[#1A1A2E] rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden transition-colors">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <InputField 
          type="text" 
          placeholder={t("admin.searchPlaceholder", "Rechercher...")} 
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="overflow-y-auto flex-1 p-4 space-y-2">
        {users.map(user => (
          <button
            key={user.id}
            onClick={() => onSelectUser(user)}
            className={`w-full flex items-center gap-4 text-left p-4 rounded-2xl transition-all ${
              selectedUserId === user.id 
                ? "bg-[#F5F0FF] dark:bg-[#2A2438] border-[#A69ACA] border shadow-sm" 
                : "hover:bg-gray-50 dark:hover:bg-[#2A2A40] border border-transparent"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0 overflow-hidden border border-gray-100 dark:border-gray-600">
               <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.pseudo}`} alt={t("admin.avatarAlt", "Avatar")} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-bold text-[#1A1A2E] dark:text-[#F9F9FB] truncate">{user.pseudo}</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
            </div>
          </button>
        ))}
        {users.length === 0 && (
          <p className="text-center text-sm text-gray-500 p-4">{t("admin.noUserFound", "Aucun utilisateur trouvé.")}</p>
        )}
      </div>
    </div>
  );
}