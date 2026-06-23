"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { User, Post } from "../../types/AdminType";
import { AdminUserList } from "./AdminUserList";
import { AdminUserDetails } from "./AdminUserDetails";

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
  const [searchTerm, setSearchTerm] = useState<string>("");

  const userPosts = selectedUser ? (MOCK_POSTS[selectedUser.id] || []) : [];

  const handleDeleteUser = (userId: string) => {
    const confirmDelete = window.confirm(t("admin.confirmDeleteUser", "Es-tu sûr de vouloir supprimer cet utilisateur ?"));
    if (confirmDelete) {
      console.log(`DELETE /api/users/${userId}`); // À remplacer par un vrai fetch API
      setUsers(users.filter(u => u.id !== userId));
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
      }
    }
  };

  const handleDeletePost = (postId: string) => {
    const confirmDelete = window.confirm(t("admin.confirmDeletePost", "Supprimer ce message ?"));
    if (confirmDelete) {
      console.log(`DELETE /api/moderation/posts/${postId}`); // À remplacer par l'appel à l'API Admin
    }
  };

  const filteredUsers = users.filter(u => 
    u.pseudo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 min-h-[75vh]">
      <AdminUserList 
        users={filteredUsers} 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedUserId={selectedUser?.id}
        onSelectUser={setSelectedUser}
      />
      <AdminUserDetails 
        user={selectedUser} 
        posts={userPosts}
        onDeleteUser={handleDeleteUser}
        onDeletePost={handleDeletePost}
      />
    </div>
  );
}