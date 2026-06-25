"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import "../../i18n";
import Logo from "../../components/Logo/Logo";
import SearchBar from "../../components/Searchbar/Searchbar";
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";

interface ApiUser {
  _id: string;
  username: string;
  avatar?: string;
}

export default function MessagesPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<ApiUser[]>([]);

  useEffect(() => {
    if (!user) return;
    api.get<ApiUser[]>("/api/messages/conversations").then((data) => {
      setUsers(Array.isArray(data) ? data : []);
    }).catch(() => {});
  }, [user]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter((u) => u.username.toLowerCase().includes(q));
  }, [users, searchQuery]);

  if (!user) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center transition-colors duration-300">
        <p className="text-gray-400 dark:text-gray-500 text-sm">
          {t("messages.loginRequired", "Connecte-toi pour accéder aux messages.")}
        </p>
      </main>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row min-h-screen bg-white dark:bg-[#121212] transition-colors duration-300">
      <aside className="hidden lg:block w-[350px] shrink-0" />

      <main className="flex-1 w-full max-w-2xl min-h-screen bg-white dark:bg-[#121212] border-x border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="flex items-center gap-3 px-4 py-4 sticky top-0 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md z-10 transition-colors duration-300 border-b border-gray-200 dark:border-gray-800">
          <div className="shrink-0 w-8">
            <Logo />
          </div>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            variant="messages"
            placeholder={t("messages.searchPlaceholder")}
          />
        </div>

        <div className="px-5 mt-4">
          <h2 className="text-[#492775] dark:text-[#A395DA] font-medium text-sm mb-4 transition-colors duration-300">
            {t("messages.title")}
          </h2>

          {filteredUsers.length === 0 && (
            <p className="text-gray-400 dark:text-gray-500 text-sm text-center mt-10">
              {searchQuery
                ? t("messages.noResults", "Aucun résultat.")
                : t("messages.noContacts", "Aucun utilisateur trouvé.")}
            </p>
          )}

          <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
            {filteredUsers.map((contact) => {
              const avatar =
                contact.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.username}`;
              return (
                <button
                  key={contact._id}
                  onClick={() => router.push(`/messages/${contact._id}`)}
                  className="flex items-center gap-3 py-3 hover:bg-gray-50 dark:hover:bg-[#1A1A2E] transition-colors text-left rounded-xl px-2 cursor-pointer border-none bg-transparent"
                >
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                    <img src={avatar} alt={contact.username} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#1E1E40] dark:text-[#F9F9FB] truncate">
                      @{contact.username}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                      {t("messages.tapToConversation", "Appuie pour démarrer la conversation")}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      <Navbar />
    </div>
  );
}