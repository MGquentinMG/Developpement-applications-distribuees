"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../services/api";
import { AdminConfirmModal } from "./AdminConfirmModal";

interface ApiReport {
  _id: string;
  reportedPost?: {
    _id: string;
    content: string;
    image?: string;
    author?: { _id: string; username: string };
  };
  reportedComment?: {
    _id: string;
    content: string;
    author?: { _id: string; username: string };
  };
  reportedUser?: { _id: string; username: string; email: string };
  reporter: { _id: string; username: string };
  reason: string;
  description?: string;
  status: "pending" | "reviewed" | "resolved";
  createdAt: string;
}

type ActionType = "ignore" | "deletePost" | "banAndDelete" | "deleteComment" | "banAndDeleteComment";

interface PendingAction {
  type: ActionType;
  reportId: string;
  postId?: string;
  commentId?: string;
  userId?: string;
  title: string;
  description: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  reviewed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  resolved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export function AdminReports() {
  const { t } = useTranslation();
  const [reports, setReports] = useState<ApiReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const STATUS_LABELS: Record<string, string> = {
    pending: t("admin.statusPending", "En attente"),
    reviewed: t("admin.statusReviewed", "En cours"),
    resolved: t("admin.statusResolved", "Résolu"),
  };

  const REASON_LABELS: Record<string, string> = {
    spam: t("admin.reasonSpam", "Spam"),
    harassment: t("admin.reasonHarassment", "Harcèlement"),
    inappropriate: t("admin.reasonInappropriate", "Contenu inapproprié"),
    hate: t("admin.reasonHate", "Incitation à la haine"),
    violence: t("admin.reasonViolence", "Violence"),
    disinfo: t("admin.reasonDisinfo", "Désinformation"),
    illegal: t("admin.reasonIllegal", "Activités illégales"),
    fraud: t("admin.reasonFraud", "Fraudes"),
    other: t("admin.reasonOther", "Autre"),
  };

  useEffect(() => {
    api
      .get<ApiReport[]>("/api/reports")
      .then((data) => setReports(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openAction = (action: PendingAction) => setPendingAction(action);

  const handleConfirm = async (_reason: string) => {
    if (!pendingAction) return;
    try {
      if (pendingAction.type === "deletePost" && pendingAction.postId) {
        await api.delete(`/api/moderation/posts/${pendingAction.postId}`);
      } else if (pendingAction.type === "banAndDelete" && pendingAction.userId && pendingAction.postId) {
        await api.patch(`/api/users/${pendingAction.userId}/ban`, { banReason: _reason });
        await api.delete(`/api/moderation/posts/${pendingAction.postId}`);
      } else if (pendingAction.type === "deleteComment" && pendingAction.commentId) {
        await api.delete(`/api/moderation/comments/${pendingAction.commentId}`);
      } else if (pendingAction.type === "banAndDeleteComment" && pendingAction.userId && pendingAction.commentId) {
        await api.patch(`/api/users/${pendingAction.userId}/ban`, { banReason: _reason });
        await api.delete(`/api/moderation/comments/${pendingAction.commentId}`);
      }
      await api.patch(`/api/reports/${pendingAction.reportId}`, { status: "resolved" });
      setReports((prev) =>
        prev.map((r) => r._id === pendingAction.reportId ? { ...r, status: "resolved" } : r)
      );
    } catch {}
    setPendingAction(null);
  };

  if (loading) {
    return <p className="text-center text-gray-400 mt-10 text-sm">{t("admin.loading", "Chargement...")}</p>;
  }

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="font-medium text-lg">{t("admin.noReports", "Aucun signalement")}</p>
        <p className="text-sm mt-1">{t("admin.noReportsDesc", "Tout est calme par ici.")}</p>
      </div>
    );
  }

  return (
    <>
      <AdminConfirmModal
        isOpen={!!pendingAction}
        title={pendingAction?.title ?? ""}
        description={pendingAction?.description ?? ""}
        onConfirm={handleConfirm}
        onCancel={() => setPendingAction(null)}
      />

      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report._id} className="bg-white dark:bg-[#1A1A2E] rounded-3xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm transition-colors">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${STATUS_STYLES[report.status]}`}>
                  {STATUS_LABELS[report.status]}
                </span>
                <span className="text-[12px] font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-full">
                  {REASON_LABELS[report.reason] ?? report.reason}
                </span>
              </div>
              <span className="text-[11px] text-gray-400 shrink-0">
                {new Date(report.createdAt).toLocaleString("fr-FR")}
              </span>
            </div>

            {report.reportedPost && (
              <div className="bg-[#F4F2F9] dark:bg-[#2A2438] rounded-2xl overflow-hidden mb-3">
                {report.reportedPost.image && (
                  <div className="w-full max-h-40 overflow-hidden bg-gray-200 dark:bg-gray-800">
                    <img src={report.reportedPost.image} alt="Image signalée" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="px-4 py-3">
                  <p className="text-[11px] font-bold text-[#A69ACA] uppercase tracking-wide mb-1">
                    {t("admin.reportedPost", "Post signalé")}
                    {report.reportedPost.author && (
                      <span className="ml-2 font-normal normal-case text-gray-400">par @{report.reportedPost.author.username}</span>
                    )}
                  </p>
                  <p className="text-[13px] text-[#1E1E40] dark:text-[#F9F9FB] line-clamp-3">
                    {report.reportedPost.content || t("admin.noText", "(sans texte)")}
                  </p>
                </div>
              </div>
            )}

            {report.reportedComment && (
              <div className="bg-[#F4F2F9] dark:bg-[#2A2438] rounded-2xl overflow-hidden mb-3">
                <div className="px-4 py-3">
                  <p className="text-[11px] font-bold text-[#A69ACA] uppercase tracking-wide mb-1">
                    {t("admin.reportedComment", "Commentaire signalé")}
                    {report.reportedComment.author && (
                      <span className="ml-2 font-normal normal-case text-gray-400">par @{report.reportedComment.author.username}</span>
                    )}
                  </p>
                  <p className="text-[13px] text-[#1E1E40] dark:text-[#F9F9FB] line-clamp-3">
                    {report.reportedComment.content || t("admin.noText", "(sans texte)")}
                  </p>
                </div>
              </div>
            )}

            {report.description && (
              <div className="mb-3">
                <p className="text-[11px] font-bold text-[#A69ACA] uppercase tracking-wide mb-1">
                  {t("admin.reportJustif", "Justificatif du signalement")}
                </p>
                <p className="text-[13px] text-gray-600 dark:text-gray-300 italic">"{report.description}"</p>
              </div>
            )}

            <div className="flex items-center justify-between flex-wrap gap-3">
              <p className="text-[12px] text-gray-500 dark:text-gray-400">
                {t("admin.reportedBy", "Signalé par")}{" "}
                <span className="font-semibold text-[#492775] dark:text-[#A395DA]">@{report.reporter?.username}</span>
              </p>

              {report.status !== "resolved" && (
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => openAction({
                      type: "ignore",
                      reportId: report._id,
                      title: t("admin.ignore", "Ne rien faire"),
                      description: "Le signalement sera marqué comme résolu sans aucune action sur le contenu.",
                    })}
                    className="px-3 py-1.5 rounded-xl text-[12px] font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 transition-colors"
                  >
                    {t("admin.ignore", "Ne rien faire")}
                  </button>

                  {report.reportedPost && (
                    <>
                      <button
                        onClick={() => openAction({
                          type: "deletePost",
                          reportId: report._id,
                          postId: report.reportedPost!._id,
                          title: t("admin.deletePostBtn", "Supprimer le post"),
                          description: "Le post sera définitivement supprimé. Le compte de l'auteur ne sera pas affecté.",
                        })}
                        className="px-3 py-1.5 rounded-xl text-[12px] font-semibold bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 transition-colors"
                      >
                        {t("admin.deletePostBtn", "Supprimer le post")}
                      </button>

                      {(report.reportedPost.author || report.reportedUser) && (
                        <button
                          onClick={() => openAction({
                            type: "banAndDelete",
                            reportId: report._id,
                            postId: report.reportedPost!._id,
                            userId: report.reportedPost!.author?._id ?? report.reportedUser?._id,
                            title: t("admin.banAndDelete", "Bannir + supprimer le post"),
                            description: "Le post sera supprimé et l'auteur sera banni définitivement.",
                          })}
                          className="px-3 py-1.5 rounded-xl text-[12px] font-semibold bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 transition-colors"
                        >
                          {t("admin.banAndDelete", "Bannir + supprimer")}
                        </button>
                      )}
                    </>
                  )}

                  {report.reportedComment && (
                    <>
                      <button
                        onClick={() => openAction({
                          type: "deleteComment",
                          reportId: report._id,
                          commentId: report.reportedComment!._id,
                          title: t("admin.deleteCommentBtn", "Supprimer le commentaire"),
                          description: "Le commentaire sera définitivement supprimé. Le compte de l'auteur ne sera pas affecté.",
                        })}
                        className="px-3 py-1.5 rounded-xl text-[12px] font-semibold bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 transition-colors"
                      >
                        {t("admin.deleteCommentBtn", "Supprimer le commentaire")}
                      </button>

                      {(report.reportedComment.author || report.reportedUser) && (
                        <button
                          onClick={() => openAction({
                            type: "banAndDeleteComment",
                            reportId: report._id,
                            commentId: report.reportedComment!._id,
                            userId: report.reportedComment!.author?._id ?? report.reportedUser?._id,
                            title: t("admin.banAndDelete", "Bannir + supprimer"),
                            description: "Le commentaire sera supprimé et l'auteur sera banni définitivement.",
                          })}
                          className="px-3 py-1.5 rounded-xl text-[12px] font-semibold bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 transition-colors"
                        >
                          {t("admin.banAndDelete", "Bannir + supprimer")}
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
