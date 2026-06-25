export interface User {
  id: string;
  pseudo: string;
  email: string;
  createdAt: string;
  banned?: boolean;
  avatar?: string;
}

export interface Post {
  id: string;
  content: string;
  createdAt: string;
  image?: string;
}

export interface AdminUserListProps {
  users: User[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedUserId: string | undefined;
  onSelectUser: (user: User) => void;
}

export interface AdminUserDetailsProps {
  user: User | null;
  posts: Post[];
  onDeleteUser: (userId: string) => void;
  onDeletePost: (postId: string) => void;
  onBanUser: (userId: string) => void;
  onUnbanUser: (userId: string) => void;
}
