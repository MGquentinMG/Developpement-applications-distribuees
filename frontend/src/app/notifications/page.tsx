"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../i18n";
import BackButton from "../../components/BackButton/BackButton";
import NotificationCard from "../../components/NotificationCard/NotificationCard";
import { NotificationProps } from "../../types/NotificationType";
import Logo from "../../components/Logo/Logo";
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
    if (!user) {
      setLoading(false);
      return;
    }
    api
      .get<ApiNotification[]>("/api/notifications")
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
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
    <main className="min-h-screen bg-[#F9F9FB] dark:bg-[#121212] pb-32 relative transition-colors duration-300">
      <div className="flex items-center justify-between px-4 py-4 sticky top-0 bg-[#F9F9FB] dark:bg-[#121212] z-10 transition-colors duration-300">
        <div className="w-10">
          <Logo />
        </div>
        <div className="bg-[#EAE5F3] dark:bg-[#2A2438] px-6 py-2 rounded-2xl transition-colors duration-300">
          <h1 className="text-[#1E1E40] dark:text-[#F9F9FB] font-bold text-sm transition-colors duration-300">
            {t("notifications.title")}
          </h1>
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
  );
}
