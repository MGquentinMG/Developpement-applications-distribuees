"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../i18n";
import BackButton from "../../components/BackButton/BackButton";
import NotificationCard from "../../components/NotificationCard/NotificationCard";
import Navbar from "../../components/Navbar/Navbar";
import { NotificationProps } from "../../types/NotificationType";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

interface ApiNotification {
  _id: string;
  type: string;
  relatedUser?: { _id: string; username: string; avatar?: string };
  read: boolean;
  createdAt: string;
}

function mapType(type: string): NotificationProps["action"] {
  if (type === "follow") return "follow";
  if (type === "like") return "like";
  if (type === "comment") return "comment";
  return "share";
}

export default function NotificationsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [filter, setFilter] = useState<"new" | "all">("new");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (!user) {
      setLoading(false);
      return;
    }

    api
      .get<ApiNotification[]>("/api/notifications")
      .then((data) => {
        if (isMounted) setNotifications(Array.isArray(data) ? data : []);
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [user]);

  const handleMarkRead = async (id: string | number) => {
    try {
      await api.patch(`/api/notifications/${id}`, {});
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch {}
  };

  const filtered = filter === "new"
    ? notifications.filter((n) => !n.read)
    : notifications;

  const toProps = (n: ApiNotification): NotificationProps => ({
    id: n._id,
    username: n.relatedUser ? `@${n.relatedUser.username}` : "@inconnu",
    action: mapType(n.type),
    time: new Date(n.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    isRead: n.read,
  });

  return (
    <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row min-h-screen bg-white dark:bg-[#121212] transition-colors duration-300">
      <aside className="hidden lg:block w-[350px] shrink-0" />

      <main className="flex-1 w-full max-w-2xl min-h-screen bg-[#F9F9FB] dark:bg-[#121212] border-x border-gray-200 dark:border-gray-800 pb-32 md:pb-0 transition-colors duration-300">
        <div className="sticky top-0 z-40 bg-[#F9F9FB]/80 dark:bg-[#121212]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-4 flex items-center gap-4 transition-colors duration-300">
          <BackButton />
          <h1 className="text-[#1E1E40] dark:text-[#F9F9FB] font-bold text-[19px]">
            {t("notifications.title")}
          </h1>
        </div>

        <div className="px-5 mt-6 mb-6 flex gap-3">
          <button
            onClick={() => setFilter("new")}
            className={`px-5 py-1.5 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer border-none ${
              filter === "new"
                ? "bg-[#492775] text-white dark:bg-[#A395DA] dark:text-[#1E1E40]"
                : "bg-[#EAE5F3] text-[#492775] dark:bg-[#2A2438] dark:text-[#A395DA]"
            }`}
          >
            {t("notifications.new")}
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-5 py-1.5 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer border-none ${
              filter === "all"
                ? "bg-[#492775] text-white dark:bg-[#A395DA] dark:text-[#1E1E40]"
                : "bg-[#EAE5F3] text-[#492775] dark:bg-[#2A2438] dark:text-[#A395DA]"
            }`}
          >
            {t("notifications.all")}
          </button>
        </div>

        <section className="px-4 relative z-10">
          {loading && (
            <p className="text-center text-gray-400 dark:text-gray-500 mt-10 text-sm">
              Chargement...
            </p>
          )}

          {!loading && !user && (
            <p className="text-center text-gray-400 dark:text-gray-500 mt-10 text-sm">
              {t("notifications.loginRequired", "Connecte-toi pour voir tes notifications.")}
            </p>
          )}

          {!loading && user && filtered.map((notif) => (
            <div key={notif._id} onClick={() => !notif.read && handleMarkRead(notif._id)}>
              <NotificationCard {...toProps(notif)} />
            </div>
          ))}

          {!loading && user && filtered.length === 0 && (
            <p className="text-center text-gray-400 dark:text-gray-500 mt-10 text-sm transition-colors duration-300">
              {t("notifications.empty")}
            </p>
          )}
        </section>
      </main>

      <Navbar />
    </div>
  );
}