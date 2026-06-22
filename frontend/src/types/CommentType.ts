export interface CommentProps {
  id: string | number;
  author: string;
  avatarUrl?: string;
  timeAgo: string;
  content: string;
  likes: string | number;
  onReply?: (author: string) => void;
}