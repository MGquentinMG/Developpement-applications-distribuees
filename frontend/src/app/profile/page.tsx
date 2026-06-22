"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../../i18n"; // Ton import i18n
import  Navbar  from "../../components/Navbar/Navbar"; 

const MOCK_POSTS = [
  {
    id: 1,
    user: "Gusty",
    content: "Et regardez !!!",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=500",
    comments: [
      { id: 101, user: "User1", content: "Incroyable cette voiture !" },
      { id: 102, user: "User2", content: "C'est quel modèle ?" },
    ]
  },
  {
    id: 2,
    user: "Gusty",
    content: "Une superbe journée pour coder sur Breezy",
    image: null,
    comments: []
  }
];

export default function ProfilePage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"messages" | "reponses">("messages");
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  
  const [isOwnProfile, setIsOwnProfile] = useState<boolean>(false);

  const toggleComments = (postId: number) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] pb-20 transition-colors duration-300">
      
      <div className="p-6 pt-10">
        <div className="flex gap-6 items-start">
          
          <div className="relative shrink-0">
            <div className="w-28 h-28 rounded-full border-4 border-gray-100 dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Gusty" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            {isOwnProfile && (
              <button className="absolute top-1 right-0 bg-[#A69ACA] p-1.5 rounded-full border-2 border-white dark:border-[#121212] shadow-sm text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
            )}
          </div>

          <div className="flex-1 w-full">
            {!isOwnProfile && (
              <div className="flex gap-3 mb-4">
                <button className="bg-[#A69ACA] text-white px-5 py-2 rounded-full font-semibold text-xs shadow-sm hover:bg-[#9084b8] transition-colors">
                  {t("profile.subscribeBtn", "S'abonner")}
                </button>
                <button className="bg-[#F4F2F9] dark:bg-[#2A2A40] text-[#5A4B81] dark:text-[#D0C9E8] px-5 py-2 rounded-full font-semibold text-xs hover:bg-[#e4dff0] dark:hover:bg-[#3A3A55] transition-colors">
                  {t("profile.messageBtn", "Messages")}
                </button>
              </div>
            )}

            <div className="flex items-center gap-4 mb-4">
              <div className="text-center">
                <p className="text-xl font-bold text-black dark:text-[#F9F9FB]">100K</p>
                <p className="text-[10px] text-[#A69ACA] font-medium uppercase tracking-wider">{t("profile.followers", "Abonnés")}</p>
              </div>
              <div className="w-[1px] h-6 bg-[#A69ACA]/30 dark:bg-gray-700"></div>
              <div className="text-center">
                <p className="text-xl font-bold text-black dark:text-[#F9F9FB]">100K</p>
                <p className="text-[10px] text-[#A69ACA] font-medium uppercase tracking-wider">{t("profile.following", "Abonnements")}</p>
              </div>
              <div className="w-[1px] h-6 bg-[#A69ACA]/30 dark:bg-gray-700"></div>
              <div className="text-center">
                <p className="text-xl font-bold text-black dark:text-[#F9F9FB]">100K</p>
                <p className="text-[10px] text-[#A69ACA] font-medium uppercase tracking-wider">{t("profile.posts", "Messages")}</p>
              </div>
            </div>

            <div className="bg-[#EAE6F3] dark:bg-[#2A2A40] p-3 rounded-2xl w-full transition-colors">
              <p className="text-[11px] text-[#2D2D2D] dark:text-[#D0C9E8] leading-relaxed">
                Le Chat, plus spécifiquement désigné sous le nom de Chat domestique (Felis catus)...
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-2 bg-gray-100 dark:bg-gray-900 mb-2 transition-colors"></div>

      <div className="flex px-4 border-b border-gray-100 dark:border-gray-800 transition-colors">
        <button 
          onClick={() => setActiveTab("messages")}
          className={`flex-1 py-3 text-sm font-bold transition-all ${activeTab === "messages" ? "text-black dark:text-[#F9F9FB] border-b-4 border-[#A69ACA]" : "text-gray-400 dark:text-gray-600"}`}
        >
          {t("profile.tabs.messages", "Messages")}
        </button>
        <button 
          onClick={() => setActiveTab("reponses")}
          className={`flex-1 py-3 text-sm font-bold transition-all ${activeTab === "reponses" ? "text-black dark:text-[#F9F9FB] border-b-4 border-[#A69ACA]" : "text-gray-400 dark:text-gray-600"}`}
        >
          {t("profile.tabs.replies", "Réponses")}
        </button>
      </div>

      <div className="bg-gray-50/50 dark:bg-[#121212] min-h-[300px] transition-colors">
        {activeTab === "messages" && (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {MOCK_POSTS.map((post) => (
              <div key={post.id} className="bg-white dark:bg-[#1A1A2E] transition-colors">
                <div 
                  onClick={() => toggleComments(post.id)}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2A2A40] transition-colors p-4 flex gap-3"
                >
                   <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0 overflow-hidden">
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user}`} alt="Avatar" className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1">
                     <p className="font-bold text-sm text-black dark:text-[#F9F9FB]">@{post.user}</p>
                     <p className="text-gray-800 dark:text-[#D0C9E8] text-sm mb-3 mt-1">{post.content}</p>
                     {post.image && (
                       <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 max-w-xs">
                          <img src={post.image} alt="Contenu" className="w-full h-auto" />
                       </div>
                     )}
                   </div>
                </div>

                {expandedPostId === post.id && (
                  <div className="bg-gray-50 dark:bg-[#1A1A2E] px-14 py-4 space-y-4 border-t border-gray-50 dark:border-gray-800 transition-colors">
                    <p className="text-[10px] font-bold text-[#A69ACA] uppercase tracking-widest mb-2">
                      {t("profile.commentsTitle", "Commentaires")}
                    </p>
                    {post.comments.length > 0 ? (
                      post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 items-start">
                          <div className="w-6 h-6 rounded-full bg-[#A69ACA]/30 shrink-0"></div>
                          <div className="bg-white dark:bg-[#2A2A40] p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex-1 transition-colors">
                            <p className="text-[11px] font-bold text-black dark:text-[#F9F9FB] mb-1">@{comment.user}</p>
                            <p className="text-xs text-gray-700 dark:text-[#D0C9E8]">{comment.content}</p>
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

    </div>
  );
}