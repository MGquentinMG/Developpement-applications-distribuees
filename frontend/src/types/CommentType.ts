export interface CommentProps {
  id: string | number;
  author: string;
  avatarUrl?: string;
  timeAgo: string;
  content: string;
  likes: string | number;
  imageUrl?: string;
  isLiked?: boolean;
  onLike?: () => void;
  onReply?: (author: string) => void;
  onReport?: () => void;
}