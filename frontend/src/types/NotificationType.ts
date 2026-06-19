export type NotificationAction = "like" | "comment" | "share" | "follow";

export interface NotificationProps {
  id: string | number;
  username: string;
  action: NotificationAction;
  time: string;
  isRead: boolean;
}