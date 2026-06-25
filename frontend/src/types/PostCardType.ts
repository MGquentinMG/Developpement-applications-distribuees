export interface PostCardProps {
  id: string | number;
  author: string;
  timeAgo: string;
  content: string;
  likes: string | number;
  comments: string | number;
  shares: string | number;
  avatarUrl?: string;
  imageUrl?: string;
  isLiked?: boolean;
  onRequireAuth?: () => void;
  onCommentClick?: () => void;
  onLike?: () => void;
  onEdit?: (newContent: string) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
}