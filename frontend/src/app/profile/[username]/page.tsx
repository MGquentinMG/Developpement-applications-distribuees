"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import BackButton from "../../../components/BackButton/BackButton";
import { api, timeAgo } from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";

interface ApiUser {
  _id: string;
  username: string;
  avatar?: string;
  bio?: string;
  followers: { _id: string; username: string }[];
  following: { _id: string; username: string }[];
}

interface ApiPost {
  _id: string;
  content: string;
  image?: string;
  createdAt: string;
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params?.username as string;
  const { user: currentUser, updateUser } = useAuth();

  const [profile, setProfile] = useState<ApiUser | null>(null);
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (!username) return;
    api
      .get<ApiUser>(`/api/users/by-username/${username}`)
      .then((data) => {
        setProfile(data);
        if (currentUser) {
          setIsFollowing(data.followers.some((f) => f._id === currentUser._id));
        }
        return api.get<ApiPost[]>(`/api/users/${data._id}/posts`);
      })
      .then((postsData) => setPosts(Array.isArray(postsData) ? postsData : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [username, currentUser]);

  const handleFollowToggle = async () => {
    if (!profile || !currentUser || followLoading) return;
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await api.post(`/api/users/${profile._id}/unfollow`, {});
        setProfile((prev) =>
          prev
            ? { ...prev, followers: prev.followers.filter((f) => f._id !== currentUser._id) }
            : prev
        );
        setIsFollowing(false);
        updateUser({
          following: (currentUser.following ?? []).filter((f) => f._id !== profile._id),
        });
      } else {
        await api.post(`/api/users/${profile._id}/follow`, {});
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                followers: [...prev.followers, { _id: currentUser._id, username: currentUser.username }],
              }
            : prev
        );
        setIsFollowing(true);
        updateUser({
          following: [...(currentUser.following ?? []), { _id: profile._id, username: profile.username }],
        });
      }
    } catch {
    } finally {
      setFollowLoading(false);
    }
  };

  const isOwnProfile = currentUser?.username === username;
  const avatarUrl =
    profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] pb-20 transition-colors duration-300">
      <div className="flex items-center gap-4 px-4 py-4 sticky top-0 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md z-20 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <BackButton />
        <h1 className="text-[#1E1E40] dark:text-[#F9F9FB] font-bold text-[17px]">
          {username}
        </h1>
      </div>

      {loading && (
        <p className="text-center text-gray-400 dark:text-gray-500 mt-16 text-sm">
          Chargement...
        </p>
      )}

      {!loading && !profile && (
        <p className="text-center text-gray-400 dark:text-gray-500 mt-16 text-sm">
          Utilisateur introuvable.
        </p>
      )}

      {!loading && profile && (
        <>
          <div className="p-6 pt-10">
            <div className="flex gap-6 items-start">
              <div className="shrink-0">
                <div className="w-28 h-28 rounded-full border-4 border-gray-100 dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="flex-1 w-full">
                {!isOwnProfile && currentUser && (
                  <div className="flex gap-3 mb-4">
                    <button
                      onClick={handleFollowToggle}
                      disabled={followLoading}
                      className={`px-5 py-2 rounded-full font-semibold text-xs transition-colors ${
                        isFollowing
                          ? "bg-[#F4F2F9] dark:bg-[#2A2A40] text-[#5A4B81] dark:text-[#D0C9E8] hover:bg-[#e4dff0] dark:hover:bg-[#3A3A55]"
                          : "bg-[#492775] text-white hover:bg-[#5A3A8A]"
                      }`}
                    >
                      {isFollowing ? "Abonné" : "Suivre"}
                    </button>
                    <button
                      onClick={() => router.push(`/messages/${profile._id}`)}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-full font-semibold text-xs bg-[#F4F2F9] dark:bg-[#2A2A40] text-[#5A4B81] dark:text-[#D0C9E8] hover:bg-[#e4dff0] dark:hover:bg-[#3A3A55] transition-colors"
                    >
                      <MessageCircle size={13} strokeWidth={2.5} />
                      Message
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-black dark:text-[#F9F9FB]">
                      {profile.followers.length}
                    </p>
                    <p className="text-[10px] text-[#A69ACA] font-medium uppercase tracking-wider">
                      Abonnés
                    </p>
                  </div>
                  <div className="w-[1px] h-6 bg-[#A69ACA]/30 dark:bg-gray-700" />
                  <div className="text-center">
                    <p className="text-xl font-bold text-black dark:text-[#F9F9FB]">
                      {profile.following.length}
                    </p>
                    <p className="text-[10px] text-[#A69ACA] font-medium uppercase tracking-wider">
                      Abonnements
                    </p>
                  </div>
                  <div className="w-[1px] h-6 bg-[#A69ACA]/30 dark:bg-gray-700" />
                  <div className="text-center">
                    <p className="text-xl font-bold text-black dark:text-[#F9F9FB]">
                      {posts.length}
                    </p>
                    <p className="text-[10px] text-[#A69ACA] font-medium uppercase tracking-wider">
                      Posts
                    </p>
                  </div>
                </div>

                {profile.bio && (
                  <div className="bg-[#EAE6F3] dark:bg-[#2A2A40] p-3 rounded-2xl w-full transition-colors">
                    <p className="text-[11px] text-[#2D2D2D] dark:text-[#D0C9E8] leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>
                )}

                <p className="mt-2 text-[13px] font-bold text-[#492775] dark:text-[#A395DA]">
                  @{profile.username}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full h-2 bg-gray-100 dark:bg-gray-900 mb-2 transition-colors" />

          <div className="bg-gray-50/50 dark:bg-[#121212] min-h-[300px] transition-colors">
            {posts.length === 0 && (
              <p className="text-center text-gray-400 dark:text-gray-500 text-sm mt-10">
                Aucun post pour le moment.
              </p>
            )}
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white dark:bg-[#1A1A2E] p-4 flex gap-3 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0 overflow-hidden">
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-black dark:text-[#F9F9FB]">
                      @{profile.username}
                    </p>
                    <p className="text-[10px] text-gray-400 mb-1">{timeAgo(post.createdAt)}</p>
                    <p className="text-gray-800 dark:text-[#D0C9E8] text-sm mt-1">
                      {post.content}
                    </p>
                    {post.image && (
                      <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 max-w-xs mt-2">
                        <img src={post.image} alt="Contenu" className="w-full h-auto" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
