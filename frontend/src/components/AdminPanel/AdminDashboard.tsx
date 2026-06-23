"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { User, Post } from "../../types/AdminType";
import { AdminUserList } from "./AdminUserList";
import { AdminUserDetails } from "./AdminUserDetails";
import { AdminConfirmModal } from "./AdminConfirmModal";
import { api } from "../../services/api";

interface ApiUser {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  avatar?: string;
  banned?: boolean;
}

interface ApiPost {
  _id: string;
  content: string;
  image?: string;
  createdAt: string;
}

interface PendingAction {
  type: "deleteUser" | "deletePost" | "banUser";
  id: string;
  label: string;
}

export function AdminDashboard() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  useEffect(() => {
    api
      .get<ApiUser[]>("/api/users")
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setUsers(list.map((u) => ({
          id: u._id,
          pseudo: u.username,
          email: u.email,
          createdAt: new Date(u.createdAt).toLocaleDateString("fr-FR"),
          avatar: u.avatar,
          banned: u.banned ?? false,
        })));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSelectUser = async (user: User) => {
    setSelectedUser(user);
    setUserPosts([]);
    try {
      const posts = await api.get<ApiPost[]>(`/api/users/${user.id}/posts`);
      const list = Array.isArray(posts) ? posts : [];
      setUserPosts(list.map((p) => ({
        id: p._id,
        content: p.content,
        image: p.image,
        createdAt: new Date(p.createdAt).toLocaleString("fr-FR"),
      })));
    } catch {}
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    setPendingAction({ type: "deleteUser", id: userId, label: `Supprimer le compte de ${user?.pseudo ?? userId}` });
  };

  const handleDeletePost = (postId: string) => {
    setPendingAction({ type: "deletePost", id: postId, label: "Supprimer ce post" });
  };

  const handleBanUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    setPendingAction({ type: "banUser", id: userId, label: `Bannir ${user?.pseudo ?? userId}` });
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      await api.patch(`/api/users/${userId}/unban`, {});
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, banned: false } : u));
      if (selectedUser?.id === userId) setSelectedUser((prev) => prev ? { ...prev, banned: false } : prev);
    } catch {}
  };

  const handleConfirmAction = async (reason: string) => {
    if (!pendingAction) return;
    try {
      if (pendingAction.type === "deleteUser") {
        await api.delete(`/api/users/${pendingAction.id}`);
        setUsers((prev) => prev.filter((u) => u.id !== pendingAction.id));
        if (selectedUser?.id === pendingAction.id) { setSelectedUser(null); setUserPosts([]); }
      } else if (pendingAction.type === "deletePost") {
        await api.delete(`/api/moderation/posts/${pendingAction.id}`);
        setUserPosts((prev) => prev.filter((p) => p.id !== pendingAction.id));
      } else if (pendingAction.type === "banUser") {
        await api.patch(`/api/users/${pendingAction.id}/ban`, { banReason: reason });
        setUsers((prev) => prev.map((u) => u.id === pendingAction.id ? { ...u, banned: true } : u));
        if (selectedUser?.id === pendingAction.id) setSelectedUser((prev) => prev ? { ...prev, banned: true } : prev);
      }
    } catch {}
    setPendingAction(null);
  };

  const filteredUsers = users.filter((u) =>
    u.pseudo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p className="text-center text-gray-400 mt-10 text-sm">Chargement...</p>;
  }

  const modalDescriptions: Record<string, string> = {
    deleteUser: "Cette action est irréversible. Le compte et tous les posts associés seront définitivement supprimés.",
    deletePost: "Ce post sera définitivement supprimé.",
    banUser: "L'utilisateur ne pourra plus accéder à son compte. Vous pouvez le débannir à tout moment.",
  };

  return (
    <>
      <AdminConfirmModal
        isOpen={!!pendingAction}
        title={pendingAction?.label ?? ""}
        description={pendingAction ? modalDescriptions[pendingAction.type] : ""}
        onConfirm={handleConfirmAction}
        onCancel={() => setPendingAction(null)}
      />

      <div className="w-full flex flex-col lg:flex-row gap-8 min-h-[75vh]">
        <AdminUserList
          users={filteredUsers}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedUserId={selectedUser?.id}
          onSelectUser={handleSelectUser}
        />
        <AdminUserDetails
          user={selectedUser}
          posts={userPosts}
          onDeleteUser={handleDeleteUser}
          onDeletePost={handleDeletePost}
          onBanUser={handleBanUser}
          onUnbanUser={handleUnbanUser}
        />
      </div>
    </>
  );
}
