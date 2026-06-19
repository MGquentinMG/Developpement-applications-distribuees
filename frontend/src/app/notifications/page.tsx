"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../../i18n";
import BackButton from "../../components/BackButton/BackButton";
import NotificationCard from "../../components/NotificationCard/NotificationCard";
import { NotificationProps } from "../../types/NotificationType";
import Logo from "../../components/Logo/Logo";

export default function NotificationsPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<"new" | "all">("new");

  const mockNotifications: NotificationProps[] = [
    { id: 1, username: "@Pessi", action: "follow", time: "17:21", isRead: false },
    { id: 2, username: "@Ambroise", action: "like", time: "17:02", isRead: true },
    { id: 3, username: "@aurel62", action: "comment", time: "17:01", isRead: false },
    { id: 4, username: "@hakam", action: "share", time: "17:22", isRead: true },
    { id: 5, username: "@Ambroise", action: "like", time: "17:02", isRead: false },
    { id: 6, username: "@Manu", action: "share", time: "17:22", isRead: true },
  ];

  const filteredNotifications = filter === "new"
    ? mockNotifications.filter((n) => !n.isRead)
    : mockNotifications;

  return (
    <main className="min-h-screen bg-[#F9F9FB] dark:bg-[#121212] pb-32 relative transition-colors duration-300">
      <div className="flex items-center justify-between px-4 py-4 sticky top-0 bg-[#F9F9FB] dark:bg-[#121212] z-10 transition-colors duration-300">
        <div className="w-10">
          <Logo />
        </div>
        <div className="bg-[#EAE5F3] dark:bg-[#2A2438] px-6 py-2 rounded-2xl transition-colors duration-300">
          <h1 className="text-[#1E1E40] dark:text-[#F9F9FB] font-bold text-sm transition-colors duration-300">{t("notifications.title")}</h1>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="absolute left-1 top-1/2 -translate-y-1/2 z-20">
        <BackButton />
      </div>

      <div className="px-5 mt-2 mb-6 flex gap-3">
        <button
          onClick={() => setFilter("new")}
          className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-colors duration-300 ${
            filter === "new" 
              ? "bg-[#A395DA] text-white shadow-sm dark:bg-[#492775] dark:text-[#D0C9E8]" 
              : "bg-[#EAE5F3] text-[#492775] dark:bg-[#2A2438] dark:text-[#A395DA]"
          }`}
        >
          {t("notifications.new")}
        </button>
        <button
          onClick={() => setFilter("all")}
          className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-colors duration-300 ${
            filter === "all" 
              ? "bg-[#A395DA] text-white shadow-sm dark:bg-[#492775] dark:text-[#D0C9E8]" 
              : "bg-[#EAE5F3] text-[#492775] dark:bg-[#2A2438] dark:text-[#A395DA]"
          }`}
        >
          {t("notifications.all")}
        </button>
      </div>

      <section className="px-4 relative z-10">
        {filteredNotifications.map((notif) => (
          <NotificationCard
            key={notif.id}
            id={notif.id}
            username={notif.username}
            action={notif.action}
            time={notif.time}
            isRead={notif.isRead}
          />
        ))}

        {filteredNotifications.length === 0 && (
          <p className="text-center text-gray-400 dark:text-gray-500 mt-10 text-sm transition-colors duration-300">
            {t("notifications.empty")}
          </p>
        )}
      </section>
    </main>
  );
}