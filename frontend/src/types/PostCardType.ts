export interface PostCardProps {
  id?: number | string;
  author: string;
  timeAgo: string;
  content: string;
  likes: string;
  comments: string;
  shares: string;
  avatarUrl?: string; 
}