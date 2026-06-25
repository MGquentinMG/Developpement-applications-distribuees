"use client";

import { useTranslation } from "react-i18next";
import { AdminUserDetailsProps } from "../../types/AdminType";

export function AdminUserDetails({ user, posts, onDeleteUser, onDeletePost, onBanUser, onUnbanUser }: AdminUserDetailsProps) {
  const { t } = useTranslation();

  if (!user) {
    return (
      <div className="w-full lg:w-2/3 bg-white dark:bg-[#1A1A2E] rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-gray-400 transition-colors min-h-[300px]">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4 opacity-50">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <p className="font-medium text-lg text-gray-500 dark:text-gray-400">{t("admin.selectUser", "Sélectionnez un utilisateur")}</p>
        <p className="text-sm mt-1">{t("admin.selectUserDesc", "Pour modérer son compte et ses contenus")}</p>
      </div>
    );
  }

  const avatarSrc = user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.pseudo}`;

  return (
    <div className="w-full lg:w-2/3 bg-white dark:bg-[#1A1A2E] rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden transition-colors">
      {/* En-tête utilisateur */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0 overflow-hidden border-2 border-gray-100 dark:border-gray-800 shadow-sm">
            <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-[#1A1A2E] dark:text-[#F9F9FB]">{user.pseudo}</h2>
              {user.banned && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 uppercase tracking-wide">
                  {t("admin.banned")}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            <p className="text-[11px] text-gray-400 mt-0.5 uppercase tracking-wider">{t("admin.registeredOn", "Inscrit le")} {user.createdAt}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {user.banned ? (
            <button
              onClick={() => onUnbanUser(user.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {t("admin.unban")}
            </button>
          ) : (
            <button
              onClick={() => onBanUser(user.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
              {t("admin.ban")}
            </button>
          )}
          <button
            onClick={() => onDeleteUser(user.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            {t("admin.deleteAccount")}
          </button>
        </div>
      </div>

      {/* Liste des posts */}
      <div className="p-6 overflow-y-auto flex-1 bg-[#F9F9FB] dark:bg-[#121212]">
        <h3 className="text-sm font-bold text-[#A69ACA] uppercase tracking-widest mb-5">
          {t("admin.publishedMessages", "Posts publiés")} ({posts.length})
        </h3>

        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-[#2A2A40] rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-colors">
              {post.image && (
                <div className="w-full max-h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img src={post.image} alt="Image du post" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4 flex justify-between items-center gap-4">
                <div className="flex-1">
                  {post.content && (
                    <p className="text-[14px] text-[#1A1A2E] dark:text-[#F9F9FB] leading-relaxed">{post.content}</p>
                  )}
                  <p className="text-[11px] text-gray-400 mt-1.5 uppercase tracking-wide">{post.createdAt}</p>
                </div>
                <button
                  onClick={() => onDeletePost(post.id)}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all p-2.5 rounded-xl shrink-0"
                  aria-label="Supprimer le post"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="text-center py-10">
              <p className="text-sm text-gray-500 italic">{t("admin.noMessages", "Aucun post publié.")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
