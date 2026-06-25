"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pencil } from "lucide-react";
import "../../i18n";
import { useAuth } from "../../contexts/AuthContext";
import { api, timeAgo } from "../../services/api";
import Navbar from "../../components/Navbar/Navbar";
import EditProfileModal from "../../components/EditProfileModal/EditProfileModal";

interface ApiPost {
  _id: string;
  content: string;
  image?: string;
  author: { _id: string; username: string; avatar?: string };
  comments: { _id: string; content: string; author: { username: string } }[];
  createdAt: string;
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [activeTab, setActiveTab] = useState<"messages" | "reponses">("messages");
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    api
      .get<ApiPost[]>(`/api/users/${user._id}/posts`)
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center pb-20">
        <p className="text-gray-400 dark:text-gray-500 text-sm">
          Tu dois être connecté pour voir ton profil.
        </p>
      </div>
    );
  }

  const avatarUrl = user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`;

  return (
    <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row min-h-screen bg-white dark:bg-[#121212] transition-colors duration-300">
      <aside className="hidden lg:block w-[350px] shrink-0" />

      <main className="flex-1 w-full max-w-2xl min-h-screen bg-white dark:bg-[#121212] border-x border-gray-100 dark:border-gray-800 pb-20 transition-colors duration-300">
        <div className="p-6 pt-10">
          <div className="flex gap-6 items-start">
            <div className="relative shrink-0">
              <div className="w-28 h-28 rounded-full border-4 border-gray-100 dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700">
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <button
                onClick={() => setEditOpen(true)}
                className="absolute top-0 right-0 w-8 h-8 rounded-full bg-[#F4F2F9] dark:bg-[#2A2A40] text-[#5A4B81] dark:text-[#D0C9E8] flex items-center justify-center hover:bg-[#e4dff0] dark:hover:bg-[#3A3A55] transition-colors shadow-sm"
              >
                <Pencil size={14} strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex-1 w-full">
              <div className="flex gap-3 mb-4">
                <button
                  onClick={logout}
                  className="bg-[#F4F2F9] dark:bg-[#2A2A40] text-[#5A4B81] dark:text-[#D0C9E8] px-5 py-2 rounded-full font-semibold text-xs hover:bg-[#e4dff0] dark:hover:bg-[#3A3A55] transition-colors"
                >
                  {t("profile.logout", "Déconnexion")}
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-black dark:text-[#F9F9FB]">
                    {user.followers.length}
                  </p>
                  <p className="text-[10px] text-[#A69ACA] font-medium uppercase tracking-wider">
                    {t("profile.followers", "Abonnés")}
                  </p>
                </div>
                <div className="w-[1px] h-6 bg-[#A69ACA]/30 dark:bg-gray-700"></div>
                <div className="text-center">
                  <p className="text-xl font-bold text-black dark:text-[#F9F9FB]">
                    {user.following.length}
                  </p>
                  <p className="text-[10px] text-[#A69ACA] font-medium uppercase tracking-wider">
                    {t("profile.following", "Abonnements")}
                  </p>
                </div>
                <div className="w-[1px] h-6 bg-[#A69ACA]/30 dark:bg-gray-700"></div>
                <div className="text-center">
                  <p className="text-xl font-bold text-black dark:text-[#F9F9FB]">
                    {posts.length}
                  </p>
                  <p className="text-[10px] text-[#A69ACA] font-medium uppercase tracking-wider">
                    {t("profile.posts", "Posts")}
                  </p>
                </div>
              </div>

              {user.bio && (
                <div className="bg-[#EAE6F3] dark:bg-[#2A2A40] p-3 rounded-2xl w-full transition-colors">
                  <p className="text-[11px] text-[#2D2D2D] dark:text-[#D0C9E8] leading-relaxed">
                    {user.bio}
                  </p>
                </div>
              )}

              <p className="mt-2 text-[13px] font-bold text-[#492775] dark:text-[#A395DA]">
                @{user.username}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full h-2 bg-gray-100 dark:bg-gray-900 mb-2 transition-colors"></div>

        <div className="flex px-4 border-b border-gray-100 dark:border-gray-800 transition-colors">
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex-1 py-3 text-sm font-bold transition-all ${
              activeTab === "messages"
                ? "text-black dark:text-[#F9F9FB] border-b-4 border-[#A69ACA]"
                : "text-gray-400 dark:text-gray-600"
            }`}
          >
            {t("profile.tabs.messages", "Posts")}
          </button>
          <button
            onClick={() => setActiveTab("reponses")}
            className={`flex-1 py-3 text-sm font-bold transition-all ${
              activeTab === "reponses"
                ? "text-black dark:text-[#F9F9FB] border-b-4 border-[#A69ACA]"
                : "text-gray-400 dark:text-gray-600"
            }`}
          >
            {t("profile.tabs.replies", "Réponses")}
          </button>
        </div>

        <EditProfileModal isOpen={editOpen} onClose={() => setEditOpen(false)} />

        <div className="bg-gray-50/50 dark:bg-[#121212] min-h-[300px] transition-colors">
          {loading && (
            <p className="text-center text-gray-400 dark:text-gray-500 text-sm mt-10">
              Chargement...
            </p>
          )}

          {activeTab === "messages" && !loading && (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {posts.length === 0 && (
                <p className="text-center text-gray-400 dark:text-gray-500 text-sm mt-10">
                  {t("profile.noPosts", "Aucun post pour le moment.")}
                </p>
              )}
              {posts.map((post) => (
                <div key={post._id} className="bg-white dark:bg-[#1A1A2E] transition-colors">
                  <div
                    onClick={() =>
                      setExpandedPostId(expandedPostId === post._id ? null : post._id)
                    }
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2A2A40] transition-colors p-4 flex gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0 overflow-hidden">
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-black dark:text-[#F9F9FB]">
                        @{user.username}
                      </p>
                      <p className="text-[10px] text-gray-400 mb-1">{timeAgo(post.createdAt)}</p>
                      <p className="text-gray-800 dark:text-[#D0C9E8] text-sm mb-3 mt-1">
                        {post.content}
                      </p>
                      {post.image && (
                        <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 max-w-xs">
                          <img src={post.image} alt="Contenu" className="w-full h-auto" />
                        </div>
                      )}
                    </div>
                  </div>

                  {expandedPostId === post._id && (
                    <div className="bg-gray-50 dark:bg-[#1A1A2E] px-14 py-4 space-y-4 border-t border-gray-50 dark:border-gray-800 transition-colors">
                      <p className="text-[10px] font-bold text-[#A69ACA] uppercase tracking-widest mb-2">
                        {t("profile.commentsTitle", "Commentaires")}
                      </p>
                      {post.comments.length > 0 ? (
                        post.comments.map((comment) => (
                          <div key={comment._id} className="flex gap-3 items-start">
                            <div className="w-6 h-6 rounded-full bg-[#A69ACA]/30 shrink-0"></div>
                            <div className="bg-white dark:bg-[#2A2A40] p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex-1 transition-colors">
                              <p className="text-[11px] font-bold text-black dark:text-[#F9F9FB] mb-1">
                                @{comment.author?.username ?? "Anonyme"}
                              </p>
                              <p className="text-xs text-gray-700 dark:text-[#D0C9E8]">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                          {t("profile.noComments", "Aucun commentaire pour le moment.")}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Navbar />
    </div>
  );
}