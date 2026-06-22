"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../i18n"; // Ajuste le chemin si besoin
import { InputField } from "../LoginCard/common/InputField";

interface User {
  id: string;
  pseudo: string;
  email: string;
  createdAt: string;
}

interface Post {
  id: string;
  content: string;
  createdAt: string;
}

const MOCK_USERS: User[] = [
  { id: "1", pseudo: "Gusty", email: "gusty@breezy.com", createdAt: "2026-06-20" },
  { id: "2", pseudo: "Alice", email: "alice@example.com", createdAt: "2026-06-21" },
];

const MOCK_POSTS: Record<string, Post[]> = {
  "1": [
    { id: "p1", content: "Superbe journée pour coder !", createdAt: "2026-06-22 10:00" },
    { id: "p2", content: "Regardez cette voiture...", createdAt: "2026-06-21 15:30" }
  ],
  "2": [
    { id: "p3", content: "Je viens de m'inscrire sur Breezy !", createdAt: "2026-06-21 09:00" }
  ]
};

export function AdminDashboard() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (selectedUser) {
      setUserPosts(MOCK_POSTS[selectedUser.id] || []);
    } else {
      setUserPosts([]);
    }
  }, [selectedUser]);

  const handleDeleteUser = (userId: string) => {
    const confirmDelete = window.confirm(t("admin.confirmDeleteUser", "Es-tu sûr ?"));
    if (confirmDelete) {
      console.log(`DELETE /api/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
      setSelectedUser(null);
    }
  };

  const handleDeletePost = (postId: string) => {
    const confirmDelete = window.confirm(t("admin.confirmDeletePost", "Supprimer ce message ?"));
    if (confirmDelete) {
      console.log(`DELETE /api/posts/${postId}`);
      setUserPosts(userPosts.filter(p => p.id !== postId));
    }
  };

  const filteredUsers = users.filter(u => 
    u.pseudo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 min-h-[75vh]">
      
      {/* SECTION GAUCHE */}
      <div className="w-full lg:w-1/3 bg-white dark:bg-[#1A1A2E] rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden transition-colors">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <InputField 
            type="text" 
            placeholder={t("admin.searchPlaceholder", "Rechercher...")} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="overflow-y-auto flex-1 p-4 space-y-2">
          {filteredUsers.map(user => (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`w-full flex items-center gap-4 text-left p-4 rounded-2xl transition-all ${
                selectedUser?.id === user.id 
                  ? "bg-[#F5F0FF] dark:bg-[#2A2438] border-[#A69ACA] border shadow-sm" 
                  : "hover:bg-gray-50 dark:hover:bg-[#2A2A40] border border-transparent"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0 overflow-hidden border border-gray-100 dark:border-gray-600">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.pseudo}`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-bold text-[#1A1A2E] dark:text-[#F9F9FB] truncate">{user.pseudo}</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              </div>
            </button>
          ))}
          {filteredUsers.length === 0 && (
            <p className="text-center text-sm text-gray-500 p-4">{t("admin.noUserFound", "Aucun utilisateur trouvé.")}</p>
          )}
        </div>
      </div>

      {/* SECTION DROITE */}
      <div className="w-full lg:w-2/3 bg-white dark:bg-[#1A1A2E] rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden transition-colors">
        {selectedUser ? (
          <>
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex flex-wrap justify-between items-center gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0 overflow-hidden border-2 border-gray-100 dark:border-gray-800 shadow-sm">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.pseudo}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#1A1A2E] dark:text-[#F9F9FB]">{selectedUser.pseudo}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{selectedUser.email}</p>
                  <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-wider">{t("admin.registeredOn", "Inscrit le")} {selectedUser.createdAt}</p>
                </div>
              </div>

              <button 
                onClick={() => handleDeleteUser(selectedUser.id)}
                className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shrink-0"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                {t("admin.deleteAccount", "Supprimer le compte")}
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-1 bg-[#F9F9FB] dark:bg-[#121212]">
              <h3 className="text-sm font-bold text-[#A69ACA] uppercase tracking-widest mb-6">
                {t("admin.publishedMessages", "Messages publiés")} ({userPosts.length})
              </h3>
              
              <div className="space-y-5">
                {userPosts.map(post => (
                  <div key={post.id} className="bg-white dark:bg-[#2A2A40] p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-center gap-4 transition-colors">
                    <div className="flex-1">
                      <p className="text-[15px] text-[#1A1A2E] dark:text-[#F9F9FB] leading-relaxed">{post.content}</p>
                      <p className="text-[11px] text-gray-400 mt-2 uppercase tracking-wide">{post.createdAt}</p>
                    </div>
                    <button 
                      onClick={() => handleDeletePost(post.id)}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all p-3 rounded-xl shrink-0"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                ))}
                {userPosts.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-sm text-gray-500 italic">{t("admin.noMessages", "Cet utilisateur n'a publié aucun message.")}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-[#F9F9FB] dark:bg-[#121212]">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4 opacity-50">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <p className="font-medium text-lg text-gray-500 dark:text-gray-400">{t("admin.selectUser", "Sélectionnez un utilisateur")}</p>
            <p className="text-sm mt-1">{t("admin.selectUserDesc", "Pour modérer son compte et ses contenus")}</p>
          </div>
        )}
      </div>

    </div>
  );
}