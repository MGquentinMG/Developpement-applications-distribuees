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
  onRequireAuth?: () => void;
  onCommentClick?: () => void;
  onLike?: () => void;
}